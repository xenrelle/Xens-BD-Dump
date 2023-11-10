/**
 * @name NoSuperReactions
 * @author xenona
 * @description Removes super reactions.
 * @version 1.1.0
 * @source https://github.com/xenrelle/Xens-BD-Dump/tree/main/plugins/NoSuperReactions
 * @updateUrl https://raw.githubusercontent.com/xenrelle/Xens-BD-Dump/main/plugins/NoSuperReactions/NoSuperReactions.plugin.js
 */

module.exports = class MyPlugin {
	observer = null;
	constructor(meta) {

	}

	start() {
		BdApi.injectCSS("noSuperReactions",`
			div[class^="hideEmoji_"] {
				opacity: 1;
			}

			/* Menu Options */
			div[class^="effectsWrapper_"],
			div[class^="burstToggle_"],
			div[aria-label="Add Super Reaction"],
			div[id^="message-accessories"]:not(:has(div[class^="reaction_"]:not([style*="background"]))),
			div[class^="reactions_"]:not(:has(div[class^="reaction_"]:not([style*="background"]))) {
				display: none;
			}

			/* Actual Super Reactions */
			div[class^="reaction_"][style*="background"],
			div[class^="reactionDefault_"][aria-label*="super reaction"],
			div[class^="reactionSelected_"][aria-label*="super reaction"] {
				display: none;
			}
		`);
	}

	stop() {
		BdApi.clearCSS("noSuperReactions");
	}
};
