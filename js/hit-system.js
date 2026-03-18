// KI - Generated ( > 50 %)
//
// Hit-System nach dem Hitkonzept aus README.md:
//
// Attacker-Seite (weapon-hit):
//   Lokale Waffe trifft networked Lootbox oder networked Spieler.
//   Energy-Check → Energy abziehen → Lootbox breaken / Schaden senden → Sound
//
// Defender-Seite (player-hittable + handlePlayerDamage):
//   Wenn Waffen networked sind: Erkennt Collision von fremder Waffe mit lokalem Spieler.
//   Aktuell temporär über Netzwerk-Nachrichten gelöst, bis Waffen networked sind.
//   Energy-Check (über synced Stats) → Health abziehen → Sound

import { breakLootbox } from "./lootbox.js";
import * as Player from "./player.js";
import { getOwningPlayerId, getLocalPlayerId, sendMessageToPlayer } from "./network.js";

const ENERGY_COST_PER_HIT = 33;
const DEFAULT_HIT_DAMAGE = 20;

// ==========================================
// Multiplayer Hit-System (game.html)
// ==========================================

/**
 * Attacker-Seite: Wird auf die lokale Waffe gelegt.
 * Prüft jeden Frame auf Kollision mit Lootboxen und anderen Spielern.
 */
AFRAME.registerComponent('weapon-hit', {
	init: function () {
		this._weaponBox = new THREE.Box3();
		this._targetBox = new THREE.Box3();
		this._collidingWith = new Set();
	},

	tick: function () {
		this._weaponBox.setFromObject(this.el.object3D);
		if (this._weaponBox.isEmpty()) return;

		this._checkLootboxCollisions();
		this._checkPlayerCollisions();
	},

	_checkLootboxCollisions: function () {
		const lootboxes = document.querySelectorAll('.lootbox');

		lootboxes.forEach(lootbox => {
			if (!lootbox.components.lootbox || !lootbox.components.lootbox.isSpawned) return;

			this._targetBox.setFromObject(lootbox.object3D);
			if (this._targetBox.isEmpty()) return;

			this._targetBox.expandByScalar(-0.1);

			const id = lootbox.getAttribute("id");
			const isColliding = this._weaponBox.intersectsBox(this._targetBox);

			if (isColliding && !this._collidingWith.has(id)) {
				this._collidingWith.add(id);
				this._onHitLootbox(lootbox);
			} else if (!isColliding) {
				this._collidingWith.delete(id);
			}
		});
	},

	_checkPlayerCollisions: function () {
		const localPlayerId = getLocalPlayerId();
		const players = document.querySelectorAll('[player-stats]');

		players.forEach(playerEl => {
			const ownerId = getOwningPlayerId(playerEl);
			if (!ownerId || ownerId === localPlayerId) return;

			this._targetBox.setFromObject(playerEl.object3D);
			if (this._targetBox.isEmpty()) return;

			this._targetBox.expandByScalar(-0.1);

			const isColliding = this._weaponBox.intersectsBox(this._targetBox);

			if (isColliding && !this._collidingWith.has(ownerId)) {
				this._collidingWith.add(ownerId);
				this._onHitPlayer(playerEl, ownerId);
			} else if (!isColliding) {
				this._collidingWith.delete(ownerId);
			}
		});
	},

	// Player1 (lokal) trifft Lootbox
	_onHitLootbox: function (lootboxEl) {
		if (Player.isOnCooldown()) return;
		if (Player.getEnergy() < ENERGY_COST_PER_HIT) return;

		Player.setEnergy(Player.getEnergy() - ENERGY_COST_PER_HIT);
		breakLootbox(lootboxEl.getAttribute("id"));
		// TODO: Sound abspielen
	},

	// Player1 (lokal) trifft Player2 (networked)
	_onHitPlayer: function (playerEl, targetPlayerId) {
		if (Player.isOnCooldown()) return;
		if (Player.getEnergy() < ENERGY_COST_PER_HIT) return;

		// Angreifer: Energy abziehen
		Player.setEnergy(Player.getEnergy() - ENERGY_COST_PER_HIT);

		// Schadensnachricht an Ziel senden.
		// Temporär: Wird ersetzt durch lokale Collision Detection wenn Waffen networked sind.
		// Dann erkennt der Verteidiger die Collision selbst und zieht sich eigenständig Health ab.
		sendMessageToPlayer(targetPlayerId, "player-damage", {
			damage: DEFAULT_HIT_DAMAGE
		});

		// TODO: Sound abspielen

		// Prüfe ob Ziel tot wäre
		const targetHealth = Player.getHealth(targetPlayerId);
		if (targetHealth !== undefined && targetHealth - DEFAULT_HIT_DAMAGE <= 0) {
			// TODO: Tod auf Angreifer-Seite verarbeiten
		}
	}
});

