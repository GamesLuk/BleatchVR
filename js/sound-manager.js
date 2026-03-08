// KI - Generated (100 %)

// ============================================
// UNIFIED SOUND SYSTEM
// Supports both menu and death screen sounds
// ============================================

class SoundManager {
    constructor(config = {}) {
        this.config = {
            type: config.type || 'menu', // 'menu' or 'death'
            buttonSelector: config.buttonSelector || '.menu-button',
            primaryButtonSelector: config.primaryButtonSelector || '.menu-button.primary',
            navigationKeys: config.navigationKeys || { prev: 'ArrowUp', next: 'ArrowDown' },
            shortcuts: config.shortcuts || {},
            tracks: config.tracks || ['vocal', 'instrumental']
        };
        
        this.sounds = {};
        this.musicTracks = {};
        this.currentTrack = null;
        this.volume = {
            master: 0.6,
            sfx: 1.0,
            music: config.type === 'death' ? 0.25 : 0.15
        };
        this.initialized = false;
        this.soundsLoaded = 0;
        this.isMusicMuted = false;
        this.currentTrackIndex = 0; // For multi-track switching
    }

    init() {
        if (this.initialized) return;
        
        this.loadSounds();
        this.initialized = true;
        console.log(`🔊 ${this.config.type === 'death' ? 'Death' : 'Menu'} sound system initializing...`);
    }

    // Load sound files
    loadSounds() {
        const soundFiles = {
            hover: '../sounds/hover.mp3',
            click: '../sounds/click.mp3'
        };
        
        // Add track files based on configuration
        this.config.tracks.forEach(trackName => {
            if (trackName === 'vocal') {
                soundFiles.vocal = '../sounds/background-music.mp3';
            } else if (trackName === 'instrumental') {
                soundFiles.instrumental = '../sounds/background-music2.mp3';
            } else if (trackName === 'ambient') {
                soundFiles.ambient = '../sounds/death-ambient.mp3';
            }
        });

        Object.keys(soundFiles).forEach(key => {
            const audio = new Audio();
            audio.src = soundFiles[key];
            audio.preload = 'auto';
            
            // Music/Ambient tracks
            if (['vocal', 'instrumental', 'ambient'].includes(key)) {
                audio.loop = true;
                audio.volume = 0; // Start at 0 for fade-in
                
                audio.addEventListener('canplaythrough', () => {
                    this.musicTracks[key] = audio;
                    console.log(`✅ Loaded: ${soundFiles[key]}`);
                }, { once: true });
            } 
            // Sound effects
            else {
                audio.volume = this.volume.master * this.volume.sfx;
                
                audio.addEventListener('canplaythrough', () => {
                    this.sounds[key] = audio;
                    this.soundsLoaded++;
                    console.log(`✅ Loaded: ${key}.mp3 (${this.soundsLoaded}/2)`);
                }, { once: true });
            }
            
            audio.addEventListener('error', (e) => {
                console.warn(`❌ Failed to load: ${soundFiles[key]}`, e);
            });
            
            // Trigger loading
            audio.load();
        });
    }

    playHoverSound() {
        if (!this.sounds.hover) return;
        
        const sound = this.sounds.hover.cloneNode();
        sound.volume = this.volume.master * this.volume.sfx * 0.5;
        sound.play().catch(() => {}); // Silently fail if not allowed
    }

    playClickSound() {
        if (!this.sounds.click) return;
        
        const sound = this.sounds.click.cloneNode();
        sound.volume = this.volume.master * this.volume.sfx;
        sound.play().catch(() => {}); // Silently fail if not allowed
    }

    playSelectSound() {
        // Use hover sound for selection navigation
        this.playHoverSound();
    }

    playBackgroundMusic() {
        const trackName = this.config.tracks[this.currentTrackIndex];
        const trackToPlay = this.musicTracks[trackName];
        
        if (!trackToPlay) return;
        
        this.currentTrack = trackToPlay;
        
        // Start playing
        trackToPlay.play().catch(() => {});
        
        // Fade in based on type
        const fadeTime = this.config.type === 'death' ? 4000 : 3000;
        this.fadeInMusic(fadeTime);
    }

