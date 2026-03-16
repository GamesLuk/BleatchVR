// KI - Generated ( > 50 %)

const PICO_MAIN_DIRECTIONS = Object.freeze([
	{ name: 'forward', x: 0, z: -1 },
	{ name: 'backward', x: 0, z: 1 },
	{ name: 'left', x: -1, z: 0 },
	{ name: 'right', x: 1, z: 0 }
]);

window.PICO_MAIN_DIRECTIONS = PICO_MAIN_DIRECTIONS;

function getMainDirection(axesX, axesY, deadzone) {
	const magnitude = Math.hypot(axesX, axesY);
	if (magnitude < deadzone) return null; 

	if (Math.abs(axesX) > Math.abs(axesY)) {
		return axesX > 0 ? PICO_MAIN_DIRECTIONS[3] : PICO_MAIN_DIRECTIONS[2];
	}

	return axesY > 0 ? PICO_MAIN_DIRECTIONS[1] : PICO_MAIN_DIRECTIONS[0];
}

AFRAME.registerComponent('right-thumbstick-move', {
	schema: {
		controller: { type: 'selector' },
		camera: { type: 'selector' },
		speed: { type: 'number', default: 2.8 },
		deadzone: { type: 'number', default: 0.2 },
		axisX: { type: 'number', default: 2 },
		axisY: { type: 'number', default: 3 }
	},

	init: function () {
		this.up = new THREE.Vector3(0, 1, 0);
		this.moveVector = new THREE.Vector3();
		this.controllerEl = this.data.controller;
		this.cameraEl = this.data.camera;
	},

	getResolvedRefs: function () {
		if (!this.controllerEl) this.controllerEl = document.getElementById('weapon');
		if (!this.cameraEl) this.cameraEl = document.getElementById('playerCamera');
		return { controllerEl: this.controllerEl, cameraEl: this.cameraEl };
	},

	trackenControlls: function (controllerEl) {
		const trackedControls = controllerEl && controllerEl.components['tracked-controls'];
		if (!trackedControls) return null;
		if (!trackedControls.controller) return null;
		return trackedControls.controller;
	},

	getGamepad: function (controllerEl) {
		const controller = this.trackenControlls(controllerEl);
		if (!controller) return null;
		return controller.gamepad || controller;
	},

	readStickAxes: function (gamepad) {
		if (!gamepad || !Array.isArray(gamepad.axes)) return null;

		const axisPairs = [
			[this.data.axisX, this.data.axisY],
			[2, 3],
			[0, 1]
		];

		let best = null;
		let bestMagnitude = -1;

		for (let i = 0; i < axisPairs.length; i++) {
			const xIndex = axisPairs[i][0];
			const yIndex = axisPairs[i][1];
			const x = gamepad.axes[xIndex];
			const y = gamepad.axes[yIndex];

			if (typeof x !== 'number' || typeof y !== 'number') continue;

			const magnitude = Math.hypot(x, y);
			if (magnitude > bestMagnitude) {
				bestMagnitude = magnitude;
				best = { x, y };
			}
		}

		return best;
	},

	tick: function (time, deltaTime) {
		if (!deltaTime) return;

		const refs = this.getResolvedRefs();
		const controllerEl = refs.controllerEl || this.data.controller;
		const cameraEl = refs.cameraEl || this.data.camera;
		if (!controllerEl || !cameraEl) return;

		const gamepad = this.getGamepad(controllerEl);
		if (!gamepad) return;

		const axes = this.readStickAxes(gamepad);
		if (!axes) return;

		const axesX = axes.x || 0;
		const axesY = axes.y || 0;
		const direction = getMainDirection(axesX, axesY, this.data.deadzone);
		if (!direction) return;

		this.moveVector.set(direction.x, 0, direction.z);
		this.moveVector.applyAxisAngle(this.up, cameraEl.object3D.rotation.y);

		const step = this.data.speed * (deltaTime / 1000);
		this.moveVector.multiplyScalar(step);

		// Use player-controller's collision system if available (physics.js),
		// otherwise move freely for scenes without physics
		const playerController = this.el.components['player-controller'];
		if (playerController) {
			playerController.moveWithCollision(this.el.object3D.position, this.moveVector);
		} else {
			this.el.object3D.position.add(this.moveVector);
		}
	}
});
