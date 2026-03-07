import { getEnergy, setEnergy } from './player.js';

// Energie-System für den Fight-Test:
// - bei jedem Treffer -33 Energie
// - bei 0 Energie: 15 Sekunden warten
// - danach wieder auf 100 setzen
AFRAME.registerComponent('fight-energy-system', {
	init: function () {
		// Sperrt weitere Energie-Abzüge während der 15s-Erholungszeit.
		this.isRecovering = false;

		// Event-Handler binden, damit "this" korrekt bleibt.
		this.onFightHit = this.onFightHit.bind(this);

		// Treffer-Event abonnieren.
		this.el.addEventListener('fight-hit', this.onFightHit);
	},

	remove: function () {
		// Listener sauber entfernen.
		this.el.removeEventListener('fight-hit', this.onFightHit);
	},

	onFightHit: function () {
		// Während Erholung keine weiteren Energie-Änderungen.
		if (this.isRecovering) return;

		// Pro Treffer 33 Energie abziehen.
		const nextEnergy = Math.max(0, getEnergy() - 33);
		setEnergy(nextEnergy);

		if (nextEnergy === 0) {
			// Bei 0: 15 Sekunden warten und dann auf 100 zurücksetzen.
			this.isRecovering = true;
			setTimeout(() => {
				setEnergy(100);
				this.isRecovering = false;
			}, 15000);
		}
	}
});
