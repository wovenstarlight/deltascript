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
			* `/yard` - Holidays' front yard
			* `/interior` - The general indoors; first/second/third floor
			* `/kitchen` - Holidays' kitchen (first floor)
			* `/giftroom` - Room with the boxes (first floor)
			* `/noelleroom` - Noelle's room
			* `/dessroom` - Dess's room
			* nothing interactive in the bathroom so no page for that
			* possibly someday will need `/rudycarolroom`...?
		* School `/school`
			* exterior...? IIRC in ch4 end Susie will stop at the doors with some dialogue...
			* ~~`/torielclass` - Toriel's classroom~~ DONE up to Chapter 4
			* ~~`/alphysclass` - Alphys's classroom~~ DONE up to Chapter 4
			* `/unusedclass` - Unused classroom (former card world)
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
	* Dark Worlds
		* `/closetworld` - Supply closet dark world, contains Castle Town and ??????
		* `/cardkingdom` - Chapter 1 dark world
		* `/cyberworld` - Chapter 2 dark world
		* `/tvworld` - Chapter 3 dark world
		* `/darksanctuary` - Chapter 4 dark worlds. I think for this one we can include all three sanctuaries' subpages
		* Ach how do we even subdivide these pages
* Chapters `/chapters`
	* `/chapter1`
		* ~~Vessel creation and being woken up by Toriel~~ DONE `/intro`
		* ~~School scene leading into Dark World~~ DONE `/school`
			* Ok how specific do we wanna get on this. I'm thinking I record all the character interactions for this specific scene because those are very chapter-1-this-scene-specific, you can't get them at any other point, the second you leave the classroom they're gone. BUT! The objects (e.g. board, Alphys's computer, all that) are there regardless of chapter, the wording just changes a bit, so those go to the `/locations/lightworld/alphysclass` page...?
		* ~~Scenes in ?????? leading up to Castle Town~~ DONE `/darkworldintro` (can't do ?????? as the URL because question marks are a special chara :<)
		* ~~Castle Town scenes leading up to entry into Card Kingdom~~ DONE `/castletown` (TODO: Update Lancer battle URL)
		* Field scenes... Ok IDK how to do this part honestly
		* Dark World begins...............
	* `/chapter2`
	* `/chapter3`
	* `/chapter4`
	* `/chapter5`
	* `/chapter6`
	* `/chapter7`
* Miscellaneous pages... `/misc`
	* `/darkitems` - Consumables, key items, etc. Descriptions, usage text and reactions from the party members. Shop descriptions too, if we can find them?
	* ~~`/lightitems` - Light World items. Crosslink to Dark World equivalents.~~ DONE up to Chapter 4
	* ~~`/equipment` - Weapons and armor. Descriptions, reactions from the party members, shop descriptions. LW/DW equivalents.~~ DONE up to Chapter 4
	* `/encounters` - Check descriptions, ACT descriptions, etc. This is probably gonna have a ton of subpages, I'd guess one for every potential enemy. At the very least, the big story-critical encounters (e.g. all boss fights) would need their own subpages which the `/chapters` pages could then link to.
		* Include disambiguation pages for the following. Maybe we give them more descriptive names...? Double-check the URLs before creating the disambigs
			* `/lancer`: initial fight vs kris and susie, susie & lancer vs kris & ralsei, lancer vs susie
			* `/berdly`: coaster fight, alley fight, queen fight with plug-controlled berdly
			* `/rouxls`: chapter 2 pirate hat, chapter 3 contractors
			* `/tenna`: doom board and final showdown
		* gml_Object_obj_placeholderenemy_Step_0 `/placeholder` (check chapter variants! also maybe crosslink whatever baseenemy ends up becoming?)
		* gml_Object_obj_lancerboss_Step_0 (Lancer intro) `/lancer1` or `/lancervslightners`
		* ~~gml_Object_obj_dummyenemy_Step_0~~ `/dummy` DONE (messy as hell though. is there a neater way to organize it...)
		* gml_Object_obj_ralseienemy_Step_0 (Unused Ralsei tutorial) `/ralsei`
		* ~~gml_Object_obj_diamondenemy_Step_0~~ `/rudinn` DONE
		* ~~gml_Object_obj_heartenemy_Step_0~~ `/hathy` DONE
		* gml_Object_obj_clubsenemy_old_Step_0 (old Clover fight) `/cloverunused`, crosslink `/clover`
		* gml_Object_obj_smallcheckers_enemy_Step_0 `/cround`, crosslink `/kround`
		* gml_Object_obj_checkers_enemy_Step_0 `/kround`, crosslink `/cround`; include sections/numbered pages for first/second fight
		* ~~gml_Object_obj_ponman_enemy_Step_0 `/ponman`~~
		* gml_Object_obj_lancerboss3_Step_0/gml_Object_obj_susieenemy_Step_0 (vs Lancer & Susie) `/badguys` or `/darkfungang` or smthn maybe lmao. pick a better name if you want
		* ~~gml_Object_obj_rabbick_enemy_Step_0 `/rabbick`~~
		* ~~gml_Object_obj_bloxer_enemy_Step_0 `/bloxer`~~
		* gml_Object_obj_jigsawryenemy_Step_0 `/jigsawry`
		* gml_Object_obj_clubsenemy_Step_0 `/clover` (ch1 file) and `/cloverdojo` (ch2 file), crosslink each other and `/cloverunused`
		* gml_Object_obj_lancerboss2_Step_0 (Susie vs Lancer) `/lancer2` or `/lancervssusie`
		* ~~gml_Object_obj_joker_Step_0 `/jevil`~~
		* ~~gml_Object_obj_rudinnranger_Step_0 `/rudinnranger`~~
		* ~~gml_Object_obj_headhathy_Step_0 `/headhathy`~~
		* ~~gml_Object_obj_king_boss_Step_0 `/king`~~
		* gml_Object_obj_omawaroid_enemy_Step_0 `/ambyulance`
		* gml_Object_obj_poppup_enemy_Step_0 `/poppup`
		* gml_Object_obj_tasque_enemy_Step_0 `/tasque`
		* gml_Object_obj_werewire_enemy_Step_0 `/werewire`
		* gml_Object_obj_maus_enemy_Step_0 `/maus`
		* gml_Object_obj_virovirokun_enemy_Step_0 `/virovirokun`
		* gml_Object_obj_swatchling_enemy_Step_0 `/swatchling`
		* gml_Object_obj_sweet_enemy_Step_0/gml_Object_obj_hatguy_enemy_Step_0/gml_Object_obj_kk_enemy_Step_0 `/sweetcapncakes`
		* gml_Object_obj_werewerewire_enemy_Step_0 `/werewerewire`
		* gml_Object_obj_dojograzeenemy_Step_0 `/jigsawrydojo` or `/dojograze` (dojo's graze challenge)
		* gml_Object_obj_tasque_manager_enemy_Step_0 `/tasquemanager`
		* gml_Object_obj_berdlyb_enemy_Step_0 `/berdly1` or `/berdlycoaster` (coaster fight)
		* gml_Object_obj_mauswheel_enemy_Step_0 `/mauswheel`
		* gml_Object_obj_rouxls_enemy_Step_0 `/rouxls1` or `/rouxlsch2` (pirate hat fight)
		* gml_Object_obj_berdlyb2_enemy_Step_0 `/berdly2` or `/berdlyalley`
		* gml_Object_obj_queen_enemy_Step_0/gml_Object_obj_berdlyplug_enemy_Step_0 `/queen`
		* gml_Object_obj_spamton_enemy_Step_0 `/spamton`, crosslink `/spamtonneo`
		* gml_Object_obj_spamton_neo_enemy_Step_0 `/spamtonneo`, crosslink `/spamton`, split sections/pages(?) for the regular/weird route (`/spamtonneoweird`? maybe `weirdroute` in full lmao.)
		* gml_Object_obj_gigaqueen_enemy_Step_0 `/gigaqueen`
		* gml_Object_obj_dojo_spareenemy_Step_0 `/jigsawjoe` or `/dojospare` (dojo's spare challenge)
		* gml_Object_obj_pipis_enemy_Step_0 `/pipis`
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