import * as Player from "../player.js";
import { applyHudOverlay } from "./hud-overlay.js";

const defaultWidth = 0.18;						// Total width of the item texture
const defaultHight = 0.18;						// Total height of the item texture

const defaultPositionX = -0.4;					// Default X position of the first slot texture
const defaultPositionY = 0;					    // Default Y position of the slot texture
const defaultPositionZ = 0;				        // Default Z position of the slot texture

const slotSpacingX = 0.2;						// Horizontal spacing between slots

const maxHotbarSlots = 5;						// Maximum number of hotbar slots

let currentHotbarSlot = 0;					    // Currently selected hotbar item (0-4)

const defaultSelectorPositionX = -0.395;        // Default X position of the selector relative to the first slot

const selectorSpacingX = 0.1975                 // Horizontal spacing between slots for the selector
const slotSwitchCooldownMs = 250;              // Cooldown for joystick slot switching
let lastSlotSwitchAt = 0;


AFRAME.registerComponent('hud-hotbar-slot', {
	schema: {
		num: {type: 'int', default: 0}
	},
	init: function () {
		this.el.setAttribute("hud-overlay", "renderOrder: 101");
		this.el.setAttribute("width", defaultWidth);
		this.el.setAttribute("height", defaultHight);
		this.el.setAttribute("repeat", "1 1");
		this.el.setAttribute("position", `${defaultPositionX + (this.data.num * slotSpacingX)} ${defaultPositionY} ${defaultPositionZ}`);
	}
});

AFRAME.registerComponent('controller-input', {
    init: function () {
        const controller = this.el;
        
        controller.addEventListener('buttondown', (event) => {
            useCurrentHotbarItem();
        });

        controller.addEventListener('axismove', (event) => {
              const axes = event.detail.axis;   // Array mit Stick-Werten
              const x = axes[2] ?? axes[0];     // je nach Controller-Mapping
              const y = axes[3] ?? axes[1];

              const deadzone = 0.35;
              if (Math.abs(x) < deadzone && Math.abs(y) < deadzone) return;

              const now = Date.now();
              if (now - lastSlotSwitchAt < slotSwitchCooldownMs) return;

              if (x > 0 && currentHotbarSlot < maxHotbarSlots - 1) {
                  setCurrentHotbarSlot(currentHotbarSlot + 1);
                  lastSlotSwitchAt = now;
              } else if (x < 0 && currentHotbarSlot > 0) {
                  setCurrentHotbarSlot(currentHotbarSlot - 1);
                  lastSlotSwitchAt = now;
              }
        });
    }
});

export function useCurrentHotbarItem() {
    console.log(`Benutze Hotbar-Item ${currentHotbarSlot}`);

    const hotbarSlot = document.getElementById(`hotbar-slot${currentHotbarSlot}`);
    const hotbarSlotSrc = hotbarSlot.getAttribute("src");

    if (hotbarSlotSrc === "#empty") {
        console.log("Kein Item in diesem Slot!");
        return;
    }

    let itemCategory = "";
    let itemStrength = 0;

    switch (hotbarSlotSrc) {

        // Health items
        case "#bandages":
            Player.setHealth(Player.getHealth() + 20);
            break;
        case "#medic-kit":
            Player.setHealth(Player.getHealth() + 50);
            break;

        // Experience items
        case "#scroll":
            Player.setExperience(Player.getExperience() + 20);
            break;
        case "#book":
            Player.setExperience(Player.getExperience() + 50);
            break;

        // Energy items
        case "#apple":
            Player.setEnergy(Player.getEnergy() + 20);
            break;
        case "#bread":
            Player.setEnergy(Player.getEnergy() + 50);
            break;

        default:
            console.log("Kann dieses Item nicht benutzen!");
    }

    hotbarSlot.setAttribute("src", "#empty");
    requestAnimationFrame(() => applyHudOverlay(hotbarSlot, 101));
}

export function addItemToHotbar(itemSrc) {

    for (let i = 0; i < maxHotbarSlots; i++) {
        const hotbarSlot = document.getElementById(`hotbar-slot${i}`);
        if (hotbarSlot.getAttribute("src") === "#empty") {
            hotbarSlot.setAttribute("src", itemSrc);
            requestAnimationFrame(() => applyHudOverlay(hotbarSlot, 101));
            return;
        }
    }

    // Hotbar is full, replace the currently selected item
    const hotbarSlot = document.getElementById(`hotbar-slot${currentHotbarSlot}`);
    hotbarSlot.setAttribute("src", itemSrc);
    requestAnimationFrame(() => applyHudOverlay(hotbarSlot, 101));
}

export function updateHotbarSelector() {
    const selector = document.getElementById("hotbar-selector");
    const newPositionX = defaultSelectorPositionX + selectorSpacingX * currentHotbarSlot
    selector.setAttribute("position", `${newPositionX} 0 0`);
    requestAnimationFrame(() => applyHudOverlay(selector, 101));
}

export function setCurrentHotbarSlot(slotNum) {
    if (slotNum < 0 || slotNum >= maxHotbarSlots) {
        console.error("Ungültige Slot-Nummer!");
        return;
    }
    currentHotbarSlot = slotNum;
    updateHotbarSelector();
}

export function getCurrentHotbarSlot() {
    return currentHotbarSlot;
}