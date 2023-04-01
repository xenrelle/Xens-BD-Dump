/**
 * @name AtSomeone
 * @author xenona
 * @authorId 621137770697457674
 * @description You can now @someone to randomly select somebody ａｔ ｒａｎｄｏｍ. **Requires ZeresPluginLibrary.**
 * @version 23.4.1
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
		name: "AtSomeone",
		version: "23.4.1",
		authors: [{
			name: "xenona",
			discord_id: "621137770697457674",
			github_username: "xenrelle"
		}],
		description: "You can now @someone to randomly select somebody ａｔ ｒａｎｄｏｍ. **Requires ZeresPluginLibrary.**"
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
	const { DiscordModules, WebpackModules, Toasts } = Api;
	const MessageContent = WebpackModules.getModule((m) => m.type?.displayName === "MessageContent");
	const ChannelStore = WebpackModules.getByProps('getChannel', 'getDMFromUserId');
	const GuildMemberStore = DiscordModules.GuildMemberStore
	const UserStore = DiscordModules.UserStore

	return class AtSomeone extends Plugin {
		constructor() {
			super();
			this.funnyGoofySillyFaces = [`（✿ ͡◕ ᴗ◕)つ━━✫・o。`, `(◕‿◕✿)`, `¯\\\\(°_o)/¯`, `ಠ_ಠ`, `(∩ ͡° ͜ʖ ͡°)⊃━☆ﾟ. o ･ ｡ﾟ`, `(∩ ͡° ͜ʖ ͡°)⊃━✿✿✿✿✿✿`, `༼ つ ◕_◕ ༽つ`, `¯\\_(ツ)_/¯`, `(⁄ ⁄•⁄ω⁄•⁄ ⁄)`, `(╯°□°）╯︵ ┻━┻`]
			this.observer = null;
			this.getGuild = WebpackModules.getByProps('getGuild', 'getGuildCount').getGuild
		}

		onStart() {
			if (this.settings.showToasts) Toasts.success(`${config.info.name} v${config.info.version} has started!`)

			BdApi.injectCSS("atSomeoneStyle", ".atSomeone-mention { background: linear-gradient(90deg, rgba(0,0,255,0.2) 0%, rgba(0,255,0,0.2) 33%, rgba(255,255,0,0.2) 67%, rgba(255,0,0,0.2) 100%); background-origin: content-box; background-repeat: no-repeat; }")
			Patcher.before(this.name, DiscordModules.MessageActions, "sendMessage", (_, [, msg]) => {
				msg.content = this.parseSomeone(msg.content);
			});
			this.observer = new MutationObserver(mutations => {
				var messages = document.querySelectorAll(".messageContent-2t3eCI:not(.atSomeoneParsed)");
				for (var message of messages) {
					if (message.innerHTML.includes("@someone")) {
						var parsed = message.innerHTML.replaceAll("@someone", `<span class="mention wrapper-1ZcZW-">@someone</span>`)
						message.innerHTML = parsed;
						message.classList.add("atSomeone-mention")
					}
					message.classList.add("atSomeoneParsed");
				}
			});
			this.observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		}
		
		onStop() {
			if (this.settings.showToasts) Toasts.error(`${config.info.name} v${config.info.version} has stopped!`)

			Patcher.unpatchAll(this.name);
			BdApi.clearCSS("atSomeoneStyle");
			this.observer.disconnect();
			this.observer = null;
		}

		parseSomeone(str) {
			if (str.split(" ").indexOf("@someone") !== -1) {
				var randomFace = this.funnyGoofySillyFaces[Math.floor(Math.random() * this.funnyGoofySillyFaces.length)];
				var randomUser = this.getRandomUsername()
				str = str.replace("@someone", `**@someone** ${randomFace} ***(${randomUser})*** `);
			}
			return str.trim();
		}

		getRandomUsername() {
			var selectedName = "";
			const myID = UserStore.getCurrentUser().id;
			const channel = ChannelStore.getChannel(DiscordModules.SelectedChannelStore.getChannelId());
			if (channel.guild_id == null) { // Not a guild, could be a DM or Group DM
				var members = channel.recipients;
				members.push(myID);
				var selectedMember = members[Math.floor(Math.random() * members.length)]
				selectedName = UserStore.getUser(selectedMember).username;
			} else { // Guild Channel
				var members = GuildMemberStore.getMembers(channel.guild_id);
				var selectedMember = members[Math.floor(Math.random() * members.length)]
				if (selectedMember.nick == null) {
					selectedName = UserStore.getUser(selectedMember.userId).username
				} else {
					selectedName = selectedMember.nick;
				}
			}
			return selectedName;
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