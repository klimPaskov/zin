// Text-preserving JSON edits for the migrations: parse a JSON text with the offsets of every value and key, so that a migration can
// replace one string, remove one array element or object member, or replace one value, and leave every other byte (the file's own
// layout, line breaks and spacing) as it was.
//
//   const tree = parseJsonPositions(text)       -> node { type, start, end, value?, items?, members? }
//                                                  members: [{ key: { value, start, end }, value: node, start, end }]
//   applyEdits(text, edits)                     -> text with [{ start, end, text }] applied (non-overlapping)
//   removalRange(list, i)                       -> the { start, end } that removes item i of a list of nodes with its separator
export function parseJsonPositions(text) {
  let i = 0;
  const ws = () => { while (i < text.length && ' \t\r\n'.includes(text[i])) i++; };
  const str = () => {
    const start = i; i++;
    while (text[i] !== '"') { if (text[i] === '\\') i++; i++; if (i >= text.length) throw new Error('unterminated string'); }
    i++;
    return { type: 'string', start, end: i, value: JSON.parse(text.slice(start, i)) };
  };
  const value = () => {
    ws();
    const c = text[i], start = i;
    if (c === '{') {
      i++; const members = []; ws();
      if (text[i] === '}') { i++; return { type: 'object', start, end: i, members }; }
      for (;;) {
        ws(); const key = str(); ws();
        if (text[i] !== ':') throw new Error(`expected : at ${i}`);
        i++;
        const v = value();
        members.push({ key, value: v, start: key.start, end: v.end });
        ws();
        if (text[i] === ',') { i++; continue; }
        if (text[i] !== '}') throw new Error(`expected } at ${i}`);
        i++; return { type: 'object', start, end: i, members };
      }
    }
    if (c === '[') {
      i++; const items = []; ws();
      if (text[i] === ']') { i++; return { type: 'array', start, end: i, items }; }
      for (;;) {
        items.push(value()); ws();
        if (text[i] === ',') { i++; continue; }
        if (text[i] !== ']') throw new Error(`expected ] at ${i}`);
        i++; return { type: 'array', start, end: i, items };
      }
    }
    if (c === '"') return str();
    while (i < text.length && !',}] \t\r\n'.includes(text[i])) i++;
    return { type: 'literal', start, end: i, value: JSON.parse(text.slice(start, i)) };
  };
  const root = value(); ws();
  if (i !== text.length) throw new Error(`trailing text at ${i}`);
  return root;
}

export function removalRange(list, i) {
  if (list.length === 1) return { start: list[0].start, end: list[0].end };
  if (i < list.length - 1) return { start: list[i].start, end: list[i + 1].start };
  return { start: list[i - 1].end, end: list[i].end };
}

export function applyEdits(text, edits) {
  const sorted = [...edits].sort((a, b) => b.start - a.start);
  for (let k = 1; k < sorted.length; k++) if (sorted[k].end > sorted[k - 1].start) throw new Error(`overlapping edits at ${sorted[k].start}`);
  let out = text;
  for (const e of sorted) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  return out;
}
