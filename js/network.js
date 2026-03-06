import { updateHudBars } from "./hud/hud-bars.js";
import * as Player from "./player.js";

// Placeholder functions for network communication
// Send packet to player to inform about updated stats (health, experience, energy)
export function sendUpdateInfo(playerId) {
    const socket = NAF.connection.adapter.socket;
}

// Received packet from client to check for updates and update the HUD accordingly
export function receiveUpdateInfo() {
    const player = document.querySelector("#local-player");
    if (!player) return;
    updateHudBars();

    if(player.components['player-stats'].data.health === 0) Player.onDeath();
    if(player.components['player-stats'].data.experience === Player.INIT_EXPERIENCE) Player.onExprienced();
    if(player.components['player-stats'].data.energy === 0) Player.onExhausted();
}

export function getOwningPlayerId(element) {
    while (element && !element.hasAttribute("networked")) {
        element = element.parentElement;
    }
    return element ? element.getAttribute("networked").networkId : null;
}

export function getLocalPlayerId() {
    const localPlayer = document.querySelector("#local-player");
    return localPlayer ? localPlayer.getAttribute("networked").networkId : null;
}

export function getAllPlayerIds() {
    const playerIds = [];
    const players = document.querySelectorAll("[networked]");
    for (const player of players) {
        playerIds.push(player.getAttribute("networked").networkId);
    }
    return playerIds.filter(id => id !== getLocalPlayerId());
}

export function getPlayerById(playerId) {
    const players = document.querySelectorAll("[networked]");
    for (const player of players) {
        if (player.getAttribute("networked").networkId === playerId) {
            return player;
        }
    }
    return null;
}