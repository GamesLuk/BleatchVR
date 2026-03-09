import { updateHudBars } from './hud/hud-bars.js';
import { getLocalPlayerId, getPlayerById } from './network.js';

// Helper function for async delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const INIT_HEALTH = 100;
const INIT_EXPERIENCE = 0;
const INIT_ENERGY = 100;
const INIT_SPEED = 5;

const EXPERIENCE_SPEED_BOOST = 10; 	// Speed boost when player is experienced
const EXPERIENCE_DURATION = 10; 	// Duration of experience boost in seconds
const EXPERIENCE_INTERVAL = EXPERIENCE_DURATION/100; 		// Interval for experience boost ticks in seconds

const EXHAUSTED_SPEED_BOOST = -4; 	// Speed boost when player is exhausted
const EXHAUSTED_DURATION = 10; 		// Duration of exhausted state in seconds
const EXHAUSTED_INTERVAL = EXHAUSTED_DURATION/100; 		// Interval for exhausted state ticks in seconds

// Component for player stats synchronization
AFRAME.registerComponent('player-stats', {
  schema: {
    health: { type: 'number', default: INIT_HEALTH },
	experience: { type: 'number', default: INIT_EXPERIENCE },
    energy: { type: 'number', default: INIT_ENERGY },
	onCooldown: { type: 'boolean', default: false },
	speed: { type: 'number', default: INIT_SPEED }
  },
  
  init: function() {}
});

// NAF Schema registrieren - wird aufgerufen, wenn NAF bereit ist
export function registerPlayerSchema() {
  NAF.schemas.add({
    template: '#player-template',
    components: [
      'position',
      'rotation',
      {
        component: 'player-stats',
        property: 'health'  // Synchronisiert nur health
      },
      {
        component: 'player-stats',
        property: 'experience'  // Synchronisiert nur experience
      },
      {
        component: 'player-stats', 
        property: 'energy'  // Synchronisiert nur energy
      },
      {
        component: 'player-stats', 
        property: 'onCooldown'  // Synchronisiert nur onCooldown
      },
      {
        component: 'player-stats', 
        property: 'speed'  // Synchronisiert nur speed
      }
    ]
  });
  console.log('Player NAF schema registered successfully');
}

async function onDeath() {
	// Capture the current URL with all parameters
	const currentUrl = window.location.href;
	const returnUrl = encodeURIComponent(currentUrl);
	
	// Navigate to death screen with return URL
	window.location.href = `/files/html/death-menu.html?returnUrl=${returnUrl}&cause=Gefallen im Kampf`;
}

export async function onExprienced() {
	setSpeed(INIT_SPEED + EXPERIENCE_SPEED_BOOST);
	for (let i = 0; i < EXPERIENCE_DURATION/EXPERIENCE_INTERVAL; i++) {
		await sleep(EXPERIENCE_INTERVAL * 1000);
		setExperience(100 - 100 * (i+1) / (EXPERIENCE_DURATION/EXPERIENCE_INTERVAL));
		updateHudBars();
	}
	setSpeed(INIT_SPEED);
}

export async function onExhausted() {
	setOnCooldown(true);
	setSpeed(INIT_SPEED + EXHAUSTED_SPEED_BOOST);
	for (let i = 0; i < EXHAUSTED_DURATION/EXHAUSTED_INTERVAL; i++) {
		await sleep(EXHAUSTED_INTERVAL * 1000);
		setEnergy(100 * (i+1) / (EXHAUSTED_DURATION/EXHAUSTED_INTERVAL));
		updateHudBars();
	}
	setSpeed(INIT_SPEED);
	setOnCooldown(false);
}

export function getHealth(playerId) {
	playerId = playerId || getLocalPlayerId();
	const player = getPlayerById(playerId);
	if (!player) return;
	return player.components['player-stats'].data.health;
}

// Only functional for local player
export function setHealth(value) {
	const player = getPlayerById(getLocalPlayerId());
	if (!player) return;
	player.components['player-stats'].data.health = Math.max(0, Math.min(100, value));	// Clamp value between 0 and 100
	updateHudBars();
	if (player.components['player-stats'].data.health === 0) onDeath();

}

export function getExperience(playerId) {
	playerId = playerId || getLocalPlayerId();
	const player = getPlayerById(playerId);
	if (!player) return;
	return player.components['player-stats'].data.experience;
}

// Only functional for local player
export function setExperience(value) {
	const player = getPlayerById(getLocalPlayerId());
	if (!player) return;
	player.components['player-stats'].data.experience = Math.max(0, Math.min(100, value));	// Clamp value between 0 and 100
	updateHudBars();
	if (player.components['player-stats'].data.experience === 100) onExprienced();
}

export function getEnergy(playerId) {
	playerId = playerId || getLocalPlayerId();
	const player = getPlayerById(playerId);
	if (!player) return;
	return player.components['player-stats'].data.energy;
}

// Only functional for local player
export function setEnergy(value) {
	const player = getPlayerById(getLocalPlayerId());
	if (!player) return;
	player.components['player-stats'].data.energy = Math.max(0, Math.min(100, value));	// Clamp value between 0 and 100
	updateHudBars();
	if (player.components['player-stats'].data.energy === 0) onExhausted();
}

export function isOnCooldown(playerId) {
	playerId = playerId || getLocalPlayerId();
	const player = getPlayerById(playerId);
	if (!player) return false;
	return player.components['player-stats'].data.onCooldown;
}

// Only functional for local player
export function setOnCooldown(value) {
	const player = getPlayerById(getLocalPlayerId());
	if (!player) return;
	player.components['player-stats'].data.onCooldown = value || false;	// Ensure it's always a boolean
}

export function getSpeed(playerId) {
	playerId = playerId || getLocalPlayerId();
	const player = getPlayerById(playerId);
	if (!player) return;
	return player.components['player-stats'].data.speed;
}

// Only functional for local player
export function setSpeed(value) {
	const player = getPlayerById(getLocalPlayerId());
	if (!player) return;
	player.components['player-stats'].data.speed = Math.max(0, value);	// Ensure speed is not negative
}