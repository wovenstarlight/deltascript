let globalAnims = false;

// #region Game elements
/** A box containing a few lines of dialogue. */
class DialogueBox extends HTMLElement {
	constructor() {
		super();
		this._internals = this.attachInternals();
	}

	get compact() {
		return this._internals.states.has("compact");
	}

	set compact(flag) {
		if (flag) {
			// Existence of identifier corresponds to "true"
			this._internals.states.add("compact");
		} else {
			// Absence of identifier corresponds to "false"
			this._internals.states.delete("compact");
		}
	}

	connectedCallback() {
		const styles = Object.entries({
			offset_x: this.getAttribute("offset-x") ?? this.getAttribute("offset"),
			offset_y: this.getAttribute("offset-y"),
		}).filter(el => el[1]);
		if (styles.length)
			this.setAttribute("style", styles.map(([key, val]) => `--${key.replaceAll("_", "-")}: ${val}`).join("; "));
	}
}
customElements.define("d-box", DialogueBox);


/** Speaker label. Invisible when compact mode is disabled. */
class DialogueSpeaker extends HTMLElement {
	constructor() {
		super()
	}

	/** Set the color of this speaker label to match the speaker mentioned.
	 * @param {string} [speaker=this.innerText] The speaker whose corresponding color should be used.
	 */
	setColor(speaker = this.innerText) {
		const speaking = speaker.toLowerCase();
		switch (speaking) {
			// Light World
			case "kris":
			case "susie":
			case "ralsei":
			case "noelle":
			case "berdly":
			case "toriel":
			case "asgore":
			case "sans":
			case "papyrus":
			case "undyne":
			case "alphys":
			case "mettaton":
			case "rudy":
			case "carol":
			// Chapter 1
			case "lancer":
			case "king":
			case "rouxls":
			case "seam":
			case "jevil":
			// Chapter 2
			case "queen":
			case "sweet":
			case "spamton":
			// Chapter 3
			case "tenna":
			case "lanino":
			case "elnina":
			case "knight":
			// Chapter 4
			case "titan":
				this.classList.add(speaking);
				break;

			// Chapter 1
			case "rouxls kaard":
				this.classList.add("rouxls");
				break;

				case "jigsaw joe":
				this.classList.add("jigsawjoe");
				break;

			// Chapter 2
			case "cap'n":
			case "capn":
				this.classList.add("capn");
				break;

			case "k_k":
			case "kk":
				this.classList.add("kk");
				break;

			case "spamton neo":
				this.classList.add("spamton");
				break;

			// Chapter 3
			case "lanino and elnina":
			case "elnina and lanino":
				this.classList.add("weather");
				break;

			case "shadow mantle holder":
			case "mantle holder":
			case "eram":
				this.classList.add("eram");
				break;

			// Chapter 4
			case "gerson":
			case "old man":
				this.classList.add("gerson");

			default:
				break;
		}
	}

	connectedCallback() {
		// setTimeout used to force innerText to be parsed before this is run
		setTimeout(() => this.setColor(), 0);
	}
}
customElements.define("d-speaker", DialogueSpeaker);


/** Converts an alphanumeric sprite code to a strictly numeric index.
 * @param {string} emotion A single-character alphabetic string (`A`–`Z` or `a`–`z`) or a numeric string of any length.
 * @returns The numeric index corresponding to the provided sprite code.
 */
function emotionToIndex(emotion) {
	const code = emotion.charCodeAt(0);
	return (
		code >= 48 && code <= 57 ? parseInt(emotion)	// Numeric form
		: code >= 65 && code <= 90 ? code - 55			// A-Z; gets converted to the range 10-35
		: code >= 97 && code <= 122 ? code - 61			// a-z; gets converted to the range 36-61
		: 0	// fallback
	);
}

/** A sprite for a dialogue box. Invisible when compact mode is enabled. */
class DialogueSprite extends HTMLElement {
	constructor() {
		super()
	}

