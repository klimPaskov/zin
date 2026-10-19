// The sound laws of docs/specs/02_lore/06_languages.md section 1, as an engine. Each language of languages.json lists
// ordered laws in plain words ("p t k > b d g between vowels", "final vowel lost in words of two or more syllables").
// parseLaws() turns one language's list into rules; applyLaws() runs a proto-form through them. The relatedness check
// (checks/names_check.mjs) uses it: a regular word of a daughter language must equal its family's proto-form after the
// laws; an irregular or extra word is exempt. A law the parser does not know is reported in `unknown`, never guessed.
const V = '[aeiou]';
const C = '[^aeiou]';
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// A syllable is one nucleus: a diphthong or long vowel of the language ("ae", "ei", "aa") or a single vowel. y is a
// consonant here. `multi` lists the multi-letter nuclei, which are tokenised left to right.
function nucleiTools(multi) {
  const alt = [...multi].sort((a, b) => b.length - a.length).concat('[aeiou]').join('|');
  const tokens = word => word.match(new RegExp(alt, 'g')) ?? [];
  return {
    count: word => tokens(word).length,
    endsInMulti: word => { const last = tokens(word).at(-1); return !!last && last.length > 1 && word.endsWith(last); },
  };
}

// Trailing condition words of a law: "between vowels", "before a vowel", "after a consonant".
function splitCondition(text) {
  const table = [
    [/\s+between vowels$/, { before: `(?<=${V})`, after: `(?=${V})` }],
    [/\s+before an? vowel$/, { before: '', after: `(?=${V})` }],
    [/\s+after an? consonant$/, { before: `(?<=${C})`, after: '' }],
  ];
  for (const [re, cond] of table) if (re.test(text)) return { rest: text.replace(re, ''), cond };
  return { rest: text, cond: { before: '', after: '' } };
}

// One rule. `sources` are the left sides ("-u", "-i" or one list "p t k"), `target` the right side. A final vowel law
// does not touch a diphthong or long vowel: "-i" is not the end of "ai" (the data keeps nai, wae and mai whole).
function rule(sources, target, scope, cond, label, tools) {
  const dst = target.trim().replace(/^-/, '');
  const src = sources.map(s => s.trim().replace(/^-/, ''));
  const head = scope === 'initial' ? '^' : '', tail = scope === 'final' ? '$' : '';
  const vowelEnding = scope === 'final' && src.every(s => /^[aeiou]$/.test(s));
  if (src.length === 1 && /\s/.test(src[0])) {
    const from = src[0].split(/\s+/), to = dst.split(/\s+/);
    if (from.length !== to.length) throw new Error(`unbalanced list in "${label}"`);
    const map = new Map(from.map((f, i) => [f, to[i]]));
    const re = new RegExp(`${head}${cond.before}(?:${from.map(escape).join('|')})${cond.after}${tail}`, 'g');
    return { text: label, apply: w => w.replace(re, m => map.get(m)) };
  }
  const re = new RegExp(`${head}${cond.before}(?:${src.map(escape).join('|')})${cond.after}${tail}`, 'g');
  return { text: label, apply: w => (vowelEnding && tools.endsInMulti(w) ? w : w.replace(re, dst)) };
}

// Laws that are not "a > b" lists.
const FIXED = ({ count: nuclei }) => [
  [/^final vowel lost in words of two or more syllables$/, w => (nuclei(w) >= 2 && /[aeiou]$/.test(w) ? w.slice(0, -1) : w)],
  [/^final -?a lost in words of two or more syllables$/, w => (nuclei(w) >= 2 && w.endsWith('a') ? w.slice(0, -1) : w)],
  [/^final consonant \+ -os$/, w => (new RegExp(`${C}$`).test(w) ? `${w}os` : w)],
  [/^a u i o doubled before a final consonant in one-syllable roots$/, w => (nuclei(w) === 1 && /[auio][^aeiou]$/.test(w) ? w.replace(/([auio])([^aeiou])$/, '$1$1$2') : w)],
  [/^vowel lost between an initial stop and r$/, w => w.replace(/^([ptkbdgc])[aeiou](?=r)/, '$1')],
  [/^initial ([a-z]+) lost$/, (w, m) => (w.startsWith(m[1]) ? w.slice(m[1].length) : w)],
  [/^k before e i y > c$/, w => w.replace(/k(?=[eiy])/g, 'c')],
  [/^c before e i > ch$/, w => w.replace(/c(?=[ei])/g, 'ch')],
  [/^final n or m > ng$/, w => w.replace(/(?<=[aeiou])[nm]$/, 'ng')],
];

export function parseLaws(laws, { nuclei = [] } = {}) {
  const rules = [], unknown = [], tools = nucleiTools(nuclei), fixedTable = FIXED(tools);
  for (const law of laws ?? []) {
    if (/^proto-language/.test(law)) continue;
    // "sh > x (via s > x)" only names the law that does the work; the later "s > x" rule applies.
    if (/\(via /.test(law)) continue;
    const text = law.trim();
    const fixed = fixedTable.find(([re]) => re.test(text));
    if (fixed) { const m = text.match(fixed[0]); rules.push({ text, apply: w => fixed[1](w, m) }); continue; }
    const { rest, cond } = splitCondition(text);
    let scope = '';
    for (let clause of rest.split(';').map(s => s.trim())) {
      const lead = clause.match(/^(final|initial)\s+/);
      if (lead) { scope = lead[1]; clause = clause.slice(lead[0].length); } else if (/^-/.test(clause)) scope = 'final'; else scope = '';
      const pending = [];
      for (const piece of clause.split(',').map(s => s.trim()).filter(Boolean)) {
        if (!piece.includes('>')) { pending.push(piece); continue; }
        for (const part of piece.split(/\s+and\s+(?=\S[^>]*>)/)) {
          const [lhs, rhs] = part.split('>').map(s => s.trim());
          const sources = [...pending.splice(0), lhs];
          const initial = !scope && sources.length === 1 && /^initial /.test(sources[0]);
          try { rules.push(rule(sources.map(x => x.replace(/^initial\s+/, '')), rhs, initial ? 'initial' : scope, cond, text, tools)); } catch (error) { unknown.push(error.message); }
        }
      }
      if (pending.length) unknown.push(`${text}: no target for ${pending.join(', ')}`);
    }
  }
  return { rules, unknown };
}

export function applyLaws(word, parsed) {
  let w = String(word).toLowerCase();
  for (const r of parsed.rules) w = r.apply(w);
  return w;
}
