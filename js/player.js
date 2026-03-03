import { updateHudBars } from './hud/hud-bars.js';

let health = 100;
let experience = 100;
let energy = 100;
let onCooldown = false;

function onExhausted() {

}

function onDeath() {

}

export function getHealth(value) {
	return health;
}

export function setHealth(value) {
	health = Math.max(0, Math.min(100, value));	// Clamp value between 0 and 100
	updateHudBars();

	if (health === 0) onDeath();
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

	if (energy === 0) onExhausted();
}

export function isOnCooldown() {
	return onCooldown;
}

export function setOnCooldown(value) {
	onCooldown = value || false;	// Ensure it's always a boolean
}