import { addItemToHotbar } from "./hud/hud-hotbar.js";

const MAX_LOOTBOXES = 5;    // Maximum number of lootboxes allowed in the scene at any time
const MIN_LOOTBOXES = 0;    // Minimum number of lootboxes to maintain in the scene
const SPAWN_CHANCE = 1;  // Chance to spawn a lootbox each tick (0.01 -> 1%)

const COOLDOWN_TIME = 30; // Cooldown time in seconds before a broken lootbox can respawn

let currentActiveLootboxes = 0;

// Export getter function so external code can read the current value
export function getActiveLootboxCount() {
    return currentActiveLootboxes;
}

AFRAME.registerComponent('lootbox', {
	schema: {
		num: {type: 'int', default: 0}
	},
	init: function () {
		this.el.setAttribute("src", "#lootbox-model");
		this.el.setAttribute("scale", "0.4 0.4 0.4");
        this.el.setAttribute("visible", "false");
        this.isSpawned = false;  // Track if this lootbox has been spawned
        this.cooldownEndTime = 0; // Timestamp (in ms) when cooldown ends
	},
    tick: function () {
        // Skip if already spawned
        if (this.isSpawned) return;

        // Don't spawn more if we already have the max
        if (currentActiveLootboxes >= MAX_LOOTBOXES) return;

        // Check if we're still in cooldown
        const currentTime = Date.now();
        if (currentTime < this.cooldownEndTime) return

        if(Math.random() < SPAWN_CHANCE || currentActiveLootboxes < MIN_LOOTBOXES) {
            this.el.setAttribute("visible", "true");
            this.isSpawned = true;
            currentActiveLootboxes++;

            this.el.addEventListener('obbcollisionstarted', (event) => {
                const collidedWithWeapon = event.detail.withEl.getAttribute("id") === "weapon";              
                breakLootbox(this.el.getAttribute("id"), collidedWithWeapon);
            });
        }
    }
});

export function breakLootbox(lootboxId, collidedWithWeapon) {
    const lootbox = document.getElementById(lootboxId);

    if(!lootbox.components.lootbox.isSpawned) return;    // Only break if the lootbox is currently spawned

    if (!collidedWithWeapon) return;    // Only break if collided with weapon

    if (!lootbox) {                     // Sanity check
        console.warn("Lootbox not found:", lootboxId);
        return;
    }

    lootbox.setAttribute("visible", "false");
    
    // Reset the component state so it can respawn later after cooldown
    if (lootbox.components.lootbox) {
        lootbox.components.lootbox.isSpawned = false;
        // Set cooldown end time to current time + cooldown duration (in milliseconds)
        lootbox.components.lootbox.cooldownEndTime = Date.now() + (COOLDOWN_TIME * 1000);
    }
    
    currentActiveLootboxes--;

    addItemToHotbar(getRandomLootSrc());
}

export function getRandomLootSrc() {
    const lootOptions = {
        "health-normal": "#bandages",
        "health-strong": "#medic-kit",
        "experience-normal": "#scroll",
        "experience-strong": "#book",
        "energy-normal": "#apple",
        "energy-strong": "#bread"
    };

    // Separate random numbers for type and strength
    const typeRand = Math.random();
    const strengthRand = Math.random();

    // Determine type based on cumulative probabilities
    let type;
    if (typeRand < 0.33) type = "health";
    else if (typeRand < 0.66) type = "experience";
    else type = "energy";

    // Determine strength based on cumulative probabilities
    let strength;
    if (strengthRand < 0.80) strength = "normal";
    else strength = "strong";

    console.log(`Generated loot type: ${type}, strength: ${strength}`);

    const lootKey = `${type}-${strength}`;
    return lootOptions[lootKey] || "#apple"; // Fallback in case of error
}