	#getImageTag(speaker) {
		const variant = this.getAttribute("variant") ??	// Use provided variant, or default to...
			( speaker === "Susie" ? "eyes"		// ...eyes-exposed for Susie
			: speaker === "Ralsei" ? "nohat"	// ...hatless for Ralsei
			: speaker === "Berdly" ? "light"	// ...Light World for Berdly
			: speaker === "Toriel" ? "home"		// ...home clothes for Toriel
			: speaker === "Rouxls" ? "nohat"	// ...hatless for Rouxls
			: "" )								// ...no variants for all others
		const emotion = this.getAttribute("emotion");
		const emotionIndex = emotionToIndex(emotion);
		const src = (
			`${BASE_URL}/assets/images/faces/${speaker.toLowerCase()
			}${variant.length ? `/${variant}` : ""
			}${emotion ? `/${emotionIndex}` : ""
			}`
		);
		const alt = (
			`${
				speaker
			}${
				variant.length && emotion
				? ` (${variant}, ver.${emotion})`
				: emotion ? ` (ver.${emotion})`
				: variant.length ? ` (${variant})`
				: ""
			}`
		);
		const isGif = (
			(speaker === "Toriel" && [0, 1, 2, 6, 7, 9].includes(emotionIndex))
			|| (speaker === "Asgore" && [0, 1, 2, 3, 4, 6].includes(emotionIndex))
			|| (speaker === "Susie" && variant === "noeyes" && emotionIndex === 11)
			|| (speaker === "Seam" && emotionIndex !== 1)
			|| (speaker === "Rouxls" && variant === "shop")
			|| (speaker === "Spamton" && emotionIndex !== 0)
			|| (speaker === "Tenna"/* && emotionIndex === 0 */)
		);
		if (isGif) globalAnims = true;

		return (
			`<img
				src="${src}.${isGif ? "gif" : "png"}"
				alt="${alt}"
			>${
				isGif
				? `<img src="${src}.png" alt="${alt}">`
				: ""
			}`
		)
	}

	connectedCallback() {
		const speaker = this.getAttribute("speaker");
		this.innerHTML = this.getAttribute("format") === "shop" ? (
			this.#getImageTag(speaker)
		) : (
			`<d-speaker>${speaker}</d-speaker>
			${this.#getImageTag(speaker)}`
		);
	}
}
customElements.define("d-sprite", DialogueSprite);


/** A line of text for a dialogue box. */
class DialogueText extends HTMLElement {
	constructor() {
		super()
	}
}
customElements.define("d-text", DialogueText);


/** Images used as part of Tenna's dialogue. */
let audioContext, playFile;
class FunnyText extends HTMLElement {
	constructor() {
		super()
	}

	initializeAudioContext() {
		// Return early if setup has already been done
		if (audioContext) return;

		// Audio setup taken from https://css-tricks.com/form-validation-web-audio/
		audioContext = new window.AudioContext();
		playFile = (filepath) => {
		  // Fetch the file
			fetch(filepath)
				// Read it into memory as an arrayBuffer
				.then(response => response.arrayBuffer())
				// Turn it from mp3/aac/whatever into raw audio data
				.then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
				.then(audioBuffer => {
				// Now we're ready to play!
				const soundSource = audioContext.createBufferSource();
				soundSource.buffer = audioBuffer;
				soundSource.connect(audioContext.destination);
				soundSource.start();
			});
		}
	}

