// Passt eine Hitbox automatisch an die Größe und Position eines geladenen 3D-Modells an.
AFRAME.registerComponent('auto-fit-hitbox', {
	schema: {
		// Ziel-Hitbox, die skaliert und positioniert wird.
		hitbox: { type: 'selector' },
		// Optionaler Text (z. B. HP), der über dem Modell positioniert wird.
		healthText: { type: 'selector' },
		// Abstand des Textes über der oberen Modellkante.
		textOffset: { type: 'number', default: 0.4 }
	},

	init: function () {
		// Wird ausgeführt, sobald das Modell vollständig geladen ist.
		this.fit = this.fit.bind(this);
		this.el.addEventListener('model-loaded', this.fit);
	},

	remove: function () {
		// Event-Listener beim Entfernen der Komponente sauber aufräumen.
		this.el.removeEventListener('model-loaded', this.fit);
	},

	fit: function () {
		if (!this.data.hitbox) return;

		// Weltweite Bounding-Box des Modells berechnen.
		const bounds = new THREE.Box3().setFromObject(this.el.object3D);
		if (bounds.isEmpty()) return;

		const size = new THREE.Vector3();
		const center = new THREE.Vector3();
		bounds.getSize(size);
		bounds.getCenter(center);

		// Mittelpunkt in den lokalen Raum des Hitbox-Parents umrechnen,
		// damit die Hitbox korrekt am Modell "klebt".
		const hitboxParent = this.data.hitbox.object3D.parent;
		const localCenter = hitboxParent ? hitboxParent.worldToLocal(center.clone()) : center;

		// Hitbox auf Modellgröße setzen.
		this.data.hitbox.setAttribute('width', Math.max(0.01, size.x));	// Min 0.01, damit es nicht komplett verschwindet
		this.data.hitbox.setAttribute('height', Math.max(0.01, size.y));
		this.data.hitbox.setAttribute('depth', Math.max(0.01, size.z));
		this.data.hitbox.setAttribute('position', `${localCenter.x} ${localCenter.y} ${localCenter.z}`);

		if (this.data.healthText) {
			// Optionalen Text über dem Modell platzieren.
			const y = bounds.max.y + this.data.textOffset;
			this.data.healthText.setAttribute('position', `${center.x} ${y} ${center.z}`);
		}
	}
});