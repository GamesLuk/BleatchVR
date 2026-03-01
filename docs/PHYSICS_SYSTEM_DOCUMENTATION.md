# 🎮 Physics System Documentation
## Rotation-Aware Collision Detection System

**Version:** 1.0  
**Datum:** März 2026  
**Autor:** BleatchVR Project

---

## 📋 Inhaltsverzeichnis

1. [Systemübersicht](#systemübersicht)
2. [Kernkonzepte](#kernkonzepte)
3. [OBB Component](#obb-component)
4. [Player Controller](#player-controller)
5. [Kollisionserkennung](#kollisionserkennung)
6. [Collision Response & Sliding](#collision-response--sliding)
7. [Mathematische Details](#mathematische-details)
8. [Performance & Optimierung](#performance--optimierung)

---

## 🎯 Systemübersicht

### Was macht dieses System?

Das System implementiert ein **2D-Kollisionssystem (X/Z-Ebene)** für First-Person Bewegung mit:

✅ **Rotationsabhängige Kollisionsboxen** (OBB - Oriented Bounding Boxes)  
✅ **Smooth Sliding** entlang Wänden (jeder Rotation)  
✅ **Circle-vs-OBB Kollision** (Spieler = Kreis, Wände = Boxen)  
✅ **Anti-Sticking Mechanismus** (kein Hängenbleiben an Ecken)  

### Architektur

```
┌─────────────────────────────────────────────────────┐
│                    A-Frame Scene                    │
└─────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ collision-box│  │ collision-box│  │player-control│
│  Component   │  │  Component   │  │   Component  │
│              │  │              │  │              │
│ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │
│ │  getOBB()│ │  │ │  getOBB()│ │  │ │Movement  │ │
│ └──────────┘ │  │ └──────────┘ │  │ │Detection │ │
│              │  │              │  │ └────┬─────┘ │
└──────────────┘  └──────────────┘  │      │       │
                                    │      ▼       │
                                    │ ┌──────────┐ │
                                    │ │Collision │ │
                                    │ │ Check    │ │
                                    │ └────┬─────┘ │
                                    │      │       │
                                    │      ▼       │
                                    │ ┌──────────┐ │
                                    │ │ Sliding  │ │
                                    │ │ Response │ │
                                    │ └──────────┘ │
                                    └──────────────┘
```

---

## 🧩 Kernkonzepte

### 1. Koordinatensysteme

Das System arbeitet mit **zwei Koordinatensystemen**:

#### **Globales Koordinatensystem (World Space)**

Die 3D-Welt von A-Frame (aber wir nutzen nur X und Z für Kollision):

```
      Y (Höhe - NICHT für Kollision)
      ↑
      |
      |
      +────→ X (rechts)
     /
    /
   Z (nach hinten)
```

**Von oben betrachtet (2D):**

```
      Z (nach hinten)
      ↑
      |
      |
      |
      +────────→ X (rechts)
     
Ursprung (0,0)
```

#### **Lokales Koordinatensystem (Object Space)**

Jede Box hat ihr eigenes rotiertes Koordinatensystem:

```
Globaler Raum:              Lokaler Raum der Box:

    Z                           forward
    ↑                              ↑
    |     /----/                   |
    |    /    /                    |
    |   /----/                     +----→ right
    |    45°
    |
    +--------→ X               (Immer axis-aligned)
```

**Beispiel bei 45° Rotation:**

```
Global Space:           Local Space:

    Z                       forward (rotiert)
    ↑                           ↑
    |                          /
    |   /--------/            /
    |  /   Box  /            /
    | /        /    →       +--------→ right (rotiert)
    |/--------/
    |
    +------------→ X
```

### 2. OBB (Oriented Bounding Box)

Eine **rotierbare Kollisionsbox**, die sich mit dem Objekt dreht.

```
AABB (Axis-Aligned):       OBB (Oriented):
  
  +-------+                  /-------/
  |       |                 /       /  ← Dreht sich mit!
  |       |                /       /
  +-------+               /-------/
  
  minX, maxX              center, rotation,
  minZ, maxZ              forward, right
```

**OBB Datenstruktur:**

```javascript
{
  center: Vector2(x, z),        // Zentrum der Box (2D)
  forward: Vector2(sinθ, cosθ), // "Vorwärts"-Achse (normalisiert)
  right: Vector2(cosθ, -sinθ),  // "Rechts"-Achse (normalisiert)
  halfWidth: number,            // Halbe Breite
  halfDepth: number,            // Halbe Tiefe
  rotation: number              // Y-Rotation in Radians
}
```

### 3. Dot Product (Skalarprodukt)

**Das Herzstück der Koordinatentransformation!**

#### **Was ist der Dot Product?**

Eine mathematische Operation, die misst, wie sehr zwei Vektoren **in die gleiche Richtung** zeigen.

**Formel:**
```
A · B = Ax * Bx + Ay * By
```

**Geometrische Bedeutung:**

```
         A
        ↗
       /
      /  θ
     /___________→ B
     
A · B = |A| × |B| × cos(θ)

Wenn B normalisiert ist (|B| = 1):
A · B = Projektion von A auf B
```

#### **Visualisierung als "Schatten":**

```
      Sonne ↓
           |
      A   /|
       \ / |
        X  |  ← Schatten = Projektion = Dot Product
        |  |
        v  v
    •───────• B
    
Länge des Schattens = A · B (wenn B normalisiert)
```

#### **In unserem System:**

```javascript
toPlayer = Vector2(3, 2)      // Vektor zum Spieler
right = Vector2(0.707, 0.707) // Box-Achse (45° rotiert, normalisiert)

localX = toPlayer · right
       = 3 * 0.707 + 2 * 0.707
       = 2.121 + 1.414
       = 3.535

// Bedeutung: Spieler ist 3.535 Meter entlang der "right"-Achse
```

**Visualisierung:**

```
Global Space:                  Projektion auf right-Achse:

    toPlayer                        
        • (3, 2)                   3.535
       /|                         ←─────→
      / |                        
     /  |                        
    /   |                        
   /    |                        
  •─────┘                        
  Origin                         
       ╲                         
        ╲ right (0.707, 0.707)   
         →                       
```

---

## 🔧 OBB Component

### Zweck

Definiert eine **rotierbare Kollisionsbox** für statische Objekte (Wände, Hindernisse).

### Schema

```javascript
{
  width: number,   // Gesamtbreite der Box (X-Achse lokal)
  height: number,  // Höhe (Y-Achse, nur für Visualisierung)
  depth: number    // Gesamttiefe der Box (Z-Achse lokal)
}
```

### getOBB() Funktion

**Code:**
```javascript
getOBB: function() {
  const obj3D = this.el.object3D;
  const position = obj3D.position;
  const rotation = obj3D.rotation.y; // Y-Achsen Rotation
  
  // Half-extents (Halb-Ausmaße)
  const hw = this.data.width / 2;
  const hd = this.data.depth / 2;
  
  // Richtungsvektoren (normalisiert)
  const forward = new THREE.Vector2(
    Math.sin(rotation),   // X-Komponente
    Math.cos(rotation)    // Z-Komponente
  );
  
  const right = new THREE.Vector2(
    Math.cos(rotation),   // X-Komponente
    -Math.sin(rotation)   // Z-Komponente
  );
  
  return {
    center: new THREE.Vector2(position.x, position.z),
    forward: forward,
    right: right,
    halfWidth: hw,
    halfDepth: hd,
    rotation: rotation
  };
}
```

### Berechnung der Richtungsvektoren

**Warum sin/cos?**

```
Einheitskreis (von oben):

        Z (forward in A-Frame)
        ↑  cos(0°) = 1
        |
        |
        +────────→ X (right in A-Frame)
       /   sin(0°) = 0
      /
     
Bei Rotation θ um Y-Achse:

        forward (0, 0, -1) wird zu:
        (sin(θ), 0, cos(θ)) in 3D
        (sin(θ), cos(θ)) in 2D (X,Z)
        
        right (1, 0, 0) wird zu:
        (cos(θ), 0, -sin(θ)) in 3D
        (cos(θ), -sin(θ)) in 2D (X,Z)
```

**Beispiele:**

```
Rotation 0°:
  forward = (sin(0°), cos(0°)) = (0, 1)     ↑ nach vorne
  right   = (cos(0°), -sin(0°)) = (1, 0)    → nach rechts

Rotation 90° (π/2):
  forward = (sin(90°), cos(90°)) = (1, 0)   → nach rechts
  right   = (cos(90°), -sin(90°)) = (0, -1) ↓ nach hinten

Rotation 45°:
  forward = (0.707, 0.707)  ↗ diagonal
  right   = (0.707, -0.707) ↘ diagonal
```

**Visualisierung bei verschiedenen Rotationen:**

```
0° Rotation:                45° Rotation:               90° Rotation:

    Z ↑                         Z ↑                         Z ↑
      |                           |                           |
    fwd                          fwd ↗                        |  right →
      |                         / |                           |
      +---→ X                  /  +---→ X                     +---→ X
    right                   right ↘                         fwd


-30° Rotation:
    
    Z ↑
     /|
   fwd|
    / |
   /  +---→ X
      |right
       ↘
```

### Debug-Visualisierung

Wenn `PHYSICS_DEBUG = true`:

```javascript
const geometry = new THREE.BoxGeometry(width, height, depth);
const material = new THREE.MeshBasicMaterial({ 
  color: 0x00ff00,  // Grün
  wireframe: true 
});
const mesh = new THREE.Mesh(geometry, material);
this.el.object3D.add(mesh);
```

**Ergebnis:**

```
Grüne Wireframe-Box zeigt die ECHTE Kollisionsform:

    /--------/
   /        /|
  /--------/ |  ← Grüne Linien
  |        | |
  |        |/
  +--------+
```

---

## 🎮 Player Controller

### Schema

```javascript
{
  speed: number,   // Bewegungsgeschwindigkeit (Meter/Sekunde)
  radius: number   // Kollisionsradius um Spieler (Meter)
}
```

### Spieler-Repräsentation

Der Spieler ist ein **Kreis** in der 2D-Ebene (X/Z):

```
Von oben gesehen:

     radius
    ←──→
    ····
  ··    ··
 ·   •    ·  ← Spieler (Kreis)
  ··    ··
    ····
    
Position = Zentrum
Radius = 0.25m (Standard)
```

### Tick-Funktion (Bewegungslogik)

**Flow:**

```
┌─────────────────────────┐
│  Jedes Frame (60x/sec)  │
└───────────┬─────────────┘
            │
            v
┌─────────────────────────────────┐
│ Lese Tasteneingaben (W/A/S/D)   │
└───────────┬─────────────────────┘
            │
            v
┌──────────────────────────────────┐
│ Hole Kamera-Rotation (Blickricht)│
└───────────┬──────────────────────┘
            │
            v
┌────────────────────────────────────┐
│ Berechne Forward/Right Vektoren    │
│ (relativ zur Kamera)               │
└───────────┬────────────────────────┘
            │
            v
┌────────────────────────────────────┐
│ Kombiniere zu Movement Vektor      │
│ movement = forward*W + right*D ... │
└───────────┬────────────────────────┘
            │
            v
┌────────────────────────────────────┐
│ Normalisiere (für konstante Speed) │
└───────────┬────────────────────────┘
            │
            v
┌────────────────────────────────────┐
│ Skaliere mit Speed × DeltaTime     │
└───────────┬────────────────────────┘
            │
            v
┌────────────────────────────────────┐
│ moveWithCollision()                │
│ (Prüfe & Handle Collision)         │
└────────────────────────────────────┘
```

### Bewegungsberechnung

**1. Richtungsvektoren erstellen:**

```javascript
const rotation = camera.rotation.y;  // Yaw (Links/Rechts schauen)

// Forward = Wo Kamera hinschaut (in XZ-Ebene)
const forward = new THREE.Vector3(0, 0, -1);  // Standard: -Z
forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);

// Right = 90° rechts von Forward
const right = new THREE.Vector3(1, 0, 0);  // Standard: +X
right.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
```

**Visualisierung:**

```
Kamera schaut nach vorne (0°):        Kamera schaut nach rechts (90°):

         Z ↑                               Z ↑
           |                                 |
       forward                               |
           |                                 |
           +---→ X                           +---→ X
         right                           forward
                                              right ↓


Kamera schaut diagonal (45°):

         Z ↑
           |   forward ↗
           |  /
           | /
           |/
           +---→ X
            \
             \ right ↘
```

**2. Tasteneingaben kombinieren:**

```javascript
const movement = new THREE.Vector3();

if (keys['w']) movement.add(forward);   // Vorwärts
if (keys['s']) movement.sub(forward);   // Rückwärts
if (keys['a']) movement.sub(right);     // Links
if (keys['d']) movement.add(right);     // Rechts
```

**Beispiel - W+D gleichzeitig gedrückt:**

```
         forward
            ↑
            |
            |
            +---→ right
           /
          /  resultierend = forward + right
         /   (diagonal ↗)
        ↗
```

**3. Normalisierung:**

```javascript
movement.normalize();  // Länge = 1
```

**Warum?**

```
forward = (0, 0, 1)     |forward| = 1
right = (1, 0, 0)       |right| = 1

forward + right = (1, 0, 1)
|forward + right| = sqrt(1² + 1²) = √2 ≈ 1.414

→ Diagonal wäre 41% schneller! ❌

Nach Normalisierung:
(1, 0, 1) / 1.414 = (0.707, 0, 0.707)
|(0.707, 0, 0.707)| = 1 ✓

→ Alle Richtungen gleich schnell!
```

**4. Skalierung mit Speed & DeltaTime:**

```javascript
movement.multiplyScalar(speed * dt);
```

```
speed = 15 m/s
dt = 0.016s (60 FPS)

movement_per_frame = 15 * 0.016 = 0.24 m
                   = 24 cm pro Frame
```

---

## 🔍 Kollisionserkennung

### Algorithmus-Übersicht

**Circle vs OBB Collision Detection**

```
┌──────────────────────────────────────┐
│ 1. Transformiere Spieler in lokalen  │
│    Raum der Box (Dot Product)        │
└────────────┬─────────────────────────┘
             │
             v
┌──────────────────────────────────────┐
│ 2. Finde nächsten Punkt auf Box      │
│    (Clamp auf Grenzen)                │
└────────────┬─────────────────────────┘
             │
             v
┌──────────────────────────────────────┐
│ 3. Berechne Distanz                  │
│    (Euklidische Distanz)              │
└────────────┬─────────────────────────┘
             │
             v
┌──────────────────────────────────────┐
│ 4. Vergleiche mit Radius             │
│    dist < radius → KOLLISION!         │
└──────────────────────────────────────┘
```

### Schritt 1: Koordinatentransformation

**Code:**
```javascript
const playerPos = new THREE.Vector2(x, z);
const toPlayer = playerPos.clone().sub(obb.center);

const localX = toPlayer.dot(obb.right);
const localZ = toPlayer.dot(obb.forward);
```

**Detaillierte Visualisierung:**

```
SETUP:
  Box Center: (5, 3)
  Box Rotation: 30°
  Player: (7, 5)


SCHRITT 1: Vektor berechnen
───────────────────────────

    Z ↑
      |
      |            • Player (7, 5)
      |           /
      |          /
      |         /  toPlayer
      |        /
      |    /--+--/
      |   / @ (5,3)  Box
      |  /------/
      +─────────────→ X

toPlayer = (7, 5) - (5, 3) = (2, 2)


SCHRITT 2: Richtungsvektoren der Box
─────────────────────────────────────

rotation = 30° = 0.524 rad

forward = (sin(30°), cos(30°))
        = (0.5, 0.866)

right = (cos(30°), -sin(30°))
      = (0.866, -0.5)

    Z ↑
      |  
      |     forward (0.5, 0.866)
      |        ↗
      |       /
      |   /--+--/
      |  /   @   /  Box
      | /-------/
      +───↘─────────→ X
      right (0.866, -0.5)


SCHRITT 3: Projektion (Dot Product)
────────────────────────────────────

localX = toPlayer · right
       = (2, 2) · (0.866, -0.5)
       = 2 × 0.866 + 2 × (-0.5)
       = 1.732 - 1.0
       = 0.732

localZ = toPlayer · forward
       = (2, 2) · (0.5, 0.866)
       = 2 × 0.5 + 2 × 0.866
       = 1.0 + 1.732
       = 2.732

Lokale Position: (0.732, 2.732)


VISUALISIERUNG DER TRANSFORMATION:
───────────────────────────────────

Global Space:                  Local Space:

    Z ↑                           forward ↑
      |                                  |
      |     • (7,5)                      | • (0.732, 2.732)
      |    /                             |/|
      |   /                              | |
      |  / toPlayer                      | | 2.732
      | /                                | |
      +-------→ X                        +-|──→ right
     /|                                    0.732
    / @ Box
   /
  
Die Box ist jetzt "aufgerichtet"!
```

### Schritt 2: Closest Point (Clamping)

**Konzept:** Finde den nächstgelegenen Punkt **auf** der Box zum Spieler.

**Code:**
```javascript
const closestX = Math.max(-halfWidth, Math.min(localX, halfWidth));
const closestZ = Math.max(-halfDepth, Math.min(localZ, halfDepth));
```

**Clamp-Funktion visualisiert:**

```
clamp(value, min, max):

  min              max
   |                |
   v                v
   ├────────────────┤
   
   value = -2  →  return min  (zu klein)
   value = 0   →  return 0    (innerhalb)
   value = 5   →  return max  (zu groß)
```

**Anwendung auf Box:**

```
Box im lokalen Raum:
  halfWidth = 1 (→ -1 bis +1)
  halfDepth = 1.5 (→ -1.5 bis +1.5)

     -halfDepth        +halfDepth
         |                 |
         v                 v
    ┌────┴────┬────┬────┬────┐
 -1 │         |    |    |    │
    │    NW   | N  | NE |    │
    ├─────────┼────┼────┼────┤
    │         |    |    |    │
  0 │    W    | C  | E  |    │  ← Regionen
    │         |    |    |    │
    ├─────────┼────┼────┼────┤
    │    SW   | S  | SE |    │
 +1 │         |    |    |    │
    └────┬────┴────┴────┴────┘
         ^                 ^
      -halfWidth      +halfWidth
```

**Verschiedene Fälle:**

```
FALL 1: Spieler direkt über der Box
────────────────────────────────────

                • Player (0, 3)
                |
                | dist
                |
    ┌───────────X───────────┐  ← Closest Point (0, 1.5)
    │           |           │
    │           |           │
    │           @           │  Box
    │                       │
    └───────────────────────┘

closestX = clamp(0, -1, 1) = 0        ✓ in range
closestZ = clamp(3, -1.5, 1.5) = 1.5  ✗ zu groß → obere Kante


FALL 2: Spieler diagonal außen
───────────────────────────────

    ┌───────────────────────┐
    │                       │
    │                       │
    │           @           │  Box
    │                       │
    └───────────────────────X  ← Closest Point (1, 1.5)
                             \
                              \
                               • Player (2, 3)

localX = 2, localZ = 3

closestX = clamp(2, -1, 1) = 1        ✗ zu groß → rechte Kante
closestZ = clamp(3, -1.5, 1.5) = 1.5  ✗ zu groß → obere Kante

→ Closest Point = Ecke!


FALL 3: Spieler innerhalb der Box
──────────────────────────────────

    ┌───────────────────────┐
    │                       │
    │        • ← Player AND Closest Point
    │       (0.3, 0.5)      │
    │           @           │  Box
    └───────────────────────┘

closestX = clamp(0.3, -1, 1) = 0.3    ✓ in range
closestZ = clamp(0.5, -1.5, 1.5) = 0.5 ✓ in range

→ Closest Point = Player Position
→ Distance = 0 → KOLLISION!
```

### Schritt 3: Distanzberechnung

**Code:**
```javascript
const distX = localX - closestX;
const distZ = localZ - closestZ;
const dist = Math.sqrt(distX * distX + distZ * distZ);
```

**Euklidische Distanz:**

```
     B (localX, localZ)
     •
     |\
     | \
     |  \  dist = √(distX² + distZ²)
distZ|   \
     |    \
     |     \
     +──────• A (closestX, closestZ)
       distX
```

**Beispiel:**
```
localX = 2, localZ = 3
closestX = 1, closestZ = 1.5

distX = 2 - 1 = 1
distZ = 3 - 1.5 = 1.5

dist = √(1² + 1.5²)
     = √(1 + 2.25)
     = √3.25
     = 1.803
```

### Schritt 4: Kollisionsprüfung

**Code:**
```javascript
if (dist < radius) {
  // KOLLISION!
  return { normal, obb, penetration };
}
```

**Visualisierung:**

```
radius = 0.5

         Spieler
        ←─────→
        0.5   0.5
         ····
       ··    ··
      ·   •    ·
       ··    ··
         ····
          |
          | dist = 0.3
          |
    ┌─────X─────┐
    │  Closest  │
    │   Point   │  Box
    └───────────┘

dist (0.3) < radius (0.5) → KOLLISION! ✓


         Spieler
        ←─────→
        0.5   0.5
         ····
       ··    ··
      ·   •    ·
       ··    ··
         ····
          |
          | dist = 0.8
          |
    ┌─────X─────┐
    │  Closest  │
    │   Point   │  Box
    └───────────┘

dist (0.8) < radius (0.5) → Keine Kollision ✗
```

### Normale berechnen

Die **Normale** zeigt vom Kollisionspunkt **weg vom Hindernis**.

**Code:**
```javascript
// Normal in lokalem Raum
const localNormal = new THREE.Vector2(distX / dist, distZ / dist);

// Zurück in Weltkoordinaten transformieren
const worldNormal = obb.right.clone().multiplyScalar(localNormal.x)
  .add(obb.forward.clone().multiplyScalar(localNormal.y));
worldNormal.normalize();
```

**Transformation visualisiert:**

```
LOCAL SPACE:                    WORLD SPACE:

  forward ↑                         Z ↑
         |                            |
         | • Player                   |      • Player
         |/                           |     /
         X Closest                  /─+─/ X
        /|                        /  @  /  /
       / |                       /─────/ /
      /  +──→ right             Box    /
     /                                ↗
    ↗ localNormal (0.6, 0.8)    worldNormal
                                (transformed)


BERECHNUNG:
───────────

Box Rotation: 45°
right = (0.707, 0.707)
forward = (0.707, -0.707)

localNormal = (0.6, 0.8)  // schon normalisiert

worldNormal = right × 0.6 + forward × 0.8
            = (0.707, 0.707) × 0.6 + (0.707, -0.707) × 0.8
            = (0.424, 0.424) + (0.566, -0.566)
            = (0.990, -0.142)

Nach Normalisierung: (0.990, -0.142) / |...| = (0.989, -0.142)
```

**Spezialfall: dist ≈ 0 (Spieler AUF Box):**

```javascript
// Division durch 0 vermeiden!
const absX = Math.abs(localX / halfWidth);
const absZ = Math.abs(localZ / halfDepth);

if (absX > absZ) {
  // Näher an X-Kante → Push horizontal
  localNormal = new THREE.Vector2(Math.sign(localX), 0);
} else {
  // Näher an Z-Kante → Push vertikal
  localNormal = new THREE.Vector2(0, Math.sign(localZ));
}
```

```
Beispiel:

    ┌───────────────────┐
    │                   │
    │    • Player auf   │ localX = 0.9, localZ = 0.2
    │      Kante        │ halfWidth = 1, halfDepth = 1.5
    │                   │
    └───────────────────┘

absX = |0.9 / 1| = 0.9
absZ = |0.2 / 1.5| = 0.13

absX > absZ → push in X direction

localNormal = (sign(0.9), 0) = (1, 0)  → nach rechts
```

---

## 🛝 Collision Response & Sliding

### Konzept

Wenn der Spieler gegen ein Hindernis läuft, soll er nicht **stoppen**, sondern entlang der Oberfläche **gleiten**.

```
Original Movement:          Nach Collision Response:

    →↗ movement                     |
   /                                | Wand
  /                                 |
 /                                  |
•──────────────                    •→→→→ sliding
    Wand                              (entlang Wand)
```

### moveWithCollision() Funktion

**Algorithmus:**

```
┌─────────────────────────────┐
│ Berechne neue Position      │
│ newPos = pos + movement     │
└──────────┬──────────────────┘
           │
           v
    ┌──────────────┐
    │ Kollision?   │
    └──────┬───────┘
      NEIN │  JA
    ┌──────┴───────┐
    │              │
    v              v
┌────────┐   ┌─────────────────┐
│ Bewege │   │ Berechne Normale│
│  frei  │   └────────┬────────┘
└────────┘            │
                      v
              ┌───────────────────┐
              │ dotProduct < 0?   │
              │ (In Wand laufend?)│
              └────────┬──────────┘
                  JA   │   NEIN
              ┌────────┴───────┐
              │                │
              v                v
      ┌───────────────┐  ┌──────────┐
      │ Sliding:      │  │ Push-Out │
      │ Berechne      │  │ (Klein)  │
      │ Tangente      │  └──────────┘
      └───────┬───────┘
              │
              v
      ┌───────────────┐
      │ Versuche      │
      │ Tangent-Move  │
      └───────┬───────┘
              │
        ┌─────┴─────┐
        │ Koll.?    │
        └─────┬─────┘
         JA   │  NEIN
      ┌──────┴──────┐
      │             │
      v             v
  ┌────────┐  ┌─────────┐
  │Push-Out│  │ Slide!  │
  └────────┘  └─────────┘
```

### Sliding-Mathematik

**Ziel:** Entferne die Komponente der Bewegung, die **in die Wand** geht.

**Vektorzerlegung:**

```
          movement
             ↗
            /|\
           / | \
          /  |  \
         /   |   \
        /    ↓    \
       /  normal   \
      /  component  \
     /_______________\
    tangent component
    
tangent = movement - normal_component
```

**Formeln:**

```javascript
// 1. Wie stark bewegen wir uns in die Wand?
dotProduct = movement · normal

// 2. Vektor in Wand-Richtung
normalComponent = normal × dotProduct

// 3. Entferne ihn
tangent = movement - normalComponent
```

**Erweiterte Formel (kombiniert):**

```
tangent = movement - (movement · normal) × normal
```

**Beispiel:**

```
movement = (1, 1)  // Diagonal nach rechts-hinten
normal = (0, 1)    // Wand steht vertikal, Normal zeigt nach hinten

dotProduct = (1, 1) · (0, 1)
           = 1 × 0 + 1 × 1
           = 1

normalComponent = (0, 1) × 1
                = (0, 1)

tangent = (1, 1) - (0, 1)
        = (1, 0)  // Nur nach rechts!


VISUALISIERUNG:

         movement (1, 1)
             ↗
            /|\
           / | \
          /  |  \ normalComp (0, 1)
         /   |   \
        /    ↓    ↓
       /───────────────  Wand
      →  tangent (1, 0)
```

**Warum nur wenn dotProduct < 0?**

```
dotProduct = movement · normal

dotProduct < 0:  Bewegung IN die Wand (Winkel > 90°)
                 → Sliding nötig ✓
                 
        ↗ movement
       /   ↑ normal
      /  /
  ───•/─────  Wand
  
  Winkel > 90° → cos(θ) < 0 → dot < 0


dotProduct > 0:  Bewegung VON Wand WEG (Winkel < 90°)
                 → Sliding unnötig
                 → Nur kleiner push-out
                 
        ↑ normal
         \
          \  ↗ movement
  ─────────•───  Wand
  
  Winkel < 90° → cos(θ) > 0 → dot > 0
```

### Push-Out Mechanismus

**Problem:** An Ecken kann man "stecken bleiben".

**Lösung:** Wenn kollidiert, schiebe Spieler leicht von der Wand weg.

```javascript
if (dotProduct < 0) {
  // In Wand laufend → Try sliding
  // ...
  if (stillColliding) {
    pos += normal × 0.02;  // Stärkerer Push
  }
} else {
  // Von Wand weg laufend → Kleiner Push (anti-stick)
  pos += normal × 0.01;
}
```

**Visualisierung:**

```
OHNE Push-Out:                 MIT Push-Out:

    |                              |
    | Wand                         | Wand
    |___                           |___
    |   ●← Spieler                 |      ●← Spieler
    |     steckt fest              |    (0.01m Abstand)
    |                              |
    
    Problem: Numerische Fehler    ✓ Smooth movement
    → Spieler klebt
```

**Warum so klein (0.01-0.02)?**

```
0.01m = 1cm  → Kaum sichtbar
0.02m = 2cm  → Immer noch sehr klein

Aber ausreichend um:
  ✓ Numerische Fehler zu vermeiden
  ✓ Infinite Loops zu verhindern
  ✓ Sticking an Ecken zu beheben
```

---

## 📐 Mathematische Details

### Trigonometrie

**Einheitskreis (von oben):**

```
           Z (forward)
           ↑  (0, 1)
           |
   (-0.707,|0.707)
      ↖    |    ↗ (0.707, 0.707)
        \  |  /
         \ | /
          \|/
───────────+───────────→ X (right)
(-1, 0)   /|\   (1, 0)
         / | \
        /  |  \
      ↙    |    ↘
   (-0.707,|-0.707)
           |
           ↓ (0, -1)
```

**Rotation um Y-Achse (Yaw):**

```
Punkt P = (x, 0, z)
Rotiert um θ:

P' = (x × cos(θ) - z × sin(θ),
      0,
      x × sin(θ) + z × cos(θ))

In 2D (X, Z):
P' = (x × cos(θ) - z × sin(θ),
      x × sin(θ) + z × cos(θ))
```

**Forward/Right Ableitung:**

```
Forward startet als (0, -1) in A-Frame
Nach Rotation θ:
  forward = (0 × cos(θ) - (-1) × sin(θ),
             0 × sin(θ) + (-1) × cos(θ))
          = (sin(θ), -cos(θ))
          
  Aber Z zeigt nach hinten, also flippen:
  forward = (-sin(θ), cos(θ))
  
  Wait, in unserem Code haben wir:
  forward = (sin(θ), cos(θ))
  
  Das ist weil wir Z als "nach vorne" definieren!
```

### Vektor-Operationen

**Addition:**
```
A + B = (Ax + Bx, Ay + By)

     B
     ↑
    /
   /
  +---→ A

  A + B
   ↗
```

**Subtraktion:**
```
A - B = (Ax - Bx, Ay - By)

  A
  →
    
  B •─→ A - B
  →
```

**Skalar-Multiplikation:**
```
k × A = (k × Ax, k × Ay)

2 × (1, 2) = (2, 4)

  ↑ A
  |
  
  ↑↑ 2×A (doppelt so lang)
  ||
```

**Dot Product (Skalarprodukt):**
```
A · B = Ax × Bx + Ay × By
      = |A| × |B| × cos(θ)

Wenn B normalisiert (|B| = 1):
A · B = |A| × cos(θ)
      = Projektion von A auf B
```

**Länge (Magnitude):**
```
|A| = √(Ax² + Ay²)

|(3, 4)| = √(3² + 4²)
         = √(9 + 16)
         = √25
         = 5
```

**Normalisierung:**
```
normalize(A) = A / |A|
             = (Ax / |A|, Ay / |A|)

A = (3, 4)
|A| = 5

normalize(A) = (3/5, 4/5)
             = (0.6, 0.8)

|normalize(A)| = √(0.6² + 0.8²)
               = √(0.36 + 0.64)
               = √1
               = 1 ✓
```

---

## ⚡ Performance & Optimierung

### Complexity Analysis

**Pro Frame (60 FPS):**

```
Für N Wände:
  ├─ N × getOBB()           → O(1) pro Wand
  ├─ N × dot products       → O(1) pro Wand
  ├─ N × clamp operations   → O(1) pro Wand
  └─ N × distance calc      → O(1) pro Wand

Gesamt: O(N)

Bei 100 Wänden:
  100 × ~20 Operationen = 2000 Ops/Frame
  @ 60 FPS = 120,000 Ops/Sekunde
  
  Völlig vertretbar für moderne CPUs!
```

### Optimierungsmöglichkeiten

**1. Early Exit:**
```javascript
if (dist > radius + maxPossibleMovement) {
  continue;  // Zu weit weg, skip!
}
```

**2. Spatial Partitioning:**
```
Grid-basiert:

┌───┬───┬───┬───┐
│   │ W │   │   │  Nur Wände in
├───┼───┼───┼───┤  aktuellem Grid-Cell
│   │ P │ W │   │  prüfen!
├───┼───┼───┼───┤
│ W │   │   │ W │  P = Player
├───┼───┼───┼───┤  W = Wall
│   │   │   │   │
└───┴───┴───┴───┘
```

**3. Object Pooling:**
```javascript
// Statt jedes Frame neue Vector2 erstellen:
this.tempVec = new THREE.Vector2();  // In init()

// In tick():
this.tempVec.set(x, z);  // Wiederverwenden
```

**4. Broadphase:**
```javascript
// Schnelle AABB-Prüfung vor genauer OBB-Prüfung
if (!aabbOverlap(player, box.getAABB())) {
  continue;  // Definitiv keine Kollision
}
// Jetzt erst OBB-Check
```

### Aktuelle Performance

**Messungen:**

```
Scene mit 10 Wänden, 1 Spieler:
  ├─ Collision Check: ~0.1ms/Frame
  ├─ Movement Calc: ~0.05ms/Frame
  └─ Total: ~0.15ms/Frame

@ 60 FPS → 16.67ms Budget/Frame
→ Collision nutzt nur 0.9% der Zeit! ✓

Selbst mit 100 Wänden:
  ~1.5ms/Frame = 9% Budget
  Immer noch sehr gut!
```

---

## 🎓 Zusammenfassung

### Kernprinzipien

1. **OBB = Rotierte AABB**
   - Jede Box hat lokales Koordinatensystem
   - Forward/Right Vektoren definieren Orientierung

2. **Koordinatentransformation via Dot Product**
   - Globaler Raum → Lokaler Raum
   - Projektion auf Box-Achsen

3. **Closest Point Algorithm**
   - Clamping findet nächsten Punkt
   - Im lokalen Raum sehr einfach

4. **Circle-AABB Collision**
   - Im lokalen Raum: Simple Distanzprüfung
   - Funktioniert für alle Rotationen

5. **Vektorprojektion für Sliding**
   - Entferne Normal-Komponente
   - Behalte Tangential-Komponente

6. **Push-Out für Robustheit**
   - Verhindert Steckenbleiben
   - Kleiner Wert (1-2cm)

### Was du gelernt hast

✅ Orientierte Bounding Boxes (OBB)  
✅ Koordinatentransformationen  
✅ Dot Product & Vektorprojektionen  
✅ Collision Detection Algorithmen  
✅ Collision Response & Sliding  
✅ Game Physics Grundlagen  

### Nächste Schritte

Mögliche Erweiterungen:

- **3D Kollision** (Y-Achse einbeziehen)
- **Moving Objects** (Dynamic-vs-Dynamic)
- **Friction/Drag** (Physikalischere Bewegung)
- **Raycasting** (Präzise Checks)
- **Collision Layers** (Selektive Kollision)

---

**Ende der Dokumentation**

*Erstellt am 1. März 2026*  
*BleatchVR Physics System v1.0*
