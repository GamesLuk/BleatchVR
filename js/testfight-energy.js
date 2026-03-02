// Energie-System für den Fight-Test:
// - bei jedem Treffer -33 Energie
// - bei 0 Energie: 15 Sekunden warten
// - danach wieder auf 100 setzen
AFRAME.registerComponent('fight-energy-system', {
	init: function () {
		// Sperrt weitere Energie-Abzüge während der 15s-Erholungszeit.
		this.isRecovering = false;

		// Event-Handler binden, damit "this" korrekt bleibt.
		this.onSceneLoaded = this.onSceneLoaded.bind(this);
		this.onFightHit = this.onFightHit.bind(this);

		// Szene- und Treffer-Events abonnieren.
		this.el.addEventListener('loaded', this.onSceneLoaded);
		this.el.addEventListener('fight-hit', this.onFightHit);
	},

	remove: function () {
		// Listener sauber entfernen.
		this.el.removeEventListener('loaded', this.onSceneLoaded);
		this.el.removeEventListener('fight-hit', this.onFightHit);
	},

	onSceneLoaded: function () {
		// HUD einmal initial synchronisieren.
		if (window.updateHudBars) window.updateHudBars();
		if (window.updateHotbarSelector) window.updateHotbarSelector();
	},

	onFightHit: function () {
		// Nur arbeiten, wenn Energy-API verfügbar ist.
		if (!window.getEnergy || !window.setEnergy) return;
		// Während Erholung keine weiteren Energie-Änderungen.
		if (this.isRecovering) return;

		// Pro Treffer 33 Energie abziehen.
		const nextEnergy = Math.max(0, window.getEnergy() - 33);
		window.setEnergy(nextEnergy);
		if (window.updateHudBars) window.updateHudBars();

		if (nextEnergy === 0) {
			// Bei 0: 15 Sekunden warten und dann auf 100 zurücksetzen.
			this.isRecovering = true;
			setTimeout(() => {
				window.setEnergy(100);
				if (window.updateHudBars) window.updateHudBars();
				this.isRecovering = false;
			}, 15000);
		}
	}
});
