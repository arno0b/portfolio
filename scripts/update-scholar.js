#!/usr/bin/env node
/**
 * Refresh citation data from Google Scholar into src/data/scholar.json.
 *
 *   npm run update:scholar
 *
 * Google Scholar has no public API and blocks datacenter traffic, so this is
 * deliberately a LOCAL script: run it from your own machine, commit the JSON it
 * writes, and the site builds from that snapshot. Do not wire it into the
 * Netlify build -- it will be CAPTCHA'd.
 *
 * If Scholar serves a CAPTCHA the script exits non-zero and leaves the existing
 * snapshot untouched, so a blocked run can never blank out the site.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SCHOLAR_USER = '0W5bcBIAAAAJ';
const OUT_FILE = path.join(__dirname, '..', 'src', 'data', 'scholar.json');
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const DELAY_MS = 2500;

const sleep = ms => new Promise(r => setTimeout(r, ms));

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' } }, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          return resolve(get(res.headers.location));
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        let body = '';
        res.setEncoding('utf8');
        res.on('data', c => (body += c));
        res.on('end', () => resolve(body));
      })
      .on('error', reject);
  });
}

function assertNotBlocked(html, what) {
  if (/id="gs_captcha_|unusual traffic|not a robot|sorry\/index/i.test(html)) {
    throw new Error(
      `Google Scholar served a CAPTCHA while fetching ${what}.\n` +
        `Wait a while, or open the profile in a browser and solve it, then re-run.\n` +
        `The existing ${path.relative(process.cwd(), OUT_FILE)} was left unchanged.`,
    );
  }
}

// Kept as a lookup table so the apostrophe never appears as a bare literal,
// which prettier and eslint disagree about how to quote.
const ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': String.fromCharCode(39),
  '&nbsp;': ' ',
};

const decode = s => s.replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, m => ENTITIES[m]).trim();

/** Bars carry their year in the href (as_ylo=YYYY), so zero-citation years cannot desync. */
function parseHistogram(html, barClass) {
  const re = new RegExp(
    `<a[^>]*href="[^"]*as_ylo=([0-9]{4})[^"]*"[^>]*class="${barClass}"[^>]*>[^<]*<span[^>]*>([0-9]+)</span>`,
    'g',
  );
  const out = {};
  for (const m of html.matchAll(re)) {
    out[m[1]] = Number(m[2]);
  }
  return out;
}

/**
 * The author-level bars link to javascript:void(0) instead of a year, so pair each
 * bar to its axis label by CSS offset. Matching on document order would desync the
 * moment Scholar omits a bar for a zero-citation year.
 */
function parseAuthorHistogram(html) {
  const labels = [
    ...html.matchAll(/<span class="gsc_g_t" style="right:([0-9]+)px">([0-9]{4})</g),
  ].map(m => ({ offset: Number(m[1]), year: m[2] }));
  const bars = [
    ...html.matchAll(
      /<a[^>]*class="gsc_g_a"[^>]*style="right:([0-9]+)px[^"]*"[^>]*>[^<]*<span[^>]*>([0-9]+)</g,
    ),
  ].map(m => ({ offset: Number(m[1]), count: Number(m[2]) }));

  const out = {};
  for (const bar of bars) {
    let best = null;
    for (const label of labels) {
      const d = Math.abs(label.offset - bar.offset);
      if (!best || d < best.d) {
        best = { d, year: label.year };
      }
    }
    if (best && best.d <= 16) {
      out[best.year] = bar.count;
    }
  }
  return out;
}

function parseProfile(html) {
  const rows = [...html.matchAll(/<tr class="gsc_a_tr">([\s\S]*?)<\/tr>/g)];
  const publications = rows.map(([, row]) => {
    const pick = re => (row.match(re) || [])[1];
    return {
      scholarId: pick(/citation_for_view=([^&"]+)/),
      title: decode(pick(/class="gsc_a_at"[^>]*>([^<]*)</) || ''),
      year: Number(pick(/class="gsc_a_h[^"]*"[^>]*>(\d{4})</)) || null,
      citations: Number(pick(/class="gsc_a_ac[^"]*"[^>]*>([^<]*)</)) || 0,
      citationsByYear: {},
    };
  });

  const stats = [...html.matchAll(/class="gsc_rsb_std">(\d+)</g)].map(m => Number(m[1]));
  return {
    publications,
    // stats are [citations all, citations since, h all, h since, i10 all, i10 since]
    totals: { citations: stats[0] ?? 0, hIndex: stats[2] ?? 0, i10Index: stats[4] ?? 0 },
    citationsByYear: parseAuthorHistogram(html),
  };
}

(async () => {
  const profileUrl = `https://scholar.google.com/citations?user=${SCHOLAR_USER}&hl=en&cstart=0&pagesize=100`;
  process.stdout.write('Fetching Scholar profile... ');
  const profileHtml = await get(profileUrl);
  assertNotBlocked(profileHtml, 'the author profile');
  const { publications, totals, citationsByYear } = parseProfile(profileHtml);
  console.log(`${publications.length} publications, ${totals.citations} citations total`);

  for (const pub of publications) {
    if (!pub.scholarId) {
      continue;
    }
    await sleep(DELAY_MS);
    process.stdout.write(`  ${pub.title.slice(0, 58)}... `);
    const url =
      `https://scholar.google.com/citations?view_op=view_citation&hl=en` +
      `&user=${SCHOLAR_USER}&citation_for_view=${encodeURIComponent(pub.scholarId)}`;
    const html = await get(url);
    assertNotBlocked(html, `"${pub.title}"`);
    pub.citationsByYear = parseHistogram(html, 'gsc_oci_g_a');
    console.log(`${pub.citations} cites`);
  }

  const data = {
    fetchedAt: new Date().toISOString(),
    source: 'Google Scholar',
    profileUrl: `https://scholar.google.com/citations?user=${SCHOLAR_USER}&hl=en`,
    totals,
    citationsByYear,
    publications,
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`\nWrote ${path.relative(process.cwd(), OUT_FILE)} - commit it to publish.`);
})().catch(err => {
  console.error(`\n${err.message}`);
  process.exit(1);
});
