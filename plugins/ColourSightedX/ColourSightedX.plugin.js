/**
 * @name ColourSightedX
 * @author xenona
 * @description Makes statuses full circles again.
 * @version 0.1.3
 */

module.exports = class MyPlugin {
	observer = null;
	constructor(meta) {

	}

	start() {
		// this code is shit please save your eyes lmfao
		this.observer = new MutationObserver(mutations => {
			var statuses = document.querySelectorAll(".mask-1y0tyc.svg-1G_H_8 > .pointerEvents-2KjWnj:not(.colourSightedXParsed)");
			var otherStatuses = document.querySelectorAll(".mask-3tgVZv.icon-3XHs8t > foreignObject:not(.colourSightedXParsed), .mask-3tgVZv.icon-OgaO6F > foreignObject:not(.colourSightedParsed)")
			var statusTransitions = document.querySelectorAll(".mask-1y0tyc.svg-1G_H_8 > .cursorDefault-2M8ZNp:not(.colourSightedXParsed)"); // For when status transition
			for (var status of statuses) {
				if (status.previousSibling.getAttribute(`mask`) != `url(#svg-mask-avatar-status-mobile-32)`) { // if not Mobile
					status.setAttribute(`mask`, `url(#svg-mask-status-online)`);
				}
				status.classList.add("colourSightedXParsed");
			}
			for (var status of otherStatuses) {
				status.setAttribute(`mask`, `url(#svg-mask-status-online)`);
				status.classList.add("colourSightedXParsed");
			}
			for (var status of statusTransitions) {
				var mask = status.firstChild;
				mask.innerHTML = `<rect x="7.5" y="5" width="10" height="10" rx="5" ry="5" fill="white"></rect>`;
				status.classList.add("colourSightedXParsed");
			}
		});

		this.observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	stop() {
		this.observer.disconnect();
		this.observer = null;
	}
};