	connectedCallback() {
		this.initializeAudioContext();

		let myName = this.getAttribute("name"),
			mySound,
			myText,
			styles = {},
			isJittering = true,
			isGif = false;
		// Sounds retrieved from gml_GlobalScript_scr_funnytext_init; text manually transcribed
		switch (myName) {
			case "alligator":	// 1679
				myText = "(Guess your mother's never been a fan of alligators in bikinis.)";
				styles.width = "25ch";
				styles.offset_y = "0.4em";
				break;

			case "amazing_01":	// 2602
				myText = "AMAZING";
				mySound = "prize";
				styles.width = "25ch";
				break;

			case "big":	// 1272
				myText = "BiG";
				mySound = "bounce";
				styles.width = "6ch";
				break;

			case "board":	// 3699
				myText = "BOARD";
				mySound = "woodblock";
				styles.width = "8ch";
				break;

			case "bonus_round":	// 4487
				myText = "BONUS ROUND";
				mySound = "prize";
				styles.width = "17ch";
				break;

			case "breaking_news":	// 1223
				myText = "BREAKING NEWS";
				mySound = "whip_crack_only";
				styles.width = "19ch";
				break;

			case "brother":	// 2494
				myText = "BROTHER";
				mySound = "brother";
				styles.width = "11ch";
				isGif = true;
				break;

			case "city_feet":	// 3184
				myText = "(But don't ask why the cars don't have feet!)";
				styles.width = "20ch";
				styles.offset_y = "0.4em";
				break;

			case "challenge":	// 4235
				myText = "CHALLENGE";
				mySound = "woodblock";
				styles.width = "16ch";
				break;

			case "coffee":	// 2191
				myText = "(And get me a cup of coffee.)";
				styles.width = "23ch";
				styles.offset_y = "0.4em";
				break;

			case "dark_fountain":	// 3984
				myText = "DARK FOUNTAIN";
				mySound = "dark_fountain";
				styles.width = "29ch";
				styles.offset_x = "-1em";
				styles.offset_y = "-0.9em";
				isGif = true;
				break;

			case "flames":	// 244
				myText = "FLAMES";
				mySound = "badexplosion";
				styles.width = "11ch";
				isGif = true;
				break;

			case "fun_loop":	// 2916
				myText = "FUN";
				mySound = "crowd_cheer_single";
				styles.width = "7ch";
				styles.offset_y = "-0.2em";
				isGif = true;
				break;

			case "fun_o_meter":	// 1087
				myText = "FUN-O-METER";
				mySound = "enter";
				styles.width = "15ch";
				styles.offset_y = "-0.1em";
				break;

			case "game":	// 4659
				myText = "GAME";
				styles.width = "8ch";
				isGif = true;
				break;

			case "game_over":	// 2914
				myText = "GAME OVER!?";
				styles.width = "24ch";
				isGif = true;
				break;

			case "gentle":	// 3828
				myText = "(Well, okay, you can touch it. Just be gentle.)";
				styles.width = "22ch";
				styles.offset_y = "0.4em";
				break;

			case "grand_prize":	// 1700
				myText = "GRAND PRIZE";
				mySound = "gunshot";
				styles.width = "19ch";
				break;

			case "green_room":	// 4037
				myText = "Green Room";
				mySound = "vibraphones";
				styles.width = "19ch";
				break;

			case "hall_of_fame":	// 4013
				myText = "Hall of Fame";
				mySound = "prize";
				styles.width = "15ch";
				break;

			case "its_tv_time":	// composited from 4919/3654/228/4042/4053
				myText = "IT'S!! TV!! TIME!!!"
				mySound = "its_tv_time";
				styles.width = "19ch";
				isGif = true;
				isJittering = false;
				break;

			case "know_tv":	// 1176
				myText = "(And trust me, I know TV.)";
				styles.width = "23ch";
				styles.offset_y = "0.4em";
				break;

			case "love":	// 4793
				myText = "LOVE";
				mySound = "audience_aww";
				styles.width = "8ch";
				styles.offset_y = "-0.35em";
				break;

			case "lovely":	// 3437
				myText = "Lovely";
				mySound = "audience_aww";
				styles.width = "9ch";
				styles.offset_y = "-0.35em";
				break;

			case "lovers":	// 3575
				myText = "LOVERS";
				mySound = "audience_aww";
				styles.width = "9ch";
				styles.offset_y = "0.15em";
				isGif = true;
				break;

			case "names":	// 3550
				myText = "NAMES";
				mySound = "names";
				styles.width = "11ch";
				isGif = true;
				break;

			case "over_small":	// 130
				myText = "OVER";
				styles.width = "7ch";
				isGif = true;
				break;

			case "physical_challenge":	// 2693
				myText = "PHYSICAL CHALLENGE";
				mySound = "bounce";
				styles.width = "25ch";
				isGif = true;
				break;

			case "physical_challenges":	// 3886
				myText = "PHYSICAL CHALLENGES";
				mySound = "bounce";
				styles.width = "24ch";
				isGif = true;
				break;

			case "prizes":	// 3803
				myText = "PRIZES";
				mySound = "gunshot";
				styles.width = "11ch";
				break;

			case "quizzes":	// 127
				myText = "QUIZZES";
				mySound = "vibraphones";
				styles.width = "10ch";
				break;

			case "relax":	// 1662
				myText = "Relax and Enjoy…";
				styles.width = "16.5ch";
				isGif = true;
				break;

			case "rock_concert":	// 4541
				myText = "ROCK CONCERT";
				mySound = "cd_bagel_susie";
				styles.width = "19ch";
				isGif = true;
				break;

			case "round":	// 3055
				myText = "ROUND";
				mySound = "gunshot";
				styles.width = "9ch";
				isGif = true;
				break;

			case "rounds":	// 3603
				myText = "ROUNDS";
				mySound = "gunshot";
				styles.width = "11ch";
				break;

			case "round_1":	// 4464
				myText = "ROUND 1!";
				mySound = "gunshot";
				styles.width = "12ch";
				break;

			case "special":	// 883
				myText = "Special";
				mySound = "enter";
				styles.width = "7ch";
				break;

			case "star":	// 1724
				myText = "STAR";
				mySound = "sparkle_glock";
				styles.width = "9ch";
				styles.offset_y = "-0.5em";
				break;

			case "stars":	// 700
				myText = "STARS";
				mySound = "sparkle_glock";
				styles.width = "11ch";
				break;

			case "stop":	// 1817
				myText = "STOP";
				mySound = "locker";
				styles.width = "5ch";
				break;

			case "susiezilla":	// 2623
				myText = "SUSIEZILLA";
				mySound = "susiezilla";
				styles.width = "11ch";
				isGif = true;
				break;

			case "tan":	// 4409
				myText = "(Though I would look good with a tan.)";
				styles.width = "30ch";
				styles.offset_y = "0.4em";
				break;

			case "tears":	// 766
				myText = "TEARS";
				mySound = "splat";
				styles.width = "12ch";
				isGif = true;
				break;

			case "toriel":	// 333
				myText = "TORIEL";
				mySound = "toriel";
				styles.width = "10ch";
				isGif = true;
				break;

			case "tv_time":	// 2843
				myText = "TV TIME";
				styles.width = "12ch";
				break;

			case "win":	// 4661
				myText = "WIN!";
				styles.width = "7ch";
				isGif = true;
				break;

			case "win_big":	// 4472
				myText = "* WIN!";
				mySound = "carhonk";
				styles.width = "17ch";
				isGif = true;
				break;

			case "word":	// 4476
				myText = "WORD";
				mySound = "prize";
				styles.width = "8ch";
				break;
		}

		// GIF if applicable, figcaption for searchable text
		let myImage = `<figure>${isGif ? `
	<img src="${BASE_URL}/assets/images/story/talktenna/${myName}.gif" alt="${myText}" class="animswitch${isJittering ? ` shaking`: ""}" />` : ""}
	<img src="${BASE_URL}/assets/images/story/talktenna/${myName}.png" alt="${myText}"${
		isGif ? ` class="animswitch"`	// if it has a gif equivalent, it will never shake
		: isJittering ? ` class="shaking"`
		: ""
	} />
	<figcaption aria-hidden="true">${myText}</figcaption>
</figure>`;
		if (mySound) {
			let btn = document.createElement("button");
			btn.addEventListener("click", () => { playFile(`${BASE_URL}/assets/images/story/talktenna/snd/${mySound}.wav`) });
			btn.innerHTML = myImage;
			this.append(btn);
		}
		else this.innerHTML = myImage;

		styles = Object.entries(Object.assign(
			styles,							// Use any default styles
			Object.fromEntries(				// Plus overrides from this specific instance
				Object.entries({
					width: this.getAttribute("width"),
					offset_x: this.getAttribute("offset-x") ?? this.getAttribute("offset"),
					offset_y: this.getAttribute("offset-y"),
				})
					.filter(el => el[1]),	// …if it has any, that is
			)
		));
		if (styles.length)	// if any styles were assigned
			this.setAttribute("style", styles.map(([key, val]) => `--${key.replaceAll("_", "-")}: ${val}`).join("; "));
	}

}
customElements.define("funny-text", FunnyText);


