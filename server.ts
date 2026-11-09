import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import compression from 'compression';
import { cache } from './redisClient';

const app = express();
const PORT = 4000;
const DEFAULT_ADMIN_PASSWORD = 'Techxera@gmail.2026';
const DEFAULT_ADMIN_EMAIL = 'techxerahack@gmail.com';

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres.lloiyxagwcbsunhsbvip:Raghab%4020062026@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

export const dbPool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
});

dbPool.on('error', (err) => {
  console.warn('PostgreSQL pool background event:', err.message);
});

// ─── DIRECT SUPABASE DATABASE ACCESS HELPERS WITH REDIS CACHING ───
const SITE_CONTENT_CACHE_KEY = 'site_content_cache';
const SITE_CONTENT_CACHE_TTL = 60; // 60 seconds TTL

async function getSiteContentFromDb(bypassCache = false): Promise<Record<string, any>> {
  if (!bypassCache) {
    const cached = await cache.get(SITE_CONTENT_CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // Fall through on JSON parse error
      }
    }
  }

  try {
    const res = await dbPool.query(
      "SELECT content FROM site_content WHERE id = 'hackverse_2026'"
    );
    if (res.rows[0]?.content && typeof res.rows[0].content === 'object') {
      const content = res.rows[0].content;
      // Store in Redis / Cache with TTL
      await cache.setex(SITE_CONTENT_CACHE_KEY, SITE_CONTENT_CACHE_TTL, JSON.stringify(content));
      return content;
    }
  } catch (err: any) {
    console.error('Error fetching site_content from Supabase:', err.message);
  }
  return {};
}

async function saveSiteContentToDb(data: Record<string, any>): Promise<void> {
  await dbPool.query(
    `INSERT INTO site_content (id, content, updated_at)
     VALUES ('hackverse_2026', $1, now())
     ON CONFLICT (id) DO UPDATE SET content = $1, updated_at = now()`,
    [JSON.stringify(data)]
  );
  // Immediately invalidate cache on update
  await cache.del(SITE_CONTENT_CACHE_KEY);
}

async function getAdminCredentials(): Promise<{ email: string; pass: string }> {
  try {
    const content = await getSiteContentFromDb();
    const settings = content.adminSettings || {};
    const pass = typeof settings.passcode === 'string' && settings.passcode.trim()
      ? settings.passcode.trim()
      : DEFAULT_ADMIN_PASSWORD;
    const email = typeof settings.email === 'string' && settings.email.trim()
      ? settings.email.trim().toLowerCase()
      : DEFAULT_ADMIN_EMAIL;
    return { email, pass };
  } catch {
    return { email: DEFAULT_ADMIN_EMAIL, pass: DEFAULT_ADMIN_PASSWORD };
  }
}

// Enable Gzip/Brotli compression for all requests (reduces payload by 80%+)
app.use(compression());

app.use(express.json({ limit: '10mb' }));

// CORS headers
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (_req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

async function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization;
  const { pass } = await getAdminCredentials();
  if (!auth || auth !== `Bearer ${pass}`) {
    res.status(401).json({ error: 'Unauthorized: invalid or missing admin token' });
    return;
  }
  next();
}

// ─── PUBLIC ROUTES ──────────────────────────────────────────────
app.get('/api/content', async (_req, res) => {
  try {
    const cached = await cache.get(SITE_CONTENT_CACHE_KEY);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
      res.type('json').send(cached);
      return;
    }

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    const content = await getSiteContentFromDb(true);
    res.json(content);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to read content from Supabase', details: err.message });
  }
});

