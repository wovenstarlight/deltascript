# Contribution guide
## Accessing the game files
* Download and unzip [UndertaleModTool](https://github.com/UnderminersTeam/UndertaleModTool/releases). I use the `UndertaleModTool_v#.#.#.#-Windows.zip` version, NOT the `SingleFile` version or the `CLI` versions.
* In the UMT folder, open `UndertaleModTool.exe`.
* From the navbar, select `File > Open`.
* Enter the following into File Explorer's path: ``%ProgramFiles(x86)%\Steam\steamapps\common\DELTARUNE`. You'll see a bunch of `chapter#_windows` folders; each of these contain a `data.win` file. There's also a `data.win` in the root folder, which corresponds to the file selection screen. Select the `data.win` file for the chapter you want to view the script/assets of.
* All the game scripts are under the Code dropdown in the left navigation menu. These have the code for what interactions play when. You can open and start reading from basically wherever!
	* ...Mind you, actually navigating to the script file that contains stuff you want is annoying. What I've been doing is watching a playthrough for the room that I want to get dialogue from, searching up a line of dialogue, and then reading through the rest of the file to see all the dialogue from that particular room.

### Notes
For chapter 2 onwards, dialogue is hardcoded into the script files. But for **chapter 1**, the dialogue is all stored in `%ProgramFiles(x86)%\Steam\steamapps\common\DELTARUNE\chapter1_windows\lang\lang_en.json` in key-value format, and referenced in the code as `scr_84_get_lang_string(KEY_GOES_HERE)`. So if the code says something like:

```javascript
scr_84_get_lang_string("obj_readable_room1_slash_Other_10_gml_83_0")
```

Then Ctrl+F in the `lang_en.json` file, and you'll find the following:

```json
"obj_readable_room1_slash_Other_10_gml_83_0": "* It's only you./%",
```

## Decoding all the commands
Dialogue is stored as strings *(if you haven't programmed before, that just means text surrounded by double quotes. This is a 7-character string: `"string!"`)*. These strings contain a bunch of commands to signal changing speaker SFX, character sprites, color, and more.

| Symbol | Meaning | Examples |
| :----: | ------- | -------- |
| `^#` | Pause for a little bit<br>The number represents how long to pause<br>Irrelevant, delete these | `^1`, `^2`, ... |
| `&` | Forced linebreak (textbox)<br>Generally indicates that text should be split into different `<d-text>`s, unless it's purely for visual format | `"* Line 1&* Line 2"`<br>...turns into...<br>`* Line 1`<br>`* Line 2`<br><br>`"* This is a long line and is only&split for visual reasons."`<br>...turns into...<br>`* This is a long line and is only split for visual reasons.` |
| `#` | Forced linebreak (choice menu)<br>Can be replaced with `\s`, `\b`, and `\h` as appropriate. See the HTML guide for more on that | `"No No No#No No No#No No No"`<br>...can turn into...<br>`No No No`<br>`No No No`<br>`No No No` |
| `/` | End of a single textbox (i.e. wait for user to press CONFIRM) |
| `%` | End of a conversation/chunk. Sometimes gets repeated, as in `%%` |
| `\\C#` | Open a choice menu<br>`#` represents number of choices<br>Choices 0–3 are ordered left/right/up/down | `\C2`: 2 choices<br>`\C3`: 3 choices<br>`\C4`: 4 choices |
| `\\M#` | sets `global.flag[20]`, which "Controls how some characters' overworld sprites interact with their dialogue, among other things."<br/>You can just ignore this one pretty much |
| `\\c?` | Change color to `?`<br>Replace this with `<span class="COLOR_CODE">...</span>`<br>Specific codes include:<br>`\cR`: red<br>`\cB`: blue<br>`\cY`: yellow<br>`\cG`: green<br>`\cW`: white<br>`\cX`: black<br>`\cP`: purple<br>`\cM`: maroon<br>`\cO`: orange<br>`\cA`: lightblue<br>`\cS`: pink<br>`\cV`: lightgreen<br>`\cI`: iceblue  | `"There's \\cYyellow\\cW text"`<br>...turns into...<br>`There's <span class="yellow">yellow</span> text`<br>...or...<br>`There's <span class="cY">yellow</span> text`<br><br>`"There's \\cSyellow\\cW text"`<br>...turns into...<br>`There's <span class="cS">yellow</span> text` |
| `\\c0` | Reset color (generally to white) |
| `\\F?` | Switch to a specific character's set of face sprites ([see below](#variable-globalfc-or-the-f-command)) |
| `\\E?` | Switch to a specific face sprite for the currently-selected character ([see below](#variable-globalfe-or-the-e-command)) |
| `\\T?` | Switch to a specific character's talking SFX ([see below](#variable-globaltyper-or-the-t-command)) |

### Variable `global.fc`, or the `\\F?` command
Indicates which character's face sprites to display ("face character", probably). Can be changed directly via setting `global.fc = #`, or by including an `\\F?` command in the dialogue string itself.

| Value | Character | `\\F?` code | Notes |
| :-: | - | - | - |
| 0 | No sprite, only text | `\\F0` | Sometimes used as a reset before immediately switching to another character
| 1 | Susie | `\\FS` | Has eyes showing/not showing variants
| 2 | Ralsei | `\\FR` |
| 3 | Noelle | `\\FN` |
| 4 | Toriel | `\\FT` | Has church variant
| 5 | Lancer | `\\FL` |
| 6 | Sans | `\\Fs` |
| 9 | Undyne | `\\FU` |
| 10 | Asgore | `\\FA` |
| 11 | Alphys | `\\Fa` |
| 12 | Berdly | `\\FB` | Has Light/Dark World variants
| 13 | Catti | `\\Fi` |
| 14 | Jockington |
| 15 | Rudy | `\\Fr` |
| 16 | Catty |
| 17 | Bratty | `\\Fy` |
| 18 | Rouxls | `\\Fu` |
| 19 | Burgerpants | `\\Fb` |
| 20 | King of Spades | `\\FK` |
| 21 | Queen | `\\FQ` |
| 22 | Carol | `\\FC` |

### Variable `global.fe`, or the `\\E?` command
Indicates which of a character's face sprites to display ("face emotion", probably). Can be changed directly via setting `global.fe = #`, or by including an `\\F?` command in the dialogue string itself.

Goes from `0-9`, followed by uppercase `A-Z` (representing 10-35), followed by lowercase `a-z` (representing 36-61). That ends up looking like `\\E0-\\E9`, `\\EA-\\EZ`, and `\\Ea-\\Ez`.

You can use the letters or enter numbers 10-61 into `<d-sprite emotion="#">`; either one is fine. Since you should be copying from the dialogue files directly, the `\\E?` code will often be in the dialogue string already, so you can just copy/paste the specific letter/digit in.

### Exceptions
Some `global.fe` indexes for certain characters got updated from Chapter 2 to Chapter 3 onwards. Keep these in mind when formatting dialogue from Chapter 2!
* Susie
	* Sprite `N` (23) -> `f` (41)
	* Sprite `R` (27) -> `g` (42)
	* Sprite `S` (28) -> `h` (43)
	* Sprite `T` (29) -> `i` (44)
	* Sprite `U` (30) -> `B` (11)
	* Sprite `a` (36) -> `j` (45)

### Variable `global.typer`, or the `\\T?` command
Indicates the speech sound to play as text is printed in the dialogue box, I think? Can be changed directly via setting `global.typer = #`, or by including an `\\T?` command in the dialogue string itself.

| Value | Character | `\T?` code | Notes |
| :-: | - | - | - |
| 2 | Silent | `\T1` |
| 4 | In-combat default
| 5 | Default (Light World) | `\T0` |
| 6 | Default (Dark World)<br>Ralsei (hooded) | `\T0`<br>`\TR` |
| 7 | Toriel | `\TT` |
| 10 | Susie (Light World) | `\TS` |
| 12 | Noelle (Light World) | `\TN` |
| 13 | Berdly (Light World) | `\TB` |
| 14 | Sans | `\Ts` |
| 17 | Undyne | `\TU` |
| 18 | Asgore | `\TA` |
| 20 | Alphys | `\Ta` |
| 21 | Temmie
| 22 | Alphys (small text) | | add the attribute `small` to `d-text` to get the right font |
| 23 | Noelle (small text) | `\Tn` | add the attribute `small` to `d-text` to get the right font |
| 30 | Susie (Dark World) | `\TS` |
| 31 | Ralsei | `\TR` |
| 32 | Lancer | `\TL` |
| 33 | King of Spades | `\TK` |
| 35 | Jevil | `\TJ` |
| 36 | Silent (Dark World)<br>King of Spades (Chapter 1, before the King fight) | -<br>`\TK` |
| 40 | *None? Used as a reset, I think* | `\TX` |
| 45 | Ralsei (in combat) | `\TR` |
| 46 | Lancer (in combat) | `\TL` |
| 47 | Susie (Dark World, in combat) | `\TS` |
| 48 | King of Spades (in combat) | `\TK` |
| 50 | For speaker "balloon" or "enemy"?? (No clue.)
| 55 | Rudy | `\Tr` |
| 56 | Noelle (Dark World) | `\TN` |
| 57 | Berdly (Dark World) | `\TB` |
| 58 | Queen | `\TQ` |
| 59 | Noelle (in combat, zone-irrelevant) | `\TN` |
| 62 | Giga Queen (post-fight) | `\Tq` |
| 66 | Spamton
| 67 | Spamton Neo | `\Tp` |
| 68 | Spamton (in combat)
| 77 | Berdly (in combat) | `\TB` |
| 82 | Jackenstein (cute) | `\Tk` |
| 83 | Jackenstein | `\Tj` |
| 84 | Tenna | `\Tv` |
| 85 | Gerson | `\Tg` |
| 87 | Carol | `\TC` |
| 666 | ~~Gaster~~ Voice | | used during vessel creation |

### scr_speaker() and other helper functions
There's a helper function called `scr_speaker()` that sets `global.fc` and `global.typer` all at once (it's called a helper because it helps you handle the work of setting them individually).

This function takes one argument, the character name, and automatically figures out which variants to use if any, depending on whether the global variables say you're in the Light/Dark world and that sort of thing. For example, `scr_speaker("susie")` or `scr_speaker("sus")` will automatically set it to Susie's talksprites and SFX.

Most arguments are pretty intuitive—either the character's name, or the first three letters of their name. The only unusual one is `queen_2`/`que_2`, which is specifically Giga Queen after you've won the fight and the bot is starting to break down.

There are also some variants which set specific character faces, I think...? Ones like `scr_susface()`, `scr_ralface()` etc. In these ones, the *last* number is the `global.fe` value. So `scr_susface(5, 3)` is using the THIRD Susie sprite.

## Decoding the flags and other variables
The primary resource you'll need is [Flags Guide](https://github.com/Jacky720/FloweysTimeMachine/blob/deltarune/data.js).
* Search for `plotValues` to find `global.plot` values for each chapter; these tell the code how much progress you've made on the overall story.
* Search for `flags = ` to find values for `global.flag[NUMBER]` (a.k.a. helper functions `scr_flag_get()`/`scr_flag_set()`). These track all sorts of things, such as whether you've recruited certain Darkners, what scores you got on certain things, whether you've encountered certain individuals, how much progress you've made on specific quests, and more.
* Near the top are a bunch of object IDs. You can see how they map to actual objects in the following script files:
	* `gml_GlobalScript_scr_recruit_info`
	* `gml_GlobalScript_scr_iteminfo`
	* `gml_GlobalScript_scr_weaponinfo`
	* `gml_GlobalScript_scr_armorinfo`
	* Light world items
		* `gml_Globalscript_scr_litemname`
		* `gml_Globalscript_scr_litemdesc`
		* `gml_Globalscript_scr_litemuseb`
	* `gml_GlobalScript_scr_keyiteminfo`
	* `gml_GlobalScript_scr_spellinfo`

Other global variables you'll spot in the code:
* `global.choicemsg` stores the text for a choice menu's options, in 0-1-2-3 order. These are the `index` values to set on `d-option`/`d-option-panel`.
* `global.choice` stores which choice was selected, and matches the 0-1-2-3 ordering of `global.choicemsg`.
* You'll see `con` show up sometimes, like blocks of "if `con` is so and so value, play this part of a scene, then increase `con`; if `con` is this increased value, play the next part of the scene", and so on. Sometimes it'll look like it skips values (e.g. `con=4` sets `con` to `5`, but the next "if" says to check for `con=6`, so how do you get there??). If so, check for any changes to `alarm[NUMBER]`. There are attached Alarm_NUMBER.gml scripts which do nothing but wait a little bit (proportional to how much `alarm` was changed, I think) and then increase `con`. This usually gets used for timing pauses between dialogue/actions.
* `global.char[0-2]` stores the first, second, and third members of the party. Party members are signified by specific numbers: `1` for Kris, `2` for Susie, `3` for Ralsei, `4` for Noelle, and `0` for no party member in that slot. E.g. if party members are Kris/Susie/Ralsei, then `global.char[0] = 1, global.char[1] = 2, global.char[2] = 3`. In that one prison section of Chapter 1 where we're in control of Susie, it's `global.char[0] = 2, global.char[1] = 0, global.char[2] = 0`.
	* There's a helper function for this: `scr_havechar(n)` checks if the character corresponding to the number `n` is in any of the `global.char` slots, i.e. it checks if a character's currently in the party. `scr_havechar(3)` would be checking if you have Ralsei with you. If this function returns 0, that means the character's NOT in the party, while 1 means they ARE in the party.
	* `scr_getchar(n)` adds the character corresponding to `n` in the first available party slot.
	* `scr_losechar()`, as I understand it, removes all but the first party member. Simplifies party cleanup when Susie and Ralsei both run off and leave Kris alone.
* `scr_get_input_name(n)` gives the platform-specific names for the CONFIRM/CANCEL/MENU buttons. `scr_get_input_name(4)` gives `[Z]`, `scr_get_input_name(5)` gives `[X]`, and `scr_get_input_name(6)` gives `[C]`.

## Page creation
There's a page template located at [template.html](./template.html)! Replace the fields, rename the file, move it to the path you want it to be available at on the site, and you're good to go.

The page info near the top contains the following. Fill in the fields as necessary.
```yaml
title: Page title goes here

description: >
  <p>Page description goes here.</p>
  <p>Multiple paragraphs can be included on multiple lines, as long as they all have "p" tags.</p>

credits: >
  <p>Compiled by [yournamehere].</p>

sources:
  -
    name: gml_GlobalScript_script_name_here
    chapters: [1, 2, ...]
  -
    name: More list items with name/chapter pairings; each item is indicated by a hyphen. Indentation is very important - keep it consistent!
    url: [1]
  -
    name: Add all the files you reference, including for character actions during cutscenes.
    url: [4]
```