// Minimale Komponente: aktiviert nur OBB-Collision auf dem Objekt.
// Kein Hitbox-Fitting, keine Modellanpassung.
const ENSURE_OBB_COLLIDER_DEFINITION = {
	init: function () {
		if (!this.el.hasAttribute('obb-collider')) {
			this.el.setAttribute('obb-collider', '');
		}
	}
};

AFRAME.registerComponent('auto-fit-collider', ENSURE_OBB_COLLIDER_DEFINITION);
AFRAME.registerComponent('auto-fit-hitbox', ENSURE_OBB_COLLIDER_DEFINITION);