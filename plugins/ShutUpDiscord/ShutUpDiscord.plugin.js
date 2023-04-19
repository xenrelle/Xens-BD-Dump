/**
 * @name ShutUpDiscord!
 * @author xenona
 * @authorId 621137770697457674
 * @description Highly-customizable plugin that hides certain (possibly annoying) elements from Discord. **Requires ZeresPluginLibrary.**
 * @version 1.0.0
 * @source https://github.com/xenrelle/Xens-BD-Dump/tree/main/plugins/ShutUpDiscord
 * @updateUrl https://raw.githubusercontent.com/xenrelle/Xens-BD-Dump/main/plugins/ShutUpDiscord/ShutUpDiscord.plugin.js
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
		name: "ShutUpDiscord!",
		version: "1.0.0",
		authors: [{
			name: "xenona",
			discord_id: "621137770697457674",
			github_username: "xenrelle"
		}],
		description: "Highly-customizable plugin that hides certain (possibly annoying) elements from Discord. **Requires ZeresPluginLibrary.**"
	},
	changelog: [
		{
			title: "Initial Release",
			type: "added",
			items: [
				"This is the first release of this plugin."
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
		},
		{
			type: 'category',
			name: 'Users',
			id: 'users',
			settings: [
				{
					type: 'switch',
					id: 'avatarDecoration',
					name: "Hide Avatar Decorations",
					note: "Hides users' avatar decorations from their avatar.",
					value: true
				},
				{
					type: 'switch',
					id: 'memberSince',
					name: "Hide 'Member Since' Section",
					note: "Hides the date the user has joined both Discord and the server.",
					value: false
				}
			]
		},
		{
			type: 'category',
			name: 'Text Chat',
			id: 'messages',
			settings: [
				{
					type: 'switch',
					id: 'welcomeSticker',
					name: "Hide 'Wave to say hi' Stickers",
					note: "Hides the welcome sticker button.",
					value: true
				}
			]
		},
		{
			type: 'category',
			name: 'Voice Chat',
			id: 'voice',
			settings: [
				{
					type: 'switch',
					id: 'activityButton',
					name: 'Hide Activity Buttons',
					note: "Hides the activity buttons, but doesn't hide the actual activities.",
					value: false
				},
				{
					type: 'switch',
					id: 'emojiReact',
					name: 'Hide In-VC Reactions',
					note: 'Hides the in-voice emoji reactions.',
					value: true
				},
				{
					type: 'switch',
					id: 'soundboard',
					name: 'Hide Soundboard',
					note: 'Hides the soundboard effects and the buttons.',
					value: false
				},
				{
					type: 'switch',
					id: 'consoleVC',
					name: 'Hide Transfer to Console',
					note: 'Hides the options to transfer voice chat to console.',
					value: false
				}
			]
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
	const { ContextMenu, DOM, Patcher, UI } = window.BdApi;
	const { DiscordModules, WebpackModules, Toasts } = Api;

	// Replace ShutUpDiscord with your plugin name.
	return class ShutUpDiscord extends Plugin {
		constructor() {
			super();
			this.styles = [];
			/* USERS */
			this.avatarDecorationStyle = `.avatarDecoration-2Wb1Au, .avatarDecoration-34OC0G, .bannerSVGWrapper-2CLfzN > mask > image { display: none; } .avatarDecorationHint-3n-p6O { top: 0px; left: 0px; width: 80px !important; height: 80px !important; border-radius: 100% !important; } .avatarDecorationHint-3n-p6O > foreignObject[mask="url(#svg-mask-avatar-decoration-profile-status-square-80)"] { mask: url(#svg-mask-avatar-status-round-80); } .avatarDecorationHint-3n-p6O > foreignObject[mask="url(#svg-mask-avatar-decoration-profile-status-mobile-square-80)"] { mask: url(#svg-mask-avatar-status-mobile-80); } .avatarDecorationHint-3n-p6O .avatarHintInner-2HUAWj { font-size: 12px; }`;
			this.memberSinceStyle = `.section-28YDOf:has(.memberSinceContainer-2CBD23) { display: none; }`;
			/* MESSAGES */
			this.welcomeStickerStyle = `.welcomeCTA-3GMMRK { display: none; }`;
			/* VOICE */
			this.activityButtonStyle = `.actionButtons-2vEOUh > button:nth-child(3), .wrapper-3t3Yqv > .buttonContainer-1sjtPU { display: none; }`;
			this.emojiReactStyle = `.voiceChannelEffectsContainer-1cDkyc, .layerContainer-2lfOPe > .container-3q3CS_, .border-2Vy6FN.voiceChannelEffect-1J1MWE, .voiceEffectsActionBar-EX-WFC > div:nth-child(2) { display: none; }`;
			this.soundboardStyle = `.actionButtons-2vEOUh > div, .voiceEffectsActionBar-EX-WFC > div:first-child, div[id*="popout"]:has(.educationFeatureArt-PcA8gX) { display: none; }`;
			this.consoleVCStyle = `.bottomControls-31YuPK.controlSection-1mNixL > .justifyStart-2Mwniq > div:not([class]), .menu-2TXYjN#channel-context div[role="menuitem"][id*="channel-context-transfer"] { display: none; }`;

			this.actionButtonLabelsStyle = `.actionButtons-2vEOUh > button:nth-child(1):not(:has(.withText-2iJppd)) > div { margin: 0 8px 0 0; } .actionButtons-2vEOUh > button:nth-child(1):not(:has(.withText-2iJppd))::after { font-size: 14px; content: "Video"; } .actionButtons-2vEOUh > button:nth-child(2):not(:has(.withText-2iJppd)) > div { margin: 0 8px 0 0; } .actionButtons-2vEOUh > button:nth-child(2):not(:has(.withText-2iJppd))::after { font-size: 14px; content: "Screen"; }`;
		}

		onStart() {
			if (this.settings.showToasts) Toasts.success(`${config.info.name} v${config.info.version} has started!`);
			this.updateStyles();
		}
		
		onStop() {
			if (this.settings.showToasts) Toasts.error(`${config.info.name} v${config.info.version} has stopped!`);
			Patcher.unpatchAll(this.name);
		}

		updateStyles() {
			for (var style of this.styles) {
				BdApi.clearCSS(style);
			}

			/* USERS */
			if (this.settings.users.avatarDecoration) this.addStyle(`avatarDecoration`, this.avatarDecorationStyle)
			if (this.settings.users.memberSince) this.addStyle(`memberSince`, this.memberSinceStyle)

			/* MESSAGES */
			if (this.settings.messages.welcomeSticker) this.addStyle(`welcomeSticker`, this.welcomeStickerStyle)

			/* VOICE */
			if (this.settings.voice.activityButton) this.addStyle(`activityButton`, this.activityButtonStyle);
			if (this.settings.voice.emojiReact) this.addStyle(`emojiReact`, this.emojiReactStyle);
			if (this.settings.voice.soundboard) this.addStyle(`soundboard`, this.soundboardStyle);
			if (this.settings.voice.consoleVC) this.addStyle(`consoleVC`, this.consoleVCStyle);

			if (this.settings.voice.activityButton && this.settings.voice.soundboard) this.addStyle(`actionButtonLabels`, this.actionButtonLabelsStyle)
			if (this.settings.voice.consoleVC || (!this.settings.voice.consoleVC && this.settings.voice.emojiReact && this.settings.voice.soundboard)) this.addStyle(`noVCControlSeparator`, `.bottomControls-31YuPK.controlSection-1mNixL .leftDivider-1HpX9I { display: none; }`);
		}

		addStyle(key, style) {
			this.styles.push(`shutUpDiscord-${key}`);
			BdApi.injectCSS(`shutUpDiscord-${key}`, style);
		}

		getSettingsPanel() {
			const panel = this.buildSettingsPanel();
			panel.addListener(() => {
				this.updateStyles();
			});
			return panel.getElement();
		}
	};
};
	 return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/