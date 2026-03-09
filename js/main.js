import "./hud/hud-overlay.js";
import * as Player from "./player.js";
import * as HotBar from "./hud/hud-hotbar.js";
import { updateHudBars } from "./hud/hud-bars.js";
import "./physics.js";
import * as LootBox from "./lootbox.js";
import "./movemtn.js";
import * as Network from "./network.js";
import "./hit-system.js"

const scene = document.querySelector('a-scene');

// Global initialization for inline html scripts
window.getHealth = Player.getHealth;
window.setHealth = Player.setHealth;
window.getExperience = Player.getExperience;
window.setExperience = Player.setExperience;
window.getEnergy = Player.getEnergy;
window.setEnergy = Player.setEnergy;

window.useCurrentHotbarItem = HotBar.useCurrentHotbarItem;
window.addItemToHotbar = HotBar.addItemToHotbar;
window.setCurrentHotbarSlot = HotBar.setCurrentHotbarSlot;

window.breakLootbox = LootBox.breakLootbox;
window.getActiveLootboxCount = LootBox.getActiveLootboxCount;

window.getAllPlayerIds = Network.getAllPlayerIds;
window.getLocalPlayerId = Network.getLocalPlayerId;
window.getOwningPlayerId = Network.getOwningPlayerId;
window.getPlayerById = Network.getPlayerById;

window.sendMessageToPlayer = Network.sendMessageToPlayer;
window.sendMessageToAll = Network.sendMessageToAll;

// Set networked-scene BEFORE scene initialization
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const lobby = urlParams.get('lobby') || 'default';

scene.setAttribute('networked-scene', `room: ${lobby}; adapter: socketio; serverURL: /;`);	

// Initialize NAF when NAF is ready
scene.addEventListener('adapter-ready', () => {
	console.log('NAF adapter ready, registering schemas...');
	Player.registerPlayerSchema();
	
	// Wait for socket to be available
	const checkSocket = setInterval(() => {
		if (NAF.connection?.adapter?.socket) {
			clearInterval(checkSocket);
			console.log('Socket is ready, setting up network listeners...');
			Network.setupNetworkListeners();
		}
	}, 100);
});

// Request current lootbox status from other clients, to update the lootbox states for the new client
LootBox.requestLootboxStatus();

scene.addEventListener('loaded', () => {

	// Initialize HUD after scene is loaded
	updateHudBars();
	HotBar.updateHotbarSelector();
});