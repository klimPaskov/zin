// ZIN 3D land units (warfare spec §14): copies each unit's exported runtime files from its kit job root into
// gfx/models/units/zin/<id>/ and defines its pdxmesh, animations and per-people infantry entity. HOI4 looks up the
// infantry model as `<graphical culture>_infantry_entity`, so each people gets a culture `zin_<people>_gfx`
// (assigned to countries by the politics step) and an entity naming the people's model. Peoples without their own
// model yet borrow the nearest one; every borrowed mapping is listed here so it is easy to replace.
// The job roots' export/ and textures/ folders are gitignored working files. When a job root has neither (a fresh
// clone), its files are read from the tracked copies the builder shipped before, gfx/models/units/zin/<id>/, which
// hold the same bytes under their staged names. A job root with its working files is always read as is.
import { readFile, stat } from 'node:fs/promises';

export const JOBS = 'docs/assets/hoi4_3d_model_jobs/models_3d';
export const UNITS = ['zin_men_infantry', 'zin_elves_warden', 'zin_orcs_warrior', 'zin_the_dead_revenant', 'zin_trolls_brute'];
// people -> unit model. Interim borrowings until those peoples get their own models: Sunhot elves use the elf
// warden; giants and yeti use the troll's large frame; ents use the troll; demons use the revenant.
export const MODEL_FOR_PEOPLE = {
  men: 'zin_men_infantry', elves: 'zin_elves_warden', sun_elves: 'zin_elves_warden', orcs: 'zin_orcs_warrior',
  trolls: 'zin_trolls_brute', giants: 'zin_trolls_brute', yeti: 'zin_trolls_brute', ents: 'zin_trolls_brute',
  the_dead: 'zin_the_dead_revenant', demons: 'zin_the_dead_revenant',
};
const VANILLA_CULTURES = ['western_european_gfx', 'eastern_european_gfx', 'asian_gfx', 'southamerican_gfx', 'middle_eastern_gfx', 'african_gfx', 'commonwealth_gfx', 'commonwealth_2d', 'western_european_2d', 'eastern_european_2d', 'asian_2d', 'southamerican_2d', 'middle_eastern_2d', 'african_2d', 'sami_gfx', 'sami_2d'];
export const cultureOf = people => `zin_${people}_gfx`;
// The exported .mesh names generic textures. HOI4 resolves textures by file name across the whole mod, so each
// unit's maps are staged under unique names and bound to its mesh through meshsettings, as vanilla buildings do.
const TEXTURES = { diffuse: 'texture_0.dds', specular: 'texture_specular.dds', normal: 'texture_normal.dds' };
const MESH_OBJECT = 'output_unwrapped.002'; // the kit's exported mesh object name (each unit's runtime/handoff.md)
const ROLES = ['idle', 'move', 'attack', 'defend', 'retreat', 'death'];
// Until a role is delivered, it plays the closest delivered one (warfare spec §14.2 step 6 for the reuse roles).
const FALLBACK = { defend: 'attack', retreat: 'move' };
const exists = async p => { try { await stat(p); return true; } catch { return false; } };

const meshBlock = (id, dir, play) => [
  '\tpdxmesh = {',
  `\t\tname = "${id}_mesh"`,
  `\t\tfile = "${dir}/${id}.mesh"`,
  '\t\tmeshsettings = {',
  `\t\t\tname = "${MESH_OBJECT}"`,
  '\t\t\tindex = 0',
  `\t\t\ttexture_diffuse = "${id}_diffuse.dds"`,
  `\t\t\ttexture_normal = "${id}_normal.dds"`,
  `\t\t\ttexture_specular = "${id}_specular.dds"`,
  '\t\t\tshader = "PdxMeshAdvanced"',
  '\t\t}',
  ...ROLES.map(r => `\t\tanimation = { id = "${r}" type = "${id}_${play(r)}_animation" }`),
  `\t\tanimation = { id = "support_attack" type = "${id}_${play('attack')}_animation" }`,
  `\t\tanimation = { id = "training" type = "${id}_idle_animation" }`,
  '\t}',
].join('\n');

