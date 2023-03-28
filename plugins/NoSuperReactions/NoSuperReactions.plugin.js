/**
 * @name NoSuperReactions
 * @author xenona
 * @authorId 621137770697457674
 * @description Removes super reactions.
 * @version 1.0.2
 * @source https://github.com/xenrelle/Xens-BD-Dump/tree/main/plugins/NoSuperReactions
 * @updateUrl https://raw.githubusercontent.com/xenrelle/Xens-BD-Dump/main/plugins/NoSuperReactions/NoSuperReactions.plugin.js
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
			var reactionsInMenu = document.querySelectorAll(".scroller-2GkvCq.thin-RnSY0a.scrollerBase-1Pkza4.fade-27X6bG > .reactionDefault-1Sjj1f:not(.superReactionParsed), .scroller-2GkvCq.thin-RnSY0a.scrollerBase-1Pkza4.fade-27X6bG > .reactionSelected-1aMb2K:not(.superReactionParsed)")
			for (var reaction of reactions) {
				if (!(!reaction.style.background)) { // if it has a background, it's a super reaction
					reaction.style.display = "none"; // simply hide it instead of removing it, since removing it crashes discord
				}
				reaction.classList.add("superReactionParsed");
			}
			for (var reaction of reactionsInMenu) {
				if (reaction.getAttribute("aria-label").includes("super reaction")) { // if it contains "super reaction" in it's aria label then, well, you get the idea.
					reaction.style.display = "none";
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
