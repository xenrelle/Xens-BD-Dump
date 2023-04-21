/**
 * @name OnlineFriendCounter
 * @author xenona
 * @authorId 621137770697457674
 * @description Restores the "ONLINE" text under the home button. **Requires ZeresPluginLibrary.**
 * @version 1.0.3
 * @source https://github.com/xenrelle/Xens-BD-Dump/tree/main/plugins/OnlineFriendCounter
 * @updateUrl https://raw.githubusercontent.com/xenrelle/Xens-BD-Dump/main/plugins/OnlineFriendCounter/OnlineFriendCounter.plugin.js
 */
/*@cc_on
@if (@_jscript)
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();
@else@*/
const config = {
	info: {
		name: "OnlineFriendCounter",
		version: "1.0.3",
		authors: [{
			name: "xenona",
			discord_id: "621137770697457674",
			github_username: "xenrelle"
		}],
		description: `Restores the "ONLINE" text under the home button. **Requires ZeresPluginLibrary.**`,
		github: "https://github.com/xenrelle/Xens-BD-Dump/tree/main/plugins/OnlineFriendCounter",
        github_raw: "https://raw.githubusercontent.com/xenrelle/Xens-BD-Dump/main/plugins/OnlineFriendCounter/OnlineFriendCounter.plugin.js"
	},
	changelog: [
		{
			title: "[v1.0.3] Bug Fixes",
			type: "fixed",
			items: [
				"The label should no longer appear incorrectly upon receiving a DM."
			]
		}
	],
	defaultConfig: [
		{
			type: "switch",
			id: "showToasts",
			name: "Show Toasts",
			note: "Shows toasts when this plugin starts or stops.",
			value: true
		}
	]
};
class Dummy {
	constructor() {this._config = config;}
	start() {
		BdApi.showConfirmationModal('Library plugin is needed', [`ZeresPluginLibrary is missing, which is a required library for ${config.info.name} to work. Press the Download button to download the library. (Discord will automatically restart when finished)`], {
			confirmText: 'Download',
			cancelText: 'Cancel',
			onConfirm: () => {
				require('request').get('https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js', async (error, response, body) => {
					if (error) return require('electron').shell.openExternal('https://betterdiscord.app/Download?id=9');
					await new Promise((r) => require('fs').writeFile( require('path').join(BdApi.Plugins.folder, '0PluginLibrary.plugin.js'), body, r ));
					window.location.reload();
				});
			}
		});
	}
	stop() {}
}
 
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
	const plugin = (Plugin, Api) => {
	const { Patcher } = window.BdApi;
	const { DiscordModules, WebpackModules, Toasts } = Api;
	const RelationshipStore = DiscordModules.RelationshipStore;
	const PresenceStore = WebpackModules.getByProps("getStatus", "isMobileOnline");
	const Dispatcher = DiscordModules.Dispatcher;

	return class OnlineFriendCounter extends Plugin {
		constructor() {
			super();
		}

		onStart() {
			if (this.settings.showToasts) Toasts.success(`${config.info.name} v${config.info.version} has started!`)

			BdApi.injectCSS("onlineFriendCounter",`
				.friendCounterLabel {
					margin-bottom: 8px;
					font-weight: 500;
					font-size: 10px;
					text-align: center;
					width: 72px;
					color: var(--channels-default);
				}
			`);

			this.createLabel()

			Patcher.after(this.name, Dispatcher, "dispatch", (_this, [props], ret) => {
				if (props.type === "PRESENCE_UPDATES") {
					this.updateOnlineCount()
				}
			});
		}
		
		onStop() {
			if (this.settings.showToasts) Toasts.error(`${config.info.name} v${config.info.version} has stopped!`)

			Patcher.unpatchAll(this.name)
			BdApi.clearCSS("onlineFriendCounter");
			var counter = document.querySelector(`.friendCounterLabel`);
			if (counter != null) counter.remove();
		}

		updateOnlineCount() {
			if (document.querySelector(`.friendCounterLabel`) == null) return this.createLabel();
			var counter = document.querySelector(`.friendCounterLabel`);
			counter.innerHTML = `${this.getOnlineCount()} ONLINE`;
		}

		createLabel() {
			// Check if theres already a counter for some reason
			if (document.querySelector(`.friendCounterLabel`) != null) return;
			if (document.querySelector(`ul[data-list-id="guildsnav"] > .scroller-3X7KbA.none-1rXy4P.scrollerBase-1Pkza4`) == null) return;
			var homeButton = document.querySelector(`.tutorialContainer-1pL9QS`);
			var counter = document.createElement('div');
			counter.classList.add("friendCounterLabel")
			counter.innerHTML = `${this.getOnlineCount()} ONLINE`
			homeButton.lastElementChild.parentNode.insertBefore(counter, homeButton.lastElementChild.nextSibling)
		}

		getOnlineCount() {
			var online = 0;
			var friends = RelationshipStore.getFriendIDs();
			for (var i = 0; i < friends.length; i++) {
				if (PresenceStore.getStatus(friends[i]) != "offline") online++;
			}
			return online;
		}

		getSettingsPanel() {
			const panel = this.buildSettingsPanel();
			return panel.getElement();
		}
	};
};
	 return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/