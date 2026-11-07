import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Phone, Mail, MessageSquare, MapPin, Clock, ExternalLink,
  ChevronLeft, Send, CheckCircle2, AlertCircle, User, Shield, HelpCircle
} from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';
import { supabase } from '../lib/supabase';

interface ContactPageProps {
  onBack: () => void;
}

export function parseMapEmbedUrl(raw?: string): string {
  if (!raw || typeof raw !== 'string') return '';
  const trimmed = raw.trim();

  // If user pasted full iframe tag (<iframe src="..." ...></iframe>)
  const match = trimmed.match(/src=["']([^"']+)["']/i);
  if (match && match[1]) {
    return match[1];
  }

  // If direct Google Maps embed URL
  if (trimmed.includes('google.com/maps/embed')) {
    return trimmed;
  }

  // If regular Google Maps URL or search
  if (trimmed.startsWith('http')) {
    if (trimmed.includes('output=embed')) return trimmed;
    try {
      const url = new URL(trimmed);
      const q = url.searchParams.get('q') || url.pathname.replace('/maps/place/', '').replace(/\//g, ' ');
      if (q) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
      }
    } catch {}
    return trimmed;
  }

  return trimmed;
}

export default function ContactPage({ onBack }: ContactPageProps) {
  const { content } = useSiteContent();
  const contact = content?.contact || {};
  const coordinators = Array.isArray(contact.contacts) ? contact.contacts : [];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Inquiry',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const primaryPhone = contact.primaryPhone || '+91 98765 43210';
  const cleanPrimaryPhone = primaryPhone.replace(/[^\d+]/g, '');
  const primaryEmail = contact.primaryEmail || 'codebreakers@gcekbpatna.ac.in';
  const whatsappNumber = contact.whatsappNumber || primaryPhone;
  const cleanWhatsApp = (contact.whatsappLink ? '' : whatsappNumber.replace(/[^\d]/g, ''));
  const whatsappUrl = contact.whatsappLink || `https://wa.me/${cleanWhatsApp}`;
  const address = contact.address || 'Nalanda Institute of Technology, Buddhist Villa, Chandaka, Bhubaneswar, Odisha 754005';
  const mapsUrl = contact.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  const embedUrl = parseMapEmbedUrl(contact.mapEmbedUrl) ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.4118269223304!2d85.75926857501254!3d20.36590298112258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19060462635441%3A0x2697f0bcc78c2240!2sNalanda%20Institute%20of%20Technology%20%5BNIT%5D%2C%20Bhubaneswar!5e0!3m2!1sen!2sin!4v1794030031793!5m2!1sen!2sin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, email, and message.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    // 1. Direct Supabase insert (works in production on Vercel deployment)
    try {
      const { error: sbErr } = await supabase.from('contact_messages').insert({
        id: `msg-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        category: formData.category,
        message: formData.message,
        created_at: new Date().toISOString(),
      });

      if (!sbErr) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          category: 'General Inquiry',
          message: '',
        });
        return;
      }
    } catch (sbE) {
      console.warn('Supabase direct contact insert fallback:', sbE);
    }

    // 2. Fallback to local server API if running
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          category: 'General Inquiry',
          message: '',
        });
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to dispatch transmission.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Transmission failed. You can reach out directly via WhatsApp or Phone below.');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050608] text-[#F5F5F5] overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#55FF55]/5 blur-[160px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[#FFAA00]/5 blur-[180px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Top Back Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            id="contact-back-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[#D4AF37]/80 hover:text-[#F5D061] font-rajdhani font-bold text-xs tracking-[0.2em] uppercase transition-colors group cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            BACK TO MAIN ARENA
          </button>
        </motion.div>

        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#55FF55] animate-pulse" />
            <span className="font-mono text-xs font-bold text-[#55FF55] tracking-widest uppercase">
              {contact.subtitle || 'DIRECT HELPLINES // DISPATCH TRANSMISSION'}
            </span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl font-black tracking-wide text-white mb-4">
            {contact.title || 'COMMUNICATIONS & COMMAND HQ'}
          </h1>

          <p className="font-rajdhani text-sm sm:text-base text-neutral-400 max-w-3xl leading-relaxed">
            {contact.description ||
              'Have queries regarding hackathon battlegrounds, team registrations, travel coordinates, or partnership alliances? Connect directly with our operational coordinators below.'}
          </p>
        </div>

        {/* Direct Action Helplines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* 1. Phone Helpline */}
          <div className="p-5 bg-[#0c1017] border border-[#D4AF37]/30 sf-clip-angled-sm space-y-3 hover:border-[#D4AF37] transition-all group">
            <div className="w-10 h-10 border border-[#D4AF37]/50 bg-[#D4AF37]/10 flex items-center justify-center text-[#F5D061]">
              <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-neutral-400 tracking-wider uppercase block">
                VOICE HELPLINE
              </span>
              <span className="font-mono font-bold text-sm text-white tracking-wide block mt-0.5">
                {primaryPhone}
              </span>
              {contact.secondaryPhone && (
                <span className="font-mono text-xs text-neutral-400 block mt-0.5">
                  {contact.secondaryPhone}
                </span>
              )}
            </div>
            <a
              href={`tel:${cleanPrimaryPhone}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#F5D061] hover:text-white transition-colors pt-1"
            >
              <span>CALL NOW</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* 2. WhatsApp Direct */}
          <div className="p-5 bg-[#0c1017] border border-[#55FF55]/30 sf-clip-angled-sm space-y-3 hover:border-[#55FF55] transition-all group">
            <div className="w-10 h-10 border border-[#55FF55]/50 bg-[#55FF55]/10 flex items-center justify-center text-[#55FF55]">
              <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-neutral-400 tracking-wider uppercase block">
                WHATSAPP COMMAND
              </span>
              <span className="font-mono font-bold text-sm text-white tracking-wide block mt-0.5">
                {whatsappNumber}
              </span>
              <span className="font-rajdhani text-xs text-[#55FF55] block mt-0.5">
                Instant Chat & Support
              </span>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#55FF55] hover:text-white transition-colors pt-1"
            >
              <span>START CHAT</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* 3. Official Email */}
          <div className="p-5 bg-[#0c1017] border border-[#4ECDC4]/30 sf-clip-angled-sm space-y-3 hover:border-[#4ECDC4] transition-all group">
            <div className="w-10 h-10 border border-[#4ECDC4]/50 bg-[#4ECDC4]/10 flex items-center justify-center text-[#4ECDC4]">
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-neutral-400 tracking-wider uppercase block">
                OFFICIAL INBOX
              </span>
              <span className="font-mono font-bold text-xs text-white tracking-wide block mt-0.5 break-all">
                {primaryEmail}
              </span>
              {contact.secondaryEmail && (
                <span className="font-mono text-[11px] text-neutral-400 block mt-0.5 break-all">
                  {contact.secondaryEmail}
                </span>
              )}
            </div>
            <a
              href={`mailto:${primaryEmail}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#4ECDC4] hover:text-white transition-colors pt-1"
            >
              <span>DRAFT EMAIL</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* 4. Campus Location */}
          <div className="p-5 bg-[#0c1017] border border-[#FF4655]/30 sf-clip-angled-sm space-y-3 hover:border-[#FF4655] transition-all group">
            <div className="w-10 h-10 border border-[#FF4655]/50 bg-[#FF4655]/10 flex items-center justify-center text-[#FF4655]">
              <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-neutral-400 tracking-wider uppercase block">
                HQ COORDINATES
              </span>
              <span className="font-mono font-bold text-xs text-white tracking-wide block mt-0.5 line-clamp-1">
                {contact.venueName || 'GCEK Kalahandi'}
              </span>
              <span className="font-rajdhani text-xs text-neutral-400 block mt-0.5 line-clamp-2">
                {address}
              </span>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF4655] hover:text-white transition-colors pt-1"
            >
              <span>GOOGLE MAPS</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Two Column Layout: Transmission Dispatch Form & Key Coordinators */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Direct Transmission Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0c1017] border border-[#D4AF37]/35 p-6 sm:p-8 sf-clip-angled-sm space-y-6">
            <div className="border-b border-[#D4AF37]/20 pb-4">
              <div className="flex items-center gap-2 text-[#F5D061] mb-1">
                <Send className="w-4 h-4" />
                <h3 className="font-cinzel font-bold text-lg tracking-wider uppercase">
                  Dispatch Transmission
                </h3>
              </div>
              <p className="font-rajdhani text-xs text-neutral-400">
                Send a direct message to our command team. We typically respond within 2 to 4 hours.
              </p>
            </div>

            {status === 'success' ? (
              <div className="p-6 bg-[#55FF55]/10 border border-[#55FF55] text-center space-y-3 sf-clip-angled-sm">
                <CheckCircle2 className="w-10 h-10 text-[#55FF55] mx-auto animate-bounce" />
                <h4 className="font-cinzel font-black text-lg text-white tracking-wider">
                  TRANSMISSION RECEIVED & LOGGED
                </h4>
                <p className="font-rajdhani text-sm text-neutral-300">
                  Your message has been dispatched to the SYNTHARA2.0 command desk. Our lead coordinator will reach out via your provided email or phone.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setStatus('idle')}
                    className="px-4 py-2 border border-[#55FF55]/40 hover:bg-[#55FF55]/20 text-[#55FF55] font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#55FF55] text-black font-mono text-xs font-bold uppercase flex items-center gap-1.5 hover:bg-white transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    CHAT ON WHATSAPP
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="p-3 bg-[#FF4655]/10 border border-[#FF4655] text-[#FF4655] text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Mercer"
                      className="w-full bg-[#141a24] border border-[#D4AF37]/30 text-white p-3 text-sm font-rajdhani focus:border-[#D4AF37] outline-none sf-clip-angled-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@domain.com"
                      className="w-full bg-[#141a24] border border-[#D4AF37]/30 text-white p-3 text-sm font-rajdhani focus:border-[#D4AF37] outline-none sf-clip-angled-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#141a24] border border-[#D4AF37]/30 text-white p-3 text-sm font-rajdhani focus:border-[#D4AF37] outline-none sf-clip-angled-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-[#141a24] border border-[#D4AF37]/30 text-white p-3 text-sm font-rajdhani focus:border-[#D4AF37] outline-none sf-clip-angled-sm"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Squad & Registration">Squad & Registration Support</option>
                      <option value="Battleground & Problem Statements">Battleground & Tracks Query</option>
                      <option value="Travel, Route & Accommodation">Travel, Route & Accommodation</option>
                      <option value="Sponsorship & Partnership">Sponsorship & Alliances</option>
                      <option value="Technical Platform Issue">Technical Issue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-rajdhani text-xs font-bold text-[#F5D061] uppercase tracking-wider mb-1">
                    Your Message / Query *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry, question, or requirement in detail..."
                    className="w-full bg-[#141a24] border border-[#D4AF37]/30 text-white p-3 text-sm font-rajdhani focus:border-[#D4AF37] outline-none sf-clip-angled-sm leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full sm:w-auto px-8 py-3.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-black tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{status === 'submitting' ? 'DISPATCHING...' : 'DISPATCH TRANSMISSION'}</span>
                  </button>

                  <span className="font-mono text-[11px] text-neutral-500">
                    Encrypted Direct Transmission
                  </span>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Key Coordinators Directory (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0c1017] border border-[#D4AF37]/35 p-6 sf-clip-angled-sm space-y-4">
              <div className="border-b border-[#D4AF37]/20 pb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#F5D061]" />
                <h3 className="font-cinzel font-bold text-base text-white tracking-wider uppercase">
                  Key Operational Contacts
                </h3>
              </div>

              <div className="space-y-3">
                {coordinators.map((c, idx) => (
                  <div
                    key={c.id || idx}
                    className="p-3.5 bg-[#141a24]/80 border border-[#D4AF37]/20 sf-clip-angled-sm space-y-2 hover:border-[#D4AF37]/50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-rajdhani font-bold text-sm text-white block">
                          {c.name}
                        </span>
                        <span className="font-mono text-[11px] text-[#F5D061] block">
                          {c.role}
                        </span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#F5D061]">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-white/5 text-xs font-mono">
                      {c.phone && (
                        <a
                          href={`tel:${c.phone.replace(/[^\d+]/g, '')}`}
                          className="text-neutral-300 hover:text-[#55FF55] flex items-center gap-1 transition-colors"
                        >
                          <Phone className="w-3 h-3 text-[#55FF55]" />
                          <span>{c.phone}</span>
                        </a>
                      )}
                      {c.email && (
                        <a
                          href={`mailto:${c.email}`}
                          className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <Mail className="w-3 h-3 text-[#4ECDC4]" />
                          <span className="truncate max-w-[150px]">{c.email}</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-[#0c1017] border border-[#D4AF37]/35 p-5 sf-clip-angled-sm space-y-2">
              <div className="flex items-center gap-2 text-[#55FF55]">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-xs font-bold tracking-wider uppercase">
                  OPERATIONAL HOURS
                </span>
              </div>
              <p className="font-rajdhani text-sm text-neutral-300 leading-relaxed">
                {contact.timings || '24/7 Operations during Hackathon • Mon–Sat 9:00 AM – 7:00 PM IST'}
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-[#D4AF37]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#55FF55]" />
                <span>Command Desk Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Campus Location & Map Embed */}
        <div className="bg-[#0c1017] border border-[#D4AF37]/35 p-6 sm:p-8 sf-clip-angled-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D4AF37]/20 pb-4">
            <div>
              <div className="flex items-center gap-2 text-[#FF4655] mb-1">
                <MapPin className="w-4 h-4" />
                <h3 className="font-cinzel font-bold text-lg tracking-wider uppercase">
                  Physical Arena Coordinates
                </h3>
              </div>
              <p className="font-rajdhani text-xs text-neutral-400">
                {address}
              </p>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-[#FF4655]/40 hover:bg-[#FF4655]/15 text-[#FF4655] font-mono text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1.5 sf-clip-angled-sm transition-all shrink-0"
            >
              <span>OPEN FULL MAP</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Responsive Map Embed */}
          <div className="w-full h-72 sm:h-96 border border-neutral-700 sf-clip-angled-sm overflow-hidden bg-neutral-900 relative shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
            <iframe
              title="Campus Map"
              src={embedUrl}
              width="100%"
              height="100%"
              className="w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

