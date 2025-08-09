# To-Do list
## Files/assets
Nothing right now!

## Page design
* Add the OpenDyslexia toggle back in. Requires checking all the site features with it enabled and confirming that everything's sized properly.

## Specific pages
* Home page could use cleanup/more information. Some sections that might be nice to have:
	* Progress updates (what's finished/new arrivals, what's currently being focused on)
	* Priority list (what will be worked on after the current tasks are complete, what needs attention, what's been requested...)
* ch3 0.0.089/ch4 0.0.088 has typo fixes:
	* Elnina/Lanino page: Tenna's win condition declaration
	* Shuttah(?)'s "you have seen naught" dialogue in `obj_npc_room`
	* Shadowguy's Sharpshoot ACT instructions
	* Watercooler chat ACT description
	* Catty's rendition of the prophecy
	* `obj_dw_church_waterfallroom` "if only you had something **to** help you climb"
	* stealing scarlixir from mizzle (via nuzzle, I think?)
* ch3 0.0.098:
	* tripticket now available after shadowmantle obtained!
		* `gml_Object_obj_npc_room_Other_10` bibliox's hint to look under the ball machine
		* `gml_Object_obj_room_ranking_b_Step_0` "must've already had it" ticket obtain message
	* lancers get removed after leaving ball machine room (can check for `scr_keyitemremove(8)`)
* ch4 0.0.098:
	* Um. Okay so something gerson throws gets a Thar she blows line...? `gml_Object_obj_dw_church_darkmaze_Step_2`
	* `gml_Object_obj_npc_room_Other_10` New Top Chef dialogue for getting that SpinCake. All Lightners do is ask for Spin Cake eat hot chip and lie

### Page list
Brainstorming what pages we'd want. This is a changeable list! Feel free to add and edit!

* Locations `/locations`
	* Light World i.e. Hometown `/lightworld`
		* Dreemurr residence `/dreemurrresidence`
			* ~~`/krisroom` - Kris/Asriel's room~~ DONE up to Chapter 4
			* ~~`/hallway` - Upstairs hallway~~ DONE up to Chapter 4
			* ~~`/downstairs` - Ground floor: kitchen/living room~~ DONE up to Chapter 4
			* ~~`/bathroom` - Downstairs bathroom~~ DONE up to Chapter 4
			* ~~`/yard` - Front yard~~ DONE up to Chapter 4
			* possibly someday will need `/torielroom`...?
		* Noelle's house `/holidayresidence`
			* ~~`/yard` - Holidays' front yard~~ DONE up to Chapter 4
			* ~~`/interior` - The general indoors; first/second/third floor~~ DONE up to Chapter 4
			* ~~`/kitchen` - Holidays' kitchen (first floor)~~ DONE up to Chapter 4
			* ~~`/closet` - Room with the boxes (first floor)~~ DONE up to Chapter 4
			* ~~`/noelleroom` - Noelle's room~~ DONE up to Chapter 4
			* ~~`/dessroom` - Dess's room~~ DONE up to Chapter 4
			* nothing interactive in the bathroom so no page for that
			* possibly someday will need `/rudycarolroom`...?
		* School `/school`
			* exterior...? IIRC in ch4 end Susie will stop at the doors with some dialogue...
			* ~~`/torielclass` - Toriel's classroom~~ DONE up to Chapter 4
			* ~~`/alphysclass` - Alphys's classroom~~ DONE up to Chapter 4
			* ~~`/unusedclass` - Unused classroom (former card world)~~ DONE up to Chapter 4
			* ~~`/hallways` - all the lockers and whatnot. will include text for interacting with the supply closet doors~~ DONE up to Chapter 4
			* Locked classroom if that ever opens up
		* North street (residential)
			* Locked gate
			* Cattenheimer Residence
			* Bratty's House
			* Ghost House
			* Flower King (Asgore's shop)
		* Northeast - Lake path
		* North central street
			* ICE-E'S P"E"ZZA (Pizza place)
			* QC's diner
			* 'Sans (Grocery store)
			* Skeletons' house
			* Apartments
			* Alleyway
		* South central street
			* Police tape >.> (maybe this falls under the "interactions in the streets" thing? see below)
			* Police station
			* Hospital
			* Library
		* South
			* Church
				* Lobby
				* Hall
				* Storage room
				* Study
			* Town Hall
		* Southwest - Graveyard
		* Far south - Bunker
		* QUESTION: where to put interactions that happen in the streets... do the streets themselves need pages.
			* by "interactions in the streets" i mean things like. sans outside the grocery store. rain kid playing in the puddles. the milk sicko being like "Damn your family is messy as hell" in chapter 4
			* could put them under the building they're closest to...? But what if they're like. Not directly related to the building. I'm thinking about chapter 2 undyne "handling" the traffic jam next to the library. That wasn't involved with any nearby building
			* Maybe just a general "Streets" page for the interactions that can't be tied to specific buildings
	* Dark Worlds
		* `/closetworld` - Supply closet dark world, contains Castle Town and ??????
		* `/cardkingdom` - Chapter 1 dark world
		* `/cyberworld` - Chapter 2 dark world
		* `/tvworld` - Chapter 3 dark world
		* `/darksanctuary` - Chapter 4 dark worlds. I think for this one we can include all three sanctuaries' subpages
		* Ach how do we even subdivide these pages
* Chapters `/chapters`
	* Ok for this one there's enough Stuff that i'm just listing like. Pages that have been linked to from elsewhere. So you can update the URLs as/when necessary. Pages not mentioned here, just create as you like and make sure you add them to the [index](../chapters/index.html). If you're not sure whether a page already exists, search for one of its dialogue lines and see if any pages come up
	* `/chapter1`
		* Vessel creation up to all Castle Town scenes DONE
		* `/field` (placeholder URL, update when created) - Field scenes... Ok IDK how to do this part honestly
		* `/thrashing` Susie & Lancer joint fight's pre-/post-encounter dialogue
		* `/prisonbreak` - The prison scene with Susie breaking out, encountering Lancer, and freeing Kris/Ralsei
	* `/chapter2`
		* `/darkworldintro` - Entering the Cyber World and meeting Queen
		* `/drive1` - First part of the Kris/Queen/Noelle drive, pre-Spamton
		* `/drive2` - Second part of the Kris/Queen/Noelle drive, post-Spamton
		* `/fountain` - Sealing the fountain
		* `/fountainweird` - Sealing the fountain (Weird Route)
		* `/shelter` - End of chapter scene with Susie confronting Snowy/MK
		* `/handwashing` - Kris runs the tap.
	* `/chapter3`
		* `/desertboard`
		* `/islandboard`
		* `/doomboard`
		* Sword Route - These should all also include Ramb's before/after commentary
			* `/desertboardsword` - Obtaining the Ice Key
			* `/islandboardsword` - YOU WERE USED UP
			* `/cityboard` - The Manhole Dungeon & the Mantle holder fight's post-cutscene, as well as the Susie interrupting scene
	* `/chapter4`
		* `/noellevisit` - Noelle's house intro. Update this link on other pages if you end up splitting it further
		* `/bathroomweird` - maybe merge with below for an `outroweird`
		* `/holidayoutro` - leaving the Holidays' house. May need a `weird` variant
		* `/darkworldintro` - sanctuary entrance
	* `/chapter5`
	* `/chapter6`
	* `/chapter7`
* Miscellaneous pages... `/misc`
	* ~~`/darkitems` - Consumables, key items, etc. Descriptions, usage text and reactions from the party members. Shop descriptions too, if we can find them?~~ DONE up to Chapter 4
	* ~~`/lightitems` - Light World items. Crosslink to Dark World equivalents.~~ DONE up to Chapter 4
	* Equipment: Descriptions, reactions from the party members, shop descriptions. LW/DW equivalents. Originally intended to be at `/equipment` but goddamn it got long so we're splitting it up
		* ~~`/weapons` - Attack equipment.~~ DONE up to Chapter 4
		* ~~`/armor` - Defense equipment.~~ DONE up to Chapter 4
	* `/encounters` - Check descriptions, ACT descriptions, etc. This is probably gonna have a ton of subpages, I'd guess one for every potential enemy. At the very least, the big story-critical encounters (e.g. all boss fights) would need their own subpages which the `/chapters` pages could then link to.
		* Include disambiguation pages for the following. Maybe we give them more descriptive names...? Double-check the URLs before creating the disambigs
			* `/rouxls`: chapter 2 pirate hat, chapter 3 contractors
			* `/tenna`: doom board and final showdown
		* Chapter 1
			* gml_Object_obj_ralseienemy_Step_0 (Unused Ralsei tutorial) `/ralsei`
			* gml_Object_obj_clubsenemy_old_Step_0 (old Clover fight) `/cloverunused`, crosslink `/clover`
		* Chapter 2
			* gml_Object_obj_werewire_enemy_Step_0 `/werewire`
			* gml_Object_obj_swatchling_enemy_Step_0 `/swatchling`
			* gml_Object_obj_sweet_enemy_Step_0/gml_Object_obj_hatguy_enemy_Step_0/gml_Object_obj_kk_enemy_Step_0 `/sweetcapncakes`
			* gml_Object_obj_werewerewire_enemy_Step_0 `/werewerewire`
			* gml_Object_obj_dojograzeenemy_Step_0 `/jigsawrydojo` or `/dojograze` (dojo's graze challenge)
			* gml_Object_obj_tasque_manager_enemy_Step_0 `/tasquemanager`
			* gml_Object_obj_mauswheel_enemy_Step_0 `/mauswheel`
			* gml_Object_obj_rouxls_enemy_Step_0 `/rouxls1` or `/rouxlsch2` (pirate hat fight)
			* gml_Object_obj_berdlyb2_enemy_Step_0 `/berdly2` or `/berdlyalley`
			* gml_Object_obj_queen_enemy_Step_0/gml_Object_obj_berdlyplug_enemy_Step_0 `/queen`
			* gml_Object_obj_gigaqueen_enemy_Step_0 `/gigaqueen`
			* gml_Object_obj_dojo_spareenemy_Step_0 `/jigsawjoe` or `/dojospare` (dojo's spare challenge)
		* Chapter 3
			* gml_Object_obj_shadowman_enemy_Step_0 `/shadowguy`
			* gml_Object_obj_shutta_enemy_Step_0 `/shuttah`
			* gml_Object_obj_zapper_enemy_Step_0 `/zapper`
			* gml_Object_obj_ribbick_enemy_Step_0 `/ribbick`
			* gml_Object_obj_watercooler_enemy_Step_0 `/watercooler`
			* gml_Object_obj_pippins_enemy_Step_0 `/pippins`
			* gml_Object_obj_elnina_enemy_Step_0/gml_Object_obj_lanino_enemy_Step_0 `/weather` (initial fight)
			* gml_Object_obj_rouxls_ch3_enemy_Step_0 `/rouxls2` or `/rouxlsch3` (contracts)
			* gml_Object_obj_tenna_board4_enemy_Step_0 `/tenna1` or `/tennadoom` (doom board)
			* gml_Object_obj_tenna_enemy_Step_0 `/tenna2` or `/tennafinal`
			* gml_Object_obj_knight_enemy_Step_0 `/knight`
		* Chapter 4
			* gml_Object_obj_guei_enemy_Step_0 `/guei`
			* gml_Object_obj_balthizard_enemy_Step_0 `/balthizard`
			* gml_Object_obj_bibliox_enemy_Step_0 `/bibliox`
			* gml_Object_obj_mizzle_enemy_Step_0 `/mizzle`
			* gml_Object_obj_bell_enemy_Step_0 `/wicabel`
			* gml_Object_obj_halo_enemy_Step_0 `/winglade`
			* gml_Object_obj_organ_enemy_Step_0 `/organikk`
			* gml_Object_obj_holywatercooler_enemy_Step_0 `/missmizzle`
			* gml_Object_obj_hammer_of_justice_enemy_Step_0 `/hammerofjustice`
			* gml_Object_obj_sound_of_justice_enemy_Step_0 `/soundofjustice`
			* gml_Object_obj_jackenstein_enemy_Step_0 `/jackenstein`
			* gml_Object_obj_titan_enemy_Step_0 `/titan`
			* gml_Object_obj_titan_spawn_enemy_Step_0 `/titanspawn`
			* gml_Object_obj_elnina_rematch_enemy_Step_0/gml_Object_obj_lanino_rematch_enemy_Step_0 `/weatherdojo` (Dojo variant)
			* gml_Object_obj_mike_attack_controller_Step_0 `/mike`
		* gml_Object_obj_multiboss_enemy1_Step_0/gml_Object_obj_multiboss_enemy2_Step_0/gml_Object_obj_multiboss_enemy3_Step_0 `/multiboss` &LeftArrow; no idea what these are. test enemies? the mikes...?
		* gml_Object_obj_multiboss_controller_enemy1_Step_0/gml_Object_obj_multiboss_controller_enemy2_Step_0/gml_Object_obj_multiboss_controller_enemy3_Step_0 `/multibosscontroller` &LeftArrow; no idea what these are. test enemies?
		* Figure out where these go because I don't have the brain power atm: ch3 gml_Object_obj_b1enemy_Step_0, allch gml_Object_obj_baseenemy_Step_0
	* ~~`/recruits` - Profiles for recruited enemies~~ DONE up to Chapter 4
	* ~~`/savepoints` - Youuuu guessed it. Save point text. The power of X fills you and all that.~~ DONE up to Chapter 4
	* Maybe something for general menu text...?
	* Generic text for stuff like shops ("buy it for $### ?" and "sell it for $### ?") and opening chests and all that. May overlap with above point in some cases.
	* AH... TITLES... the whole, Level 1 Dark Knight stuff. In progress at `/powermenu`
	* Oh also. Death messages. Hello again ch3 Voice