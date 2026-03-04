import * as Player from '../player.js';
import { applyHudOverlay } from './hud-overlay.js';

let defaultWidth = 0.860;						// Total width of the bar texture
let defaultHight = 0.081;						// Total height of the bar texture

let defaultPositionX = 	0;					// Default X position of the bar when health is 100%
let defaultPositionY = -0.8;					   	// Default Y position of the first bar
let defaultPositionZ = -2;						// Default Z position of the bar

let barSpacingY = 0.125;						// Vertical spacing between bars

AFRAME.registerComponent('hud-bar', {
	schema: {
		num: {type: 'int', default: 0}			// Type of bar: 0 = health, 1 = experience, 2 = energy
	},
	init: function () {
		this.el.setAttribute("hud-overlay", "");
		this.el.setAttribute("width", defaultWidth);
		this.el.setAttribute("height", defaultHight);
		this.el.setAttribute("repeat", "1 1");
		this.el.setAttribute("position", `${defaultPositionX} ${defaultPositionY - (this.data.num * barSpacingY)} ${defaultPositionZ}`);
	}
});

export function updateHudBars() {

	// Values for health, experience and energy (0-100)
	let healthValue = Player.getHealth();
	let experienceValue = Player.getExperience();
	let energyValue = Player.getEnergy();

	const minWidth = 0.036;                         // Width when health is 0%
	const maxWidth = defaultWidth - minWidth * 2;   // Width when health is 100%

	// Update health bar
	const healthBar = document.getElementById("health-bar");

	const newWidth = minWidth + (healthValue / 100) * maxWidth;
	healthBar.setAttribute("width", `${newWidth}`);

	const newRepeat = newWidth / defaultWidth;
	healthBar.setAttribute("repeat", `${newRepeat} 1`);

	const currentHealthBarPosition = healthBar.object3D.position;
	const healthBarPositionX = defaultPositionX - (defaultWidth - newWidth) / 2;
	healthBar.setAttribute("position", `${healthBarPositionX} ${currentHealthBarPosition.y} ${currentHealthBarPosition.z}`);

	requestAnimationFrame(() => applyHudOverlay(healthBar, 101));


	// Update experience bar
	const experienceBar = document.getElementById("experience-bar");

	const newExperienceWidth = minWidth + (experienceValue / 100) * maxWidth;
	experienceBar.setAttribute("width", `${newExperienceWidth}`);

	const newExperienceRepeat = newExperienceWidth / defaultWidth;
	experienceBar.setAttribute("repeat", `${newExperienceRepeat} 1`);

	const currentExperienceBarPosition = experienceBar.object3D.position;
	const experienceBarPositionX = defaultPositionX - (defaultWidth - newExperienceWidth) / 2;
	experienceBar.setAttribute("position", `${experienceBarPositionX} ${currentExperienceBarPosition.y} ${currentExperienceBarPosition.z}`);

	requestAnimationFrame(() => applyHudOverlay(experienceBar, 101));


	// Update energy bar
	const energyBar = document.getElementById("energy-bar");

	const newEnergyWidth = minWidth + (energyValue / 100) * maxWidth;
	energyBar.setAttribute("width", `${newEnergyWidth}`);

	const newEnergyRepeat = newEnergyWidth / defaultWidth;
	energyBar.setAttribute("repeat", `${newEnergyRepeat} 1`);

	const currentEnergyBarPosition = energyBar.object3D.position;
	const energyBarPositionX = defaultPositionX - (defaultWidth - newEnergyWidth) / 2;
	energyBar.setAttribute("position", `${energyBarPositionX} ${currentEnergyBarPosition.y} ${currentEnergyBarPosition.z}`);

	requestAnimationFrame(() => applyHudOverlay(energyBar, 101));

}