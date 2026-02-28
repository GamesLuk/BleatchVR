	AFRAME.registerComponent("hud-overlay", {
				dependencies: ['material'],
				init: function () {
					this.el.sceneEl.renderer.sortObjects = true;
					this.el.object3D.renderOrder = 100;
					this.el.components.material.material.depthTest = false;
				}
	});

	// Hilfsfunktion um HUD-Overlay Eigenschaften erneut anzuwenden
	function applyHudOverlay(element) {
		element.sceneEl.renderer.sortObjects = true;
		element.object3D.renderOrder = 100;
		if (element.components.material) {
			element.components.material.material.depthTest = false;
		}
	}