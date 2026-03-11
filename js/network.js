import { handleLootboxBreak , handleLootboxSpawn, handleLootboxStatusRequest} from "./lootbox.js";
import { handlePlayerDamage } from "./hit-system.js";

const REAPEAT_FAILED_MESSAGES_INTERVAL = 5; // The time in seconds after a failed message will be resent, to avoid message loss due to temporary connection issues

// Send packet to player to inform about updated stats (health, experience, energy)
export function sendMessageToPlayer(targetNetworkId, messageType, data) {
    const socket = NAF.connection.adapter.socket;
    
    if (!socket) {
        console.error('Socket not available. Cannot send message. Trying again in a few seconds...');
        setTimeout(() => sendMessageToPlayer(targetNetworkId, messageType, data), REAPEAT_FAILED_MESSAGES_INTERVAL * 1000);
        return;
    }

    console.log(`Sending message to player ${targetNetworkId}: ${messageType}`, data);
    
    socket.emit("send", {
        to: targetNetworkId,        // Socket-ID des Zielspielers
        type: messageType,          // z.B. "damage", "heal", "chat"
        data: data                  // Ihre Nutzdaten
    });
}

// Im Client (network.js)
export function sendMessageToAll(messageType, data) {
    const socket = NAF.connection.adapter.socket;

    if (!socket) {
        console.error('Socket not available. Cannot send message. Trying again in a few seconds...');
        setTimeout(() => sendMessageToPlayer(targetNetworkId, messageType, data), REAPEAT_FAILED_MESSAGES_INTERVAL * 1000);
        return;
    }

    console.log(`Broadcasting message to all others: ${messageType}`, data);
    
    socket.emit("broadcast", {
        type: messageType,
        data: data
    });
}

export function setupNetworkListeners() {
    const socket = NAF.connection.adapter.socket;

    if (!socket) {
        console.error('Socket not available. Make sure NAF is connected before calling setupNetworkListeners.');
        return;
    }

    // Nachricht empfangen
    socket.on("send", (message) => {
        console.log("Message received:", message);
        
        switch(message.type) {
            case "lootbox-spawn":
                // This direct message is only received by new clients who request the current lootbox status, 
                // so that they can update their lootbox states accordingly. 
                // Existing clients receive lootbox spawn/break events via the broadcast channel, 
                // but new clients need to get the current state of all lootboxes when they join, 
                // which is done via this direct message.
                handleLootboxSpawn(message.data);
                break;
            case "lootbox-status-request":
                // This message is sent by new clients when they join, to request the current lootbox status from existing clients.
                // The existing clients will respond with direct messages of type "lootbox-spawn" for each currently spawned lootbox, 
                // so that the new client can update their lootbox states accordingly.
                handleLootboxStatusRequest(message.data);
                break;
            case "player-damage":
                // Temporär: Schadensnachricht von Angreifer empfangen.
                // Wird ersetzt durch lokale Collision Detection wenn Waffen networked sind.
                handlePlayerDamage(message.data);
                break;
        }
    });

    // Broadcast empfangen
    socket.on("broadcast", (message) => {
        console.log("Broadcast received:", message);
        
        switch(message.type) {
            case "lootbox-break":
                // Called when a lootbox got broken by any client, except the one who broke it 
                // (because that one already handles the break locally)
                handleLootboxBreak(message.data);
                break;
            case "lootbox-spawn":
                // Called when a lootbox got spawned by any client, except the one who spawned it 
                // (because that one already handles the spawn locally)
                handleLootboxSpawn(message.data);
                break;
            case "player-health-update":
                // Called when a player health changed, so that all clients can update the health info of the player, 
                // except the one whose health changed (because that one already handles the update locally)
                break;
        }
    });
}

export function getOwningPlayerId(element) {
    while (element && !element.hasAttribute("networked")) {
        element = element.parentElement;
    }
    return element ? element.getAttribute("networked").owner : null;
}

export function getLocalPlayerId() {
    if (!NAF || !NAF.connection) {
        console.error("NAF connection not available. Retrying getLocalPlayerId in a few seconds...");
        return setTimeout(() => getLocalPlayerId(), 1000);
    }

    const localPlayer = document.querySelector("#local-player");
    return localPlayer ? localPlayer.getAttribute("networked").owner : null;
}

export function getAllPlayerIds() {
    const playerIds = new Set();
    const players = document.querySelectorAll("[networked]");
    for (const player of players) {
        playerIds.add(player.getAttribute("networked").owner);
    }
    return [...playerIds].sort();
}

export function getAllOtherPlayerIds() {
    const allPlayerIds = new Set(getAllPlayerIds());
    allPlayerIds.delete(getLocalPlayerId());
    return [...allPlayerIds].sort();
}

export function getPlayerById(playerId) {
    const players = document.querySelectorAll("[networked]");
    for (const player of players) {
        if (player.getAttribute("networked").owner === playerId) {
            return player;
        }
    }
    return null;
}