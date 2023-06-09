/**
 * @name NoSuperReactions
 * @author xenona
 * @description Removes super reactions.
 * @version 1.0.3
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

			/* Menu Options */
			.effectsWrapper-1M6qbb,
			div[aria-label="Add Super Reaction"],
			.button-3bklZh[aria-label="Add Super Reaction. ( left)"],
			div#message-actions-add-reaction-1,
			div#message-add-reaction-1,
			.navList-3uG4ub > div {
				display: none;
			}

			/* Actual Super Reactions */
			.reaction-3vwAF2[style*="background"],
			.reactionDefault-1Sjj1f[aria-label*="super reaction"],
			.reactionSelected-1aMb2K[aria-label*="super reaction"] {
				display: none;
			}
		`);
	}

	stop() {
		BdApi.clearCSS("noSuperReactions");
	}
};
