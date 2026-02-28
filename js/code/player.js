
let health = 100;
let experience = 100;
let energy = 100;

function getHealth(value) {
	return health;
}

function setHealth(value) {
	health = Math.max(0, Math.min(100, value));	// Clamp value between 0 and 100
	updateHudBars();
}

function getExperience(value) {
	return experience;
}

function setExperience(value) {
	experience = Math.max(0, Math.min(100, value));	// Clamp value between 0 and 100
	updateHudBars();
}

function getEnergy(value) {
	return energy;
}

function setEnergy(value) {
	energy = Math.max(0, Math.min(100, value));	// Clamp value between 0 and 100
	updateHudBars();
}
