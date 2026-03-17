// KI - Generated ( > 50 %)
// Explanation in docs\PHYSICS_SYSTEM_DOCUMENTATION.md

import { getOwningPlayerId } from "./network.js";
import { getSpeed } from "./player.js";

const PHYSICS_DEBUG = false;  // Setze auf false um Wireframes zu deaktivieren

// Oriented Collision Component (rotation-aware)
AFRAME.registerComponent('collision-box', {
    schema: {
        width: {type: 'number', default: 1},
        height: {type: 'number', default: 1},
        depth: {type: 'number', default: 1},
        offsetX: {type: 'number', default: 0},
        offsetY: {type: 'number', default: 0},
        offsetZ: {type: 'number', default: 0}
    },

    init: function() {
        // Add debug wireframe if enabled globally
        if (PHYSICS_DEBUG) {
            const geometry = new THREE.BoxGeometry(
                this.data.width, 
                this.data.height, 
                this.data.depth
            );
            const material = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00, 
                wireframe: true 
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(this.data.offsetX, this.data.offsetY, this.data.offsetZ);
            this.el.object3D.add(mesh);
        }
    },

    // Get Oriented Bounding Box (OBB) data
    getOBB: function() {
        const obj3D = this.el.object3D;
        const position = obj3D.position;
        const rotation = obj3D.rotation.y; // Y-axis rotation
        
        // Half-extents
        const hw = this.data.width / 2;
        const hd = this.data.depth / 2;
        
        // Forward and Right vectors (rotated)
        const forward = new THREE.Vector2(
            Math.sin(rotation),
            Math.cos(rotation)
        );
        const right = new THREE.Vector2(
            Math.cos(rotation),
            -Math.sin(rotation)
        );
        
        return {
            center: new THREE.Vector2(position.x + this.data.offsetX, position.z + this.data.offsetZ),
            forward: forward,
            right: right,
            halfWidth: hw,
            halfDepth: hd,
            rotation: rotation
        };
    }
});

// Player Controller with Collision
AFRAME.registerComponent('player-controller', {
    schema: {
        radius: {type: 'number', default: 0.3}
    },

    init: function() {
        this.keys = {};
        
        // Keyboard listeners
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

    },

    tick: function(time, deltaTime) {
        if (deltaTime === 0) return;
        
        const el = this.el;
        const pos = el.object3D.position;
        const dt = deltaTime / 1000;
        const speed = getSpeed(getOwningPlayerId(el)) || this.el.getAttribute('player-controller')?.speed || 5;


        // Get camera rotation
        const cameraEl = el.querySelector('[camera]');
        if (!cameraEl) return;
        
        const rotation = cameraEl.object3D.rotation.y;
        
        // Create direction vectors
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
        
        const right = new THREE.Vector3(1, 0, 0);
        right.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
        
        // Calculate movement
        const movement = new THREE.Vector3();
        
        if (this.keys['w']) movement.add(forward);
        if (this.keys['s']) movement.sub(forward);
        if (this.keys['a']) movement.sub(right);
        if (this.keys['d']) movement.add(right);
        
        // Normalize diagonal movement
        if (movement.length() > 0) {
            movement.normalize();
            movement.multiplyScalar(speed * dt);
            
            // Apply movement with collision response
            this.moveWithCollision(pos, movement);
        }
    },

    moveWithCollision: function(pos, movement) {
        const newX = pos.x + movement.x;
        const newZ = pos.z + movement.z;
        
        // Check collision at new position
        const collision = this.getCollisionInfo(newX, newZ);
        
        if (!collision) {
            // No collision - move freely
            pos.x = newX;
            pos.z = newZ;
        } else {
            // Collision detected - slide along surface
            const normal = collision.normal;
            const movementVec = new THREE.Vector2(movement.x, movement.z);
            
            // Calculate sliding direction (perpendicular to normal)
            const dotProduct = movementVec.dot(normal);
            
            // Only slide if moving towards the wall
            if (dotProduct < 0) {
                // Project movement onto surface (remove normal component)
                const tangent = movementVec.clone().sub(
                    normal.clone().multiplyScalar(dotProduct)
                );
                
                // Apply a stronger slide factor for smoother movement
                const slideX = pos.x + tangent.x * 1.0;
                const slideZ = pos.z + tangent.y * 1.0;
                
                // Try sliding movement
                const slideCollision = this.getCollisionInfo(slideX, slideZ);
                
                if (!slideCollision) {
                    // Slide is clear
                    pos.x = slideX;
                    pos.z = slideZ;
                } else {
                    // Still colliding - push out slightly
                    const pushOut = 0.02;
                    pos.x += normal.x * pushOut;
                    pos.z += normal.y * pushOut;
                }
            } else {
                // Moving away from wall - allow it but push out to prevent sticking
                const pushOut = 0.01;
                pos.x += normal.x * pushOut;
                pos.z += normal.y * pushOut;
            }
        }
    },

    getCollisionInfo: function(x, z) {
        const radius = this.data.radius;
        const collidables = document.querySelectorAll('[collision-box]');
        
        for (let i = 0; i < collidables.length; i++) {
            const box = collidables[i].components['collision-box'];
            if (!box) continue;
            
            const obb = box.getOBB();
            
            // Transform player position into box's local space
            const playerPos = new THREE.Vector2(x, z);
            const toPlayer = playerPos.clone().sub(obb.center);
            
            // Project onto box's local axes
            const localX = toPlayer.dot(obb.right);
            const localZ = toPlayer.dot(obb.forward);
            
            // Find closest point on box (in local space)
            const closestX = Math.max(-obb.halfWidth, Math.min(localX, obb.halfWidth));
            const closestZ = Math.max(-obb.halfDepth, Math.min(localZ, obb.halfDepth));
            
            // Calculate distance from player to closest point
            const distX = localX - closestX;
            const distZ = localZ - closestZ;
            const dist = Math.sqrt(distX * distX + distZ * distZ);
            
            // Check if within collision radius (with small buffer)
            if (dist < radius) {
                // Calculate collision normal in world space
                let normal;
                
                if (dist > 0.001) {
                    // Normal points from closest point to player
                    const localNormal = new THREE.Vector2(distX / dist, distZ / dist);
                    
                    // Transform normal to world space
                    normal = obb.right.clone().multiplyScalar(localNormal.x)
                        .add(obb.forward.clone().multiplyScalar(localNormal.y));
                    normal.normalize();
                } else {
                    // Player is at edge/corner - use strongest local axis
                    const absX = Math.abs(localX / obb.halfWidth);
                    const absZ = Math.abs(localZ / obb.halfDepth);
                    
                    if (absX > absZ) {
                        const localNormal = new THREE.Vector2(Math.sign(localX), 0);
                        normal = obb.right.clone().multiplyScalar(localNormal.x);
                    } else {
                        const localNormal = new THREE.Vector2(0, Math.sign(localZ));
                        normal = obb.forward.clone().multiplyScalar(localNormal.y);
                    }
                    normal.normalize();
                }
                
                return { normal: normal, obb: obb, penetration: radius - dist };
            }
        }
        
        return null; // No collision
    }
});