    fadeInMusic(duration = 3000) {
        if (!this.currentTrack) return;
        
        const targetVolume = this.volume.master * this.volume.music;
        const steps = this.config.type === 'death' ? 80 : 60;
        const stepTime = duration / steps;
        const volumeIncrement = targetVolume / steps;
        let currentStep = 0;
        
        const fadeInterval = setInterval(() => {
            if (currentStep >= steps || !this.currentTrack) {
                clearInterval(fadeInterval);
                if (this.currentTrack) {
                    this.currentTrack.volume = targetVolume;
                }
                return;
            }
            
            currentStep++;
            this.currentTrack.volume = volumeIncrement * currentStep;
        }, stepTime);
    }

    fadeOutMusic(duration = 800, callback = null) {
        if (!this.currentTrack) return;
        
        const startVolume = this.currentTrack.volume;
        const steps = this.config.type === 'death' ? 60 : 40;
        const stepTime = duration / steps;
        const volumeDecrement = startVolume / steps;
        let currentStep = 0;
        
        const fadeInterval = setInterval(() => {
            if (currentStep >= steps || !this.currentTrack) {
                clearInterval(fadeInterval);
                if (this.currentTrack) {
                    this.currentTrack.volume = 0;
                }
                if (callback) callback();
                return;
            }
            
            currentStep++;
            this.currentTrack.volume = startVolume - (volumeDecrement * currentStep);
        }, stepTime);
    }

    toggleMute() {
        this.isMusicMuted = !this.isMusicMuted;
        
        if (this.isMusicMuted) {
            // Fade out
            this.fadeOutMusic(800, () => {
                if (this.currentTrack) {
                    this.currentTrack.pause();
                }
            });
        } else {
            // Fade in
            const trackName = this.config.tracks[this.currentTrackIndex];
            const trackToPlay = this.musicTracks[trackName];
            
            if (trackToPlay) {
                this.currentTrack = trackToPlay;
                trackToPlay.play().catch(() => {});
                this.fadeInMusic(800);
            }
        }
        
        this.updateMusicControls();
    }

    switchMusicType() {
        if (this.isMusicMuted || this.config.tracks.length <= 1) return;
        
        // Cycle to next track
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.config.tracks.length;
        const newTrackName = this.config.tracks[this.currentTrackIndex];
        const newTrack = this.musicTracks[newTrackName];
        
        if (!newTrack || !this.currentTrack) return;
        
        // Fade out current track
        this.fadeOutMusic(600, () => {
            if (this.currentTrack) {
                this.currentTrack.pause();
                this.currentTrack.currentTime = 0;
            }
            
            // Start new track
            this.currentTrack = newTrack;
            newTrack.play().catch(() => {});
            this.fadeInMusic(600);
        });
        
        this.updateMusicControls();
    }

    updateMusicControls() {
        // Update mute button icons
        const muteBtn = document.getElementById('musicMuteBtn');
        if (muteBtn) {
            const iconOn = muteBtn.querySelector('.icon-music-on');
            const iconOff = muteBtn.querySelector('.icon-music-off');
            
            if (this.isMusicMuted) {
                if (iconOn) iconOn.style.display = 'none';
                if (iconOff) iconOff.style.display = 'block';
            } else {
                if (iconOn) iconOn.style.display = 'block';
                if (iconOff) iconOff.style.display = 'none';
            }
        }
        
        // Show/hide type button (only for multi-track setups)
        const typeBtn = document.getElementById('musicTypeBtn');
        if (typeBtn && this.config.tracks.length > 1) {
            typeBtn.style.display = this.isMusicMuted ? 'none' : 'flex';
            
            // Update type button icons
            const iconVocal = typeBtn.querySelector('.icon-vocal');
            const iconInstrumental = typeBtn.querySelector('.icon-instrumental');
            
            const currentTrackName = this.config.tracks[this.currentTrackIndex];
            
            if (iconVocal && iconInstrumental) {
                if (currentTrackName === 'vocal') {
                    iconVocal.style.display = 'block';
                    iconInstrumental.style.display = 'none';
                    typeBtn.title = 'Switch to Instrumental';
                } else {
                    iconVocal.style.display = 'none';
                    iconInstrumental.style.display = 'block';
                    typeBtn.title = 'Switch to Vocal';
                }
            }
        }
    }

