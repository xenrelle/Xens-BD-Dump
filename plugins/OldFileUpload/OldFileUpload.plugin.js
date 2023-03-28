/**
 * @name OldFileUpload
 * @author xenona
 * @authorId 621137770697457674
 * @description Reverts the functionality of the (+) button to just file uploads, requiring only one click. **Requires ZeresPluginLibrary.**
 * @version 1.0.0
 * @source https://github.com/xenrelle/Xens-BD-Dump/tree/main/plugins/OldFileUpload
 * @updateUrl https://raw.githubusercontent.com/xenrelle/Xens-BD-Dump/main/plugins/OldFileUpload/OldFileUpload.plugin.js
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
		name: "OldFileUpload",
		version: "1.0.0",
		authors: [{
			name: "xenona",
			discord_id: "621137770697457674",
			github_username: "xenrelle"
		}],
		description: "Reverts the functionality of the (+) button to just file uploads, requiring only one click. **Requires ZeresPluginLibrary.**",
		github: "https://github.com/xenrelle/Xens-BD-Dump/tree/main/plugins/OldFileUpload",
        github_raw: "https://raw.githubusercontent.com/xenrelle/Xens-BD-Dump/main/plugins/OldFileUpload/OldFileUpload.plugin.js"
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
	const { DiscordModules, ReactTools, WebpackModules, Toasts } = Api;
	const Dispatcher = DiscordModules.Dispatcher;

	return class OldFileUpload extends Plugin {
		constructor() {
			super()
			this.originalFunction = null;
		}

		onStart() {
			if (this.settings.showToasts) Toasts.success(`${config.info.name} v${config.info.version} has started!`)

			this.patchButton();
			Patcher.after(this.name, Dispatcher, "dispatch", (_this, [props], ret) => {
				// PS: CHANNEL_SELECT would seem more likely to be the right choice, but that is called before the new button is loaded.
				if (props.type === 'UPDATE_VISIBLE_MESSAGES') { // New Channel selected, re-patch button
					this.patchButton();
				}
			});
		}
		
		onStop() {
			if (this.settings.showToasts) Toasts.error(`${config.info.name} v${config.info.version} has stopped!`);

			Patcher.unpatchAll(this.name);
			this.unpatchButton();
		}

		patchButton() {
			var uploadButton = document.querySelector(`.attachWrapper-3slhXI > button.attachButton-_ACFSu:not(.oldFileUploadPatched)`);
			if (uploadButton == null) return; // No need to replace the button if it isn't there!
			var inst = ReactTools.getReactInstance(uploadButton);
			this.originalFunction = inst.memoizedProps.onClick;
			inst.memoizedProps.onClick = inst.memoizedProps.onDoubleClick;
			uploadButton.classList.add(`oldFileUploadPatched`);
		}

		unpatchButton() {
			var uploadButton = document.querySelector(`.attachWrapper-3slhXI > button.attachButton-_ACFSu.oldFileUploadPatched`);
			if (uploadButton == null) return; // No need to replace the button if it isn't patched!
			var inst = ReactTools.getReactInstance(uploadButton);
			inst.memoizedProps.onClick = this.originalFunction;
			this.originalFunction = null;
			uploadButton.classList.remove(`oldFileUploadPatched`);
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