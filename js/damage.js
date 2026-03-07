// Schlanke Damage-Komponente auf Basis von Object-Collision (obb-collider).
// Die Komponente hängt am Zielobjekt selbst (z. B. giraffeRoot) und reagiert
// auf Kollisionen mit der konfigurierten Waffe.
AFRAME.registerComponent('simple-hit-damage', {
	schema: {
		// Waffen-Entity mit obb-collider
		weapon: { type: 'selector' },
		// Optionales Text-Entity für HP-Anzeige
		healthText: { type: 'selector' },
		// Parameter, damit die Komponente universell wiederverwendbar bleibt.
		damage: { type: 'number', default: 20 },
		maxHp: { type: 'number', default: 100 }
	},

	init: function () {
		// Startwerte
		this.hp = this.data.maxHp;

		// Event-Handler binden, damit remove() sauber aufräumen kann.
		this.onCollisionStarted = this.onCollisionStarted.bind(this);
		this.updateText();

		// OBB-Kollisionen direkt am Zielobjekt abhören.
		this.el.addEventListener('obbcollisionstarted', this.onCollisionStarted);
	},

	remove: function () {
		// Listener beim Entfernen der Komponente aufräumen.
		this.el.removeEventListener('obbcollisionstarted', this.onCollisionStarted);
	},

	updateText: function () {
		// HP-Text aktualisieren (falls vorhanden)
		if (!this.data.healthText) return;
		this.data.healthText.setAttribute('text', 'value', 'HP: ' + this.hp);
	},

	onCollisionStarted: function (event) {
		if (!this.data.weapon || this.hp <= 0) return;

		// Nur Treffer akzeptieren, wenn das Ziel mit der definierten Waffe kollidiert.
		const withEl = event && event.detail ? event.detail.withEl : null;
		if (withEl !== this.data.weapon) return;

		this.hp = Math.max(0, this.hp - this.data.damage);
		this.updateText();
		this.el.emit('fight-hit', { damage: this.data.damage, hp: this.hp });
	}
});