    setMasterVolume(vol) {
        this.volume.master = Math.max(0, Math.min(1, vol));
    }

    // Attach events to UI elements
    attachEvents() {
        // Init sound on first click
        let soundInitialized = false;
        const initSound = () => {
            if (!soundInitialized) {
                this.init();
                soundInitialized = true;
                
                // Start background music after short delay
                const startDelay = this.config.type === 'death' ? 500 : 300;
                setTimeout(() => {
                    this.playBackgroundMusic();
                    if (this.config.tracks.length > 1) {
                        this.updateMusicControls(); // Show type button
                    }
                }, startDelay);
            }
        };
        
        document.addEventListener('click', initSound, { once: true });
        
        // Button events
        const buttons = document.querySelectorAll(this.config.buttonSelector);
        buttons.forEach((button) => {
            button.addEventListener('mouseenter', () => {
                this.playHoverSound();
                
                // Preload target page
                const href = button.getAttribute('href');
                if (href && !href.startsWith('#')) {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = href;
                    document.head.appendChild(link);
                }
            });
            
            button.addEventListener('click', (e) => {
                const href = button.getAttribute('href');
                
                if (href && !href.startsWith('#')) {
                    e.preventDefault();
                    this.playClickSound();
                    
                    // Fade out music
                    const fadeOutTime = this.config.type === 'death' ? 1200 : 800;
                    this.fadeOutMusic(fadeOutTime);
                    
                    // Click animation
                    const animOffset = this.config.type === 'death' ? ' translateY(-5px)' : '';
                    button.style.transform = `scale(0.95)${animOffset}`;
                    setTimeout(() => {
                        button.style.transform = '';
                    }, 150);
                    
                    // Navigate after fade-out
                    const navDelay = this.config.type === 'death' ? 1300 : 900;
                    setTimeout(() => {
                        window.location.href = href;
                    }, navDelay);
                } else {
                    // For # links, just play sound and animate
                    this.playClickSound();
                    const animOffset = this.config.type === 'death' ? ' translateY(-5px)' : '';
                    button.style.transform = `scale(0.95)${animOffset}`;
                    setTimeout(() => {
                        button.style.transform = '';
                    }, 150);
                }
            });
        });
        
        // Music Control Buttons
        const musicMuteBtn = document.getElementById('musicMuteBtn');
        const musicTypeBtn = document.getElementById('musicTypeBtn');
        
        if (musicMuteBtn) {
            musicMuteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playClickSound();
                this.toggleMute();
            });
            
