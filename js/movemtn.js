// KI - generated

// Custom locomotion component:
// - reads right thumbstick input
// - reduces movement to 4 directions only
// - moves the rig relative to camera yaw (where player looks)
AFRAME.registerComponent('right-thumbstick-move', {
	schema: {
		// VR controller entity to listen for axis/thumbstick events.
		controller: { type: 'selector' },
		// Camera entity used to orient movement direction.
		camera: { type: 'selector' },
		// Movement speed in meters per second.
		speed: { type: 'number', default: 2.8 },
		// Ignore tiny stick input near center to avoid drift.
		deadzone: { type: 'number', default: 0.2 }
	},

	init: function () {
		// Quantized movement state: -1, 0, or 1 on each axis.
		this.moveX = 0;
		this.moveZ = 0;

		// Keep correct "this" context for event callbacks.
		this.onThumbstickMoved = this.onThumbstickMoved.bind(this);
		this.onAxisMoved = this.onAxisMoved.bind(this);

		// Listen to both event names for better runtime/device compatibility.
		if (this.data.controller) {
			this.data.controller.addEventListener('thumbstickmoved', this.onThumbstickMoved);
			this.data.controller.addEventListener('axismove', this.onAxisMoved);
		}
	},

	remove: function () {
		// Clean up listeners when entity/component is removed.
		if (this.data.controller) {
			this.data.controller.removeEventListener('thumbstickmoved', this.onThumbstickMoved);
			this.data.controller.removeEventListener('axismove', this.onAxisMoved);
		}
	},

	quantizeTo4Directions: function (x, y) {
		const deadzone = this.data.deadzone;
		// If stick is near center, stop movement.
		if (Math.abs(x) < deadzone && Math.abs(y) < deadzone) {
			this.moveX = 0;
			this.moveZ = 0;
			return;
		}

		// Choose dominant axis only -> exactly 4 directions.
		if (Math.abs(x) > Math.abs(y)) {
			this.moveX = Math.sign(x);
			this.moveZ = 0;
		} else {
			this.moveX = 0;
			// In A-Frame/WebXR, forward is usually negative Z.
			this.moveZ = -Math.sign(y);
		}
	},

	onThumbstickMoved: function (event) {
		// Event shape: {x, y}
		const x = event.detail.x || 0;
		const y = event.detail.y || 0;
		this.quantizeTo4Directions(x, y);
	},

	onAxisMoved: function (event) {
		// Event shape: axis array, often [x, y].
		const axes = event.detail.axis || [];
		if (axes.length < 2) return;

		const x = axes[0] || 0;
		const y = axes[1] || 0;
		this.quantizeTo4Directions(x, y);
	},

	//tick: function (time, deltaTime) {
	//	// Per-frame movement integration.
	//	if (!deltaTime) return;
	//	if (this.moveX === 0 && this.moveZ === 0) return;
//
	//	const cameraEl = this.data.camera;
	//	if (!cameraEl) return;
//
	//	// Convert delta time from ms to seconds.
	//	const dt = deltaTime / 1000;
	//	// Use camera yaw so movement follows view direction.
	//	const yaw = cameraEl.object3D.rotation.y;
//
	//	// Build horizontal forward/right vectors from current yaw.
	//	const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
	//	const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
//
	//	const movement = new THREE.Vector3();
	//	movement.addScaledVector(right, this.moveX);
	//	movement.addScaledVector(forward, this.moveZ);
	//	// Keep speed constant for the active direction.
	//	movement.normalize().multiplyScalar(this.data.speed * dt);
//
	//	// Move the rig in world space.
	//	this.el.object3D.position.add(movement);
	//}
});