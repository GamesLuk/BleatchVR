# Networked-Aframe (NAF) Integration in BleatchVR
KI - Generated (100 %)

## Inhaltsverzeichnis
1. [Überblick](#überblick)
2. [Backend-Struktur](#backend-struktur)
3. [Architektur](#architektur)
4. [Beispielimplementation](#beispielimplementation)
5. [Konfiguration](#konfiguration)
6. [Troubleshooting](#troubleshooting)

---

## Überblick

Networked-Aframe (NAF) ist eine Framework-Erweiterung für A-Frame, die Multi-User-VR-Erlebnisse im Web ermöglicht. In diesem Projekt nutzen wir NAF mit einem **Socket.io-Adapter** für Echtzeit-WebSocket-Kommunikation.

### Technologie-Stack
- **Frontend**: A-Frame + Networked-Aframe (via CDN)
- **Backend**: Node.js + Express + Socket.io
- **Webserver**: Caddy (Reverse Proxy + Static Files)
- **Container**: Docker Compose

### Warum Socket.io statt WebRTC?
- ✅ Einfachere Server-Implementierung
- ✅ Skalierbar für viele Nutzer
- ✅ Keine STUN/TURN-Server nötig
- ✅ Server als zentrale Authorität
- ❌ Keine Voice/Video-Chat (nur bei WebRTC)

---

## Backend-Struktur

Das Backend wurde auf das absolute Minimum reduziert:

```
backend/
├── socketio-server.js         # WebSocket-Server
├── package.json               # Dependencies (nur express + socket.io)
├── package-lock.json          # Locked Versions
├── LICENSE                    # MIT Lizenz
└── .gitignore                 # Ignore node_modules etc.
```

### 1. socketio-server.js

**Zweck**: WebSocket-Server für Multiplayer-Synchronisation

**Hauptfunktionen:**

#### Connection Handling
```javascript
io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  // Jeder Client bekommt eine eindeutige Socket-ID
});
```

#### Room Management
- Clients können Räume beitreten (`joinRoom`)
- Automatische Instanzierung bei >50 Spielern pro Raum
- Raum-Struktur: `{ name, occupants, occupantsCount }`

#### Event-Typen

| Event | Beschreibung | Sender | Empfänger |
|-------|--------------|--------|-----------|
| `joinRoom` | Client tritt Raum bei | Client → Server | - |
| `connectSuccess` | Bestätigung + Timestamp | Server → Client | Nur Sender |
| `occupantsChanged` | Liste aller Spieler im Raum | Server → Clients | Alle im Raum |
| `send` | Direktnachricht an einen Spieler | Client → Server → Client | Spezifischer Client |
| `broadcast` | Nachricht an alle im Raum | Client → Server → Clients | Alle außer Sender |
| `disconnect` | Client verlässt Server | Client → Server | - |

#### Room Instancing (Auto-Scaling)
```javascript
const maxOccupantsInRoom = 50;

// Wenn Raum voll: Erstelle neue Instanz
if (roomInfo.occupantsCount >= maxOccupantsInRoom) {
  // Suche nach verfügbarer Instanz: "lobby--2", "lobby--3" etc.
  // Oder erstelle neue
}
```

**Verwendete Ports:**
- Standard: `8080` (konfigurierbar via `process.env.PORT`)
- Nur intern erreichbar (kein Port-Expose in docker-compose)

---

### 2. package.json

**Zweck**: Dependency-Management und npm-Scripts

**Dependencies:**
```json
{
  "express": "^4.17.3",    // HTTP-Server Framework
  "socket.io": "^4.8.1"    // WebSocket-Library
}
```

**Scripts:**
```json
{
  "start": "node ./socketio-server.js"
}
```

**Warum so minimal?**
- ❌ Kein Webpack (Client-Code via CDN)
- ❌ Kein Babel (Node.js 18+ unterstützt moderne Syntax)
- ❌ Keine Tests (bisher nicht implementiert)
- ✅ Nur Runtime-Dependencies

---

### 3. package-lock.json

**Zweck**: Version-Locking aller Dependencies

- Sichert exakte Versionen von Express (~30 Packages) und Socket.io (~50 Packages)
- Insgesamt ~88 Packages durch Sub-Dependencies
- Garantiert identische Builds in Dev/Prod
- **Größe**: ~1050 Zeilen / 37 KB (normal für npm lockfile v3)

---

## Architektur

### Request Flow

```
Client Browser
    ↓ HTTPS
Cloudflare Tunnel
    ↓
Caddy Container (Port 443)
    ├─ /files/*        → Static Files (HTML/JS/CSS/Models)
    └─ /socket.io/*    → Reverse Proxy
                           ↓
                      Node.js Container (Port 8080)
                      (WebSocket Server)
```

### Docker Network
Alle Container befinden sich im gleichen Docker-Netzwerk:
- `caddy` → `nodejs:8080` (interner DNS)
- Kein Port-Expose für Node.js nötig
- Nur Caddy exponiert Port 443 (HTTPS)

### Caddyfile-Konfiguration

```caddyfile
handle /socket.io/* {
    reverse_proxy nodejs:8080
}
```

**Wichtig:** 
- Muss `/socket.io/*` matchen (nicht `/socket/*`)
- Socket.io nutzt diesen Pfad standardmäßig

---

## Beispielimplementation

### Minimale Multi-User VR Scene

```html
<!DOCTYPE html>
<html>
  <head>
    <title>BleatchVR Multiplayer</title>
    
    <!-- A-Frame Core (1.7.0) -->
    <script src="https://aframe.io/releases/1.7.0/aframe.min.js"></script>
    
    <!-- Socket.io Client (4.8.1) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.8.1/socket.io.min.js"></script>
    
    <!-- Networked-Aframe (0.14.0) -->
    <script src="https://unpkg.com/networked-aframe@^0.14.0/dist/networked-aframe.min.js"></script>
  </head>
  
  <body>
    <a-scene networked-scene="
      room: lobby;
      adapter: socketio;
      serverURL: /;
    ">
      
      <!-- Assets & Templates -->
      <a-assets>
        <!-- Avatar Template für Remote-Spieler -->
        <template id="avatar-template">
          <a-sphere color="#5985ff" radius="0.3"></a-sphere>
        </template>
      </a-assets>
      
      <!-- Lokaler Spieler (Camera + Networking) -->
      <a-entity id="player" 
                networked="template:#avatar-template;attachTemplateToLocal:false;" 
                camera 
                wasd-controls 
                look-controls 
                position="0 1.6 0">
      </a-entity>
      
      <!-- Umgebung -->
      <a-plane color="#7BC8A4" rotation="-90 0 0" width="20" height="20"></a-plane>
      <a-sky color="#ECECEC"></a-sky>
      
    </a-scene>
  </body>
</html>
```

### Code-Erklärung

#### 1. Script-Einbindung (Head)

**Reihenfolge ist wichtig!**

```html
<script src="...aframe.min.js"></script>        <!-- 1. A-Frame Core -->
<script src="...socket.io.min.js"></script>     <!-- 2. Socket.io Client -->
<script src="...networked-aframe.min.js"></script> <!-- 3. NAF -->
```

NAF benötigt sowohl A-Frame als auch Socket.io, daher müssen diese zuerst geladen werden.

#### 2. Networked Scene Konfiguration

```html
<a-scene networked-scene="
  room: lobby;           ← Name des Raums (Spieler im gleichen Raum sehen sich)
  adapter: socketio;     ← Verwendeter Adapter (socketio/easyrtc/webrtc)
  serverURL: /;          ← Basis-URL des Backends (/ = gleiche Domain)
">
```

**Parameter-Erklärung:**

| Parameter | Wert | Bedeutung |
|-----------|------|-----------|
| `room` | `lobby` | Raum-Identifier. Alle Clients mit gleichem Raum-Namen werden synchronisiert |
| `adapter` | `socketio` | NAF nutzt Socket.io für Kommunikation (statt WebRTC) |
| `serverURL` | `/` | WebSocket-Server auf gleicher Domain. Caddy leitet `/socket.io/*` weiter |

**Alternative serverURL-Werte:**
- `/` - Gleiche Domain (Standard)
- `https://api.example.com` - Anderer Server
- `http://localhost:8080` - Lokales Development

#### 3. Avatar Template

```html
<a-assets>
  <template id="avatar-template">
    <a-sphere color="#5985ff" radius="0.3"></a-sphere>
  </template>
</a-assets>
```

**Was ist ein Template?**
- HTML-Template für Remote-Spieler
- Wird für jeden anderen Spieler instanziiert
- Kann beliebige A-Frame-Entities enthalten

**Beispiel-Templates:**

```html
<!-- Einfacher Avatar -->
<template id="avatar-template">
  <a-sphere color="#5985ff" radius="0.3"></a-sphere>
</template>

<!-- Avatar mit Nametag -->
<template id="avatar-template">
  <a-entity>
    <a-sphere color="#5985ff" radius="0.3"></a-sphere>
    <a-text value="Player" position="0 0.5 0" align="center"></a-text>
  </a-entity>
</template>

<!-- 3D-Modell Avatar -->
<template id="avatar-template">
  <a-gltf-model src="/files/models/player.glb"></a-gltf-model>
</template>
```

#### 4. Networked Entity

```html
<a-entity id="player" 
          networked="template:#avatar-template;attachTemplateToLocal:false;" 
          camera 
          wasd-controls 
          look-controls 
          position="0 1.6 0">
</a-entity>
```

**Component-Breakdown:**

| Attribut | Wert | Beschreibung |
|----------|------|--------------|
| `networked` | - | NAF-Component für Synchronisation |
| `template` | `#avatar-template` | Verwendet dieses Template für Remote-Spieler |
| `attachTemplateToLocal` | `false` | Lokaler Spieler sieht eigenen Avatar **nicht** |
| `camera` | - | First-Person Kamera |
| `wasd-controls` | - | Tastatur-Steuerung |
| `look-controls` | - | Maus-Look |
| `position` | `0 1.6 0` | Startposition (1.6m = Augenhöhe) |

**Warum `attachTemplateToLocal:false`?**
- Der lokale Spieler sieht keine Kugel vor seinem Gesicht
- Nur andere Spieler sehen seinen Avatar
- Bei VR-Controllern eventuell auf `true` setzen (um eigene Hände zu sehen)

---

## Konfiguration

### Erweiterte Networked-Scene Optionen

```html
<a-scene networked-scene="
  room: myRoom;
  adapter: socketio;
  serverURL: /;
  connectOnLoad: true;
  debug: false;
  audio: false;
">
```

| Option | Default | Beschreibung |
|--------|---------|--------------|
| `connectOnLoad` | `true` | Automatisch verbinden beim Laden |
| `debug` | `false` | Debug-Logs in Console |
| `audio` | `false` | Audio-Streaming (nur WebRTC) |

### Synchronisierte Komponenten

**Standard-Synchronisation:**
- `position`
- `rotation`

**Custom Components synchronisieren:**

```javascript
// Schema registrieren
NAF.schemas.add({
  template: '#avatar-template',
  components: [
    'position',
    'rotation',
    'scale',
    'material',  // Farbe, Textur synchronisieren
    'visible'    // Sichtbarkeit synchronisieren
  ]
});
```

### Server-Port ändern

**In docker-compose.yml:**
```yaml
nodejs:
  environment:
    - PORT=3000
  # ...
```

**In Caddyfile anpassen:**
```caddyfile
handle /socket.io/* {
    reverse_proxy nodejs:3000
}
```

### Mehrere Räume

**Dynamische Räume via URL-Parameter:**
```html
<script>
  // URL: https://example.com/?room=dungeon
  const urlParams = new URLSearchParams(window.location.search);
  const roomName = urlParams.get('room') || 'lobby';
  
  document.querySelector('a-scene').setAttribute('networked-scene', {
    room: roomName,
    adapter: 'socketio',
    serverURL: '/'
  });
</script>
```

---

## Troubleshooting

### 1. "Failed to connect to server"

**Symptom:** Console zeigt WebSocket-Fehler

**Lösung:**
```bash
# Prüfe Backend-Logs
docker logs bleatchvr-nodejs

# Erwartete Ausgabe:
# listening on http://localhost:8080
```

**Checklist:**
- ✅ Container läuft: `docker ps | grep nodejs`
- ✅ Caddyfile Reverse Proxy korrekt: `/socket.io/*`
- ✅ Nicht `/socket/*` verwenden!
- ✅ `serverURL: /` in HTML korrekt

### 2. "Spieler sehen sich nicht"

**Symptom:** Jeder sieht nur sich selbst

**Ursachen:**
- ❌ Unterschiedliche Räume: `room: lobby` vs `room: Lobby`
- ❌ Kein `networked`-Component auf Entity
- ❌ Template-ID stimmt nicht überein

**Lösung:**
```javascript
// Console öffnen und prüfen:
NAF.connection.adapter.getConnectedClients()
// Sollte mindestens 1 anderen Client zeigen
```

### 3. "Avatar nicht sichtbar"

**Symptom:** Remote-Spieler sind unsichtbar

**Lösung:**
```html
<!-- Template muss in <a-assets> sein -->
<a-assets>
  <template id="avatar-template">
    <a-sphere color="red" radius="0.3"></a-sphere>
  </template>
</a-assets>

<!-- ID muss mit # referenziert werden -->
<a-entity networked="template:#avatar-template"></a-entity>
```

### 4. Performance-Probleme

**Symptom:** Laggy Bewegungen bei vielen Spielern

**Lösungen:**

**Tick-Rate reduzieren:**
```javascript
NAF.options.updateRate = 15; // Standard: 15 Hz (15 Updates/Sekunde)
```

**Interpolation aktivieren:**
```html
<a-entity networked="template:#avatar-template;networkId:player1;interpolation:true;"></a-entity>
```

**Compression aktivieren (Beta):**
```javascript
NAF.options.compressSyncUpdate = true;
```

### 5. Docker-Container startet nicht

```bash
# Node.js Container Logs
docker logs bleatchvr-nodejs

# Häufige Fehler:
# - "Cannot find module 'express'" → npm install fehlt
# - "Port already in use" → Alter Container läuft noch

# Neustart
docker-compose down
docker-compose up -d --build
```

---

## Best Practices

### 1. Netzwerk-Effizienz

**❌ Schlecht:** Alles synchronisieren
```html
<a-entity networked="template:#avatar">
  <a-box></a-box>
  <a-sphere></a-sphere>
  <a-cylinder></a-cylinder>
  <!-- 100 Child-Entities... -->
</a-entity>
```

**✅ Gut:** Nur Parent synchronisieren, Children sind lokal gleich
```html
<!-- Template mit allen Children -->
<template id="avatar-template">
  <a-entity>
    <a-box></a-box>
    <a-sphere></a-sphere>
    <a-cylinder></a-cylinder>
  </a-entity>
</template>

<!-- Nur Parent wird synchronisiert -->
<a-entity networked="template:#avatar-template"></a-entity>
```

### 2. Sicherheit

**Server-Side-Validierung:**
Der aktuelle Server validiert **NICHT**. Für Production:

```javascript
socket.on("send", (data) => {
  // ❌ Aktuell: Blind weiterleiten
  io.to(data.to).emit("send", data);
  
  // ✅ Besser: Validieren
  if (isValidPosition(data.position)) {
    io.to(data.to).emit("send", data);
  }
});
```

### 3. Raum-Management

**Verwende sprechende Raum-Namen:**
```javascript
const room = `game_${gameId}_level_${levelId}`;
// Beispiel: "game_abc123_level_5"
```

**Räume begrenzen:**
```javascript
// Im socketio-server.js bereits implementiert:
const maxOccupantsInRoom = 50;
```

---

## Weiterführende Ressourcen

- [Networked-Aframe Docs](https://github.com/networked-aframe/networked-aframe)
- [A-Frame Docs](https://aframe.io/docs/)
- [Socket.io Docs](https://socket.io/docs/)
- [NAF Community Discord](https://discord.gg/networked-aframe)

---

**Erstellt für BleatchVR** | Last Updated: 2026-02
