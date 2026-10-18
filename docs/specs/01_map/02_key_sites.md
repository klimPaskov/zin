# Key sites

**Status:** Draft. **Priority:** 1. **Phase:** 1.

Places that mechanics, events or focus trees refer to. Each needs a stable, named state or victory point so scripts can target it. Scripts must find sites through scripted triggers named for the site (for example `zin_is_site_parim`), never through raw state numbers, so a map rebuild only changes one file.

| Site | Lore status | Needed by | Map requirement |
| --- | --- | --- | --- |
| **Parim** | established working seat | Aenor capital, Golden Court, the palace battle, the succession | Aenor capital state; victory point 50; palace building (custom landmark when available) |
| **The Golden Court** | proposed | Aenor mechanic | A district of Parim: no separate state; scripted as a Parim modifier |
| **The Great Lake ports** | established region | Aenor economy, navy | Three or more coastal victory points on the lake in Aenor's states |
| **The Great Wall of Aenor** | established geography | Wall mechanic, elves, Kingson, eastern invasion | Forts on the Aenor side; a scripted list of wall states |
| **Kingson** | established | Wall gate dominion | Satellite on the wall |
| **Selen** | established | Alleria, rangers, the Lost Cause | Selen satellite; victory point at its capital |
| **Sonargur and the strait** | established seat | Lerendor, Treaty of the Narrow Strait | Lerendor capital; naval base on the strait |
| **Fandanar** | established seat | Coldor | Coldor capital |
| **Eindil's ice** | established region, exact place proposed | Eindil's journey | A remote north-west Cold Lands state, not a capital; scripted as `zin_is_site_eindil_ice` |
| **Castle of Yeldenne (Mp'E)** | established | Horos, Glo | Yeldenne's one state; capital victory point named Castle of Yeldenne |
| **Bridge of the Three Oaths, Girdon's Winter Ford** | proposed | Eindil's western episodes | Victory points in the West Lands; place them where Gunwaith and Girdon meet |
| **Islands of the South shrine** | proposed | Eindil's journey | A victory point on a southern island |
| **Gala and the Mirror of First Rain** | Gala established, the Mirror proposed | Lorien | Gala Elves' capital; Mirror as a scripted site, no separate state |
| **Zilin Hills** | established | Worshipdom, Afrit's networks | Worshipdom states |
| **Dragon Mountain** | established | Dragons | Named state in the Magical Lands |
| **Mirolon's northern passes** | proposed | Volgan's march north | Forts on Mirolon's border with the Dead Lands |
| **Nafeher** | established working seat | Volgan | Volgan capital |
| **The Abyss** | established | Roka, the Necklace's origin, events | Named state in the Dead Lands |
| **The Nether** | established | King of Demons, demon portals | Named state in the south of the Dead Lands |
| **Furviatlon** | established working seat | Zol's Mistake | Zol capital |
| **Šodolôrō** | established | Zol's Mistake | Victory point |
| **Ocean of Zol islands** | established | Zol's dead rising | Scripted list of the black island states |
| **The palace cliff** | established event, place open | Afrit casts Eindil down | Scripted near Parim; no map change |
| **Dardan** | established battle, place open | First Age memory only | Not placed until the owner decides |

## Acceptance

Every site with a map requirement exists, is named in localisation and has a scripted trigger in `common/scripted_triggers/zin_sites.txt` generated from one table.