/** A choice menu.
 * Has the same compact mode toggle from DialogueBox, with additional functionality for moving the tab toggles around.
 */
class DialogueChoices extends HTMLElement {
	/** Tracks the total number of menus. */
	static count = 0;

	constructor() {
		super();
		this._internals = this.attachInternals();
		/** The index of this menu in all menus.
		 * @type {number}
		 */
		this.count = ++ DialogueChoices.count;
		/** A list of options belonging to this menu.
		 * @type {DialogueChoicesOption[]}
		 */
		this.options = [];
		/** `true` if this menu's options are linked to panels.
		 * @type {boolean}
		 */
		this.isInteractive = true;
	}

	get forced() {
		return this._internals.states.has("forced");
	}

	set forced(flag) {
		if (flag) this._internals.states.add("forced");
		else this._internals.states.delete("forced");
	}

	get compact() {
		return this._internals.states.has("compact");
	}

	set compact(flag) {
		if (flag) {
			// Existence of identifier corresponds to "true"
			this._internals.states.add("compact");
			// Move all options adjacent to their panels
			if (this.isInteractive) {
				this.options.forEach(option => {
					option.tabIndex = 0;
					option.panel.parentElement.insertBefore(option, option.panel);
				});
			}
			else {
				this.options.toReversed().forEach(option => this.insertAdjacentElement("afterend", option));
			}
		} else {
			// Absence of identifier corresponds to "false"
			this._internals.states.delete("compact");
			// Move all options back into this menu
			this.options.forEach(option => {
				this.append(option);
				if (this.isInteractive) option.tabIndex = option.getAttribute("aria-expanded") === "true" ? 0 : -1;
			});
			if (this.isInteractive && !this.options.find(opt => opt.tabIndex === 0)) this.options[0].tabIndex = 0;
		}
	}

