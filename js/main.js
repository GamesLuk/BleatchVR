import "./hud/hud-overlay.js";
import * as Player from "./player.js";
import * as HotBar from "./hud/hud-hotbar.js";
import { updateHudBars } from "./hud/hud-bars.js";
import "./physics.js";
import * as LootBox from "./lootbox.js";

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