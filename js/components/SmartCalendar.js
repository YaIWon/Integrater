// ============================================
// SMART CALENDAR & REMINDER SYSTEM
// Complete with Voice, Effects, and Automation
// ============================================

export default class SmartCalendar {
    constructor() {
        this.reminders = [];
        this.intervals = [];
        this.voice = null;
        this.synth = window.speechSynthesis;
        this.isSpeaking = false;
        this.voiceEffects = {
            pitch: 1.0,
            rate: 1.0,
            volume: 1.0,
            echo: 0,
            reverb: 0,
            distortion: 0,
            cussLevel: 100
        };
        
        this.cussWords = [
            'fuck', 'shit', 'damn', 'bitch', 'ass', 'hell', 'cock', 'pussy', 'dick', 'cunt',
            'motherfucker', 'bullshit', 'goddamn', 'bastard', 'whore', 'slut', 'faggot', 'retard',
            'asshole', 'douche', 'piss', 'crap', 'suck', 'balls', 'twat', 'wanker', 'bollocks',
            'bloody', 'bugger', 'crikey', 'wanker', 'git', 'tosser', 'plonker', 'berk',
            'prick', 'knob', 'bellend', 'twat', 'minge', 'clunge', 'fanny', 'gash'
        ];
        
        // Auto-init on construction
        this.init();
    }

    init() {
        // Check if already exists
        if (document.getElementById('smartCalendarModal')) {
            console.log('📅 Smart Calendar already exists');
            return;
        }
        
        this.createUI();
        this.loadReminders();
        this.startClock();
        this.loadVoice();
        this.addLaunchButton();
        console.log('📅 Smart Calendar initialized');
    }