            musicMuteBtn.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });
        }
        
        if (musicTypeBtn && this.config.tracks.length > 1) {
            musicTypeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playClickSound();
                this.switchMusicType();
            });
            
            musicTypeBtn.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });
        }

        // Developer Links & GitHub
        const footerLinks = document.querySelectorAll('.developer, .github-link');
        footerLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });
            
            link.addEventListener('click', () => {
                this.playClickSound();
            });
        });
    }

    // Attach keyboard events
    attachKeyboardEvents() {
        const buttons = document.querySelectorAll(this.config.primaryButtonSelector);
        let selectedIndex = 0;
        
        document.addEventListener('keydown', (e) => {
            const prevKey = this.config.navigationKeys.prev;
            const nextKey = this.config.navigationKeys.next;
            
            if (e.key === prevKey || e.key === nextKey) {
                e.preventDefault();
                
                if (e.key === nextKey) {
                    selectedIndex = (selectedIndex + 1) % buttons.length;
                } else {
                    selectedIndex = (selectedIndex - 1 + buttons.length) % buttons.length;
                }
                
                buttons[selectedIndex].focus();
                this.playSelectSound();
            }
            
            if (e.key === 'Enter' && document.activeElement.matches(this.config.buttonSelector)) {
                this.playClickSound();
                document.activeElement.click();
            }
            
            // Handle shortcuts
            Object.keys(this.config.shortcuts).forEach(action => {
                const key = this.config.shortcuts[action];
                if (e.key === key || e.key === key.toUpperCase()) {
                    const element = document.getElementById(action);
                    if (element) {
                        this.playClickSound();
                        element.click();
                    }
                }
            });
            
            if (e.key === 'Escape' && !this.config.shortcuts.menuBtn) {
                this.playHoverSound();
                console.log('ESC - Return to previous menu');
            }
        });
    }

    // Attach gamepad events
    attachGamepadEvents() {
        const buttons = document.querySelectorAll(this.config.primaryButtonSelector);
        let selectedIndex = 0;
        let gamepadIndex = null;
        let lastButtonState = {};
        
        window.addEventListener('gamepadconnected', (e) => {
            console.log('🎮 Gamepad connected:', e.gamepad.id);
            gamepadIndex = e.gamepad.index;
            gamepadLoop();
        });
        
        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('🎮 Gamepad disconnected');
            gamepadIndex = null;
        });
        
        const gamepadLoop = () => {
            if (gamepadIndex === null) return;
            
            const gamepad = navigator.getGamepads()[gamepadIndex];
            if (!gamepad) return;
            
            // Button press detection (prevent repeats)
            const isPressed = (buttonIndex) => {
                const pressed = gamepad.buttons[buttonIndex]?.pressed;
                if (pressed && !lastButtonState[buttonIndex]) {
                    lastButtonState[buttonIndex] = true;
                    return true;
                }
                if (!pressed) {
                    lastButtonState[buttonIndex] = false;
                }
                return false;
            };
            
            // Navigation (vertical for menu, horizontal for death)
            if (this.config.type === 'menu') {
                if (isPressed(12)) { // D-pad up
                    selectedIndex = (selectedIndex - 1 + buttons.length) % buttons.length;
                    buttons[selectedIndex].focus();
                    this.playSelectSound();
                }
                if (isPressed(13)) { // D-pad down
                    selectedIndex = (selectedIndex + 1) % buttons.length;
                    buttons[selectedIndex].focus();
                    this.playSelectSound();
                }
            } else {
                if (isPressed(14)) { // D-pad left
                    selectedIndex = (selectedIndex - 1 + buttons.length) % buttons.length;
                    buttons[selectedIndex].focus();
                    this.playHoverSound();
                }
                if (isPressed(15)) { // D-pad right
                    selectedIndex = (selectedIndex + 1) % buttons.length;
                    buttons[selectedIndex].focus();
                    this.playHoverSound();
                }
            }
            
            if (isPressed(0)) { // A button
                this.playClickSound();
                buttons[selectedIndex]?.click();
            }
            
            // B button for shortcuts
            if (isPressed(1) && this.config.shortcuts.menuBtn) {
                const menuBtn = document.getElementById('menuBtn');
                if (menuBtn) {
                    this.playClickSound();
                    menuBtn.click();
                }
            }
            
            requestAnimationFrame(gamepadLoop);
        };
    }
}

// ============================================
// INITIALIZATION HELPER
// ============================================

function initSoundSystem(config) {
    const soundManager = new SoundManager(config);
    soundManager.attachEvents();
    soundManager.attachKeyboardEvents();
    soundManager.attachGamepadEvents();
    console.log(`🔊 ${config.type === 'death' ? 'Death' : 'Menu'} sound system ready`);
    return soundManager;
}
