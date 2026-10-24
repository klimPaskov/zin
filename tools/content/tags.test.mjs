// Tests of the real-tag derivation and the A-27 tag check (lib/tags.mjs, requirement R-27).
import test from 'node:test';
import assert from 'node:assert/strict';
import { candidates, deriveTag, assignTags, checkTags, refused, VANILLA_TAGS } from './lib/tags.mjs';

test('Tags come from the name: Aenor is AEN; Noris skips NOR, the vanilla tag of Norway, and takes its skeleton NRS', () => {
  assert.equal(deriveTag('Aenor'), 'AEN');
  assert.equal(refused('NOR'), 'vanilla tag');
  assert.equal(deriveTag('Noris'), 'NRS');
});

test('Leading words and possessives are skipped: Zol\'s Mistake starts with ZOL; The Kingdom of Selen with SEL', () => {
  assert.equal(candidates("Zol's Mistake")[0], 'ZOL');
  assert.equal(candidates('The Kingdom of Selen')[0], 'SEL');
});

test('A taken tag falls back to the consonant skeleton, then to later triples, always from the name', () => {
  const taken = new Set(['LER']);
  const t = deriveTag('Lerendor', taken);
  assert.equal(t, 'LRN');
  assert.equal(deriveTag('Lerendor', new Set(['LER', 'LRN']))[0], 'L');
});

test('Assignment honours priority and fixed tags and never repeats a tag', () => {
  const tags = assignTags([{ key: 'a', name: 'Aenor' }, { key: 'b', name: 'Aenwick' }, { key: 'c', name: 'Selen', fixed: 'SEL' }]);
  assert.equal(tags.get('a'), 'AEN');
  assert.notEqual(tags.get('b'), 'AEN');
  assert.equal(tags.get('c'), 'SEL');
  assert.equal(new Set(tags.values()).size, 3);
});

test('Negative: vanilla tags, script words, dynamic tags, tripled letters and unseemly words are refused', () => {
  const vanilla = [...VANILLA_TAGS][0];
  assert.equal(refused(vanilla), 'vanilla tag');
  assert.equal(refused('D07'), 'shape');
  assert.equal(refused('AAA'), 'tripled letter');
  assert.equal(refused('ASS'), 'unseemly');
  assert.throws(() => assignTags([{ key: 'x', name: 'Germany', fixed: 'GER' }]), /refused: vanilla tag/);
});

test('Negative: the check finds duplicates, debug tags, a tag unrelated to its name and a total at the crash limit', () => {
  const { errors } = checkTags([{ tag: 'AEN', name: 'Aenor' }, { tag: 'AEN', name: 'Aenwick' }, { tag: 'Y01', name: 'Coldor' }, { tag: 'QRX', name: 'Noris' }], { dynamic: 0 });
  const codes = errors.map(e => e.code);
  assert(codes.includes('TAG_DUPLICATE'));
  assert(codes.includes('TAG_REFUSED'));
  assert(codes.includes('TAG_NOT_FROM_NAME'));
  const big = Array.from({ length: 364 }, (_, i) => ({ tag: 'Q' + String.fromCharCode(65 + Math.floor(i / 26) % 26) + String.fromCharCode(65 + i % 26), name: 'Q' }));
  assert(checkTags(big, { dynamic: 75 }).errors.some(e => e.code === 'TAG_TOTAL'));
  assert(!checkTags(big.slice(0, 363), { dynamic: 75 }).errors.some(e => e.code === 'TAG_TOTAL'));
});