    // ==========================================
    // UI CREATION
    // ==========================================
    createUI() {
        const modal = document.createElement('div');
        modal.id = 'smartCalendarModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(20px);
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', system-ui, sans-serif;
        `;
        
        modal.innerHTML = `
            <div style="
                background: #1a1a2e;
                border-radius: 24px;
                padding: 30px;
                max-width: 1100px;
                width: 95%;
                max-height: 90vh;
                overflow-y: auto;
                border: 1px solid rgba(74,158,255,0.15);
                box-shadow: 0 25px 60px rgba(0,0,0,0.8);
                position: relative;
            ">
                <!-- Close Button -->
                <button onclick="document.getElementById('smartCalendarModal').style.display='none'" style="
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    background: none;
                    border: none;
                    color: #8899aa;
                    font-size: 2rem;
                    cursor: pointer;
                    transition: color 0.3s;
                " onmouseover="this.style.color='#ff4757'" onmouseout="this.style.color='#8899aa'">&times;</button>
                
                <!-- Header -->
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px;">
                    <div>
                        <h2 style="color:#4a9eff;font-size:1.8rem;margin:0;">📅 Smart Calendar</h2>
                        <p style="color:#8899aa;margin:0;font-size:0.9rem;">Your AI-powered reminder system</p>
                    </div>
                    <div id="clockDisplay" style="
                        background:rgba(0,0,0,0.3);
                        padding:10px 20px;
                        border-radius:12px;
                        text-align:center;
                        border:1px solid rgba(74,158,255,0.1);
                    ">
                        <div style="color:#4a9eff;font-size:2rem;font-weight:700;font-family:'Courier New',monospace;" id="timeDisplay">00:00:00</div>
                        <div style="color:#8899aa;font-size:0.8rem;" id="dateDisplay">Loading...</div>
                    </div>
                </div>
                
                <!-- Voice Controls -->
                <div style="
                    background:rgba(0,0,0,0.2);
                    border-radius:12px;
                    padding:15px;
                    margin-bottom:20px;
                    border:1px solid rgba(74,158,255,0.06);
                ">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <h4 style="color:#4a9eff;margin:0;">🗣️ Voice Settings</h4>
                        <button id="voiceTestBtn" style="
                            padding:6px 16px;
                            border:none;
                            border-radius:8px;
                            background:linear-gradient(135deg,#4a9eff,#a855f7);
                            color:#fff;
                            cursor:pointer;
                            font-size:0.85rem;
                            transition:all 0.3s;
                        ">🔊 Test Voice</button>
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
                        <div>
                            <label style="color:#8899aa;font-size:0.75rem;display:block;margin-bottom:2px;">🎵 Pitch</label>
                            <input type="range" id="voicePitch" min="0.5" max="2.0" step="0.1" value="1.0" style="width:100%;">
                            <span style="color:#4a9eff;font-size:0.7rem;float:right;" id="pitchVal">1.0</span>
                        </div>
                        <div>
                            <label style="color:#8899aa;font-size:0.75rem;display:block;margin-bottom:2px;">⚡ Speed</label>
                            <input type="range" id="voiceRate" min="0.5" max="3.0" step="0.1" value="1.0" style="width:100%;">
                            <span style="color:#4a9eff;font-size:0.7rem;float:right;" id="rateVal">1.0</span>
                        </div>
                        <div>
                            <label style="color:#8899aa;font-size:0.75rem;display:block;margin-bottom:2px;">🔊 Volume</label>
                            <input type="range" id="voiceVolume" min="0" max="1.0" step="0.05" value="0.8" style="width:100%;">
                            <span style="color:#4a9eff;font-size:0.7rem;float:right;" id="volumeVal">0.8</span>
                        </div>
                        <div>
                            <label style="color:#8899aa;font-size:0.75rem;display:block;margin-bottom:2px;">🔁 Echo</label>
                            <input type="range" id="voiceEcho" min="0" max="5" step="1" value="0" style="width:100%;">
                            <span style="color:#4a9eff;font-size:0.7rem;float:right;" id="echoVal">Off</span>
                        </div>
                        <div>
                            <label style="color:#8899aa;font-size:0.75rem;display:block;margin-bottom:2px;">🌊 Reverb</label>
                            <input type="range" id="voiceReverb" min="0" max="3" step="0.1" value="0" style="width:100%;">
                            <span style="color:#4a9eff;font-size:0.7rem;float:right;" id="reverbVal">0.0</span>
                        </div>
                        <div>
                            <label style="color:#8899aa;font-size:0.75rem;display:block;margin-bottom:2px;">⚡ Distortion</label>
                            <input type="range" id="voiceDistortion" min="0" max="1.0" step="0.05" value="0" style="width:100%;">
                            <span style="color:#4a9eff;font-size:0.7rem;float:right;" id="distortionVal">0.0</span>
                        </div>
                        <div>
                            <label style="color:#8899aa;font-size:0.75rem;display:block;margin-bottom:2px;">🤬 Cuss Level</label>
                            <input type="range" id="cussLevel" min="0" max="100" step="5" value="100" style="width:100%;">
                            <span style="color:#4a9eff;font-size:0.7rem;float:right;" id="cussLevelVal">100%</span>
                        </div>
                    </div>
                </div>
                
                <!-- Reminder Creation -->
                <div style="
                    background:rgba(0,0,0,0.2);
                    border-radius:12px;
                    padding:15px;
                    margin-bottom:20px;
                    border:1px solid rgba(74,158,255,0.06);
                ">
                    <h4 style="color:#4a9eff;margin:0 0 10px 0;">➕ New Reminder</h4>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <div>
                            <label style="color:#8899aa;font-size:0.75rem;display:block;margin-bottom:2px;">Reminder Text</label>
                            <input type="text" id="reminderText" placeholder="What do you want to remember?" style="
                                width:100%;
                                padding:8px 12px;
                                background:rgba(0,0,0,0.3);
                                border:1px solid rgba(74,158,255,0.1);
                                border-radius:8px;
                                color:#e0e0e0;
                                outline:none;
                            ">
                        </div>
                        <div>
                            <label style="color:#8899aa;font-size:0.75rem;display:block;margin-bottom:2px;">Repeat</label>
                            <select id="reminderRepeat" style="
                                width:100%;
                                padding:8px 12px;
                                background:rgba(0,0,0,0.3);
                                border:1px solid rgba(74,158,255,0.1);
                                border-radius:8px;
                                color:#e0e0e0;
                                outline:none;
                            ">
                                <option value="once">Once</option>
                                <option value="daily">Daily</option>
                                <option value="hourly">Hourly</option>
                                <option value="10min">Every 10 Minutes</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                    </div>
                    <button id="addReminderBtn" style="
                        margin-top:10px;
                        padding:10px 24px;
                        border:none;
                        border-radius:12px;
                        background:linear-gradient(135deg,#4a9eff,#a855f7);
                        color:#fff;
                        cursor:pointer;
                        font-size:0.95rem;
                        font-weight:600;
                        transition:all 0.3s;
                        width:100%;
                    ">➕ Add Reminder</button>
                </div>
                
                <!-- Reminders List -->
                <div style="
                    background:rgba(0,0,0,0.2);
                    border-radius:12px;
                    padding:15px;
                    border:1px solid rgba(74,158,255,0.06);
                ">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <h4 style="color:#4a9eff;margin:0;">📋 Your Reminders</h4>
                        <span id="reminderCount" style="color:#8899aa;font-size:0.85rem;">0 active</span>
                    </div>
                    <div id="remindersList" style="max-height:300px;overflow-y:auto;">
                        <div style="text-align:center;color:#556677;padding:30px 0;">
                            No reminders yet. Add one above!
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup event listeners
        this.setupEventListeners();
        this.setupVoiceControls();
    }

    // ==========================================
    // LAUNCH BUTTON ON HOME PAGE (AUTO-ADDED)
    // ==========================================
    addLaunchButton() {
        // Remove existing button if any
        const existingBtn = document.getElementById('calendarLaunchBtn');
        if (existingBtn) existingBtn.remove();
        
        const btn = document.createElement('button');
        btn.id = 'calendarLaunchBtn';
        btn.innerHTML = '📅 Smart Calendar';
        btn.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 30px;
            padding: 12px 24px;
            border: none;
            border-radius: 16px;
            background: linear-gradient(135deg, #4a9eff, #a855f7);
            color: #fff;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 10px 30px rgba(74,158,255,0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        btn.onmouseover = () => { btn.style.transform = 'scale(1.05)'; };
        btn.onmouseout = () => { btn.style.transform = 'scale(1)'; };
        btn.onclick = () => {
            document.getElementById('smartCalendarModal').style.display = 'flex';
            this.loadReminders();
        };
        
        document.body.appendChild(btn);
        console.log('✅ Smart Calendar button added to page');
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    setupEventListeners() {
        document.getElementById('addReminderBtn')?.addEventListener('click', () => {
            this.addReminder();
        });
        
        document.getElementById('reminderText')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addReminder();
        });
        
        document.getElementById('voiceTestBtn')?.addEventListener('click', () => {
            this.speakText("Hello you fucking beautiful human! Let's test this shit out!");
        });
    }

    // ==========================================
    // VOICE CONTROLS
    // ==========================================
    setupVoiceControls() {
        const controls = [
            { id: 'voicePitch', valId: 'pitchVal', key: 'pitch', formatter: v => parseFloat(v).toFixed(1) },
            { id: 'voiceRate', valId: 'rateVal', key: 'rate', formatter: v => parseFloat(v).toFixed(1) },
            { id: 'voiceVolume', valId: 'volumeVal', key: 'volume', formatter: v => parseFloat(v).toFixed(2) },
            { id: 'voiceEcho', valId: 'echoVal', key: 'echo', formatter: v => v === '0' ? 'Off' : `${v}x` },
            { id: 'voiceReverb', valId: 'reverbVal', key: 'reverb', formatter: v => parseFloat(v).toFixed(1) },
            { id: 'voiceDistortion', valId: 'distortionVal', key: 'distortion', formatter: v => parseFloat(v).toFixed(2) },
            { id: 'cussLevel', valId: 'cussLevelVal', key: 'cussLevel', formatter: v => `${v}%` }
        ];
        
        controls.forEach(({ id, valId, key, formatter }) => {
            const el = document.getElementById(id);
            const valEl = document.getElementById(valId);
            if (el && valEl) {
                el.addEventListener('input', () => {
                    const val = el.value;
                    this.voiceEffects[key] = parseFloat(val);
                    valEl.textContent = formatter(val);
                });
            }
        });
    }

    // ==========================================
    // LOAD VOICE
    // ==========================================
    loadVoice() {
        if (this.synth) {
            const voices = this.synth.getVoices();
            const femaleVoice = voices.find(v => 
                v.name.toLowerCase().includes('female') || 
                v.name.toLowerCase().includes('samantha') ||
                v.name.toLowerCase().includes('victoria') ||
                v.name.toLowerCase().includes('zira') ||
                v.name.toLowerCase().includes('siri')
            );
            this.voice = femaleVoice || voices[0];
            console.log('🗣️ Voice loaded:', this.voice?.name || 'Default');
        }
    }

    // ==========================================
    // SPEAK TEXT WITH EFFECTS
    // ==========================================
    speakText(text) {
        if (!this.synth) return;
        
        const cussedText = this.addCussWords(text);
        
        const utterance = new SpeechSynthesisUtterance(cussedText);
        if (this.voice) utterance.voice = this.voice;
        
        utterance.pitch = this.voiceEffects.pitch;
        utterance.rate = this.voiceEffects.rate;
        utterance.volume = this.voiceEffects.volume;
        
        const echoCount = Math.floor(this.voiceEffects.echo);
        const reverbDelay = this.voiceEffects.reverb * 200;
        const distortion = this.voiceEffects.distortion;
        
        if (distortion > 0) {
            const origPitch = utterance.pitch;
            utterance.pitch = origPitch * (1 + distortion * 0.3);
        }
        
        this.synth.speak(utterance);
        this.isSpeaking = true;
        
        for (let i = 1; i <= echoCount; i++) {
            const echoUtterance = new SpeechSynthesisUtterance(cussedText);
            if (this.voice) echoUtterance.voice = this.voice;
            echoUtterance.pitch = utterance.pitch * (1 - i * 0.05);
            echoUtterance.rate = utterance.rate * (1 + i * 0.05);
            echoUtterance.volume = utterance.volume * (1 - i * 0.2);
            
            setTimeout(() => {
                this.synth.speak(echoUtterance);
            }, i * 200);
        }
        
        if (reverbDelay > 0) {
            for (let i = 1; i <= 3; i++) {
                const reverbUtterance = new SpeechSynthesisUtterance(cussedText);
                if (this.voice) reverbUtterance.voice = this.voice;
                reverbUtterance.pitch = utterance.pitch * 0.9;
                reverbUtterance.rate = utterance.rate * 0.9;
                reverbUtterance.volume = utterance.volume * (1 - i * 0.25);
                
                setTimeout(() => {
                    this.synth.speak(reverbUtterance);
                }, i * reverbDelay);
            }
        }
        
        utterance.onend = () => {
            this.isSpeaking = false;
        };
    }

    // ==========================================
    // ADD CUSS WORDS
    // ==========================================
    addCussWords(text) {
        const cussLevel = this.voiceEffects.cussLevel / 100;
        if (cussLevel === 0) return text;
        
        let words = text.split(' ');
        let result = [];
        let cussCount = Math.max(1, Math.floor(words.length * 0.3 * cussLevel));
        let inserted = 0;
        
        for (let i = 0; i < words.length; i++) {
            result.push(words[i]);
            
            if (i > 0 && i % 2 === 0 && inserted < cussCount) {
                const randomCuss = this.cussWords[Math.floor(Math.random() * this.cussWords.length)];
                const intensity = cussLevel > 0.7 ? '!!' : cussLevel > 0.4 ? '!' : '';
                result.push(`${randomCuss}${intensity}`);
                inserted++;
            }
        }
        
        if (cussLevel > 0.7 && result.length > 0) {
            const finalCuss = this.cussWords[Math.floor(Math.random() * this.cussWords.length)];
            result.push(`... and ${finalCuss} that's it!`);
        }
        
        return result.join(' ');
    }

    // ==========================================
    // CLOCK
    // ==========================================
    startClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        const dateStr = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const timeEl = document.getElementById('timeDisplay');
        const dateEl = document.getElementById('dateDisplay');
        if (timeEl) timeEl.textContent = timeStr;
        if (dateEl) dateEl.textContent = dateStr;
    }

    // ==========================================
    // REMINDERS
    // ==========================================
    addReminder() {
        const textInput = document.getElementById('reminderText');
        const repeatSelect = document.getElementById('reminderRepeat');
        
        const text = textInput.value.trim();
        if (!text) {
            this.speakText("Hey asshole! You need to type something first!");
            return;
        }
        
        const reminder = {
            id: Date.now(),
            text: text,
            repeat: repeatSelect.value,
            createdAt: new Date().toISOString(),
            active: true
        };
        
        this.reminders.push(reminder);
        this.saveReminders();
        this.renderReminders();
        this.setupReminder(reminder);
        
        textInput.value = '';
        this.speakText(`Added reminder you fucking genius! ${text}`);
    }

    setupReminder(reminder) {
        const interval = this.getInterval(reminder.repeat);
        if (interval) {
            const id = setInterval(() => {
                if (reminder.active) {
                    this.speakText(`Reminder! ${reminder.text}`);
                }
            }, interval);
            this.intervals.push({ id, reminderId: reminder.id });
        } else {
            setTimeout(() => {
                if (reminder.active) {
                    this.speakText(`Reminder! ${reminder.text}`);
                }
            }, 1000);
        }
    }

    getInterval(repeat) {
        const map = {
            'once': null,
            'daily': 86400000,
            'hourly': 3600000,
            '10min': 600000,
            'weekly': 604800000,
            'monthly': 2592000000
        };
        return map[repeat] || null;
    }

    renderReminders() {
        const list = document.getElementById('remindersList');
        const count = document.getElementById('reminderCount');
        
        if (!list) return;
        
        if (this.reminders.length === 0) {
            list.innerHTML = `
                <div style="text-align:center;color:#556677;padding:30px 0;">
                    No reminders yet. Add one above!
                </div>
            `;
            if (count) count.textContent = '0 active';
            return;
        }
        
        list.innerHTML = this.reminders.map((r, i) => `
            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                padding:10px 14px;
                background:rgba(0,0,0,0.2);
                border-radius:8px;
                margin-bottom:6px;
                border-left:3px solid ${r.active ? '#4a9eff' : '#ff4757'};
            ">
                <div>
                    <div style="color:#e0e0e0;font-weight:500;">${r.text}</div>
                    <div style="color:#556677;font-size:0.7rem;">
                        ${r.repeat} • ${new Date(r.createdAt).toLocaleString()}
                        ${!r.active ? ' (inactive)' : ''}
                    </div>
                </div>
                <div style="display:flex;gap:6px;">
                    <button onclick="window.__calendar.toggleReminder(${i})" style="
                        padding:4px 12px;
                        border:none;
                        border-radius:6px;
                        background:${r.active ? 'rgba(255,215,0,0.15)' : 'rgba(76,175,80,0.15)'};
                        color:${r.active ? '#ffd700' : '#4CAF50'};
                        cursor:pointer;
                        font-size:0.7rem;
                    ">${r.active ? '⏸️' : '▶️'}</button>
                    <button onclick="window.__calendar.deleteReminder(${i})" style="
                        padding:4px 12px;
                        border:none;
                        border-radius:6px;
                        background:rgba(255,71,87,0.15);
                        color:#ff4757;
                        cursor:pointer;
                        font-size:0.7rem;
                    ">🗑️</button>
                </div>
            </div>
        `).join('');
        
        if (count) {
            const active = this.reminders.filter(r => r.active).length;
            count.textContent = `${active} active`;
        }
    }

    toggleReminder(index) {
        if (this.reminders[index]) {
            this.reminders[index].active = !this.reminders[index].active;
            this.saveReminders();
            this.renderReminders();
        }
    }

    deleteReminder(index) {
        if (this.reminders[index]) {
            this.reminders.splice(index, 1);
            this.saveReminders();
            this.renderReminders();
        }
    }

    // ==========================================
    // STORAGE
    // ==========================================
    saveReminders() {
        try {
            localStorage.setItem('smart_calendar_reminders', JSON.stringify(this.reminders));
        } catch (e) {}
    }

    loadReminders() {
        try {
            const data = localStorage.getItem('smart_calendar_reminders');
            if (data) {
                this.reminders = JSON.parse(data);
                this.renderReminders();
                this.reminders.forEach(r => {
                    if (r.active) this.setupReminder(r);
                });
            }
        } catch (e) {}
    }

    // ==========================================
    // CLEANUP
    // ==========================================
    destroy() {
        this.intervals.forEach(({ id }) => clearInterval(id));
        this.intervals = [];
        const modal = document.getElementById('smartCalendarModal');
        if (modal) modal.remove();
        const btn = document.getElementById('calendarLaunchBtn');
        if (btn) btn.remove();
    }
}

// ============================================
// AUTO-INITIALIZE ON PAGE LOAD
// ============================================
let calendarInstance = null;

function initSmartCalendar() {
    if (!calendarInstance) {
        calendarInstance = new SmartCalendar();
        window.__calendar = calendarInstance;
    }
    return calendarInstance;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmartCalendar);
} else {
    initSmartCalendar();
}

export default SmartCalendar;
