import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Eye, EyeOff, Lock, Mail, Swords, Terminal, Users, Building, Phone, User, CheckSquare, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RegistrationFormData, RegisteredTicket } from '../types';
import { useSiteContent } from '../context/ContentContext';
import { supabase } from '../lib/supabase';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedChallengeId?: string;
}

type ModalStep = 'signup' | 'register' | 'success';

export default function RegistrationModal({ isOpen, onClose, preSelectedChallengeId }: RegistrationModalProps) {
  const { content } = useSiteContent();
  const regConfig = content?.registrationForm || {};
  const isPortalOpen = regConfig.isOpen !== false;

  const allChallenges = (content.challenges && Array.isArray(content.challenges))
    ? content.challenges.map((c, i) => ({
        id: c.id || `c-${i}`,
        number: c.number || String(i + 1).padStart(2, '0'),
        title: c.title,
      }))
    : [];

  const [step, setStep] = useState<ModalStep>('signup');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState('');

  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    phone: '',
    collegeOrOrg: '',
    teamName: '',
    teamMembers: ['', ''],
    selectedChallenge: preSelectedChallengeId || allChallenges[0]?.id || '',
    experienceLevel: 'Intermediate',
    githubOrPortfolio: '',
    trackNotes: '',
  });

  const [ticket, setTicket] = useState<RegisteredTicket | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (preSelectedChallengeId) {
      setFormData((prev) => ({ ...prev, selectedChallenge: preSelectedChallengeId }));
    }
  }, [preSelectedChallengeId]);

  // Reset to signup when modal re-opens
  useEffect(() => {
    if (isOpen) {
      setStep('signup');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirm('');
      setSignupError('');
      setTicket(null);
    }
  }, [isOpen]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters.');
      return;
    }
    if (signupPassword !== signupConfirm) {
      setSignupError('Passwords do not match.');
      return;
    }
    setFormData(prev => ({ ...prev, email: signupEmail }));
    setStep('register');
  };

  const handleMemberChange = (index: number, val: string) => {
    const updated = [...formData.teamMembers];
    updated[index] = val;
    setFormData({ ...formData, teamMembers: updated });
  };

  const addMemberSlot = () => {
    const max = Number(regConfig.maxMembers) || 4;
    if (formData.teamMembers.length < max) {
      setFormData({ ...formData, teamMembers: [...formData.teamMembers, ''] });
    }
  };

  const removeMemberSlot = (index: number) => {
    if (formData.teamMembers.length > 1) {
      const updated = formData.teamMembers.filter((_, i) => i !== index);
      setFormData({ ...formData, teamMembers: updated });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `HV-26-${randomNum}`;
    const generatedTicket: RegisteredTicket = {
      ticketId,
      registrationDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      data: { ...formData },
    };

    // 1. Submit to Supabase Cloud Database
    try {
      const { error: sbErr } = await supabase.from('registrations').insert([
        {
          id: ticketId,
          team_name: formData.teamName,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          college_or_org: formData.collegeOrOrg,
          selected_challenge: formData.selectedChallenge,
          team_members: Array.isArray(formData.teamMembers) ? formData.teamMembers : [String(formData.teamMembers)],
          github_or_portfolio: formData.githubOrPortfolio,
          submitted_at: new Date().toISOString(),
        },
      ]);
      if (sbErr) {
        console.warn('Supabase registration insert note:', sbErr.message);
      }
    } catch (sbErr) {
      console.warn('Supabase registration insert error:', sbErr);
    }

    // 2. Submit to local server as backup
    try {
      await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          ...formData,
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn('Backend API submission notice:', err);
    }

    setIsSubmitting(false);
    setTicket(generatedTicket);
    setStep('success');
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ['#D4AF37', '#F5D061', '#FF4655', '#FFFFFF'] });
  };

  const resetForm = () => {
    setTicket(null);
    onClose();
  };

  if (!isOpen) return null;

  if (!isPortalOpen) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 select-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md sf-modal-gothic p-7 z-10 text-center space-y-4 shadow-[0_15px_50px_rgba(0,0,0,0.95)]"
          >
            <div className="sf-bracket-tl" /><div className="sf-bracket-tr" />
            <div className="sf-bracket-bl" /><div className="sf-bracket-br" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-14 h-14 mx-auto border border-[#FF4655]/50 bg-[#FF4655]/10 flex items-center justify-center sf-clip-angled-sm">
              <Lock className="w-7 h-7 text-[#FF4655]" />
            </div>
            <h3 className="sf-gothic-title text-2xl text-[#FF4655]">
              Registrations Paused
            </h3>
            <p className="font-rajdhani text-sm text-neutral-300 leading-relaxed max-w-sm mx-auto">
              {regConfig.closedMessage && !regConfig.closedMessage.includes("HackVerse '26")
                ? regConfig.closedMessage
                : "Registrations for SYNTHARA2.0 are currently closed. Check back soon or contact support."}
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 sf-btn-gold sf-clip-angled font-cinzel text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                RETURN TO ARENA
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  const stepLabels: { key: ModalStep; label: string }[] = [
    { key: 'signup', label: 'Sign Up' },
    { key: 'register', label: 'Register' },
    { key: 'success', label: 'Confirmed' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step === 'success' ? resetForm : onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        />

        {/* Gothic Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto sf-modal-gothic z-10"
        >
          {/* Corner decorations */}
          <div className="sf-bracket-tl" style={{ width: 16, height: 16 }} />
          <div className="sf-bracket-tr" style={{ width: 16, height: 16 }} />
          <div className="sf-bracket-bl" style={{ width: 16, height: 16 }} />
          <div className="sf-bracket-br" style={{ width: 16, height: 16 }} />

          {/* Title Bar */}
          <div className="sf-modal-titlebar px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 border border-[#D4AF37]/50 sf-clip-angled-sm flex items-center justify-center">
                <Swords className="w-3.5 h-3.5 text-[#F5D061]" />
              </div>
              <div>
                <span className="sf-gothic-title text-sm text-[#F5D061] leading-none block">
                  SYNTHARA2.0
                </span>
                <span className="font-rajdhani text-[10px] text-[#D4AF37]/60 tracking-[0.2em] uppercase">
                  {regConfig.title || "WARRIOR ENLISTMENT PROTOCOL"}
                </span>
              </div>
            </div>
            <button
              id="close-registration-modal-btn"
              onClick={step === 'success' ? resetForm : onClose}
              className="w-8 h-8 border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/15 text-neutral-400 hover:text-[#F5D061] flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close Registration Dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step Progress */}
          {step !== 'success' && (
            <div className="px-5 py-3 border-b border-[#D4AF37]/15 flex items-center gap-2">
              {stepLabels.slice(0, 2).map((s, idx) => (
                <div key={s.key} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${step === s.key || (step === 'register' && s.key === 'signup') ? 'sf-step-active' : 'sf-step-inactive'}`}>
                    {step === 'register' && s.key === 'signup' ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span className={`font-rajdhani text-[11px] tracking-[0.15em] uppercase font-bold ${step === s.key ? 'text-[#F5D061]' : step === 'register' && s.key === 'signup' ? 'text-[#55FF55]' : 'text-neutral-600'}`}>
                    {s.label}
                  </span>
                  {idx < 1 && <ChevronRight className="w-3 h-3 text-neutral-700 mx-1" />}
                </div>
              ))}
            </div>
          )}

          <div className="p-5 sm:p-6">
            {/* ──────── STEP 1: SIGN UP ──────── */}
            {step === 'signup' && (
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 p-4 border border-[#D4AF37]/15 bg-[#D4AF37]/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="font-rajdhani text-[#D4AF37] text-xs font-black tracking-[0.2em] uppercase">Create Your Account</span>
                  </div>
                  <p className="font-rajdhani text-neutral-400 text-xs">
                    Create a free warrior account to secure your squad registration.
                  </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="sf-label-gothic">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#D4AF37]/40" />
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="warrior@example.com"
                        className="sf-input-gothic pl-9"
                        id="signup-email-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="sf-label-gothic">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#D4AF37]/40" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="sf-input-gothic pl-9 pr-10"
                        id="signup-password-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#D4AF37] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="sf-label-gothic">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#D4AF37]/40" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signupConfirm}
                        onChange={(e) => setSignupConfirm(e.target.value)}
                        placeholder="Re-enter password"
                        className="sf-input-gothic pl-9"
                        id="signup-confirm-input"
                      />
                    </div>
                  </div>

                  {signupError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-rajdhani text-[#FF4655] text-xs tracking-wide py-2 px-3 border border-[#FF4655]/30 bg-[#FF4655]/10"
                    >
                      {signupError}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    id="signup-create-account-btn"
                    className="w-full h-12 sf-btn-gold sf-clip-angled flex items-center justify-center gap-2.5 text-sm font-cinzel tracking-[0.18em] mt-2"
                  >
                    <span>CREATE ACCOUNT</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* ──────── STEP 2: REGISTER ──────── */}
            {step === 'register' && (
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-5 p-3.5 border border-[#55FF55]/20 bg-[#55FF55]/5 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#55FF55] shrink-0" />
                  <span className="font-rajdhani text-[#55FF55] text-xs tracking-wide">
                    Account created for <strong>{signupEmail}</strong> — now complete your squad registration.
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="p-3 bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center gap-2 mb-2">
                    <Terminal className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span className="font-rajdhani text-[#D4AF37] text-xs font-black tracking-[0.15em] uppercase">
                      {regConfig.noticeBanner || "⚡ FREE REGISTRATION — MEALS, SWAGS & DORM ACCOMMODATION PROVIDED"}
                    </span>
                  </div>

                  {/* Team Lead & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="sf-label-gothic">
                        <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> Lead Builder Name *</span>
                      </label>
                      <input
                        type="text" required value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Alex Rivera"
                        className="sf-input-gothic"
                        id="reg-fullname-input"
                      />
                    </div>
                    <div>
                      <label className="sf-label-gothic">
                        <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email (from account)</span>
                      </label>
                      <input
                        type="email" readOnly value={formData.email}
                        className="sf-input-gothic opacity-60 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Phone & College */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="sf-label-gothic">
                        <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> WhatsApp Number *</span>
                      </label>
                      <input
                        type="tel" required value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="sf-input-gothic"
                        id="reg-phone-input"
                      />
                    </div>
                    <div>
                      <label className="sf-label-gothic">
                        <span className="flex items-center gap-1.5"><Building className="w-3 h-3" /> College / Institution *</span>
                      </label>
                      <input
                        type="text" required value={formData.collegeOrOrg}
                        onChange={(e) => setFormData({ ...formData, collegeOrOrg: e.target.value })}
                        placeholder="e.g. GCEK, OUTR, NIT"
                        className="sf-input-gothic"
                        id="reg-college-input"
                      />
                    </div>
                  </div>

                  {/* Team Name & Challenge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="sf-label-gothic">
                        <span className="flex items-center gap-1.5"><Swords className="w-3 h-3" /> Squad / Team Name *</span>
                      </label>
                      <input
                        type="text" required value={formData.teamName}
                        onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                        placeholder="e.g. CyberValkyries"
                        className="sf-input-gothic"
                        id="reg-teamname-input"
                      />
                    </div>
                    <div>
                      <label className="sf-label-gothic">
                        <span className="flex items-center gap-1.5"><Terminal className="w-3 h-3" /> Problem Track *</span>
                      </label>
                      <select
                        value={formData.selectedChallenge}
                        onChange={(e) => setFormData({ ...formData, selectedChallenge: e.target.value })}
                        className="sf-input-gothic"
                        id="reg-challenge-select"
                      >
                        {allChallenges.map((c) => (
                          <option key={c.id} value={c.id} className="bg-[#06090E] text-[#F5D061]">
                            {c.number}: {c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="sf-label-gothic mb-0">
                        <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> Additional Members (Max 4 Total)</span>
                      </label>
                      {formData.teamMembers.length < 3 && (
                        <button
                          type="button" onClick={addMemberSlot}
                          className="font-rajdhani text-[#D4AF37]/70 hover:text-[#F5D061] font-bold text-[11px] tracking-wider uppercase transition-colors"
                        >
                          + Add Member
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {formData.teamMembers.map((member, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text" value={member}
                            onChange={(e) => handleMemberChange(idx, e.target.value)}
                            placeholder={`Member #${idx + 2} Name & Email`}
                            className="sf-input-gothic flex-1"
                          />
                          {formData.teamMembers.length > 1 && (
                            <button
                              type="button" onClick={() => removeMemberSlot(idx)}
                              className="px-3 border border-[#D4AF37]/20 hover:border-[#FF4655]/60 text-neutral-500 hover:text-[#FF4655] transition-all font-bold text-sm"
                            >
                              x
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terms & Certification Statement */}
                  <div className="flex items-start gap-2 pt-1 pb-1">
                    <input type="checkbox" required id="reg-terms-check" className="mt-1 accent-[#D4AF37] cursor-pointer" />
                    <label htmlFor="reg-terms-check" className="font-rajdhani text-xs text-neutral-400 select-none cursor-pointer leading-tight">
                      {regConfig.termsText || "I certify that all squad members are active university students or researchers and agree to the battleground rules."}
                    </label>
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      id="reg-submit-btn"
                      className="w-full h-12 sf-btn-crimson sf-clip-angled flex items-center justify-center gap-2.5 text-sm font-cinzel tracking-[0.18em] transition-all disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="font-rajdhani tracking-[0.2em]">TRANSMITTING ENLISTMENT...</span>
                      ) : (
                        <>
                          <CheckSquare className="w-4 h-4" />
                          <span>{regConfig.submitButtonText || "CONFIRM SQUAD REGISTRATION"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ──────── STEP 3: SUCCESS ──────── */}
            {step === 'success' && ticket && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5 text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#55FF55]/50 bg-[#55FF55]/10 text-[#55FF55] font-rajdhani text-xs font-bold uppercase tracking-[0.2em]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>REGISTRATION CONFIRMED</span>
                </div>

                <h2 className="sf-gothic-title text-4xl sm:text-5xl text-[#F5D061]">
                  Squad Authorized!
                </h2>

                <p className="font-rajdhani text-neutral-400 text-sm max-w-md mx-auto">
                  Your team credentials have been registered in the Codebreakers state ledger.
                </p>

                {/* Pass Card */}
                <div className="max-w-md mx-auto p-5 bg-[#080B12] border border-[#D4AF37]/30 text-left relative">
                  <div className="sf-bracket-tl" />
                  <div className="sf-bracket-tr" />
                  <div className="sf-bracket-bl" />
                  <div className="sf-bracket-br" />

                  <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3 mb-4">
                    <div>
                      <span className="font-cinzel font-black text-sm text-[#F5D061]">SYNTHARA2.0 // OFFICIAL PASS</span>
                      <div className="text-[10px] font-mono text-[#55FF55] mt-0.5">SQUAD CREDENTIAL</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-white text-xs">{ticket.ticketId}</span>
                      <div className="text-[10px] font-mono text-neutral-500">{ticket.registrationDate}</div>
                    </div>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <span className="text-neutral-500 block text-[10px] tracking-wider uppercase mb-0.5">Team Lead</span>
                      <span className="text-white font-bold">{ticket.data.fullName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-neutral-500 block text-[10px] tracking-wider uppercase mb-0.5">Team Name</span>
                        <span className="text-[#F5D061] font-bold">{ticket.data.teamName || 'SOLO BUILDER'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px] tracking-wider uppercase mb-0.5">Experience</span>
                        <span className="text-white">{ticket.data.experienceLevel}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] tracking-wider uppercase mb-0.5">College / Institution</span>
                      <span className="text-white truncate block">{ticket.data.collegeOrOrg}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] tracking-wider uppercase mb-0.5">Selected Quest</span>
                      <span className="text-[#55FF55] font-bold">
                        {allChallenges.find((c) => c.id === ticket.data.selectedChallenge)?.title || ticket.data.selectedChallenge}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={resetForm}
                  id="success-close-btn"
                  className="px-8 py-3 sf-btn-gold sf-clip-angled font-cinzel font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  CLOSE WINDOW
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
