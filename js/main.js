import "./hud/hud-overlay.js";
import * as Player from "./player.js";
import * as HotBar from "./hud/hud-hotbar.js";
import { updateHudBars } from "./hud/hud-bars.js";
import "./physics.js";
import * as LootBox from "./lootbox.js";
import "./movemtn.js";
import * as Network from "./network.js";

// Global initialization for inline html scripts
window.updateHudBars = updateHudBars;
window.getHealth = Player.getHealth;
window.setHealth = Player.setHealth;
window.getExperience = Player.getExperience;
window.setExperience = Player.setExperience;
window.getEnergy = Player.getEnergy;
window.setEnergy = Player.setEnergy;

window.useCurrentHotbarItem = HotBar.useCurrentHotbarItem;
window.addItemToHotbar = HotBar.addItemToHotbar;
window.setCurrentHotbarSlot = HotBar.setCurrentHotbarSlot;
window.getCurrentHotbarSlot = HotBar.getCurrentHotbarSlot;
window.updateHotbarSelector = HotBar.updateHotbarSelector;

window.getRandomLootSrc = LootBox.getRandomLootSrc;
window.breakLootbox = LootBox.breakLootbox;
window.getActiveLootboxCount = LootBox.getActiveLootboxCount;

window.getAllPlayerIds = Network.getAllPlayerIds;
window.getLocalPlayerId = Network.getLocalPlayerId;
window.getOwningPlayerId = Network.getOwningPlayerId;
window.getPlayerById = Network.getPlayerById;

window.onExperienced = Player.onExprienced;
window.onExhausted = Player.onExhausted;

// Initialize HUD after scene is loaded
const scene = document.querySelector('a-scene');
if (scene.hasLoaded) {
	updateHudBars();
	window.updateHotbarSelector();
} else {
	scene.addEventListener('loaded', () => {
		updateHudBars();
		window.updateHotbarSelector();
	});
}