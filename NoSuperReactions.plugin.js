/**
 * @name NoSuperReactions
 * @author xenona
 * @description Removes super reactions.
 * @version 1.0.0
 * @source https://github.com/xenrelle/RemoveSuperReactions/
 * @updateUrl https://raw.githubusercontent.com/xenrelle/RemoveSuperReactions/main/NoSuperReactions.plugin.js
 */

module.exports = class MyPlugin {
	observer = null;
	constructor(meta) {

	}

	start() {
		BdApi.injectCSS("noSuperReactions",`
			.hideEmoji-3W3sEI {
				opacity: 1;
			}

			.effectsWrapper-1M6qbb,
			div[aria-label="Add Super Reaction"],
			.button-3bklZh[aria-label="Add Super Reaction. ( left)"],
			div#message-actions-add-reaction-1,
			div#message-add-reaction-1 {
				display: none;
			}
		`);

		this.observer = new MutationObserver(mutations => {
			var reactions = document.querySelectorAll(".reaction-3vwAF2:not(.superReactionParsed)");
			for (var reaction of reactions) {
				if (!(!reaction.style.background)) { // if it has a background, it's a super reaction
					reaction.style.display = "none"; // simply hide it instead of removing it, since removing it crashes discord
				}
				reaction.classList.add("superReactionParsed");
			}
		});

		this.observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	stop() {
		BdApi.clearCSS("noSuperReactions");
		this.observer.disconnect();
		this.observer = null;
	}
};