	/** Force-open all tabs associated with this menu. */
	openAll() {
		// Mark this as forced-open
		this.forced = true;
		// Open each panel, marking them as forced-open
		this.options.forEach(o => o.panel.open(true));
	}

	/** Open a specific tab associated with this menu. */
	openOne(panel) {
		// Close all other tabs
		this.closeAll();
		// And open the desired panel (not forced-open)
		panel.open();
	}

	/** Close all tabs associated with this menu. */
	closeAll() {
		// Unmark this as forced-open
		this.forced = false;
		// Close each panel
		this.options.forEach(o => o.panel.close());
	}

	connectedCallback() {
		this.role = "tablist";
		this.setAttribute("aria-label", "Choice menu");
		const styles = Object.entries({
			offset_x: this.getAttribute("offset-x") ?? this.getAttribute("offset"),
			offset_y: this.getAttribute("offset-y"),
		}).filter(el => el[1]);
		if (styles.length)
			this.setAttribute("style", styles.map(([key, val]) => `--${key.replaceAll("_", "-")}: ${val}`).join("; "));
		this.isInteractive = this.getAttribute("noninteractive") === null;
	}
}
customElements.define("d-choices", DialogueChoices);


/** Faux line break character. */
const BREAK = `<span class="break"></span>`;

/** Returns a standard-format ID for a choice menu's option or panel.
 * @param {DialogueChoices} choiceMenu The choice menu this option or panel is a part of.
 * @param {DialogueChoicesOption|DialogueOptionPanel} me The object whose index to base the ID on.
 * @param {"option"|"panel"} type The type of element for which the ID is being created.
 */
function getChoiceId(me, type) {
	return `choice${me.menu.count}_${type}${me.getAttribute("index")}`;
}

/** An option in a choice menu. */
class DialogueChoicesOption extends HTMLElement {
	constructor() {
		super();
		/** The tab panel associated with this option.
		 * @type {DialogueOptionPanel}
		 */
		this.panel = undefined;
	}

	/** Open the tab panel associated with this option. */
	open() {
		this.menu.openOne(this.panel);
	}

