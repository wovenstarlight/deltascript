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
// #endregion