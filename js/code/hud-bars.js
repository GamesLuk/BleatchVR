function updateHudBars() {

	// Values for health, experience and energy (0-100)
	let healthValue = getHealth();
	let experienceValue = getExperience();
	let energyValue = getEnergy();

	const totalWidth = 0.860;                       // Total width of the bar texture
	const minWidth = 0.036;                         // Width when health is 0%
	const maxWidth = totalWidth - minWidth * 2;     // Width when health is 100%
	const defaultHealthBarPositionX = 2.66;         // Default X position of the health bar when health is 100%

	// Update health bar
	const healthBar = document.getElementById("health-bar");

	const newWidth = minWidth + (healthValue / 100) * maxWidth;
	healthBar.setAttribute("width", `${newWidth}`);

	const newRepeat = newWidth / totalWidth;
	healthBar.setAttribute("repeat", `${newRepeat} 1`);
	
	const currentHealthBarPosition = healthBar.object3D.position;
	const healthBarPositionX = defaultHealthBarPositionX - (totalWidth - newWidth) / 2;
	healthBar.setAttribute("position", `${healthBarPositionX} ${currentHealthBarPosition.y} ${currentHealthBarPosition.z}`);

	requestAnimationFrame(() => applyHudOverlay(healthBar));


	// Update experience bar
	const experienceBar = document.getElementById("experience-bar");

	const newExperienceWidth = minWidth + (experienceValue / 100) * maxWidth;
	experienceBar.setAttribute("width", `${newExperienceWidth}`);

	const newExperienceRepeat = newExperienceWidth / totalWidth;
	experienceBar.setAttribute("repeat", `${newExperienceRepeat} 1`);

	const currentExperienceBarPosition = experienceBar.object3D.position;
	const experienceBarPositionX = defaultHealthBarPositionX - (totalWidth - newExperienceWidth) / 2;
	experienceBar.setAttribute("position", `${experienceBarPositionX} ${currentExperienceBarPosition.y} ${currentExperienceBarPosition.z}`);

	requestAnimationFrame(() => applyHudOverlay(experienceBar));


	// Update energy bar
	const energyBar = document.getElementById("energy-bar");

	const newEnergyWidth = minWidth + (energyValue / 100) * maxWidth;
	energyBar.setAttribute("width", `${newEnergyWidth}`);

	const newEnergyRepeat = newEnergyWidth / totalWidth;
	energyBar.setAttribute("repeat", `${newEnergyRepeat} 1`);

	const currentEnergyBarPosition = energyBar.object3D.position;
	const energyBarPositionX = defaultHealthBarPositionX - (totalWidth - newEnergyWidth) / 2;
	energyBar.setAttribute("position", `${energyBarPositionX} ${currentEnergyBarPosition.y} ${currentEnergyBarPosition.z}`);

	requestAnimationFrame(() => applyHudOverlay(energyBar));

}