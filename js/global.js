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
}
customElements.define("d-box", DialogueBox);


/** Speaker label. Invisible when compact mode is disabled. */
class DialogueSpeaker extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		// Add the corresponding color class where possible
		switch (this.innerText) {
			case "Susie":
			case "Ralsei":
			case "Noelle":
			case "Kris":
			case "Lancer":
			case "Queen":
				this.classList.add(this.innerText.toLowerCase());
				break;
			default:
				break;
		}
	}
}
customElements.define("d-speaker", DialogueSpeaker);


/** Helper for matching up dialogue sprites. Invisible when compact mode is enabled.
 * @param {string} emotion A single-character string in one of the ranges `0`–`9`, `A`–`Z`, or `a`–`z`.
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

/** A sprite for a dialogue box. */
class DialogueSprite extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		const speaker = this.getAttribute("speaker");
		const variant = this.getAttribute("variant");
		const emotion = this.getAttribute("emotion");
		this.innerHTML =
			`<d-speaker>${speaker}</d-speaker>
			<img
				src="${BASE_URL}/assets/images/faces/${speaker.toLowerCase()
			}${variant ? `/${variant}` : ""
			}${emotion ? `/${emotionToIndex(emotion)}` : ""
			}.${
				(speaker === "Toriel" && [0, 1, 2, 6, 7, 9].includes(emotionToIndex(emotion)))
				|| (speaker === "Susie" && emotionToIndex(emotion) === 11)
				? "gif"	// `gif` in certain cases
				: "png"	// `png` otherwise
			}"
				alt="${speaker}${variant && emotion ? ` (${variant}, ver.${emotion})`
				: emotion ? ` (ver.${emotion})`
					: variant ? ` (${variant})`
						: ""
			}"
			>`;
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
			this.options.forEach(option => {
				option.tabIndex = 0;
				let panel = this.nextElementSibling;
				while (panel.tagName.startsWith("D-OPTION") && panel.getAttribute("index") !== option.getAttribute("index"))
					panel = panel.nextElementSibling;
				panel.parentElement.insertBefore(option, panel);
			});
		} else {
			// Absence of identifier corresponds to "false"
			this._internals.states.delete("compact");
			// Move all options back into this menu
			this.options.forEach(option => {
				this.append(option);
				option.tabIndex = option.getAttribute("aria-expanded") === "true" ? 0 : -1;
			});
			if (!this.options.find(opt => opt.tabIndex === 0)) this.options[0].tabIndex = 0;
		}
	}

	connectedCallback() {
		this.role = "tablist";
		this.setAttribute("aria-label", "Choice menu");
		if (this.getAttribute("offset") !== null) {
			this.setAttribute("style", `--offset: ${this.getAttribute("offset")}`);
		}
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

		// Add actual text label
		this.innerHTML = this.getAttribute("text")
			.replaceAll(new RegExp(`(^[#\\s]*|[#\\s]*$)`, "g"), "")	// Trim starting/trailing whitespace
			// Next, convert all remaining linebreaks...
			.replaceAll("\\s", ` ${BREAK}`)	// ...to spaces
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
		p.innerText = `Upon selecting "${document.getElementById(this.getAttribute("aria-controlledby")).innerText}"`;
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

	document.getElementById("open-choices").addEventListener("click", () => {
		document.querySelectorAll("d-choices").forEach(menu => menu.forced = true);
		document.querySelectorAll("d-option-panel").forEach(panel => {
			panel.collapsed = false;
			panel.forced = true;
		});
	})
}

// Run setup once page elements have loaded
if (document.readyState !== 'loading') setUp();
else document.addEventListener('DOMContentLoaded', setUp);
// #endregion