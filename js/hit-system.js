import { breakLootbox } from "./lootbox";
import * as Player from "./player";

const ENERGY_COST_PER_HIT = 33;
const DEFAULT_HIT_DAMAGE = 20;

AFRAME.registerComponent('weapon-target', {
	schema: {
		type: {type: 'string', default: ""}
	},
	init: function () {
		this.el.addEventListener('obbcollisionstarted', (event) => {
			const collidedWithWeapon = event.detail.withEl.getAttribute("id") === "weapon";
			if (collidedWithWeapon) {
				this.onPassivHit();
			}
		});
	},
	onPassivHit: function () {
		if (this.data.type === "") return;

		if (Player.isOnCooldown()) return;    // Don't allow hits if player is on cooldown
		
		if (Player.getEnergy() < ENERGY_COST_PER_HIT) return;    // Don't allow hits if player has no energy
		
		// Deduct energy cost for the hit
		Player.setEnergy(Player.getEnergy() - ENERGY_COST_PER_HIT);

		switch (this.data.type) {
			case "enemy":
				Player.setHealth(Player.getHealth() - DEFAULT_HIT_DAMAGE);
				break;
			case "lootbox":
				breakLootbox(this.el.getAttribute("id"), true);
				break;
		}
	}
});