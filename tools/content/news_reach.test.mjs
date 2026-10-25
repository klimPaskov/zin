// Tests for the news reach of owner decision K61 (modules/news_reach.mjs, data/news_reach.json): world news only for what the whole world
// would learn; every other news event is shown to the lands where it happens and the realms it involves.
// Run: node --test tools/content/news_reach.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { Staged } from './lib/core.mjs';
import { parse } from './lib/clausewitz.mjs';
import { countryTable } from './lib/roster.mjs';
import { applyNewsReach, loadNewsReach, newsReachTriggers, audienceOf, majorNews, FILE } from './modules/news_reach.mjs';

const countries = countryTable();
const D = await loadNewsReach();
const lands = [...new Set(countries.map(c => c.region))].sort();
const news = (id, extra = '') => `news_event = {\n\tid = ${id}\n\ttitle = ${id}.t\n\tmajor = yes\n${extra}\tis_triggered_only = yes\n\toption = { name = ${id}.a }\n}\n`;
const fixture = () => {
  const s = new Staged();
  const all = [...Object.keys(D.world), ...Object.keys(D.regional)].map(id => news(id)).join('') + Object.keys(D.owned).map(id => news(id, '\tshow_major = { always = yes }\n')).join('');
  s.files.set('events/zin_fixture.txt', Buffer.from(all));
  return s;
};

test('The triggers: one per land of the roster and the general zin_realm_hears_of, which reads ROOT', () => {
  const t = newsReachTriggers(lands);
  assert.doesNotThrow(() => parse(t));
  for (const l of lands) assert(t.includes(`zin_hears_in_${l} = {`) && t.includes(`has_country_flag = zin_realm_land_${l}`), l);
  assert.match(t, /zin_realm_hears_of = \{\s*OR = \{\s*tag = ROOT\s*is_neighbor_of = ROOT\s*has_war_with = ROOT/);
});

test('Every regional news event gets its show_major; world and owned news are left alone', async () => {
  const s = fixture();
  const r = await applyNewsReach(s, { countries });
  assert.equal(r.counts.regional, Object.keys(D.regional).length);
  const out = s.files.get('events/zin_fixture.txt').toString('latin1');
  for (const n of majorNews(out)) {
    if (D.regional[n.id]) assert(n.showMajor, `${n.id} is regional`);
    else if (D.world[n.id]) assert(!n.showMajor, `${n.id} stays world news`);
  }
  assert(out.includes(audienceOf(D.regional['zin_eindil.35']).split('\n')[0]));
  assert(s.files.has(FILE));
  assert.doesNotThrow(() => parse(out));
});

test('An unclassified major news event stops the build (K61: a new world news event is a decision)', async () => {
  const s = fixture();
  s.files.set('events/zin_new.txt', Buffer.from(news('zin_new.1')));
  await assert.rejects(applyNewsReach(s, { countries }), /zin_new\.1 .* does not classify/);
});

test('The classification keeps world news for the great wars, the great kings, the capitals, the reveal, the meter and the endings', () => {
  for (const [id, why] of Object.entries(D.world)) assert(/great|death|crown|capital|reveal|Gathering Dark|Ending|realm falls|turning|front/i.test(why), `${id}: ${why}`);
  for (const [id, row] of Object.entries(D.regional)) {
    assert(row.regions.length && row.regions.every(l => lands.includes(l)), id);
    assert.equal(row.was, 'every country', id);
  }
  // the man in the ice is never world news: no waking event is classified as world news
  for (const id of Object.keys(D.world)) assert(!/ice|wak/i.test(D.world[id]), id);
});
