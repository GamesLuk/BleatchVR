	AFRAME.registerComponent("hud-overlay", {
				schema: {
					renderOrder: {type: 'int', default: 100}
				},
				dependencies: ['material'],
				init: function () {
					this.el.sceneEl.renderer.sortObjects = true;
					this.el.object3D.renderOrder = this.data.renderOrder;
					this.el.components.material.material.depthTest = false;
				}
	});

	// Hilfsfunktion um HUD-Overlay Eigenschaften erneut anzuwenden
	export function applyHudOverlay(element, renderOrder = 100) {
		// Warte bis Element vollständig initialisiert ist
		if (!element.sceneEl || !element.components || !element.components.material) {
			requestAnimationFrame(() => applyHudOverlay(element, renderOrder));
			return;
		}
		
		element.sceneEl.renderer.sortObjects = true;
		element.object3D.renderOrder = renderOrder;
		element.components.material.material.depthTest = false;
	}	