# 🔊 BleatchVR Audio System

## Sound-Dateien

Das Menü unterstützt sowohl **externe Sound-Dateien** als auch **synthetische Sounds**.

### Aktueller Status:
✅ **Synthetische Sounds aktiv** - funktionieren sofort ohne externe Dateien!  
📁 **Externe Sounds optional** - lege eigene MP3-Dateien hier ab für bessere Qualität

---

## 🎵 Benötigte Sound-Dateien (Optional)

Lege folgende Dateien in diesem Ordner ab:

### 1. **hover.mp3**
- Wird abgespielt wenn die Maus über einen Button geht
- Empfohlen: Kurzer, subtiler Ton (50-100ms)
- Beispiel: Leises "Whoosh" oder "Tick"

### 2. **click.mp3**
- Wird beim Klicken auf Buttons abgespielt
- Empfohlen: Knackiger, bestätigender Ton (80-150ms)
- Beispiel: "Click", "Thud", metallisches Geräusch

### 3. **background-music.mp3**
- Hintergrundmusik für das Menü (optional)
- Empfohlen: Loopbare mittelalterliche/epische Musik
- Wird automatisch geloopt
- Leise Lautstärke (20% Master Volume)

---

## 🎮 Wo Sounds herunterladen?

### Kostenlose Quellen:
- **Freesound.org** - Große Community-Sound-Bibliothek
- **Pixabay** (Audio) - Kostenlose Musik & Effekte
- **OpenGameArt.org** - Game-spezifische Sounds
- **Incompetech** - Royalty-free Musik (mit Attribution)
- **ZapSplat** - Free Sound Effects

### Empfohlene Suchbegriffe:
- "UI click medieval"
- "button hover subtle"
- "medieval tavern music"
- "fantasy game menu"
- "sword metal click"

---

## ⚙️ Sound-System Features

### Automatische Fallbacks:
- Wenn keine MP3-Dateien vorhanden → **Synthetische Sounds** werden verwendet
- Sounds werden nur geladen wenn Dateien verfügbar sind
- Keine Fehler wenn Dateien fehlen

### Aktive Sound-Effekte:
✅ **Hover** - Beim Überfahren von Buttons (800 Hz Sinus)  
✅ **Click** - Beim Klicken (400 Hz → 300 Hz)  
✅ **Select** - Bei Tastatur/Gamepad-Navigation (600 Hz → 900 Hz)  
✅ **Background Music** - Optional, startet nach 500ms

### Lautstärke-Einstellungen:
- **Master Volume**: 30%
- **SFX Volume**: 70%
- **Music Volume**: 20%

### Auto-Init:
- Sound-System startet bei erster Benutzer-Interaktion
- Hintergrundmusik startet automatisch (falls vorhanden)
- VR-Controller & Tastatur voll unterstützt

---

## 🎚️ Lautstärke anpassen

Im JavaScript (menu.html) kannst du die Lautstärke ändern:

```javascript
// In der MenuSoundManager Klasse, Zeile ~20:
this.volume = {
    master: 0.3,  // 30% - Gesamt-Lautstärke
    sfx: 0.7,     // 70% - Sound-Effekte
    music: 0.2    // 20% - Hintergrundmusik
};
```

---

## 🔇 Sounds deaktivieren

Falls du Sounds komplett deaktivieren möchtest:

```javascript
// Kommentiere diese Zeile aus (Zeile ~185):
// soundManager.init();
```

---

## ✨ Technische Details

- **Web Audio API** für synthetische Sounds
- **HTML5 Audio** für MP3-Dateien
- **Lazy Loading** - Sounds nur bei Bedarf
- **Cloning** - Mehrfache gleichzeitige Wiedergabe möglich
- **Error Handling** - Keine Crashes bei fehlenden Dateien

---

**Viel Spaß mit den Sounds! 🎮⚔️**
