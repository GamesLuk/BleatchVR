AFRAME.registerComponent('local-avatar-rig', {
    schema: {
        camera: { type: 'selector' },
        head: { type: 'selector' },
        body: { type: 'selector' },
        bodyYOffset: { type: 'number', default: -0.9 }
    },

    init: function () {
        this.cameraEl = this.data.camera;
        this.headEl = this.data.head;
        this.bodyEl = this.data.body;
    },

    getRefs: function () {
        if (!this.cameraEl) this.cameraEl = document.getElementById('playerCamera');
        if (!this.headEl) this.headEl = document.getElementById('local-head');
        if (!this.bodyEl) this.bodyEl = document.getElementById('local-body');

        return {
            cameraEl: this.cameraEl,
            headEl: this.headEl,
            bodyEl: this.bodyEl
        };
    },

    tick: function () {
        const refs = this.getRefs();
        const cameraEl = refs.cameraEl;
        const headEl = refs.headEl;
        const bodyEl = refs.bodyEl;

        if (!cameraEl || !headEl || !bodyEl) return;

        // Head always follows camera position/rotation exactly.
        headEl.object3D.position.copy(cameraEl.object3D.position);
        headEl.object3D.rotation.copy(cameraEl.object3D.rotation);

        // Body stays below head.
        bodyEl.object3D.position.set(
            headEl.object3D.position.x,
            headEl.object3D.position.y + this.data.bodyYOffset,
            headEl.object3D.position.z
        );

        // Body turns only while joystick movement from movemtn.js is active.
        const moveComp = this.el.components['right-thumbstick-move'];
        const step = moveComp && moveComp.lastMoveStep;
        if (step && step.lengthSq() > 0.000001) {
            const yaw = Math.atan2(step.x, step.z);
            bodyEl.object3D.rotation.set(0, yaw, 0);
        }
    }
});
