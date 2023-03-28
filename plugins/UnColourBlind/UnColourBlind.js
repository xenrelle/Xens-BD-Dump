/**
 * @name UnColourBlind
 * @author xenona
 * @authorId 621137770697457674
 * @description Makes statuses full circles again.
 * @version 1.0.0
 * @source https://github.com/xenrelle/Xens-BD-Dump/tree/main/plugins/UnColourBlind
 * @updateUrl https://raw.githubusercontent.com/xenrelle/Xens-BD-Dump/main/plugins/UnColourBlind/UnColourBlind.plugin.js
 */

module.exports = class MyPlugin {
	originalMasks = [];
	constructor(meta) {

	}

	start() {
		BdApi.injectCSS("unColourBlind",`
			.mask-1y0tyc.svg-1G_H_8 > svg > mask > *[fill="black"]:not([cy="12.5"]):not([x="8.75"][y="2.5"]),
			.status-12NUUC.disableFlex-3I_kDH > svg > mask > *[fill="black"]:not([cy="12.5"]):not([x="1.25"][y="2.5"]) {
				display: none;
			}
		`);

		var onlineMask = document.querySelector("#svg-mask-status-online");
		var idleMask = document.querySelector("#svg-mask-status-idle");
		var dndMask = document.querySelector("#svg-mask-status-dnd");
		var offlineMask = document.querySelector("#svg-mask-status-offline");
		var streamingMask = document.querySelector("#svg-mask-status-streaming"); 
		this.originalMasks = [ idleMask.innerHTML, dndMask.innerHTML, offlineMask.innerHTML, streamingMask.innerHTML ];
		idleMask.innerHTML = onlineMask.innerHTML;
		dndMask.innerHTML = onlineMask.innerHTML;
		offlineMask.innerHTML = onlineMask.innerHTML;
		streamingMask.innerHTML = onlineMask.innerHTML;
	}
	
	stop() {
		BdApi.clearCSS("unColourBlind");

		var idleMask = document.querySelector("#svg-mask-status-idle");
		var dndMask = document.querySelector("#svg-mask-status-dnd");
		var offlineMask = document.querySelector("#svg-mask-status-offline");
		var streamingMask = document.querySelector("#svg-mask-status-streaming"); 
		idleMask.innerHTML = this.originalMasks[0];
		dndMask.innerHTML = this.originalMasks[1];
		offlineMask.innerHTML = this.originalMasks[2];
		streamingMask.innerHTML = this.originalMasks[3];
	}
};
