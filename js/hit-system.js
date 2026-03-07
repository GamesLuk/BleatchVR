import { breakLootbox } from "./lootbox.js";
import * as Player from "./player.js";

const ENERGY_COST_PER_HIT = 33;
const DEFAULT_HIT_DAMAGE = 20;

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

		// Recompute world bounding boxes from the actual meshes every frame
		this._targetBox.setFromObject(this.el.object3D);
		this._weaponBox.setFromObject(weaponEl.object3D);

		// Skip if either box is empty (model not loaded yet)
		if (this._targetBox.isEmpty() || this._weaponBox.isEmpty()) return;

		const isColliding = this._targetBox.intersectsBox(this._weaponBox);

		if (isColliding && !this._wasColliding) {
			this.onPassivHit();
		}
		this._wasColliding = isColliding;
	},
	onPassivHit: function () {
		if (this.data.type === "") return;

		if (Player.isOnCooldown()) return;    // Don't allow hits if player is on cooldown
		
		if (Player.getEnergy() < ENERGY_COST_PER_HIT) return;    // Don't allow hits if player has no energy
		
		// Deduct energy cost for the hit
		Player.setEnergy(Player.getEnergy() - ENERGY_COST_PER_HIT);

		switch (this.data.type) {
			case "enemy":
				const enemyHealth = this.el.components['enemy-health'];
				if (enemyHealth) {
					enemyHealth.takeDamage(DEFAULT_HIT_DAMAGE);
				}
				break;
			case "lootbox":
				breakLootbox(this.el.getAttribute("id"), true);
				break;
		}
	}
});