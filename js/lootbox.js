import { addItemToHotbar } from "./hud/hud-hotbar.js";
import { sendMessageToAll, getAllPlayerIds, getLocalPlayerId, sendMessageToPlayer } from "./network.js";

const MAX_LOOTBOXES = 10;    // Maximum number of lootboxes allowed in the scene at any time
const MIN_LOOTBOXES = 3;    // Minimum number of lootboxes to maintain in the scene
const SPAWN_CHANCE = 1;  // Chance to spawn a lootbox each tick (0.01 -> 1%)

const COOLDOWN_TIME = 30; // Cooldown time in seconds before a broken lootbox can respawn
const AFTER_JOIN_DELAY = 5; // Time in seconds after a player joins during which he will spawn no lootboxes, to give wait for NAF

const COLLISION_BOX_SIZE = { width: 1, height: 0.8, depth: 1 }; // Size of the collision box for lootboxes

let currentActiveLootboxes = 0;
let playerJoinTime = Date.now();

// Export getter function so external code can read the current value
export function getActiveLootboxCount() {
    return currentActiveLootboxes;
}

function getLeadSpawnerId() {
    const playerIds = getAllPlayerIds().sort(); // Sortiere IDs, damit immer derselbe Client der "Lead Spawner" ist
    return playerIds[0];
}

// Hilfsfunktion: Prüft ob dieser Client der "Lead Spawner" ist
function isLeadSpawner() {
    const leadId = getLeadSpawnerId();
    const localId = getLocalPlayerId();
    return leadId && localId && leadId === localId;
}

AFRAME.registerComponent('lootbox', {
	schema: {
		num: {type: 'int', default: 0}
	},
	init: function () {
		//this.el.setAttribute("src", "#lootbox-model");
		this.el.setAttribute("scale", "0.5 0.5 0.5");
        this.el.setAttribute("visible", "false");
        this.el.setAttribute("class", "lootbox");
        this.isSpawned = false;  // Track if this lootbox has been spawned
        this.cooldownEndTime = 0; // Timestamp (in ms) when cooldown ends
	},
    tick: function () {

        // Nur Spawnen wenn NAF schon eine Weile läuft, damit die Clients Zeit haben sich zu synchronisieren. Ansonsten könnte es passieren, dass alle Spieler gleichzeitig Lootboxes spawnen, wenn sie dem Spiel beitreten.
        if (Date.now() - playerJoinTime < AFTER_JOIN_DELAY * 1000) return;
        
        // Nur der "Lead Spawner" (erster Client in der sortierten Liste) spawnt Lootboxes
        // Wenn dieser Client disconnected, übernimmt automatisch der nächste
        if (!isLeadSpawner()) return;
        
        // Skip if already spawned
        if (this.isSpawned) return;

        // Don't spawn more if we already have the max
        if (currentActiveLootboxes >= MAX_LOOTBOXES) return;

        // Check if we're still in cooldown
        const currentTime = Date.now();
        if (currentTime < this.cooldownEndTime) {
            if (!this.loggedCooldown) {
                const remainingSeconds = Math.ceil((this.cooldownEndTime - currentTime) / 1000);
                this.loggedCooldown = true;
            }
            return;
        }
        this.loggedCooldown = false;

        if(Math.random() < SPAWN_CHANCE || currentActiveLootboxes < MIN_LOOTBOXES) {           
            handleLootboxSpawn(this.el.getAttribute("id"));
            sendMessageToAll("lootbox-spawn", this.el.getAttribute("id")); // Informiere alle anderen Clients über den Spawn der Lootbox
        }
    }
});

export function requestLootboxStatus() {

    // Diese Funktion wird von neuen Clients aufgerufen, um den aktuellen Status der Lootboxes zu erfragen.
    // Die bestehenden Clients werden daraufhin direkt mit Nachrichten des Typs "lootbox-spawn" antworten, um den neuen Client über alle aktuell gespawnten Lootboxes zu informieren.

    setTimeout(() => {
        let leadId = getLeadSpawnerId();
        const playerIds = getAllPlayerIds().sort();

        if(playerIds.length === 1) return; // Wenn nur ein Spieler da ist, brauchen wir keine Statusanfrage senden, da wir ja selbst der Lead Spawner sind und den Status kennen
        if(isLeadSpawner()) leadId = playerIds[1]; // Wenn wir der Lead Spawner sind, sende die Anfrage an den nächsten Spieler in der Liste, damit nicht alle Clients gleichzeitig die Anfrage an den Lead Spawner senden und dieser dadurch überlastet wird

        sendMessageToPlayer(leadId, "lootbox-status-request", getLocalPlayerId());
    }, (AFTER_JOIN_DELAY - 2) * 1000); // Warte ein paar Sekunden nach dem Join, bevor du die Anfrage sendest, damit NAF genug Zeit hat, die Verbindung herzustellen
}

export function handleLootboxStatusRequest(requesterId) {
    const lootboxes = document.querySelectorAll('.lootbox');

    lootboxes.forEach(lootbox => {
        if (lootbox.components.lootbox.isSpawned) {
            // Informiere den anfragenden Client über den aktuellen Status der Lootbox
            sendMessageToPlayer(requesterId, "lootbox-spawn", lootbox.getAttribute("id"));
        }
    });
}

export function handleLootboxSpawn(lootboxId) {
    const lootbox = document.getElementById(lootboxId);
    if (!lootbox) {                     // Sanity check
        console.warn("Lootbox not found:", lootboxId);
        return;
    }

    lootbox.setAttribute("visible", "true");
    lootbox.setAttribute("collision-box", `${COLLISION_BOX_SIZE.width} ${COLLISION_BOX_SIZE.height} ${COLLISION_BOX_SIZE.depth}`);
    lootbox.components.lootbox.isSpawned = true;
    currentActiveLootboxes++;

    // Hit-Detection für Lootboxen wird über weapon-hit in hit-system.js gesteuert.
}

export function handleLootboxBreak(lootboxId){

    const lootbox = document.getElementById(lootboxId);
    if (!lootbox) {                     // Sanity check
        console.warn("Lootbox not found:", lootboxId);
        return;
    }

    lootbox.setAttribute("visible", "false");
    lootbox.removeAttribute("collision-box");
    lootbox.components.lootbox.cooldownEndTime = Date.now() + (COOLDOWN_TIME * 1000);
    lootbox.components.lootbox.isSpawned = false;
    currentActiveLootboxes--;
}

export function breakLootbox(lootboxId) {
    const lootbox = document.getElementById(lootboxId);

    console.log(`Breaking lootbox: ${lootboxId}, isSpawned: ${lootbox.components.lootbox.isSpawned}, cooldownEndTime: ${lootbox.components.lootbox.cooldownEndTime}, currentTime: ${Date.now()}`);

    if(!lootbox.components.lootbox.isSpawned) {
        return;
    }

    if (!lootbox) {
        console.warn(`❌ Lootbox not found: ${lootboxId}`);
        return;
    }

    handleLootboxBreak(lootboxId);
    sendMessageToAll("lootbox-break", lootboxId); // Informiere alle anderen Clients über den Abbau der Lootbox
    addItemToHotbar(getRandomLootSrc());
}

function getRandomLootSrc() {
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