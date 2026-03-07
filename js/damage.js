// Einfache Damage-Komponente:
// - prüft Hitbox-Kollision zwischen Waffe und Ziel
// - zieht pro neuem Kontakt einmal 20 HP ab
// - aktualisiert optional eine Textanzeige
AFRAME.registerComponent('simple-hit-damage', {
	schema: {
		// Waffen-Hitbox-Entity
		weapon: { type: 'selector' },
		// Ziel-Hitbox-Entity
		target: { type: 'selector' },
		// Optionales Text-Entity für HP-Anzeige
		healthText: { type: 'selector' }
	},

	init: function () {
		// Startwerte
		this.hp = 100;
		this.wasColliding = false;
		this.updateText();
	},

	updateText: function () {
		// HP-Text aktualisieren (falls vorhanden)
		if (!this.data.healthText) return;
		this.data.healthText.setAttribute('text', 'value', 'HP: ' + this.hp);
	},

	tick: function () {
		// Nur rechnen, wenn beide Hitboxen gesetzt sind
		if (!this.data.weapon || !this.data.target) return;

		// Weltweite Bounding-Boxen erstellen und Überschneidung prüfen
		const a = new THREE.Box3().setFromObject(this.data.weapon.object3D);
		const b = new THREE.Box3().setFromObject(this.data.target.object3D);
		const isColliding = a.intersectsBox(b);

		// Schaden nur beim Übergang von "kein Kontakt" -> "Kontakt"
		if (isColliding && !this.wasColliding && this.hp > 0) {
			this.hp = Math.max(0, this.hp - 20);
			this.updateText();
			this.el.emit('fight-hit', { damage: 20, hp: this.hp });
		}

		// Kollisionszustand für den nächsten Tick merken
		this.wasColliding = isColliding;
	}
});