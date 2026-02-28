import { updateHudBars } from './hud/hud-bars.js';

let health = 100;
let experience = 100;
let energy = 100;

export function getHealth(value) {
	return health;
}

export function setHealth(value) {
	health = Math.max(0, Math.min(100, value));	// Clamp value between 0 and 100
	updateHudBars();
}

export function getExperience(value) {
	return experience;
}

export function setExperience(value) {
	experience = Math.max(0, Math.min(100, value));	// Clamp value between 0 and 100
	updateHudBars();
}

export function getEnergy(value) {
	return energy;
}

export function setEnergy(value) {
	energy = Math.max(0, Math.min(100, value));	// Clamp value between 0 and 100
	updateHudBars();
}
