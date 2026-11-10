import 'dotenv/config';
import pg from 'pg';

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres.lloiyxagwcbsunhsbvip:Raghab%4020062026@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function runAudit() {
  console.log('====================================================');
  console.log('       SUPABASE DATABASE COMPREHENSIVE AUDIT        ');
  console.log('====================================================\n');

  const client = await pool.connect();
  try {
    // 1. Connection check
    const dbInfo = await client.query(`
      SELECT current_database() as db, current_user as usr, version() as ver, now() as timestamp;
    `);
    console.log(' Connected to Supabase:');
    console.log(`   Database: ${dbInfo.rows[0].db}`);
    console.log(`   User:     ${dbInfo.rows[0].usr}`);
    console.log(`   Engine:   ${dbInfo.rows[0].ver.split(',')[0]}`);
    console.log(`   Time:     ${dbInfo.rows[0].timestamp}\n`);

    // 2. Tables list & row counts
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    const tables = tablesRes.rows.map(r => r.table_name);
    console.log(` Found ${tables.length} tables in 'public' schema:\n`);

    const tableStats: Record<string, number> = {};
    for (const t of tables) {
      const countRes = await client.query(`SELECT COUNT(*) as cnt FROM "${t}";`);
      const cnt = parseInt(countRes.rows[0].cnt, 10);
      tableStats[t] = cnt;
      console.log(`   - [${t.padEnd(20)}] : ${cnt} rows`);
    }

    // 3. Inspect site_content
    console.log('\n====================================================');
    console.log(' 1. AUDIT: site_content Table');
    console.log('====================================================');
    const scRes = await client.query(`SELECT id, updated_at, pg_column_size(content) as byte_size FROM site_content;`);
    console.log(`Rows in site_content: ${scRes.rows.length}`);
    for (const r of scRes.rows) {
      console.log(`   Row ID: '${r.id}' | Last Updated: ${r.updated_at} | Size: ${r.byte_size} bytes`);
    }

    const scContentRes = await client.query(`SELECT content FROM site_content WHERE id = 'hackverse_2026';`);
    if (scContentRes.rows.length > 0) {
      const content = scContentRes.rows[0].content;
      const keys = Object.keys(content);
      console.log(`\n'hackverse_2026' JSON Keys (${keys.length} total):`);
      for (const k of keys) {
        const val = content[k];
        if (Array.isArray(val)) {
          console.log(`   - ${k.padEnd(22)}: Array [${val.length} items]`);
        } else if (typeof val === 'object' && val !== null) {
          console.log(`   - ${k.padEnd(22)}: Object (${Object.keys(val).length} sub-keys)`);
        } else {
          console.log(`   - ${k.padEnd(22)}: ${typeof val} ("${String(val).substring(0, 30)}")`);
        }
      }

      // Check key sections detail
      console.log('\n--- Deep Inspection of Key Content Sections ---');
      console.log(`Event Name:            ${content.eventInfo?.name || 'N/A'}`);
      console.log(`Event Short Name:      ${content.eventInfo?.shortName || 'N/A'}`);
      console.log(`Gothic Title:          ${content.eventInfo?.titleGothic || 'N/A'}`);
      console.log(`Dates:                 ${content.eventInfo?.dates || 'N/A'}`);
      console.log(`Venue:                 ${content.eventInfo?.venue || 'N/A'}`);
      console.log(`Prize Pool Total:      ${content.prizes?.poolTotal || 'N/A'}`);
      console.log(`First Prize:           ${content.prizes?.first || 'N/A'}`);
      console.log(`Second Prize:          ${content.prizes?.second || 'N/A'}`);
      console.log(`Third Prize:           ${content.prizes?.third || 'N/A'}`);
      console.log(`Runner-Up Prize:       ${content.prizes?.runnerUp || 'N/A'}`);
      console.log(`Challenges Count:      ${content.challenges?.length || 0}`);
      if (Array.isArray(content.challenges)) {
        content.challenges.forEach((ch: any, idx: number) => {
          console.log(`   [Track ${idx + 1}] ${ch.title} | Bounty: ${ch.bounty} | Rules PDF: ${ch.rulesPdfUrl || '(none)'}`);
        });
      }
      console.log(`Your Team Members:     ${content.yourTeam?.length || 0}`);
      console.log(`Your Team Categories:  ${JSON.stringify(content.yourTeamCategories || [])}`);
      console.log(`Timeline Events:       ${content.timeline?.length || 0}`);
      console.log(`Partners/Sponsors:     ${content.partners?.length || content.sponsors?.length || 0}`);
      console.log(`FAQ Items:             ${content.faq?.length || 0}`);
      console.log(`Gallery Items:         ${content.gallery?.length || 0}`);
      console.log(`Admin Email:           ${content.adminSettings?.email || 'N/A'}`);
      console.log(`Admin Passcode Hash:   ${content.adminSettings?.passcode ? '***' + content.adminSettings.passcode.slice(-4) : 'N/A'}`);
    }

    // 4. Inspect registrations table
    console.log('\n====================================================');
    console.log(' 2. AUDIT: registrations Table');
    console.log('====================================================');
    const regCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'registrations';
    `);
    console.log('Columns:');
    for (const c of regCols.rows) {
      console.log(`   - ${c.column_name.padEnd(25)} : ${c.data_type}`);
    }
    const regsRes = await client.query(`SELECT id, team_name, full_name, email, phone, selected_challenge, submitted_at FROM registrations ORDER BY submitted_at DESC LIMIT 10;`);
    console.log(`\nSample Registrations (${regsRes.rows.length}):`);
    for (const reg of regsRes.rows) {
      console.log(`   - [${reg.id}] Team: "${reg.team_name}" | Leader: ${reg.full_name} (${reg.email}) | Challenge: "${reg.selected_challenge}" | At: ${reg.submitted_at}`);
    }

    // 5. Inspect normalized relational tables
    const otherTables = ['challenges', 'partners', 'gallery', 'faq', 'teams', 'timeline', 'sponsors', 'contact_messages'];
    for (const t of otherTables) {
      if (tables.includes(t)) {
        console.log(`\n====================================================`);
        console.log(` AUDIT: ${t} Table`);
        console.log(`====================================================`);
        const colsRes = await client.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = '${t}';
        `);
        console.log(`Columns: ${colsRes.rows.map(c => c.column_name).join(', ')}`);
        const sampleRes = await client.query(`SELECT * FROM "${t}" LIMIT 5;`);
        console.log(`Row count: ${tableStats[t]} | Sample rows (${sampleRes.rows.length}):`);
        for (const row of sampleRes.rows) {
          const summary = Object.entries(row)
            .map(([k, v]) => `${k}: ${typeof v === 'string' && v.length > 30 ? v.substring(0, 30) + '...' : v}`)
            .join(' | ');
          console.log(`   - ${summary}`);
        }
      }
    }

  } finally {
    client.release();
    await pool.end();
  }
}

runAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});

