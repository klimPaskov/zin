// A small, tolerant Clausewitz reader for the ZIN checks. It reads script text into entries of the form
// { k, op, v, line } where v is a string (scalar) or an array of entries (block); a bare value inside a block is an
// entry with k = null. Colour values such as `rgb { 1 2 3 }` keep the block. Comments are dropped. It never writes.
const WORD = /[^\s{}=<>!#"]/;

export function tokenize(text) {
  const tokens = [];
  let i = 0, line = 1;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (c === '\n') { line++; i++; continue; }
    if (c === ' ' || c === '\t' || c === '\r' || c === '\uFEFF') { i++; continue; }
    if (c === '#') { while (i < n && text[i] !== '\n') i++; continue; }
    if (c === '{' || c === '}') { tokens.push({ t: c, line }); i++; continue; }
    if (c === '=' || c === '<' || c === '>' || c === '!') {
      let op = c; i++;
      if (text[i] === '=' ) { op += '='; i++; }
      tokens.push({ t: 'op', v: op, line }); continue;
    }
    if (c === '"') {
      let j = i + 1, s = '';
      while (j < n && text[j] !== '"') { if (text[j] === '\\' && j + 1 < n) { s += text[j + 1]; j += 2; continue; } if (text[j] === '\n') line++; s += text[j++]; }
      tokens.push({ t: 'str', v: s, line }); i = j + 1; continue;
    }
    let j = i;
    while (j < n && WORD.test(text[j])) j++;
    if (j === i) { i++; continue; }
    tokens.push({ t: 'word', v: text.slice(i, j), line }); i = j;
  }
  return tokens;
}

export function parse(text) {
  const tokens = tokenize(text);
  let p = 0;
  const block = depth => {
    const out = [];
    while (p < tokens.length) {
      const tk = tokens[p];
      if (tk.t === '}') { p++; if (depth > 0) return out; continue; }
      if (tk.t === '{') { p++; out.push({ k: null, op: null, v: block(depth + 1), line: tk.line }); continue; }
      if (tk.t === 'op') { p++; continue; }
      p++;
      const next = tokens[p];
      if (next && next.t === 'op') {
        p++;
        const val = tokens[p];
        if (!val) { out.push({ k: tk.v, op: next.v, v: '', line: tk.line }); break; }
        if (val.t === '{') { p++; out.push({ k: tk.v, op: next.v, v: block(depth + 1), line: tk.line }); continue; }
        if (val.t === '}') { out.push({ k: tk.v, op: next.v, v: '', line: tk.line }); continue; }
        p++;
        // rgb { } / hsv { } colour values
        if (val.t === 'word' && /^(rgb|hsv|hsv360)$/i.test(val.v) && tokens[p]?.t === '{') { p++; out.push({ k: tk.v, op: next.v, v: block(depth + 1), line: tk.line }); continue; }
        out.push({ k: tk.v, op: next.v, v: val.v, line: tk.line, quoted: val.t === 'str' });
        continue;
      }
      out.push({ k: null, op: null, v: tk.v, line: tk.line, quoted: tk.t === 'str' });
    }
    return out;
  };
  return block(0);
}

// Depth-first walk; fn(entry, ancestors) where ancestors is the array of keyed parent entries.
export function walk(entries, fn, ancestors = []) {
  for (const e of entries) {
    fn(e, ancestors);
    if (Array.isArray(e.v)) { ancestors.push(e); walk(e.v, fn, ancestors); ancestors.pop(); }
  }
}

// Read game script bytes. Vanilla files are UTF-8 or Windows-1252; identifiers are ASCII, so latin1 is lossless here.
// A UTF-8 byte order mark is dropped first, so the first key of the file reads cleanly.
export const scriptText = bytes => (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf ? bytes.subarray(3) : bytes).toString('latin1');
