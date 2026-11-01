// The unlock language of the Chronicle of Aoaz (docs/specs/07_interface/04_chronicle_codex.md sections 6 and 10).
//
//   start            readable from 1 Lumae 4A 1748
//   F:<flag>         a global flag is set
//   rev              F:zin_afrit_revealed
//   hub              the viewer is the Worshipdom (zin_chr_viewer_is_hub)
//   heir             the heir's name is public to the viewer (zin_chr_heir_known)
//   S>=<n>           global.zin_eindil_stage is at least n
//   D:<loop>         the viewer has passed the knowledge gate of a fallen realm (zin_chr_deep_<loop>)
//   a, b   a | b   ( ... )     and, or, grouping (',' binds tighter than '|')
//
//   parseCond(text)              -> AST { op: 'and'|'or', args } | { atom: 'F:x' | 'start' | ... }
//   condTrigger(ast, names)      -> HOI4 trigger text (one block, tabs added by the caller)
//   implies(a, b, axioms)        -> true when every assignment that satisfies a (and the axioms) satisfies b
//   atomsOf(ast)                 -> Set of atom strings
//   condFlags(ast)               -> the global flags an AST reads

const TOKEN = /\s*(\(|\)|,|\||[A-Za-z]:[a-z0-9_]+|S>=\d+|start|rev|hub|heir)\s*/y;

export function parseCond(text) {
  const src = String(text ?? '').trim();
  if (!src) throw new Error('empty condition');
  const toks = [];
  TOKEN.lastIndex = 0;
  let at = 0;
  while (at < src.length) {
    TOKEN.lastIndex = at;
    const m = TOKEN.exec(src);
    if (!m) throw new Error(`condition "${src}": cannot read at "${src.slice(at)}"`);
    toks.push(m[1]); at = TOKEN.lastIndex;
  }
  let i = 0;
  const peek = () => toks[i];
  const orExpr = () => { const args = [andExpr()]; while (peek() === '|') { i++; args.push(andExpr()); } return args.length === 1 ? args[0] : { op: 'or', args }; };
  const andExpr = () => { const args = [unit()]; while (peek() === ',') { i++; args.push(unit()); } return args.length === 1 ? args[0] : { op: 'and', args }; };
  const unit = () => {
    const t = toks[i++];
    if (t === undefined) throw new Error(`condition "${src}": ends too early`);
    if (t === '(') { const e = orExpr(); if (toks[i++] !== ')') throw new Error(`condition "${src}": missing )`); return e; }
    if (t === ')' || t === ',' || t === '|') throw new Error(`condition "${src}": unexpected ${t}`);
    if (/^[A-Za-z]:/.test(t) && !/^[FD]:/.test(t)) throw new Error(`condition "${src}": unknown atom kind ${t}`);
    return { atom: t === 'rev' ? 'F:zin_afrit_revealed' : t };
  };
  const ast = orExpr();
  if (i !== toks.length) throw new Error(`condition "${src}": trailing ${toks.slice(i).join(' ')}`);
  return ast;
}

export function atomsOf(ast, out = new Set()) {
  if (ast.atom) out.add(ast.atom); else for (const a of ast.args) atomsOf(a, out);
  return out;
}
export const condFlags = ast => [...atomsOf(ast)].filter(a => a.startsWith('F:')).map(a => a.slice(2));
export const isStart = ast => ast.atom === 'start';

// The trigger text. `names` maps the viewer atoms to scripted triggers (they exist only when the builder emits them).
export function condTrigger(ast, names = {}) {
  if (ast.atom) {
    const a = ast.atom;
    if (a === 'start') return 'always = yes';
    if (a === 'hub') return `${names.hub ?? 'zin_chr_viewer_is_hub'} = yes`;
    if (a === 'heir') return `${names.heir ?? 'zin_chr_heir_known'} = yes`;
    if (a.startsWith('F:')) return `has_global_flag = ${a.slice(2)}`;
    if (a.startsWith('D:')) return `zin_chr_deep_${a.slice(2)} = yes`;
    const s = /^S>=(\d+)$/.exec(a);
    if (s) return `check_variable = { global.zin_eindil_stage > ${Number(s[1]) - 1} }`;
    throw new Error(`unknown atom ${a}`);
  }
  const inner = ast.args.map(x => condTrigger(x, names)).join('\n');
  const ind = inner.split('\n').map(l => `\t${l}`).join('\n');
  return ast.op === 'and' ? `AND = {\n${ind}\n}` : `OR = {\n${ind}\n}`;
}

function evalCond(ast, v) {
  if (ast.atom) {
    if (ast.atom === 'start') return true;
    const s = /^S>=(\d+)$/.exec(ast.atom);
    if (s) return v.stage >= Number(s[1]);
    return !!v[ast.atom];
  }
  return ast.op === 'and' ? ast.args.every(a => evalCond(a, v)) : ast.args.some(a => evalCond(a, v));
}

// Axioms: [{ if: <cond text>, then: <cond text> }]; each holds in every world the mechanics can reach.
export function compileAxioms(list = []) { return list.map(a => ({ if: parseCond(a.if), then: parseCond(a.then) })); }

// The conjunctions of atoms whose disjunction is the condition.
function dnf(ast) {
  if (ast.atom) return [[ast.atom]];
  if (ast.op === 'or') return ast.args.flatMap(dnf);
  return ast.args.map(dnf).reduce((acc, d) => acc.flatMap(x => d.map(y => [...x, ...y])), [[]]);
}
// The atoms a conjunction guarantees: itself, the axioms it triggers (forward chaining), and the stage thresholds below its highest.
function closure(conj, axioms) {
  const v = { stage: 0 };
  const set = atom => { const s = /^S>=(\d+)$/.exec(atom); if (s) { if (Number(s[1]) > v.stage) { v.stage = Number(s[1]); return true; } return false; } if (atom === 'start' || v[atom]) return false; v[atom] = true; return true; };
  for (const x of conj) set(x);
  let grew = true;
  while (grew) {
    grew = false;
    for (const ax of axioms) if (evalCond(ax.if, v)) for (const c of dnf(ax.then).length === 1 ? dnf(ax.then)[0] : []) if (set(c)) grew = true;
  }
  return v;
}
// a implies b when every conjunction of a, closed under the axioms, satisfies b. The language has no negation and the axioms are Horn
// clauses (a conjunctive `then`), so a monotone b holds in every completion exactly when it holds with only the closure true.
export function implies(a, b, axioms = []) {
  return dnf(a).every(conj => evalCond(b, closure(conj, axioms)));
}

export const condText = ast => ast.atom ? (ast.atom === 'F:zin_afrit_revealed' ? 'rev' : ast.atom) : ast.args.map(x => (x.atom ? condText(x) : `(${condText(x)})`)).join(ast.op === 'and' ? ', ' : ' | ');
export const andCond = (...asts) => { const args = asts.filter(x => !(x.atom === 'start')).flatMap(x => (x.op === 'and' ? x.args : [x])); return args.length === 0 ? { atom: 'start' } : args.length === 1 ? args[0] : { op: 'and', args }; };
