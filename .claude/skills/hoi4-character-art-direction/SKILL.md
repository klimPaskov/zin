---
name: hoi4-character-art-direction
description: Use whenever Hearts of Iron IV portraits, character art, creature art, event art with figures, unit models, or pools of generated faces are planned, prompted, reviewed, or accepted, so that peoples, species and individuals look distinct instead of generic human reskins.
---

# HOI4 character art direction

This skill is the design and review layer above image generation and model production. It does not replace `hoi4-portrait-production`, `hoi4-feature-assets`, or `hoi4-3d-model-pipeline`; it supplies the anatomy, variety, reference, and acceptance rules they must satisfy. Peoples, realms, canon, ratios, and palettes belong in the project spec, never in this skill.

## 1. Read the project spec first

Before any prompt, read the project's canon and art spec and write down, per people or species: the owner-stated demographic ratios (for example the share of women among rulers, commanders, and advisors), the setting's regional skin tones and features, and any hard per-people prohibitions. Record these in the project spec or the work manifest. If a rule is missing, ask the owner instead of using the generator's default face.

## 2. Anatomy sheet for every non-human people

No prompt for a non-human people may be written before its anatomy sheet exists. The sheet fixes: skull and face structure, jaw and teeth, nose, ears, eyes, skin or surface (bark, hide, scales, stone, rot, fur), body proportions, posture, hands, scale relative to an adult man, and a short list of what must NOT look human. Use `references/variety-matrix.md` for the sheet template.

Typical failures to reject by name:

- orcs and goblins with handsome human faces and green skin
- trolls at human size, or as large muscular men
- tree folk as men with bark makeup
- yeti or beast folk as bearded men
- undead as pale living people
- demons as red-skinned muscular men
- dwarves, small folk, and halfling-like folk as scaled-down humans with identical facial proportions
- any non-human face whose bone structure, eyes, and nose are the human default under a recoloured skin

Prompt rule: state the inhuman features first, then explicitly forbid "a human face with recoloured skin". Short species descriptors alone ("an orc") are not prompts.

## 3. Scale must be visible

A portrait frame has no ruler. Huge beings need composition cues inside the frame: the face filling the frame with tiny people, birds, trees, or buildings for scale; a low vantage point looking up; atmospheric haze; or a held object that reads as building-sized. Small beings need the opposite cue, such as a hand or tool that reads as normal-sized beside them. Reject a large or small being whose size cannot be read without the caption.

## 4. Owner reference art is the primary design

When the owner has drawn a people or figure, that drawing is the primary design reference and is passed to the generator as an image reference. Keep its design features and look; change only finish and quality to the project's painted style. Record which reference file fed which output.

Internet images may be studied for anatomy and creature design, with their URLs recorded. Only public-domain or suitably licensed images may be passed to a generator as references. Never use another game's or mod's art as a reference or as source material.

## 5. Variety inside a pool and across a roster

Before generating a pool, write a variety matrix (see `references/variety-matrix.md`) covering age spread from young to elderly, build, face shape, nose, brow, scars and blemishes, missing teeth, hair and beard, expression, gaze, wear, jewellery, lighting, and per-culture dress. No two members of a pool may share more than a stated number of axes (default: three of the individual axes). Faces must not look perfect or model-like: asymmetry, weathering, wrinkles, bad teeth, sunburn, pockmarks, and broken noses where they fit the person.

A multi-portrait sheet tends to collapse into one face: the generator repeats the same age, features, scar, hair and head angle across cells, and drifts toward young faces and toward the other sex. Give every cell its own explicit description (age with its signs such as grey hair, wrinkles or baldness; face shape; nose; build; beard or its absence; a scar or blemish worded differently and placed elsewhere; expression; head angle; lighting) and state the sex with visible cues in every cell. Review the first sheet of each pool before running the rest; if a sheet still shows one face, drop to two portraits per image or one.

Demographics follow the setting, not the generator's defaults. Apply the ratios and per-people constraints from step 1, and write each per-people prohibition into every prompt of that people.

## 6. Named figures keep the approved design

When the owner approved a design reference for a named figure, cut the final portrait from that approved image or generate it with that image as the reference. The face must be the same face. Compare the final and the approved design side by side before acceptance.

## 7. Crop and finish gate

Review at the real game sizes: leader and commander portraits 156x210, small advisor cards 65x67 (confirm against `hoi4-feature-assets` for other roles). Reject on any of these, however small:

- head or a defining feature (horns, crown, ears, tusks, antlers) cut off unintentionally
- face off the vanilla eye line for that portrait family
- anything important lost at an edge
- text, frame, border, watermark, or a second figure
- the generator's stock expression or lighting repeated across the pool

## 8. Prompt skeleton

Order matters. Write each prompt in this order and keep one line per block:

1. Inhuman anatomy first: the sheet's features, plus "not a human face with recoloured skin" for non-humans.
2. Individual variety axes from the pool's matrix row: age, build, face shape, nose, brow, scars, teeth, hair, expression, gaze, wear.
3. Culture dress and jewellery, with the per-people prohibitions.
4. Scale cue for very large or small beings.
5. Style and frame: the project's painted style, the target frame, eye line, plain background, and no text, border, or second figure.

For a reference-fed generation, add one line naming the reference and what to keep (design features) and what to change (finish only).

## 9. Review checklist

Fill one row per pool member and one per named figure; a single failed item blocks acceptance.

- Anatomy sheet exists and the face matches it; no human face under a recoloured skin.
- Scale reads inside the frame.
- Owner reference used where one exists; the reference-to-output record is written.
- Matrix row is distinct from every other pool member; the contact sheet at game size shows no two members that look like the same person or the same generator face.
- Faces are imperfect and individual; no model-like symmetry across the pool.
- Demographics, skin tones, and per-people prohibitions match the project spec.
- Named figure matches the approved design side by side.
- Crop and finish gate (step 7) passes at 156x210 and, where used, 65x67.
- Provenance recorded: prompt, references, source URLs, licence status, and seed or generation identifier, in the project's provenance file.

Rejection reasons use the names above: human reskin, handsome orc, human-size troll, bark makeup, bearded yeti, living-pale undead, red muscular demon, scaled-down human, no scale cue, reference ignored, same face, too perfect, wrong demographic, wrong face for named figure, cropped feature, text or second figure.

## 10. Handoffs

- Portraits: `hoi4_portrait_creator` applies this skill for every fictional or impossible portrait; the parent supplies the project spec rules from step 1.
- Event and feature art with figures: `hoi4_generated_feature_art` applies steps 2 to 8.
- Unit models: apply steps 2 to 4 to the model's source image before Meshy generation, via `hoi4-3d-model-pipeline`.
- Pool review is done on a contact sheet by someone other than the generator of that pool where an audit subagent is available.
