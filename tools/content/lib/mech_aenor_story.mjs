// The story events of the Golden Court and the succession (namespace zin_aenor): the ids that 06_events lists for the Aenor mechanic
// (docs/specs/06_events/01_golden_king_and_succession.md, 03_war_of_the_last_crowns.md, 04_endings.md) and the Aenor spec's sections 5 to 9.
// aenorStory(D, T, tip) returns event definitions for writeEvent. Options call the scripted effects of mech_aenor_script.mjs; nothing
// here names Afrit, the Council or the plot (the public voice of rule 1). "Chancellor" is written "Seal-Keeper" (text-sweep rule).
import { call, list } from './mech_court_lib.mjs';
import { setStance } from './mech_aenor_script.mjs';

export function aenorStory(D, T, tt) {
	const AEN = T.aenor;
	const CAMP = { court: 1, faithful: 2, dominions: 3, host: 4 };
	const corr = n => tt(`Court corruption ${n > 0 ? '+' : ''}${n}`, call('zin_aenor_add_court_corruption', { value: n }));
	const temple = n => tt(`Temple Favour ${n > 0 ? '+' : ''}${n}`, call('zin_aenor_add_council_influence', { value: n }));
	const lost = n => tt(`The Lost Cause ${n > 0 ? 'gains' : 'loses'} ${Math.abs(n)}`, call('zin_aenor_add_lost_cause', { value: n }));
	const camp = (k, n) => tt(`Support of ${{ court: 'the Golden Court', faithful: 'the Faithful', dominions: 'the Free Dominions', host: 'the Stranger\'s Host' }[k]} ${n > 0 ? '+' : ''}${n}`, call('zin_aenor_add_camp_support', { camp: CAMP[k], value: n }));
	const loyAll = n => tt(`Loyalty of every dominion ${n > 0 ? '+' : ''}${n}`, call('zin_aenor_add_concord_loyalty_all', { value: n }));
	const pp = n => `add_political_power = ${n}`;
	const stab = n => `add_stability = ${n}`;
	const ruled = k => `zin_aenor_ruled_by_${k} = yes`;
	const realm = 'zin_aenor_is_realm = yes';
	const alive = 'zin_aenor_king_alive = yes';
	const unexposed = 'NOT = { has_global_flag = zin_golden_king_plot_exposed }';
	const aiCamp = c => ['add = 100', `check_variable = { zin_aenor_ai_camp = ${c} }`];
	const E = [];

	// ---------------------------------------------------------------------------------------------- the court while the King lives (mechanic MTTH)
	E.push({ id: 10, kind: 'country', title: 'A Feast in the Golden Court', picture: 'court_feast',
		desc: 'Another feast in the gilded halls. Half the court is invited; the other half is offended, and has already sent a servant to count the candles.',
		trigger: list(realm, alive, unexposed), mtth: 'days = 120',
		options: [
			{ key: 'a', text: 'Open the great hall to all.', ai: 50, effect: list(pp(-25), corr(2), temple(1)) },
			{ key: 'b', text: 'A small table and a short night.', ai: 50, effect: list(corr(-1), temple(-1)) },
		] });
	E.push({ id: 11, kind: 'country', title: 'Offices for Sale', picture: 'golden_court',
		desc: 'A merchant house offers gold for a judgeship in the lake cities. The house is rich, and the seat has been empty since the spring.',
		trigger: list(realm, alive, unexposed), mtth: 'days = 150',
		options: [
			{ key: 'a', text: 'Sell the seat.', ai: 55, effect: list(pp(50), corr(3)) },
			{ key: 'b', text: 'The seat is not for sale.', ai: 45, effect: list(corr(-2), stab(0.01)) },
		] });
	E.push({ id: 12, kind: 'country', title: 'A Scandal in the Gilded Halls', picture: 'golden_court',
		desc: 'A steward bought his seat and the whole city knows the price. The singers of the lake quarters have already made a song of it, and the song has a second verse about the one who sold it.',
		trigger: list(realm, alive, unexposed, 'zin_aenor_court_gilded = yes'), mtth: 'days = 120',
		options: [
			{ key: 'a', text: 'Strike his name from the rolls.', ai: 40, effect: list(pp(-25), corr(-4), stab(0.01)) },
			{ key: 'b', text: 'Let the song die by itself.', ai: 60, effect: list(corr(2), stab(-0.03)) },
		] });
	E.push({ id: 20, kind: 'country', title: 'The Seal-Keeper\'s Counsel', picture: 'golden_court',
		desc: 'Merovan, Keeper of the Seals, has already drafted the King\'s answer to the letters of the dominions. It is a good answer, and it is written in a clear hand. He asks only for the seal.',
		trigger: list(realm, alive, unexposed, 'zin_aenor_council_dominant = yes'), mtth: 'days = 90',
		options: [
			{ key: 'a', text: 'Set the seal to it.', ai: 85, effect: list('random_list = {', '1 = {', temple(2), '}', '1 = {', corr(2), '}', '1 = {', lost(-2), '}', '}') },
			{ key: 'b', text: 'Answer in our own words.', ai: 15, trigger: 'has_political_power > 49', effect: list(pp(-50), temple(-2)) },
		] });
	E.push({ id: 21, kind: 'country', title: 'Gifts from the Houses', picture: 'houses',
		desc: 'The Houses of the First Light offer grain for the poor quarters of Parim. The carts are at the gate, the grain is clean, and the priests who drive them ask for nothing.',
		trigger: list(realm, alive, unexposed), mtth: 'days = 180',
		options: [
			{ key: 'a', text: 'Take the grain, and thank the Houses.', ai: 70, effect: list(stab(0.02), temple(3)) },
			{ key: 'b', text: 'The crown feeds its own poor.', ai: 30, effect: list(pp(-50), stab(0.01), temple(-1)) },
		] });
	E.push({ id: 22, kind: 'country', title: 'The Temples Lose Favour', picture: 'golden_court',
		desc: 'The temples\' friends at court are fewer this year. Their seats stand empty at the long table, and the men who took the places beside them are not yet sure where to put their hands.',
		options: [
			{ key: 'a', text: 'Let the offices pass to other hands.', ai: 60, effect: list(lost(3), corr(2)) },
			{ key: 'b', text: 'Fill the empty seats with the temples\' friends.', ai: 40, effect: list(pp(-25), temple(6)) },
		] });

	// ---------------------------------------------------------------------------------------------- the Concord, the Lost Cause and the warnings
	E.push({ id: 100, kind: 'country', title: 'The Concord Council', picture: 'concord_council',
		desc: 'The lords of every dominion sit in the old hall at Parim, beneath the banners of the Charters, and wait to hear what the crown asks of them this year.',
		options: [
			{ key: 'a', text: 'The King\'s tribute is due.', ai: 40, effect: list(pp(100), loyAll(-5)) },
			{ key: 'b', text: 'The old liberties are kept.', ai: 60, effect: list(loyAll(5), corr(-2)) },
		] });
	E.push({ id: 151, kind: 'country', title: 'Warnings from Mirolon', picture: 'mirolon_passes',
		desc: 'An envoy from the passes of Mirolon asks to be heard. He says the Dead Lands are arming, and that the beacons of the south were lit twice in the winter. The court remembers 4A 1736 and smiles.',
		trigger: list(realm, alive, 'date > 1748.5.31', 'NOT = { date > 1750.12.31 }', unexposed), mtth: 'days = 240',
		options: [
			{ key: 'a', text: 'Laugh, and pour the envoy wine.', ai: 85, effect: corr(1) },
			{ key: 'b', text: 'Send scouts to the passes.', ai: 15, effect: list(pp(-25), lost(3)) },
		] });
	E.push({ id: 152, kind: 'country', title: 'Tales of Black Ships', picture: 'black_ships_tale',
		desc: 'Fishermen tell of black hulls in the north that carry no lamps and cast no wake. Nobody at court believes them, and the harbour masters have stopped writing the tales down.',
		trigger: list(realm, alive, unexposed, 'date > 1748.8.31'), mtth: 'days = 300',
		options: [
			{ key: 'a', text: 'Sailors have always told tales.', ai: 85 },
			{ key: 'b', text: 'Send a cutter to look.', ai: 15, effect: list(pp(-25), lost(2)) },
		] });
	E.push({ id: 160, kind: 'country', title: 'The Lost Cause Divided', picture: 'generic_court',
		desc: 'Word of a stranger on Selen\'s shore has divided the league that the Golden King founded. Its court branch stands with the crown. Its frontier captains and its scholars ask to hear the stranger before they judge him.',
		options: [
			{ key: 'a', text: 'The league stands with the crown.', ai: 55, effect: list(lost(-5)) },
			{ key: 'b', text: 'Let the captains hear him.', ai: 45, trigger: 'NOT = { zin_aenor_ruled_by_host = yes }', effect: list(lost(-5), camp('host', 5)) },
		] });

	// ---------------------------------------------------------------------------------------------- the King's health and the plot (section 5)
	E.push({ id: 240, kind: 'country', title: 'The King\'s Physicians', picture: 'generic_court',
		desc: [
			{ text: 'The physicians keep their voices low. The King is sound, they say, and sleeps as a man of his years should.', trigger: 'check_variable = { zin_aenor_king_health = 0 }' },
			{ text: 'The physicians keep their voices low. The King is tired, they say, more than a feast and a hunt can account for, and they would like to see him rest.', trigger: 'check_variable = { zin_aenor_king_health = 1 }' },
			{ text: 'The physicians keep their voices low, and will not meet your eye. The King is failing, they say, and they cannot tell you why.', trigger: 'check_variable = { zin_aenor_king_health = 2 }' },
		],
		options: [{ key: 'a', text: 'Let their word be written down.' }] });
	E.push({ id: 241, kind: 'country', title: 'Where the Coin Went', picture: 'generic_court',
		desc: [
			{ text: 'The scribes have followed the purse through three ledgers and a temple kitchen. It ended in the hand of a man who serves the King\'s cup, and the men who paid him wear temple robes. The proof is sealed in a chest, and it can be laid before the King.', trigger: 'has_country_flag = zin_aenor_poisoner_found' },
			{ text: 'The scribes lost the purse among the ledgers of the Houses. It may have gone to a baker or to a hand that serves the King\'s cup; the books do not say. The King\'s table is no safer than it was.' },
		],
		options: [
			{ key: 'a', text: 'Seal the chest.', trigger: 'has_country_flag = zin_aenor_poisoner_found' },
			{ key: 'b', text: 'Burn the ledgers, and begin again.', trigger: 'NOT = { has_country_flag = zin_aenor_poisoner_found }', effect: pp(25) },
		] });
	E.push({ id: 242, kind: 'country', title: 'The King Hears the Proof', picture: 'generic_court',
		desc: 'The King listens in silence. He turns the sealed letters over in his hands, and looks for a long time at the cup beside him. When he speaks, it is to ask who else has read them.',
		options: [
			{ key: 'a', text: 'Show him the rest.', ai: 100, effect: 'zin_aenor_proof_shown = yes' },
			{ key: 'b', text: 'Take the letters back before he reads them.', ai: 0 },
		] });
	E.push({ id: 250, kind: 'country', title: 'The King Learns', picture: 'generic_court', requires: [],
		desc: 'The King has read the letters twice. He has had the cup tasted three times and sent for his guards. He says only that he will remember who sat at his table, and the court understands that he means every one of them.',
		immediate: list('country_event = { id = zin_reign.70 days = 3 }', 'country_event = { id = zin_aenor.260 days = 30 }'),
		options: [{ key: 'a', text: 'The Lost Cause will guard him.', effect: lost(5) }] });
	E.push({ id: 260, kind: 'country', title: 'The Temples Answer', picture: 'generic_war',
		desc: [
			{ text: 'The temples will not bow to a king who looks at them across a cup. They raise their banners in the name of the Deliverer, and the Seal-Keeper has gone with them, riding as Lord Protector of the faithful.', trigger: 'check_variable = { zin_council_influence > 29 }' },
			{ text: 'The friends of the temples have lost their seats at court, one by one, and without a sound. The Seal-Keeper left Parim by night, and nobody has asked where he went.' },
		],
		immediate: list('if = {', 'limit = { check_variable = { zin_council_influence > 29 } }', 'set_global_flag = zin_reign_councils_war', 'zin_aenor_compute_camps = yes',
			'set_temp_variable = { zin_arg_camp = 2 }', 'zin_aenor_raise_camp = yes', 'country_event = { id = zin_reign.71 }', '}',
			'else = {', 'set_temp_variable = { zin_arg_value = -20 }', 'zin_aenor_add_council_influence = yes', 'if = {', 'limit = { has_character = zin_merovan }', 'retire_character = zin_merovan', '}',
			'country_event = { id = zin_aenor.261 days = 3 }', '}'),
		options: [{ key: 'a', text: 'The King\'s league will answer.' }] });
	E.push({ id: 261, kind: 'country', title: 'The King Endures', picture: 'generic_court',
		desc: 'The banners of the temples are down and the lords who rose with them have been counted. The King lives, and the court goes on. He does not sleep without a taster, and he has never again drunk what was poured for him.',
		immediate: list('if = {', 'limit = { NOT = { has_global_flag = zin_golden_king_survives } }', 'set_global_flag = zin_golden_king_survives', 'country_event = { id = zin_reign.73 }', '}'),
		options: [{ key: 'a', text: 'Long may he reign.' }] });
	E.push({ id: 460, kind: 'country', title: 'The King and the Stranger', picture: 'dragon_return', requires: ['zin_eindil_returned'],
		desc: 'The Golden King has heard of the man the frontier calls the stranger, and has asked to see the letters that speak of his blood. He is old, he has no heir he would trust with the cup, and he asks the council what a king ought to do about a rival who may be a gift.',
		trigger: list(realm, 'has_global_flag = zin_golden_king_survives', 'has_global_flag = zin_eindil_returned', 'NOT = { has_country_flag = zin_aenor_stranger_judged }'), mtth: 'days = 30',
		immediate: 'set_country_flag = zin_aenor_stranger_judged',
		options: [
			{ key: 'a', text: 'Name him heir.', ai: 50, effect: list(lost(10), camp('host', 10), 'add_ideas = zin_aenor_hailed_king', 'set_country_flag = zin_aenor_hailed_king', 'zin_eindil_join_coalition = yes') },
			{ key: 'b', text: 'No stranger sits on this throne.', ai: 50, effect: list(lost(-10), camp('host', -10), stab(0.02)) },
		] });

	// ---------------------------------------------------------------------------------------------- the King is dead (sections 6)
	E.push({ id: 200, kind: 'news', title: 'The King Is Dead', picture: 'king_is_dead', requires: ['zin_golden_king_dead'],
		desc: 'The Golden King died in his sleep after the Mistfall feast. He reigned twenty-one years. The seals of Parim lie on an empty cushion.',
		immediate: list('if = {', `limit = {\ntag = ${AEN}\nNOT = { has_country_flag = zin_aenor_succession_open }\n}`, 'zin_aenor_open_succession = yes', 'zin_aenor_pick_ai_camp = yes', 'country_event = { id = zin_aenor.201 days = 2 }', '}'),
		options: [
			{ key: 'a', text: 'The bells of Parim toll.', trigger: `tag = ${AEN}` },
			{ key: 'b', text: 'A king is dead in Parim.', trigger: `NOT = { tag = ${AEN} }` },
		] });
	const camps = (...extra) => 'Four voices claim to speak for Aenor.';
	void camps;
	const choose = (c, ai, extra = {}) => ({ effect: list(`set_temp_variable = { zin_arg_camp = ${c} }`, 'zin_aenor_choose_camp = yes'), ai, ...extra });
	const support = 'The Golden Court holds [?ROOT.zin_aenor_camp_court|0] of a hundred, the Free Dominions [?ROOT.zin_aenor_camp_dominions|0], [zin_loc_camp_faithful] [?ROOT.zin_aenor_camp_faithful|0]';
	E.push({ id: 201, kind: 'country', title: 'Whom Will You Follow?', picture: 'thirty_days', requires: ['zin_golden_king_dead'], checkpoint: 6, timeout: 20,
		desc: [
			{ text: `The seals lie on an empty cushion. Four voices claim to speak for Aenor, and the thirty days have begun. ${support}, [zin_loc_camp_host] [?ROOT.zin_aenor_camp_host|0].`, trigger: 'zin_aenor_host_available = yes' },
			{ text: `The seals lie on an empty cushion. Three voices claim to speak for Aenor, and the thirty days have begun. ${support}.` },
		],
		immediate: list('zin_reign_on_thirty_days = yes', 'news_event = { id = zin_aenor.210 days = 30 }'),
		options: [
			{ key: 'a', text: 'Let the council decide.', effect: list('zin_aenor_best_camp = yes', 'set_temp_variable = { zin_arg_camp = zin_aenor_best }', 'zin_aenor_choose_camp = yes'), ai: 0 },
			{ key: 'b', text: 'Follow the Faithful.', ...choose(2, weighAi(2)) },
			{ key: 'c', text: 'Follow the Golden Court.', ...choose(1, weighAi(1)) },
			{ key: 'd', text: 'Follow the Free Dominions.', ...choose(3, weighAi(3)) },
			{ key: 'e', text: 'Follow the Stranger\'s Host.', trigger: 'zin_aenor_host_available = yes', ...choose(4, weighAi(4)) },
		] });
	function weighAi(c) { return `base = 0\nmodifier = {\n${aiCamp(c).join('\n')}\n}`; }

	// ---------------------------------------------------------------------------------------------- the seals and the risings
	const given = (k, text) => ({ text, trigger: `any_country = {\ntag = ${AEN}\n${ruled(k)}\n}` });
	E.push({ id: 210, kind: 'news', title: 'The Seals of Parim', picture: 'generic_court', requires: [],
		desc: [
			given('faithful', 'The seals of Parim are given. The temples and the councillors carry them from the empty cushion to the hands that will keep them, and the bells ring again.'),
			given('court', 'The seals of Parim are given to the Golden Court. No king is named; the Regency will keep the crown warm for one.'),
			given('dominions', 'The seals of Parim are given to the Concord. The lords of the dominions will choose a Speaker, and the Charters will be written again.'),
			given('host', 'The seals of Parim are given to the friends of the stranger. A man of the First Men is hailed by the frontier and the scholars, though no crown has been set on his head.'),
			{ text: 'The seals of Parim are given.' },
		],
		immediate: list('if = {', `limit = {\ntag = ${AEN}\nhas_country_flag = zin_aenor_succession_open\nNOT = { has_country_flag = zin_aenor_seals_given }\n}`, 'set_country_flag = zin_aenor_seals_given', 'zin_aenor_give_seals = yes', 'zin_aenor_resolve_risings = yes', '}'),
		options: [
			{ key: 'a', text: 'Let it be done.', trigger: `tag = ${AEN}` },
			{ key: 'b', text: 'So Parim has chosen.', trigger: `NOT = { tag = ${AEN} }` },
		] });
	const rising = (id, title, text, option) => E.push({ id, kind: 'news', title, picture: 'generic_war', desc: text, options: [{ key: 'a', text: option }] });
	rising(211, 'The Golden Court Rises', 'Parim\'s Golden Court will not accept the seals. Its lords have bought too much to see it given away, and they raise their own banners in the hinterland estates of the capital.', 'The banners are raised.');
	rising(212, 'The Faithful Rise', 'The temples of Parim will not accept the seals. [zin_loc_camp_faithful] raise their own banners in the cities of the Great Lake, and call the lords of the faith to them.', 'So it begins.');
	rising(213, 'The Host Rises', 'The frontier will not accept the seals. [zin_loc_camp_host] raise their banners along the marches and call every captain of the Lost Cause to them.', 'So it begins.');
	rising(214, 'The Dominions Declare Themselves Free', 'The lords of the dominions have torn up their charters. They name themselves free, and gather beneath one banner that is not the crown\'s.', 'The Concord is broken.');
	E.push({ id: 215, kind: 'country', title: 'The Dissenters Silenced', picture: 'generic_court',
		desc: 'Those who would not accept the new order have been sent from Parim, or are quiet. The halls are emptier than they were a month ago, and the people who remain speak to each other more slowly.',
		options: [{ key: 'a', text: 'Let the halls be quiet.' }] });
	E.push({ id: 216, kind: 'country', title: 'A Rival for the Crown', picture: 'generic_war',
		desc: 'A party that was silent at the thirtieth day has grown strong enough to call the lords to its own banner. It says that the seals were given wrongly, and it has the swords to say so.',
		options: [{ key: 'a', text: 'Then it will be settled by the sword.' }] });
	E.push({ id: 220, kind: 'country', title: 'A Dominion Breaks Its Charter', picture: 'concord_council',
		desc: [
			{ text: 'The charter lies in pieces on the council table. Our lords swear to one another instead of to the crown, and the Concord\'s banner comes down from the hall.', trigger: 'has_country_flag = zin_aenor_free_dominion' },
			{ text: 'Another dominion has torn up its charter and sent back the seals of the Concord. The council hall is a smaller room than it was.' },
		],
		options: [
			{ key: 'a', text: 'We are free.', trigger: 'has_country_flag = zin_aenor_free_dominion' },
			{ key: 'b', text: 'Let it be written in the rolls.', trigger: 'NOT = { has_country_flag = zin_aenor_free_dominion }' },
		] });

	// ---------------------------------------------------------------------------------------------- the abandoned throne, the Hailed King and the Crown of Aen (section 8)
	E.push({ id: 300, kind: 'country', title: 'The Throne Abandoned', picture: 'generic_court',
		desc: [
			{ text: 'The King has gone east. The Seal-Keeper\'s chair is empty. The captains of the Lost Cause hold the seals, and say they hold them for a king who will return.', trigger: 'zin_aenor_ruled_by_faithful = yes' },
			{ text: '[zin_loc_deliverer] has abandoned the throne of Aenor and gone east. The country that served him waits to learn who will rule in his place.' },
		],
		immediate: list('if = {', 'limit = { zin_aenor_ruled_by_faithful = yes }',
			'if = {', 'limit = { has_character = zin_merovan }', 'retire_character = zin_merovan', '}',
			'add_timed_idea = { idea = zin_aenor_throne_abandoned days = 180 }',
			'recruit_character = zin_aenor_captains_regency', 'promote_character = zin_aenor_captains_regency', setStance('zin_light_wardens'),
			'set_variable = { zin_aenor_ruling_camp = 5 }', 'zin_aenor_set_party_names = yes',
			'country_event = { id = zin_reign.86 days = 1 }', '}'),
		options: [{ key: 'a', text: 'The captains hold the seals.' }] });
	E.push({ id: 320, kind: 'country', title: 'The Hailed King', picture: 'dragon_return', requires: ['zin_eindil_returned'],
		desc: 'Aenoran survivors who stood with him in the west and in the north have begun to hail him as king. They have not asked leave of anyone. The word has reached our halls, and it is louder than any herald.',
		options: [
			{ key: 'a', text: 'Hail him.', ai: 90, effect: list('add_ideas = zin_aenor_hailed_king', 'set_country_flag = zin_aenor_hailed_king', 'zin_eindil_join_coalition = yes') },
			{ key: 'b', text: 'No man is king before he is crowned.', ai: 10, effect: list('if = {', 'limit = { check_variable = { zin_aenor_camp_host < 40 } }', 'set_variable = { zin_aenor_camp_host = 40 }', '}', 'set_temp_variable = { zin_arg_camp = 4 }', 'zin_aenor_raise_camp = yes') },
		] });
	E.push({ id: 321, kind: 'country', title: 'The Host Rises', picture: 'dragon_return', requires: ['zin_eindil_returned'],
		desc: 'The soldiers who followed the stranger home have taken the road to the marches, and the captains of the frontier have opened the gates to them. They do not ask our leave. They ask only which side of the wall we will stand on.',
		immediate: list('if = {', 'limit = { check_variable = { zin_aenor_camp_host < 35 } }', 'set_variable = { zin_aenor_camp_host = 35 }', '}', 'set_temp_variable = { zin_arg_camp = 4 }', 'zin_aenor_raise_camp = yes'),
		options: [{ key: 'a', text: 'Let the banners be raised.' }] });
	E.push({ id: 400, kind: 'country', title: 'The Crown of Aen', picture: 'coronation', requires: ['zin_golden_king_dead'],
		desc: 'The captains, the lords of the dominions and the stranded soldiers of half of Aoaz stand in the ruins of Parim and ask Eindil, son of Ein and grandson of Aen, to take the crown. Around his neck he wears the Necklace of the Abyss. Its price is not yet known.',
		options: [{ key: 'a', text: 'Long live the King.', effect: list('if = {', 'limit = { zin_aenor_eindil_can_be_crowned = yes }', 'zin_aenor_crown_eindil = yes', '}', 'else = {', 'country_event = { id = zin_aenor.400 days = 30 }', '}') }] });
	E.push({ id: 401, kind: 'news', title: 'Eindil Is Crowned', picture: 'crown_of_aen', requires: ['zin_eindil_crowned'],
		desc: 'The Fourth Age has a king of Aen\'s line again. His coronation did not erase the grievances of those who watched it.',
		options: [
			{ key: 'a', text: 'Long live the King.', trigger: 'zin_aenor_is_realm = yes' },
			{ key: 'b', text: 'A king sits in Parim.', trigger: 'NOT = { zin_aenor_is_realm = yes }' },
		] });
	E.push({ id: 402, kind: 'country', title: 'A Charter of Equals', picture: 'concord_council',
		desc: 'The new king offers every dominion a Free Charter, or freedom. He forces neither. The offer is written in his own hand, and the Concord is asked to read it aloud.',
		options: [
			{ key: 'a', text: 'We take the Free Charter.',
				ai: weighAi402(), effect: list('if = {', 'limit = { is_subject = no }', 'zin_aenor_rejoin_dominion = yes', '}', 'else = {', 'set_temp_variable = { zin_arg_charter = 3 }', 'zin_aenor_set_charter = yes', 'set_temp_variable = { zin_arg_value = 10 }', 'zin_aenor_add_concord_loyalty = yes', '}') },
			{ key: 'b', text: 'We stay as we are.', ai: 30 },
		] });
	function weighAi402() { return `base = 30\nmodifier = {\nadd = 60\ncheck_variable = { zin_concord_loyalty > 39 }\n}\nmodifier = {\nadd = 60\nany_neighbor_country = {\nzin_diplo_is_dark_power = yes\n}\n}\nmodifier = {\nfactor = 0\ntag = ${T.selen}\n}`; }
	return E;
}