// Cache & Redis operational status check
app.get('/api/cache-status', async (_req, res) => {
  try {
    const status = await cache.getStatus();
    res.json({
      success: true,
      ...status,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/redis-status', async (_req, res) => {
  try {
    const status = await cache.getStatus();
    res.json({
      success: true,
      ...status,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Direct PostgreSQL health check endpoint
app.get('/api/db-status', async (_req, res) => {
  try {
    const result = await dbPool.query(`
      SELECT 
        current_database() as database,
        current_user as user,
        now() as server_time,
        version() as version;
    `);
    const tables = await dbPool.query(`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
    `);
    const regCount = await dbPool.query(`SELECT COUNT(*) FROM registrations;`);
    res.json({
      connected: true,
      database: result.rows[0].database,
      user: result.rows[0].user,
      serverTime: result.rows[0].server_time,
      version: result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1],
      tables: tables.rows.map((r: any) => r.table_name),
      registrationsInSupabase: Number(regCount.rows[0]?.count || 0),
    });
  } catch (err: any) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const { email: currentEmail, pass: currentPass } = await getAdminCredentials();

    const passwordMatches = password === currentPass;
    const emailMatches = !email || email.trim().toLowerCase() === currentEmail;

    if (passwordMatches && emailMatches) {
      res.json({ token: currentPass, success: true });
    } else {
      res.status(401).json({ error: 'Invalid email or password. Try again.', success: false });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Login verification failed', details: err.message });
  }
});

app.post('/api/admin/change-passcode', requireAdmin, async (req, res) => {
  const { newPasscode } = req.body || {};
  if (!newPasscode || typeof newPasscode !== 'string' || newPasscode.trim().length < 4) {
    res.status(400).json({ error: 'Passcode must be at least 4 characters long', success: false });
    return;
  }
  try {
    const data = await getSiteContentFromDb();
    data.adminSettings = { ...(data.adminSettings || {}), passcode: newPasscode.trim() };
    await saveSiteContentToDb(data);
    res.json({ success: true, token: newPasscode.trim() });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update passcode in Supabase', details: err.message });
  }
});

// Enlist warrior registration — saved directly into Supabase registrations table
app.post('/api/registrations', async (req, res) => {
  try {
    // Rate limiting: Max 30 registration submissions per minute per IP
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const ipKey = String(clientIp).split(',')[0].trim();
    const rate = await cache.rateLimit(`reg:${ipKey}`, 30, 60);
    if (!rate.allowed) {
      res.status(429).json({
        error: 'Too many registration requests. Please wait a moment and try again.',
        retryAfterSeconds: rate.resetSeconds,
      });
      return;
    }

    const newReg = {
      id: req.body.ticketId || `HV-26-${Math.floor(1000 + Math.random() * 9000)}`,
      teamName: req.body.teamName || 'WARRIOR SQUAD',
      fullName: req.body.fullName || 'WARRIOR',
      email: req.body.email || '',
      phone: req.body.phone || '',
      collegeOrOrg: req.body.collegeOrOrg || '',
      selectedChallenge: req.body.selectedChallenge || '',
      teamMembers: Array.isArray(req.body.teamMembers) ? req.body.teamMembers : [],
      githubOrPortfolio: req.body.githubOrPortfolio || '',
      submittedAt: new Date().toISOString(),
    };

    await dbPool.query(
      `INSERT INTO registrations (id, team_name, full_name, email, phone, college_or_org, selected_challenge, team_members, github_or_portfolio, submitted_at, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now())
       ON CONFLICT (id) DO UPDATE SET
         team_name = EXCLUDED.team_name,
         full_name = EXCLUDED.full_name,
         email = EXCLUDED.email,
         phone = EXCLUDED.phone,
         college_or_org = EXCLUDED.college_or_org,
         selected_challenge = EXCLUDED.selected_challenge,
         team_members = EXCLUDED.team_members,
         github_or_portfolio = EXCLUDED.github_or_portfolio`,
      [
        newReg.id,
        newReg.teamName,
        newReg.fullName,
        newReg.email,
        newReg.phone,
        newReg.collegeOrOrg,
        newReg.selectedChallenge,
        JSON.stringify(newReg.teamMembers),
        newReg.githubOrPortfolio,
        newReg.submittedAt,
      ]
    );

    res.json({ success: true, id: newReg.id, registration: newReg });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save registration in Supabase', details: err.message });
  }
});

// Purge cache on demand (Redis + in-memory store)
app.post('/api/admin/clear-cache', requireAdmin, async (_req, res) => {
  try {
    await cache.del(SITE_CONTENT_CACHE_KEY);
    await cache.flushall();
    res.json({ success: true, message: 'Redis & memory cache cleared successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to clear cache', details: err.message });
  }
});

app.post('/api/admin/registrations', requireAdmin, async (req, res) => {
  try {
    const newReg = {
      id: req.body.ticketId || `HV-26-${Math.floor(1000 + Math.random() * 9000)}`,
      teamName: req.body.teamName || 'WARRIOR SQUAD',
      fullName: req.body.fullName || 'WARRIOR',
      email: req.body.email || '',
      phone: req.body.phone || '',
      collegeOrOrg: req.body.collegeOrOrg || '',
      selectedChallenge: req.body.selectedChallenge || '',
      teamMembers: Array.isArray(req.body.teamMembers) ? req.body.teamMembers : [],
      githubOrPortfolio: req.body.githubOrPortfolio || '',
      submittedAt: new Date().toISOString(),
    };

    await dbPool.query(
      `INSERT INTO registrations (id, team_name, full_name, email, phone, college_or_org, selected_challenge, team_members, github_or_portfolio, submitted_at, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now())
       ON CONFLICT (id) DO UPDATE SET
         team_name = EXCLUDED.team_name,
         full_name = EXCLUDED.full_name,
         email = EXCLUDED.email,
         phone = EXCLUDED.phone,
         college_or_org = EXCLUDED.college_or_org,
         selected_challenge = EXCLUDED.selected_challenge,
         team_members = EXCLUDED.team_members,
         github_or_portfolio = EXCLUDED.github_or_portfolio`,
      [
        newReg.id,
        newReg.teamName,
        newReg.fullName,
        newReg.email,
        newReg.phone,
        newReg.collegeOrOrg,
        newReg.selectedChallenge,
        JSON.stringify(newReg.teamMembers),
        newReg.githubOrPortfolio,
        newReg.submittedAt,
      ]
    );

    res.json({ success: true, id: newReg.id, registration: newReg });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create registration in Supabase', details: err.message });
  }
});

// ─── ADMIN ROUTES ────────────────────────────────────────────────
app.get('/api/admin/registrations', requireAdmin, async (_req, res) => {
  try {
    const sbRes = await dbPool.query('SELECT * FROM registrations ORDER BY submitted_at DESC');
    const mapped = sbRes.rows.map((r: any) => ({
      id: r.id,
      teamName: r.team_name,
      fullName: r.full_name,
      email: r.email,
      phone: r.phone,
      collegeOrOrg: r.college_or_org,
      selectedChallenge: r.selected_challenge,
      teamMembers: r.team_members,
      githubOrPortfolio: r.github_or_portfolio,
      submittedAt: r.submitted_at,
    }));
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch registrations from Supabase', details: err.message });
  }
});

// Helper to keep individual relational tables in Supabase in sync
async function syncSectionToRelationalTables(section: string, data: any) {
  try {
    if (section === 'partners' || section === 'sponsors') {
      const list = Array.isArray(data) ? data : [];
      await dbPool.query('DELETE FROM partners;');
      await dbPool.query('DELETE FROM sponsors;');
      for (const p of list) {
        await dbPool.query(
          `INSERT INTO partners (id, name, tier, category, perk, logo_url, website_url, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, now())
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             tier = EXCLUDED.tier,
             category = EXCLUDED.category,
             perk = EXCLUDED.perk,
             logo_url = EXCLUDED.logo_url,
             website_url = EXCLUDED.website_url`,
          [
            p.id || `pt-${Date.now()}`,
            p.name || 'Official Partner',
            p.tier || 'Gold',
            p.category || 'Developer Ecosystem & Grants',
            p.perk || 'Official Arena Combat Partner',
            p.logoUrl || p.logo_url || '',
            p.websiteUrl || p.website_url || '',
          ]
        );
        await dbPool.query(
          `INSERT INTO sponsors (id, name, tier, category, logo_url, website_url, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, now())
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             tier = EXCLUDED.tier,
             category = EXCLUDED.category,
             logo_url = EXCLUDED.logo_url,
             website_url = EXCLUDED.website_url`,
          [
            p.id || `sp-${Date.now()}`,
            p.name || 'Official Partner',
            p.tier || 'Gold',
            p.category || 'Developer Ecosystem & Grants',
            p.logoUrl || p.logo_url || '',
            p.websiteUrl || p.website_url || '',
          ]
        );
      }
    } else if (section === 'gallery') {
      const list = Array.isArray(data) ? data : [];
      await dbPool.query('DELETE FROM gallery;');
      for (const g of list) {
        await dbPool.query(
          `INSERT INTO gallery (id, title, category, image, caption, created_at)
           VALUES ($1, $2, $3, $4, $5, now())
           ON CONFLICT (id) DO UPDATE SET
             title = EXCLUDED.title,
             category = EXCLUDED.category,
             image = EXCLUDED.image,
             caption = EXCLUDED.caption`,
          [
            g.id || `gal-${Date.now()}`,
            g.title || 'Archive Image',
            g.category || 'EVENT',
            g.image || '',
            g.caption || '',
          ]
        );
      }
    } else if (section === 'challenges') {
      const list = Array.isArray(data) ? data : [];
      await dbPool.query('DELETE FROM challenges;');
      for (const ch of list) {
        await dbPool.query(
          `INSERT INTO challenges (id, number, title, category, difficulty, short_description, problem_statement, requirements, judging_criteria, skills, image, prize_pool, first_prize, second_prize, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, now())
           ON CONFLICT (id) DO UPDATE SET
             number = EXCLUDED.number,
             title = EXCLUDED.title,
             category = EXCLUDED.category,
             difficulty = EXCLUDED.difficulty,
             short_description = EXCLUDED.short_description,
             problem_statement = EXCLUDED.problem_statement,
             requirements = EXCLUDED.requirements,
             judging_criteria = EXCLUDED.judging_criteria,
             skills = EXCLUDED.skills,
             image = EXCLUDED.image,
             prize_pool = EXCLUDED.prize_pool,
             first_prize = EXCLUDED.first_prize,
             second_prize = EXCLUDED.second_prize`,
          [
            ch.id,
            ch.number,
            ch.title,
            ch.category,
            ch.difficulty || 'All Levels',
            ch.shortDescription || '',
            ch.problemStatement || '',
            JSON.stringify(ch.requirements || []),
            JSON.stringify(ch.judgingCriteria || []),
            JSON.stringify(ch.skills || []),
            ch.image || '',
            ch.prizePool || '',
            ch.firstPrize || '',
            ch.secondPrize || '',
          ]
        );
      }
    } else if (section === 'faq') {
      const list = Array.isArray(data) ? data : [];
      await dbPool.query('DELETE FROM faq;');
      for (const f of list) {
        await dbPool.query(
          `INSERT INTO faq (id, question, answer, category, created_at)
           VALUES ($1, $2, $3, $4, now())
           ON CONFLICT (id) DO UPDATE SET
             question = EXCLUDED.question,
             answer = EXCLUDED.answer,
             category = EXCLUDED.category`,
          [f.id, f.question, f.answer, f.category]
        );
      }
    } else if (section === 'teams') {
      const list = Array.isArray(data) ? data : [];
      await dbPool.query('DELETE FROM teams;');
      for (const tm of list) {
        await dbPool.query(
          `INSERT INTO teams (id, number, name, category, created_at)
           VALUES ($1, $2, $3, $4, now())
           ON CONFLICT (id) DO UPDATE SET
             number = EXCLUDED.number,
             name = EXCLUDED.name,
             category = EXCLUDED.category`,
          [tm.id, tm.number, tm.name, tm.category]
        );
      }
    } else if (section === 'timeline') {
      const list = Array.isArray(data) ? data : [];
      await dbPool.query('DELETE FROM timeline;');
      for (const tl of list) {
        await dbPool.query(
          `INSERT INTO timeline (id, day, time, title, description, milestone, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, now())
           ON CONFLICT (id) DO UPDATE SET
             day = EXCLUDED.day,
             time = EXCLUDED.time,
             title = EXCLUDED.title,
             description = EXCLUDED.description,
             milestone = EXCLUDED.milestone`,
          [tl.id, tl.day, tl.time, tl.title, tl.description, !!tl.milestone]
        );
      }
    }
  } catch (err: any) {
    console.warn(`Relational table sync notice (${section}):`, err.message);
  }
}

// Update an entire section in Supabase site_content (e.g. hero, eventInfo, faq, prizes, partners, gallery, etc.)
app.put('/api/admin/content/:section', requireAdmin, async (req, res) => {
  try {
    const { section } = req.params;
    const data = await getSiteContentFromDb();
    data[section] = req.body;
    await saveSiteContentToDb(data);
    await syncSectionToRelationalTables(section, req.body);
    res.json({ success: true, section, data: req.body });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update section in Supabase', details: err.message });
  }
});

// Update the ENTIRE content in one call in Supabase
app.put('/api/admin/content', requireAdmin, async (req, res) => {
  try {
    const updated = req.body;
    if (typeof updated !== 'object' || updated === null || Array.isArray(updated)) {
      res.status(400).json({ error: 'Invalid content format. Must be an object.' });
      return;
    }
    await saveSiteContentToDb(updated);
    if (updated.partners) await syncSectionToRelationalTables('partners', updated.partners);
    if (updated.gallery) await syncSectionToRelationalTables('gallery', updated.gallery);
    if (updated.challenges) await syncSectionToRelationalTables('challenges', updated.challenges);
    if (updated.faq) await syncSectionToRelationalTables('faq', updated.faq);
    if (updated.teams) await syncSectionToRelationalTables('teams', updated.teams);
    if (updated.timeline) await syncSectionToRelationalTables('timeline', updated.timeline);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update content in Supabase', details: err.message });
  }
});

app.put('/api/admin/registrations/:id', requireAdmin, async (req, res) => {
  try {
    const { teamName, fullName, email, phone, collegeOrOrg, selectedChallenge, teamMembers, githubOrPortfolio } = req.body;
    const sbRes = await dbPool.query(
      `UPDATE registrations SET
         team_name = COALESCE($2, team_name),
         full_name = COALESCE($3, full_name),
         email = COALESCE($4, email),
         phone = COALESCE($5, phone),
         college_or_org = COALESCE($6, college_or_org),
         selected_challenge = COALESCE($7, selected_challenge),
         team_members = COALESCE($8, team_members),
         github_or_portfolio = COALESCE($9, github_or_portfolio)
       WHERE id = $1
       RETURNING *`,
      [
        req.params.id,
        teamName,
        fullName,
        email,
        phone,
        collegeOrOrg,
        selectedChallenge,
        teamMembers ? JSON.stringify(teamMembers) : null,
        githubOrPortfolio,
      ]
    );

    if (sbRes.rows.length === 0) {
      res.status(404).json({ error: 'Registration not found in Supabase' });
      return;
    }

    const r = sbRes.rows[0];
    const mapped = {
      id: r.id,
      teamName: r.team_name,
      fullName: r.full_name,
      email: r.email,
      phone: r.phone,
      collegeOrOrg: r.college_or_org,
      selectedChallenge: r.selected_challenge,
      teamMembers: r.team_members,
      githubOrPortfolio: r.github_or_portfolio,
      submittedAt: r.submitted_at,
    };

    res.json({ success: true, registration: mapped });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update registration in Supabase', details: err.message });
  }
});

app.delete('/api/admin/registrations/:id', requireAdmin, async (req, res) => {
  try {
    await dbPool.query('DELETE FROM registrations WHERE id = $1', [req.params.id]);
    res.json({ success: true, deletedId: req.params.id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete registration from Supabase', details: err.message });
  }
});

// Public contact message submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, category, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required.' });
      return;
    }
    const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    await dbPool.query(
      `INSERT INTO contact_messages (id, name, email, phone, category, message, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'unread', NOW())`,
      [id, name, email, phone || '', category || 'General Inquiry', message]
    );
    res.json({ success: true, messageId: id });
  } catch (err: any) {
    console.error('Contact message submission error:', err);
    res.status(500).json({ error: 'Failed to record transmission', details: err.message });
  }
});

// Admin contact messages list
app.get('/api/admin/contact-messages', requireAdmin, async (_req, res) => {
  try {
    const { rows } = await dbPool.query(
      `SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 200`
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch contact messages', details: err.message });
  }
});

// Admin delete contact message
app.delete('/api/admin/contact-messages/:id', requireAdmin, async (req, res) => {
  try {
    await dbPool.query('DELETE FROM contact_messages WHERE id = $1', [req.params.id]);
    res.json({ success: true, deletedId: req.params.id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete message', details: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Hackverse Admin API running at http://localhost:${PORT}`);
  console.log(`☁️  Database: Supabase Cloud PostgreSQL (site_content & registrations)`);
  console.log(`🔑 Admin Login Ready\n`);
});
