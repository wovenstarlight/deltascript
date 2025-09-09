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
		const ox = this.getAttribute("offset-x"),
			oy = this.getAttribute("offset-y");
		if (ox !== null || oy !== null) {
			this.setAttribute("style", `${
				ox !== null ? `--offset-x: ${ox}` : ""
			}${
				ox !== null && oy !== null ? "; " : ""
			}${
				oy !== null ? `--offset-y: ${oy}` : ""
			}`);
		}
	}
}
customElements.define("d-box", DialogueBox);


/** Speaker label. Invisible when compact mode is disabled. */
class DialogueSpeaker extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		// setTimeout used to force innerText to be parsed before this is run
		setTimeout(() => {
			// Add the corresponding color class where possible
			switch (this.innerText) {
				case "Kris":
				case "Susie":
				case "Ralsei":
				case "Noelle":
				case "Berdly":
				case "Toriel":
				case "Asgore":
				case "Sans":
				case "Papyrus":
				case "Undyne":
				case "Alphys":
				case "Mettaton":
				case "Rudy":
				case "Carol":
				case "Lancer":
				case "King":
				case "Rouxls":
				case "Jevil":
				case "Queen":
				case "Spamton":
				case "Tenna":
				// eram's down below cuz we're not sure eram's Da Actual Name
				case "Gerson":
					this.classList.add(this.innerText.toLowerCase());
					break;

				case "Spamton NEO":
					this.classList.add("spamton");
					break;

				case "Shadow Mantle holder":
					this.classList.add("eram");
					break;

				default:
					break;
			}
		}, 0);
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
					let panel = this.nextElementSibling;
					while (panel.tagName.startsWith("D-OPTION") && panel.getAttribute("index") !== option.getAttribute("index"))
						panel = panel.nextElementSibling;
					panel.parentElement.insertBefore(option, panel);
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

	connectedCallback() {
		this.role = "tablist";
		this.setAttribute("aria-label", "Choice menu");
		if (this.getAttribute("offset") !== null) {
			this.setAttribute("style", `--offset: ${this.getAttribute("offset")}`);
		}
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
function getChoiceId(choiceMenu, me, type) {
	return `choice${choiceMenu.count}_${type}${me.getAttribute("index")}`;
}

/** An option in a choice menu. */
class DialogueChoicesOption extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		// Exit setup early if it's already been done
		if (this.menu) return;

		this.menu = this.parentElement;
		this.menu.options.push(this);
		this.setAttribute("theme", this.menu.getAttribute("theme"));

		if (this.menu.isInteractive) {	// interactive option
			// Set up ARIA features: Tab
			this.id = getChoiceId(this.menu, this, "option");	// Set ID
			this.setAttribute("role", "tab");	// Mark as tab
			this.setAttribute("aria-controls", getChoiceId(this.menu, this, "panel"));	// Mark the panel this tab controls
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
			const openTab = () => {
				// Unforce this menu
				this.menu.forced = false;
				// Close other panels
				this.menu.options.forEach(el => {
					const panel = document.getElementById(el.getAttribute("aria-controls"));
					panel.collapsed = true;
					panel.forced = false;
				});
				// Open this panel
				document.querySelector(`#${this.getAttribute("aria-controls")}`).collapsed = false;
			}
			this.addEventListener("click", openTab);
			this.addEventListener("keydown", e => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					openTab();
				}
			});
		}

		// Add actual text label
		this.innerHTML = this.getAttribute("text")
			.replaceAll(/(^(#|\s|\\s)*|(#|\s|\\s)*$)/g, "")	// Trim starting/trailing whitespace
			// Next, convert all remaining linebreaks...
			.replaceAll(/(#|\\s)/g, ` ${BREAK}`)	// ...to spaces
			.replaceAll("\\b", BREAK)	// ...to newlines without spaces
			.replaceAll(/\\h(.)/g, (_, p1) => `<span class="hide">${p1}</span>`);	// ...and hide any characters involved in linebreaking
		
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
			document.getElementById(this.getAttribute("aria-controlledby")).setAttribute("aria-expanded", "false");
		} else {
			// Absence of identifier corresponds to "false"
			this._internals.states.delete("collapsed");
			document.getElementById(this.getAttribute("aria-controlledby")).setAttribute("aria-expanded", "true");
		}
	}

	connectedCallback() {
		// Find the corresponding choices panel
		let choiceMenu = this.previousElementSibling;
		while (choiceMenu.tagName !== "D-CHOICES") choiceMenu = choiceMenu.previousElementSibling;

		// Mark this as a tab panel
		this.id = getChoiceId(choiceMenu, this, "panel");
		this.role = "tabpanel";
		this.setAttribute("aria-controlledby", getChoiceId(choiceMenu, this, "option"));
		this.tabIndex = 0;

		// Add a marker for when forced view is enabled
		const p = document.createElement("p");
		p.classList.add("selection-label");
		p.innerHTML = `Upon selecting "${document.getElementById(this.getAttribute("aria-controlledby")).innerHTML}"`;
		this.prepend(p);

		// Start off collapsed
		this.collapsed = true;
	}
}
customElements.define("d-option-panel", DialogueOptionPanel);
// #endregion



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
	// Menu
	document.getElementById("openmenu").addEventListener("click", () => {
		document.getElementById("menucontents").toggleAttribute("hidden");
	})

	// Compact mode
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

	// Disable animations
	document.getElementById("toggle-anim").addEventListener("change", e => {
		!e.currentTarget.checked ? document.body.classList.add("noanim") : document.body.classList.remove("noanim");
		localStorage.setItem("noAnimations", !e.currentTarget.checked ? "on" : "");
	});
	// Autofill on initial load; auto-enable for prefers-reduced-motion havers
	if (localStorage.getItem("noAnimations")?.length || window.matchMedia("(prefers-reduced-motion)").matches) {
		// Animations are DISABLED
		document.body.classList.add("noanim");
		document.getElementById("toggle-anim").checked = false;
	}

	// Dim mode
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

	/*
	// Dyslexic-friendly font
	document.getElementById("toggle-opendyslexic").addEventListener("change", e => {
		if (e.currentTarget.checked) document.body.classList.add("dyslexic");
		else document.body.classList.remove("dyslexic");

		localStorage.setItem("dyslexicMode", e.currentTarget.checked ? "on" : "");
	});
	// Autofill on initial load
	if (localStorage.getItem("dyslexicMode")?.length) {
		// Dyslexic mode has been set to ON
		document.body.classList.add("dyslexic");
	}
	*/

	// Force-view all choices
	document.getElementById("open-choices").addEventListener("click", () => {
		document.querySelectorAll("d-choices").forEach(menu => menu.forced = true);
		document.querySelectorAll("d-option-panel").forEach(panel => {
			panel.collapsed = false;
			panel.forced = true;
		});
	});

	// Shaky text
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

	// Chromatic aberration (color bleed)
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

	// Gray out animation toggle if no animations are present
	globalAnims ||= document.querySelector("d-text[asterisk='Sweet' i], d-text[asterisk='Cap\\'n' i], d-text[asterisk='Capn' i], d-text[asterisk='K_K' i], d-text[asterisk='KK' i], svg.winglade, [theme=prophecy]") !== null;
	if (!globalAnims) {
		(animToggle = document.querySelector("label[for='toggle-anim']")).title = "No animations on this page";
		animToggle.classList.add("gray");
		animToggle.append("*");
	}
}

// Run setup once page elements have loaded
if (document.readyState !== 'loading') setUp();
else document.addEventListener('DOMContentLoaded', setUp);
// #endregion