const entityBlock = (people, id) => [
  'entity = {',
  `\tname = "${cultureOf(people)}_infantry_entity"`,
  `\tpdxmesh = "${id}_mesh"`,
  '\tdefault_state = "idle"',
  '\tstate = { name = "idle" animation = "idle" animation_blend_time = 0.3 animation_speed = 1.0 }',
  '\tstate = { name = "move" animation = "move" animation_blend_time = 0.5 animation_speed = 1.0',
  '\t\tevent = { sound = { soundeffect = "infantry_move_animation" } }',
  '\t}',
  '\tstate = { name = "attack" animation = "attack" animation_blend_time = 0.2 animation_speed = 1.0 looping = no next_state = "attack" }',
  '\tstate = { name = "defend" animation = "defend" animation_blend_time = 0.3 animation_speed = 1.0 }',
  '\tstate = { name = "support_attack" animation = "support_attack" animation_blend_time = 0.3 animation_speed = 1.0 }',
  '\tstate = { name = "retreat" animation = "retreat" animation_blend_time = 0.3 animation_speed = 1.0 }',
  '\tstate = { name = "death" animation = "death" animation_blend_time = 0.3 animation_speed = 1.0 looping = no }',
  '\tstate = { name = "training" animation = "training" animation_blend_time = 0.3 animation_speed = 1.0 }',
  '\tscale = 0.8',
  '}',
].join('\n');

export async function buildUnits3d(staged, zinRoot, peoples) {
  const report = {}, meshes = [], entities = [];
  for (const id of UNITS) {
    const job = `${zinRoot}/${JOBS}/${id}`, dir = `gfx/models/units/zin/${id}`;
    // The job's working files, or the shipped copies under their staged names when the job has none.
    const shipped = !(await exists(`${job}/export`)) && !(await exists(`${job}/textures`)), ship = name => `${zinRoot}/${dir}/${name}`;
    const mesh = shipped ? ship(`${id}.mesh`) : `${job}/export/mesh/${id}.mesh`;
    if (!(await exists(mesh))) throw new Error(`${id}: exported mesh missing at ${mesh}`);
    staged.add(`${dir}/${id}.mesh`, await readFile(mesh));
    for (const [slot, file] of Object.entries(TEXTURES)) staged.add(`${dir}/${id}_${slot}.dds`, await readFile(shipped ? ship(`${id}_${slot}.dds`) : `${job}/textures/dds/${file}`));
    const delivered = [];
    for (const role of ROLES) {
      const anim = shipped ? ship(`${id}_${role}.anim`) : `${job}/export/anim/${id}_${role}.anim`;
      if (await exists(anim)) { staged.add(`${dir}/${id}_${role}.anim`, await readFile(anim)); delivered.push(role); }
    }
    for (const role of ['idle', 'move', 'attack', 'death']) if (!delivered.includes(role)) throw new Error(`${id}: required role ${role} not exported`);
    const play = role => delivered.includes(role) ? role : FALLBACK[role];
    // Animation types live beside their .anim files, as vanilla's gfx/models/units/animation.asset does.
    staged.text(`${dir}/${id}.asset`, `# Generated by the ZIN content builder from the kit job ${JOBS}/${id}.\n${delivered.map(r => `animation = {\n\tname = "${id}_${r}_animation"\n\tfile = "${id}_${r}.anim"\n}`).join('\n')}\n`);
    meshes.push(meshBlock(id, dir, play));
    report[id] = { delivered, borrowed: ROLES.filter(r => !delivered.includes(r)).map(r => `${r}->${FALLBACK[r]}`) };
  }
  // One infantry entity per people's culture.
  for (const people of peoples) {
    const id = MODEL_FOR_PEOPLE[people]; if (!id) throw new Error(`No unit model mapped for people ${people}`);
    entities.push(entityBlock(people, id));
  }
  // pdxmesh definitions belong in a .gfx objectTypes block; entities in an .asset file, as vanilla infantry does.
  staged.text('gfx/entities/zin_units.gfx', `# Generated by the ZIN content builder: Erdae land unit meshes (warfare spec section 14).\nobjectTypes = {\n${meshes.join('\n\n')}\n}\n`);
  staged.text('gfx/entities/zin_units.asset', `# Generated by the ZIN content builder: Erdae land unit entities (warfare spec section 14).\n${entities.join('\n\n')}\n`);
  staged.text('common/graphicalculturetype.txt', [...VANILLA_CULTURES, ...peoples.map(cultureOf)].join('\n'));
  return report;
}