	connectedCallback() {
		// Exit setup early if it's already been done
		if (this.menu) return;

		this.menu = this.parentElement;
		this.setAttribute("theme", this.menu.getAttribute("theme"));
		// (and register this option with its menu)
		this.menu.options.push(this);

		if (this.menu.isInteractive) {	// interactive option
			// Set up ARIA features: Tab
			this.id = getChoiceId(this, "option");	// Set ID
			this.setAttribute("role", "tab");	// Mark as tab
			this.setAttribute("aria-controls", getChoiceId(this, "panel"));	// Mark the panel this tab controls
			// aria-expanded is handled entirely by the corresponding tab panel
			// Make the first option in this menu tabbable;
			// or, in compact mode, make them all tabbable
			this.tabIndex = this.menu.compact || this.getAttribute("index") === "0" ? 0 : -1;
			this.addEventListener("keydown", e => {	// Enable keyboard nav of the tablist
				if (this.menu.compact) return;
				// Only run when in non-compact mode
				if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
					e.preventDefault();
					this.tabIndex = -1;
					const focusTarget = e.key === "ArrowRight"
						? this.nextElementSibling ?? this.parentElement.firstElementChild
						: this.previousElementSibling ?? this.parentElement.lastElementChild;
					focusTarget.tabIndex = 0;
					focusTarget.focus();
				}
			});
			/** Open the panel this tab controls. */
			this.addEventListener("click", this.open);
			this.addEventListener("keydown", e => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					this.open();
				}
			});
		}

		// Add actual text label
		let label = this.getAttribute("text")
			.replaceAll(/(^(#|\s|\\s)*|(#|\s|\\s)*$)/g, "")	// Trim starting/trailing whitespace
			// Next, convert all remaining linebreaks...
			.replaceAll(/(#|\\s)/g, ` ${BREAK}`)	// ...to spaces
			.replaceAll("\\b", BREAK)	// ...to newlines without spaces
			.replaceAll(/\\h(.)/g, (_, p1) => `<span class="hide">${p1}</span>`);	// ...and hide any characters involved in linebreaking
		
		let ltIndices = [];
		for (const match of label.matchAll(/<([\w-]+)/g)) {
			// label from the opening tag onwards doesn't have a corresponding closing tag
			if (label.slice(match.index + match[0].length).search(`</${match[1]}>`) < 0)
				// it's not actually an HTML tag; include in the replacement list
			 	ltIndices.push(match.index);
		}
		// Replace the <s with &lt;s
		this.innerHTML = ltIndices.reverse().reduce((str, index) => str.slice(0, index) + "&lt;" + str.slice(index + 1), label);

		// Add offsets where necessary
		const styles = Object.entries({
			offset_x: this.getAttribute("offset-x") ?? this.getAttribute("offset"),
			offset_y: this.getAttribute("offset-y"),
		}).filter(el => el[1]);
		if (styles.length)
			this.setAttribute("style", styles.map(([key, val]) => `--option-${key.replaceAll("_", "-")}: ${val}`).join("; "));

		// Add conditional marker where necessary
		if (this.getAttribute("conditional") !== null) {
			const asterisk = document.createElement("span");
			asterisk.classList.add("conditional");
			asterisk.innerText = "*";
			asterisk.title = "Available conditionally";
			this.append(asterisk);
		}
	}
}
customElements.define("d-option", DialogueChoicesOption);


/** The content that changes based on a choice. */
class DialogueOptionPanel extends HTMLElement {
	constructor() {
		super();
		this._internals = this.attachInternals();
		/** The option controlling this tab panel.
		 * @type {DialogueChoicesOption}
		 */
		this.option = undefined;
	}

	get forced() {
		return this._internals.states.has("forced");
	}

	set forced(flag) {
		if (flag) this._internals.states.add("forced");
		else this._internals.states.delete("forced");
	}

	get collapsed() {
		return this._internals.states.has("collapsed");
	}

	set collapsed(flag) {
		if (flag) {
			// Existence of identifier corresponds to "true"
			this._internals.states.add("collapsed");
			document.getElementById(this.getAttribute("aria-labelledby")).setAttribute("aria-expanded", "false");
		} else {
			// Absence of identifier corresponds to "false"
			this._internals.states.delete("collapsed");
			document.getElementById(this.getAttribute("aria-labelledby")).setAttribute("aria-expanded", "true");
		}
	}

	/** Open this panel.
	 * @param {boolean} [isForced=false] `true` if all panels associated with this one's menu are being forced open. `false` if this panel is the only one of its siblings to be opened.
	 */
	open(isForced = false) {
		this.collapsed = false;
		this.forced = isForced;
		this.removeAttribute("hidden");

		// Check that all speakers are colored
		this.querySelectorAll("d-speaker").forEach(speaker => speaker.setColor());
	}

	/** Close this panel. */
	close() {
		this.collapsed = true;
		this.forced = false;
		this.setAttribute("hidden", "until-found");
	}

	connectedCallback() {
		// Exit setup early if it's already been done
		if (this.menu) return;

		// Find the corresponding choices menu
		this.menu = this.previousElementSibling;
		while (this.menu.tagName !== "D-CHOICES") this.menu = this.menu.previousElementSibling;

		// Mark this as a tab panel
		this.id = getChoiceId(this, "panel");
		this.role = "tabpanel";
		this.tabIndex = -1;
		// Link it to its control
		this.setAttribute("aria-labelledby", getChoiceId(this, "option"));
		this.option = document.getElementById(this.getAttribute("aria-labelledby"));
		this.option.panel = this;

		// Add a marker for when forced view is enabled
		const p = document.createElement("p");
		p.classList.add("selection-label");
		p.innerHTML = `» Upon selecting "${this.option.innerHTML}"`;
		this.prepend(p);

		// Start off closed
		this.close();

		// Auto-open the associated menu if search (Ctrl+F) finds something within this panel
		this.addEventListener("beforematch", () => this.menu.openAll());
	}
}
customElements.define("d-option-panel", DialogueOptionPanel);
// #endregion Game elements



// #region Setting up page functionality
/** Sets compact mode for all dialogue elements.
 * @param {boolean} compact `true` to enable compact mode; `false` otherwise.
 */
function setAllCompact(compact) {
	compact ? document.body.classList.add("compact") : document.body.classList.remove("compact");
	document.querySelectorAll("d-box, d-choices").forEach(box => {
		box.compact = compact;
	});
}

/** Adding all event handlers to page elements. */
function setUp() {
	// #region Accessibility features
	// Menu
	document.getElementById("openmenu").addEventListener("click", () => {
		document.getElementById("menucontents").toggleAttribute("hidden");
	})

	// #region Compact mode
	document.getElementById("toggle-compact").addEventListener("change", e => {
		setAllCompact(e.currentTarget.checked);
		localStorage.setItem("compactMode", e.currentTarget.checked ? "on" : "");
	});
	// Autofill on initial load
	if (localStorage.getItem("compactMode")?.length) {
		// Compact mode has been set to ON
		setAllCompact(true);
		document.getElementById("toggle-compact").checked = true;
	}
	// #endregion Compact mode

	// #region Disable animations
	document.getElementById("toggle-anim").addEventListener("change", e => {
		!e.currentTarget.checked ? document.body.classList.add("noanim") : document.body.classList.remove("noanim");
		localStorage.setItem("noAnimations", !e.currentTarget.checked ? "on" : "");
	});
	// Auto-enable on first load for prefers-reduced-motion havers
	if (localStorage.getItem("noAnimations") === null && window.matchMedia("(prefers-reduced-motion)").matches)
		localStorage.setItem("noAnimations", "on");
	// Autofill on initial load
	if (localStorage.getItem("noAnimations")?.length) {
		// Animations are DISABLED
		document.body.classList.add("noanim");
		document.getElementById("toggle-anim").checked = false;
	}
	// #endregion Disable animations

	// #region Dim mode
	document.getElementById("toggle-dim").addEventListener("change", e => {
		e.currentTarget.checked ? document.body.classList.add("dim") : document.body.classList.remove("dim");
		localStorage.setItem("dimMode", e.currentTarget.checked ? "on" : "");
	});
	// Autofill on initial load
	if (localStorage.getItem("dimMode")?.length) {
		// Dim mode has been set to ON
		document.body.classList.add("dim");
		document.getElementById("toggle-dim").checked = true;
	}
	// #endregion Dim mode

	// #region Dyslexic-friendly font
	document.getElementById("toggle-opendyslexic").addEventListener("change", e => {
		if (e.currentTarget.checked) document.body.classList.add("dyslexic");
		else document.body.classList.remove("dyslexic");

		localStorage.setItem("dyslexicMode", e.currentTarget.checked ? "on" : "");
	});
	// Autofill on initial load
	if (localStorage.getItem("dyslexicMode")?.length) {
		// Dyslexic mode has been set to ON
		document.body.classList.add("dyslexic");
		document.getElementById("toggle-opendyslexic").checked = true;
	}
	// #endregion Dyslexic-friendly font

	// Force-view all choices
	document.getElementById("open-choices").addEventListener("click", () => {
		document.querySelectorAll("d-choices").forEach(menu => menu.openAll());
	});
	// #endregion Accessibility features

	// #region Visual display
	// #region Extra fonts
	const FONTS = [
		{
			selector: `.fnt-tiny, [font=tiny]`,
			name: "DeltaFont Tiny",
			file: "fnt_noelletiny.otf",
		},
		{
			selector: `.fnt-sans, [font=sans]`,
			name: "DeltaFont Comic Sans",
			file: "fnt_comicsans.otf",
		},
		{
			selector: `.fnt-combat, [theme^=battletalk], [theme=caller], .winglade, .profile`,
			name: "DeltaFont Dotum",
			file: "fnt_dotumche.otf",
		},
		{
			selector: `.fnt-eightbit, .fnt-8bit, [theme=eightbit], [theme="8bit"], [font=eightbit], &[font="8bit"]`,
			name: "DeltaFont 8-Bit",
			file: "fnt_8bit.otf",
		},
		{
			selector: `[theme=prophecy]`,
			name: "DeltaFont Prophecy",
			file: "fnt_legend.otf",
		},
		{
			selector: `.fnt-tv`,
			name: "DeltaFont TV",
			file: "fnt_tv.otf",
		},
	];
	let demandedFonts = [];
	FONTS.forEach(fnt => {
		if (document.querySelector(fnt.selector) !== null)
			demandedFonts.push(`@font-face { font-family: "${fnt.name}"; src: url("${BASE_URL}/assets/fonts/${fnt.file}") }`)
	});
	if (demandedFonts.length) {
		const FONT_STYLES = document.createElement("style");
		FONT_STYLES.id = "fontsondemand";
		FONT_STYLES.innerText = demandedFonts.join("\n");
		document.head.append(FONT_STYLES);
	}
	// #endregion Extra fonts

	// #region Shaky text
	let prevClassIndex,
		insideTag = false,
		insideEntity = false;
		insideShake = true;
	const SHAKE_CLASSES = ["s1", "s2", "s3", "s4"];
	function randomShake() {
		let index = Math.floor(Math.random() * SHAKE_CLASSES.length);
		while (index === prevClassIndex) index = Math.floor(Math.random() * SHAKE_CLASSES.length);
		// Index now NOT the same as the last
		prevClassIndex = index;
		return SHAKE_CLASSES[index];
	}
	document.querySelectorAll("[effect*=shake]").forEach(shakeElement => {
		globalAnims = true;

		shakeElement.setAttribute("aria-label", shakeElement.innerText);
		let result = `<span class="shake">`;

		for (const char of shakeElement.innerHTML) {
			if (char === "<") {	// HTML; include everything until the end of this tag without changes
				insideTag = true;
				result += char;
				continue;
			}
			else if (insideTag) {	// HTML; include tag ender
				result += char;
				if (char === ">") insideTag = false;
				continue;
			}

			if (char === "&") {	// HTML entity; include everything until the end of this entity without changes
				insideEntity = true;
				result += `${		// Add shake opener if necessary
					!insideShake ? `<span class="shake">` : ""
				}<span class="${	// Add random shake class; never selects the same class twice in a row
					randomShake()
				}">${				// Add the character itself
					char
				}`;					// DO NOT CLOSE; entity has to be shaken as one unit!
				if (!insideShake) insideShake = true;
				continue;
			}
			else if (insideEntity && char === ";") {	// HTML entity; include entity ender
				insideEntity = false;
				result += `${char}</span>`;
				continue;
			}
			else if (insideEntity) {	// HTML entity; keep parsing as one unit
				result += char;
				continue;
			}

			if (!char.trim().length) {	// Whitespace
				if (insideShake) {
					result += "</span>";
					insideShake = false;
				}
				result += char;
				continue;
			}

			// Non-whitespace
			result += `${		// Add shake opener if necessary
				!insideShake ? `<span class="shake">` : ""
			}<span class="${	// Add random shake class; never selects the same class twice in a row
				randomShake()
			}">${				// Add the character itself
				char
			}</span>`;
			insideShake = true;
		}

		// Got through all characters; check whether the last span is closed
		if (insideShake) result += "</span>";
		shakeElement.innerHTML = result;

		// Move any line breaks out of their parent shakers
		shakeElement.querySelectorAll(".break").forEach(el => el.parentElement.insertAdjacentElement("afterend", el));
	});
	// #endregion Shaky text

	// #region Chromatic aberration (color bleed)
	if (document.querySelector("[effect~=bleed]") !== null) {
		let d = document.createElement("div");
		d.innerHTML = `<svg height="0" width="0">
	<filter id="kill">
		<feColorMatrix type="matrix" result="red_" values="
			1 0 0 0 0
			0 0 0 0 0 
			0 0 0 0 0 
			0 0 0 1 0
		"></feColorMatrix>
		<feColorMatrix type="matrix" in="SourceGraphic" result="blue_" values="
			0 0 0 0 0
			0 0 0 0 0 
			0 0 1 0 0 
			0 0 0 1 0
		"></feColorMatrix>
		<feColorMatrix type="matrix" in="SourceGraphic" result="cyan_" values="
			0 0 0 0 0
			0 1 0 0 0 
			0 0 1 0 0 
			0 0 0 1 0
		"></feColorMatrix>
		<feColorMatrix type="matrix" result="orange_" values="
			1 0 0 0 0
			0 1 0 0 0 
			0 0 0 0 0 
			0 0 0 1 0
		"></feColorMatrix>
		<feOffset in="blue_" dy="0" result="blue" dx="2"></feOffset>
		<feOffset in="red_" dy="0" result="red" dx="-1"></feOffset>
		<feOffset dy="0" result="cyan" in="cyan_" dx="1"></feOffset>
		<feOffset dy="0" in="orange_" result="orange" dx="0"></feOffset>
		<feBlend in="red" in2="blue" mode="lighten" result="blend1"></feBlend>
		<feBlend in="orange" in2="cyan" result="blend2" mode="screen"></feBlend>
		<feBlend mode="screen" in="blend1" in2="blend2" result="blend"></feBlend>
	</filter>
</svg>`;
		document.body.append(d.firstElementChild);
	}
	// #endregion Chromatic aberration (color bleed)

	// Gray out animation toggle if no animations are present
	globalAnims ||= document.querySelector(`
		d-text[asterisk="Sweet" i],
		d-text[asterisk="Cap'n" i], d-text[asterisk="Capn" i],
		d-text[asterisk="K_K" i], d-text[asterisk="KK" i],
		svg.winglade,
		[theme=prophecy],
		funny-text:has(.shaking, .animswitch),
		.glow
	`) !== null;
	if (!globalAnims) {
		(animToggle = document.querySelector("label[for='toggle-anim']")).title = "No animations on this page";
		animToggle.classList.add("gray");
		animToggle.append("*");
	}

	// Highlight the current page in the top navbar, if any
	document.querySelectorAll("#sitenav a").forEach(a => {
		if (window.location.href === a.href) a.classList.add("currentpage");
	})
	// #endregion Visual display
}

// Run setup once page elements have loaded
if (document.readyState !== 'loading') setUp();
else document.addEventListener('DOMContentLoaded', setUp);
// #endregion Setting up page functionality