/**
 * Defender-Seite: Wird auf den lokalen Spieler gelegt.
 * Wenn Waffen networked sind: Erkennt Collision von fremder Waffe mit lokalem Spieler.
 * Aktuell: Empfängt Schadensnachrichten über network.js → handlePlayerDamage().
 */
AFRAME.registerComponent('player-hittable', {
	init: function () {
		// Placeholder: Wenn Waffen networked sind, wird hier die Collision Detection
		// für fremde Waffen gegen den lokalen Spieler implementiert.
		// Bis dahin läuft die Defender-Logik über handlePlayerDamage() via Netzwerk-Nachrichten.
	}
});

// Wird von network.js aufgerufen bei eingehender Schadensnachricht (temporär bis Waffen networked)
export function handlePlayerDamage(data) {
	const { damage } = data;
	Player.setHealth(Player.getHealth() - damage);
	// TODO: Sound abspielen
}

// ==========================================
// NPC Kampf-Komponenten (testfight.html)
// ==========================================

AFRAME.registerComponent('enemy-health', {
	schema: {
		hp: { type: 'number', default: 100 },
		healthText: { type: 'selector' }
	},
	init: function () {
		this.updateText();
	},
	takeDamage: function (amount) {
		this.data.hp = Math.max(0, this.data.hp - amount);
		this.updateText();
		if (this.data.hp <= 0) {
			this.el.emit('enemy-death');
		}
	},
	updateText: function () {
		if (this.data.healthText) {
			this.data.healthText.setAttribute('text', 'value', 'HP: ' + this.data.hp);
		}
	}
});

AFRAME.registerComponent('weapon-target', {
	schema: {
		type: {type: 'string', default: ""},
		weapon: {type: 'selector', default: '#weapon'}
	},
	init: function () {
		this._targetBox = new THREE.Box3();
		this._weaponBox = new THREE.Box3();
		this._wasColliding = false;
	},
	tick: function () {
		const weaponEl = this.data.weapon;
		if (!weaponEl) return;

		this._targetBox.setFromObject(this.el.object3D);
		this._weaponBox.setFromObject(weaponEl.object3D);

		if (this._targetBox.isEmpty() || this._weaponBox.isEmpty()) return;

		const isColliding = this._targetBox.intersectsBox(this._weaponBox);

		if (isColliding && !this._wasColliding) {
			this.onPassivHit();
		}
		this._wasColliding = isColliding;
	},
	onPassivHit: function () {
		if (this.data.type === "") return;
		if (Player.isOnCooldown()) return;
		if (Player.getEnergy() < ENERGY_COST_PER_HIT) return;

		Player.setEnergy(Player.getEnergy() - ENERGY_COST_PER_HIT);

		switch (this.data.type) {
			case "enemy":
				const enemyHealth = this.el.components['enemy-health'];
				if (enemyHealth) {
					enemyHealth.takeDamage(DEFAULT_HIT_DAMAGE);
				}
				break;
			case "lootbox":
				breakLootbox(this.el.getAttribute("id"));
				break;
		}
	}
});