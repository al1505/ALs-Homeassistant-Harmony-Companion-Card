// ============================================================================
// ALs HARMONY COMPANION CARD
// HA-DASHBOARD MASTER-BLUEPRINT v5.0 COMPLIANT CUSTOM CARD
// LOGITECH HARMONY COMPANION DIGITAL TWIN
// Version: 4.0.1 (Bugfixes: Zeit-Anzeige, Apply-Fix, Editor 2x + Snap-Preview)
// ----------------------------------------------------------------------------
// SETUP:
//   1. Datei nach /config/www/community/harmony-companion-card/harmony-companion-card.js
//   2. Harmony-Config nach /config/www/ kopieren -> /local/<name>.conf
//   3. Resource in HA registrieren
// ============================================================================

const HC_VERSION = "4.0.1";
console.info(
    "%c ALs HARMONY COMPANION CARD %c v" + HC_VERSION + " ",
    "color: white; background: #1a1a1a; font-weight: bold;",
    "color: #1a1a1a; background: #ffcc00; font-weight: bold;"
);

const escHtml = (str) => {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, (m) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
};

// ── Layout-Editor: Raster-Konstanten ─────────────────────────────────────────
const HC_GRID_COLS = 32, HC_COL_W = 10;   // 32 Spalten à 10 px = 320 px
const HC_GRID_ROWS = 18, HC_ROW_H = 7;    // 18 Zeilen  à  7 px = 126 px
const HC_DISP_W    = HC_GRID_COLS * HC_COL_W;  // 320 px
const HC_DISP_H    = HC_GRID_ROWS * HC_ROW_H;  // 126 px

// Element-Katalog: Bezeichnung, Standardgrösse, Farbe für den Editor
const HC_ELEM_CATALOG = {
    power:    { label: 'Power',    w: 30,  h: 28, color: '#b52929', fg: '#fff' },
    logo_l:   { label: 'Logo L',   w: 70,  h: 70, color: '#2255aa', fg: '#fff' },
    logo_s:   { label: 'Logo S',   w: 40,  h: 40, color: '#3366bb', fg: '#fff' },
    activity: { label: 'Activity', w: 120, h: 14, color: '#885500', fg: '#fff' },
    channel:  { label: 'Sender',   w: 120, h: 21, color: '#1a6633', fg: '#fff' },
    title:    { label: 'Titel',    w: 200, h: 14, color: '#7a1f5a', fg: '#fff' },
    time:     { label: 'Zeit',     w: 120, h: 14, color: '#884400', fg: '#fff' },
};

// Verfügbare Elemente je Modus (Reihenfolge = Palette-Reihenfolge)
const HC_MODE_ELEMS = {
    tv:    ['power', 'logo_l', 'logo_s', 'activity', 'channel', 'title', 'time'],
    media: ['power', 'activity', 'title', 'time'],
};

// Gibt Katalog-Eintrag für einen Layout-Schlüssel zurück (logo → logo_l/logo_s je h)
function hcCatalogFor(layoutKey, def) {
    if (layoutKey === 'logo') return HC_ELEM_CATALOG[def && def.h >= 60 ? 'logo_l' : 'logo_s'];
    return HC_ELEM_CATALOG[layoutKey] || null;
}

// Standard-Layouts: Startpunkt für neuen Editor-Slot (= bisheriges Layout 1)
function hcDefaultLayout(mode) {
    if (mode === 'tv') return {
        power:    { left: 0,   top: 49, w: 30,  h: 28, visible: true },
        logo:     { left: 40,  top: 28, w: 70,  h: 70, visible: true },
        activity: { left: 120, top: 21, w: 120, h: 14, visible: true },
        channel:  { left: 120, top: 42, w: 120, h: 21, visible: true },
        title:    { left: 120, top: 70, w: 200, h: 14, visible: true },
        time:     { left: 120, top: 91, w: 120, h: 14, visible: true },
    };
    // Kodi / Media-Modus
    return {
        power:    { left: 0,  top: 0,   w: 30,  h: 28, visible: true },
        logo:     { visible: false },
        channel:  { visible: false },
        activity: { left: 40, top: 7,   w: 120, h: 14, visible: true },
        title:    { left: 0,  top: 91,  w: 280, h: 14, visible: true },
        time:     { left: 0,  top: 105, w: 280, h: 14, visible: true },
    };
}

// Fallback-TV-Icon (SVG data-URI) fuer den Logo-Bereich wenn kein Picon geladen werden kann.
const HC_TV_ICON = 'url("data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
    '<path fill="rgba(255,255,255,0.55)" d="M21,17H3V5H21M21,3H3C1.89,3 1,3.89 1,5V17A2,2 0 0,0 3,19' +
    'H10V21H14V19H21A2,2 0 0,0 23,17V5C23,3.89 22.1,3 21,3Z"/></svg>'
) + '")';

// WCAG-Relative-Luminanz (sRGB-Gamma-Korrektur).
// Wird von _extractColors() benoetigt.
const _hcRelativeLum = (r, g, b) => {
    const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

// HARMONY_FALLBACKS: verwendet vom Editor-Auto-Befuellen-Button.
// Kein Laufzeit-Fallback mehr in _executeAction() – nur noch explizite Konfiguration.
const HARMONY_FALLBACKS = {
    vol_up:       ['VolumeUp'],
    vol_down:     ['VolumeDown'],
    ch_up:        ['ChannelUp'],
    ch_down:      ['ChannelDown'],
    mute:         ['Mute'],
    dir_up:       ['DirectionUp'],
    dir_down:     ['DirectionDown'],
    dir_left:     ['DirectionLeft'],
    dir_right:    ['DirectionRight'],
    ok:           ['OK', 'Select', 'Enter'],
    back:         ['Back', 'Return', 'Exit'],
    exit:         ['Exit', 'Back', 'Return'],
    menu:         ['Menu', 'ContextMenu'],
    play:         ['Play'],
    pause:        ['Pause'],
    stop:         ['Stop'],
    rewind:       ['Rewind'],
    fast_forward: ['FastForward'],
    skip_back:    ['SkipBack', 'SkipBackward', 'Previous'],
    skip_forward: ['SkipForward', 'Next'],
    record:       ['Record'],
    red:          ['Red'],
    green:        ['Green'],
    yellow:       ['Yellow'],
    blue:         ['Blue'],
    dvr_1:        ['DVR', 'PVR'],
    dvr_2:        ['Guide', 'EPG'],
    dvr_3:        ['Info'],
    num_1:        ['Number1', '1'],
    num_2:        ['Number2', '2'],
    num_3:        ['Number3', '3'],
    num_4:        ['Number4', '4'],
    num_5:        ['Number5', '5'],
    num_6:        ['Number6', '6'],
    num_7:        ['Number7', '7'],
    num_8:        ['Number8', '8'],
    num_9:        ['Number9', '9'],
    num_0:        ['Number0', '0'],
    num_minus:    ['Dash', 'Minus', '-'],
    num_enter:    ['Enter', 'Select', 'OK']
};

// ============================================================================
// CARD KLASSE
// ============================================================================
class HarmonyCompanionCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._renderGen = 0;
        this._parsedHarmonyData = { Devices: {}, Activities: {} };
        this._lastActivity = null;
        this._lastStateRef = null;
        this._lastMediaFp = '';
        this._colorCache = {};
        this._fadeTimer = null;
        this._progressTimer = null;
        this._grabRefreshTimer = null;    // Intervall-Timer fuer Grab-Bild-Polling (TV-Hintergrund)
        this._grabRefreshBase = null;     // Grab-URL ohne Timestamp (Basis fuer den Timer)
        this._grabRefreshInterval = null; // Aktives Intervall in ms (fuer Aenderungserkennung)
        this._tvData = null;
        this._tvGrabUrl = null;   // gecachte /grab-URL fuer TV-Hintergrund (Modus C)
        this._tvLastTitle = null; // letzter Titel fuer Programmwechsel-Erkennung (Modus C)
        this._logoCache = {};     // URL → 'loading'|'loaded'|'failed' fuer Picon-Fehler-Handling
        this._rendered = false;
    }

    static getConfigElement() {
        return document.createElement('harmony-companion-editor');
    }

    static getStubConfig() {
        return {
            type: 'custom:harmony-companion-card',
            entity: 'remote.harmony_hub',
            config_file: '/local/harmony_12563120.conf',
            buttons: { global: {} },
            dynamic_slots: {},
            activity_media: {}
        };
    }

    setConfig(config) {
        if (!config.entity) throw new Error('Harmony Hub Entity ID is required.');
        this.config = config;
        this._fetchConfigData();
    }

    set hass(hass) {
        if (!hass) return;
        this._hass = hass;
        if (this._rendered) this._updateLiveUI();
    }

    getCardSize() { return 10; }

    // -------- DATA --------
    async _fetchConfigData() {
        this._renderGen++;
        const localGen = this._renderGen;
        const url = this.config.config_file || '/local/harmony_12563120.conf';
        try {
            const response = await fetch(url, { cache: 'no-store' });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const data = await response.json();
            if (this._renderGen !== localGen) return;
            this._parsedHarmonyData = data || { Devices: {}, Activities: {} };
        } catch (error) {
            if (this._renderGen !== localGen) return;
            this._parsedHarmonyData = {
                Devices: {}, Activities: {},
                Error: 'Config nicht gefunden: ' + url
            };
        }
        try { this._renderDashboard(); } catch (e) { console.error('Harmony card render error:', e); }
    }

    _getOrderedActivities() {
        const acts = (this._parsedHarmonyData && this._parsedHarmonyData.Activities) || {};
        const list = [];
        for (const id in acts) {
            if (id === '-1') continue;
            list.push({ id: id, name: acts[id] });
        }
        list.sort((a, b) => {
            const an = parseInt(a.id, 10), bn = parseInt(b.id, 10);
            if (isNaN(an) || isNaN(bn)) return String(a.id).localeCompare(String(b.id));
            return an - bn;
        });
        return list;
    }

    // Prueft ob mind. 1 Button aus btnIds fuer die gegebene Aktivitaet ODER global konfiguriert ist.
    _zoneVisibleForActivity(btnIds, act) {
        if (!this.config || !this.config.buttons) return false;
        const actName    = (act && act !== 'PowerOff') ? act : null;
        const actBtns    = actName && this.config.buttons[actName] ? this.config.buttons[actName] : {};
        const globalBtns = this.config.buttons.global || {};
        for (let i = 0; i < btnIds.length; i++) {
            if (actBtns[btnIds[i]] || globalBtns[btnIds[i]]) return true;
        }
        return false;
    }

    // Zeigt/versteckt optionale Zonen je nach aktiver Aktivitaet.
    _updateZoneVisibility(act) {
        const root = this.shadowRoot;
        if (!root) return;
        const setZone = (id, btnIds) => {
            const el = root.getElementById(id);
            if (!el) return;
            el.style.display = this._zoneVisibleForActivity(btnIds, act) ? '' : 'none';
        };
        setZone('exit-menu-zone',  ['exit', 'menu']);
        setZone('color-zone',      ['red', 'green', 'yellow', 'blue']);
        setZone('dvr-zone',        ['dvr_1', 'dvr_2', 'dvr_3']);
        setZone('transport1-zone', ['skip_back', 'rewind', 'play', 'fast_forward', 'skip_forward']);
        setZone('transport2-zone', ['record', 'pause', 'stop']);
        setZone('numpad-zone',     ['num_1', 'num_2', 'num_3', 'num_4', 'num_5', 'num_6',
                                    'num_7', 'num_8', 'num_9', 'num_0', 'num_minus', 'num_enter']);
    }

    // Rendert DVR-Buttons ausschliesslich aus config.buttons.global.
    // Nur belegte dvr_N-Slots werden gerendert. Label wird aus dem Wert extrahiert.
    _renderDvrZone() {
        const global = (this.config.buttons && this.config.buttons.global) || {};
        let html = '';
        for (let i = 1; i <= 9; i++) {
            const btnId = 'dvr_' + i;
            const val = global[btnId];
            if (!val) continue;
            let label = 'DVR ' + i;
            if (val.indexOf('command:::') === 0) {
                const parts = val.split(':::');
                label = parts[2] || label;
            } else if (val.indexOf('activity:::') === 0) {
                const parts = val.split(':::');
                label = parts[1] || label;
            }
            html += '<div class="match-zone" data-btn="' + escHtml(btnId) + '">' +
                    '<div class="btn">' + escHtml(label) + '</div></div>';
        }
        return html;
    }

    // -------- BUTTON BUILDER --------
    _buildDynamicButton(slotId, defaultText) {
        const slot = (this.config.dynamic_slots && this.config.dynamic_slots[slotId]) || null;
        let text = defaultText || '';
        let icon = null;
        let configured = false;

        if (slot) {
            if (slot.text !== undefined && slot.text !== '') text = slot.text;
            if (slot.icon) icon = slot.icon;
            if (slot.action) configured = true;
        } else if (defaultText) {
            configured = true;
        }

        if (!configured && !defaultText) return '';

        let inner = '';
        if (icon) {
            inner += '<ha-icon icon="' + escHtml(icon) + '" style="--mdc-icon-size: 20px;"></ha-icon>';
        }
        if (text) {
            const margin = icon ? 'font-size:10px; margin-top:3px;' : '';
            inner += '<div style="' + margin + '">' + escHtml(text) + '</div>';
        }
        return '<div class="match-zone" data-btn="' + escHtml(slotId) + '">' +
               '<div class="btn" style="flex-direction:column;">' + inner + '</div></div>';
    }

    // -------- RENDER --------
    _renderDashboard() {
        const orderedActs = this._getOrderedActivities();
        let actHtml = '';
        for (let i = 0; i < orderedActs.length && i < 9; i++) {
            actHtml += this._buildDynamicButton('act_' + (i + 1), orderedActs[i].name);
        }

        let botHtml = '';
        for (let i = 1; i <= 9; i++) {
            botHtml += this._buildDynamicButton('bot_' + i, '');
        }

        const errorMsg = this._parsedHarmonyData && this._parsedHarmonyData.Error
            ? '<span class="display-error">' + escHtml(this._parsedHarmonyData.Error) + '</span>'
            : 'Initializing...';

        // Optionale Zonen: immer im DOM, Sichtbarkeit wird live von _updateZoneVisibility() gesteuert.
        const colorRowHtml =
              '<div class="grid-row-4" id="color-zone">' +
              '<div class="match-zone" data-btn="red"><div class="btn color-red"></div></div>' +
              '<div class="match-zone" data-btn="green"><div class="btn color-green"></div></div>' +
              '<div class="match-zone" data-btn="yellow"><div class="btn color-yellow"></div></div>' +
              '<div class="match-zone" data-btn="blue"><div class="btn color-blue"></div></div>' +
              '</div>';

        const dvrZoneHtml = '<div class="grid-dyn" id="dvr-zone">' + this._renderDvrZone() + '</div>';

        const t1Html =
              '<div class="grid-row-3" id="transport1-zone" style="margin-top:10px;">' +
              '<div class="rocker rocker-h">' +
              '<div class="match-zone" data-btn="skip_back"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M20,5V19L13,12M6,5V19H4V5M13,5V19L6,12"/></svg></div></div>' +
              '<div class="rocker-divider"></div>' +
              '<div class="match-zone" data-btn="rewind"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M11.5,12L20,18V6M11,18V6L2.5,12L11,18Z"/></svg></div></div>' +
              '</div>' +
              '<div class="match-zone" data-btn="play"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg></div></div>' +
              '<div class="rocker rocker-h">' +
              '<div class="match-zone" data-btn="fast_forward"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M13,6V18L21.5,12M4,18L12.5,12L4,6V18Z"/></svg></div></div>' +
              '<div class="rocker-divider"></div>' +
              '<div class="match-zone" data-btn="skip_forward"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M4,5V19L11,12M18,5V19H20V5M11,5V19L18,12"/></svg></div></div>' +
              '</div>' +
              '</div>';

        const t2Html =
              '<div class="grid-row-3" id="transport2-zone" style="margin-bottom:10px;">' +
              '<div class="match-zone" data-btn="record"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24" style="color:#ff4d4d;"><circle cx="12" cy="12" r="6" fill="currentColor"/></svg></div></div>' +
              '<div class="match-zone" data-btn="pause"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M14,19H18V5H14M6,19H10V5H6V19Z"/></svg></div></div>' +
              '<div class="match-zone" data-btn="stop"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" fill="currentColor"/></svg></div></div>' +
              '</div>';

        const numHtml =
              '<div class="numpad" id="numpad-zone">' +
              '<div class="match-zone" data-btn="num_1"><div class="btn">1</div></div>' +
              '<div class="match-zone" data-btn="num_2"><div class="btn">2</div></div>' +
              '<div class="match-zone" data-btn="num_3"><div class="btn">3</div></div>' +
              '<div class="match-zone" data-btn="num_4"><div class="btn">4</div></div>' +
              '<div class="match-zone" data-btn="num_5"><div class="btn">5</div></div>' +
              '<div class="match-zone" data-btn="num_6"><div class="btn">6</div></div>' +
              '<div class="match-zone" data-btn="num_7"><div class="btn">7</div></div>' +
              '<div class="match-zone" data-btn="num_8"><div class="btn">8</div></div>' +
              '<div class="match-zone" data-btn="num_9"><div class="btn">9</div></div>' +
              '<div class="match-zone" data-btn="num_minus"><div class="btn">&minus;</div></div>' +
              '<div class="match-zone" data-btn="num_0"><div class="btn">0</div></div>' +
              '<div class="match-zone" data-btn="num_enter"><div class="btn">E</div></div>' +
              '</div>';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block; width: 100%; max-width: 400px; margin: 0 auto;
                    --remote-bg: #2a2a2a; --btn-bg: #1a1a1a; --text-color: #ffffff;
                }
                @media (max-width: 600px) { :host { max-width: 100vw; touch-action: pan-y; } }
                .remote-body {
                    background: var(--remote-bg); border-radius: 36px; padding: 14px;
                    box-shadow: 0px 10px 30px rgba(0,0,0,0.5); display: grid; gap: 8px;
                }
                .display-zone {
                    background: linear-gradient(145deg, #d4d4d4, #f0f0f0);
                    border-radius: 8px; min-height: 60px;
                    display: flex; flex-direction: column; justify-content: center;
                    color: #333; font-family: inherit;
                    transition: opacity 0.3s ease, height 0.3s ease;
                    padding: 10px 48px 14px 52px; box-sizing: border-box; overflow: hidden; position: relative;
                }
                /* TV-Modus: alle Elemente absolut positioniert → kein Padding noetig */
                .display-zone.tv-mode { padding: 0; height: 126px !important; }
                #display-bg {
                    position: absolute; inset: 0; z-index: 0;
                    background-size: cover; background-position: center center;
                    background-repeat: no-repeat; display: none;
                    will-change: transform, opacity;
                }
                #display-bg.animate { animation: hcBgFadeZoom 1.2s ease-out; }
                @keyframes hcBgFadeZoom {
                    from { opacity: 0; transform: scale(1.10); }
                    to   { opacity: 1; transform: scale(1.00); }
                }
                #display-logo {
                    position: absolute; left: 50px; top: 50%; transform: translateY(-50%);
                    z-index: 3; width: 52px; height: 52px;
                    background-size: contain; background-position: center;
                    background-repeat: no-repeat; display: none;
                    filter: drop-shadow(0 1px 3px rgba(0,0,0,0.6));
                }
                #display-gradient {
                    position: absolute; inset: 0; z-index: 1; pointer-events: none;
                }
                #display-power {
                    position: absolute; left: 8px; top: 50%; transform: translateY(-50%);
                    z-index: 3; width: 36px; height: 36px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; -webkit-tap-highlight-color: transparent;
                    background: rgba(0,0,0,0.15); transition: background 0.15s ease;
                }
                #display-power:active { background: rgba(0,0,0,0.35); }
                #display-power svg { pointer-events: none; }
                #display-dots {
                    position: absolute; top: 6px; right: 6px; z-index: 3;
                    width: 32px; height: 32px; border-radius: 50%;
                    display: none; align-items: center; justify-content: center;
                    cursor: pointer; -webkit-tap-highlight-color: transparent;
                    font-size: 18px; font-weight: bold; letter-spacing: -1px; line-height: 1;
                }
                #display-dots:active { background: rgba(0,0,0,0.2); }
                #display-activity {
                    position: relative; z-index: 2; font-size: 18px; font-weight: bold;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;
                }
                #display-channel {
                    position: relative; z-index: 2; font-size: 15px; font-weight: 600; margin-top: 1px;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;
                }
                #display-title {
                    position: relative; z-index: 2; font-size: 14px; font-weight: normal; margin-top: 2px;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;
                }
                #display-time {
                    position: relative; z-index: 2; font-size: 11px; font-weight: 500; margin-top: 4px;
                    opacity: 0.85; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;
                    display: none;
                }
                #display-progress {
                    position: absolute; bottom: 0; left: 0; right: 0; height: 4px;
                    background: rgba(255,255,255,0.18); z-index: 3; cursor: pointer; display: none;
                }
                #display-progress-fill { height: 100%; width: 0%; background: rgba(255,255,255,0.85); transition: width 0.8s linear; }
                .display-error { color: #cc0000; font-size: 13px; }
                /* Layout-Positionierung wird vollstaendig per _applyDisplayLayout() als Inline-Styles gesetzt.
                   Statische [data-layout] / media-mode CSS-Positionierungsregeln entfallen ab v4. */
                .match-zone {
                    min-height: 38px; min-width: 38px;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; -webkit-tap-highlight-color: transparent;
                }
                .btn {
                    background: var(--btn-bg); color: var(--text-color);
                    border-radius: 18px; width: 100%; height: 100%;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
                    font-size: 12px; user-select: none; text-align: center;
                    padding: 0 5px; box-sizing: border-box;
                    transition: box-shadow 0.08s ease;
                }
                .match-zone:active .btn { box-shadow: inset 2px 2px 5px rgba(0,0,0,0.5); }
                .grid-dyn   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
                .grid-row-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
                .grid-row-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
                .grid-row-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
                .numpad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
                .numpad .match-zone { min-height: 32px; min-width: 32px; }
                .numpad .btn { border-radius: 9px; font-size: 14px; font-weight: 700; }
                .dpad-container {
                    display: grid; grid-template-columns: 40px 1fr 40px;
                    gap: 8px; align-items: center; justify-items: center; margin: 4px 0;
                }
                .dpad-ring {
                    display: grid; grid-template-columns: 1fr 1fr 1fr;
                    grid-template-rows: 1fr 1fr 1fr;
                    align-items: stretch; justify-items: stretch;
                    gap: 4px; width: 108px; height: 108px;
                    border-radius: 50%; overflow: hidden;
                    background: var(--btn-bg);
                    box-shadow: inset 2px 2px 10px rgba(0,0,0,0.5), 2px 2px 5px rgba(0,0,0,0.3);
                    padding: 4px; box-sizing: border-box;
                }
                .dpad-ring .match-zone { min-height: 0; min-width: 0; width: 100%; height: 100%; }
                .dpad-ring .dpad-empty { width: 100%; height: 100%; }
                .dpad-cell .btn { border-radius: 50%; }
                .rocker {
                    display: flex; flex-direction: column; gap: 0;
                    height: 96px; width: 40px; background: var(--btn-bg);
                    border-radius: 20px; overflow: hidden;
                    box-shadow: inset 2px 2px 5px rgba(0,0,0,0.5), 1px 1px 3px rgba(255,255,255,0.05);
                }
                .rocker-h { flex-direction: row; width: 100%; height: 40px; }
                .rocker .match-zone { height: 50%; width: 100%; min-height: 0; }
                .rocker-h .match-zone { height: 100%; width: 50%; min-width: 0; }
                .rocker .btn { border-radius: 0; box-shadow: none; background: transparent; }
                .rocker .match-zone:active .btn { background: rgba(0,0,0,0.3); }
                .rocker-divider { height: 2px; width: 60%; background: rgba(255,255,255,0.1); margin: 0 auto; }
                .rocker-h .rocker-divider { width: 2px; height: 60%; margin: auto 0; }
                .svg-icon { width: 18px; height: 18px; fill: currentColor; pointer-events: none; }
                .color-red    { border-bottom: 3px solid #ff4d4d; }
                .color-green  { border-bottom: 3px solid #4dff4d; }
                .color-yellow { border-bottom: 3px solid #ffff4d; }
                .color-blue   { border-bottom: 3px solid #4d4dff; }
            </style>
            <div class="remote-body" id="remote-root">

                <div class="display-zone" id="harmony-display">
                    <div id="display-bg"></div>
                    <div id="display-gradient"></div>
                    <div id="display-power">
                        <svg class="svg-icon" viewBox="0 0 24 24"><path d="M13,3H11V13H13V3M17.83,5.17L16.41,6.59C17.99,7.86 19,9.81 19,12A7,7 0 0,1 12,19A7,7 0 0,1 5,12C5,9.81 6,7.86 7.58,6.58L6.17,5.17C4.23,6.82 3,9.26 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12C21,9.26 19.77,6.82 17.83,5.17Z"/></svg>
                    </div>
                    <div id="display-dots">&#8942;</div>
                    <div id="display-activity">${errorMsg}</div>
                    <div id="display-channel" style="display:none;"></div>
                    <div id="display-title" style="display:none;"></div>
                    <div id="display-time"></div>
                    <div id="display-logo"></div>
                    <div id="display-progress" style="display:none;">
                        <div id="display-progress-fill"></div>
                    </div>
                </div>

                <div class="grid-dyn" id="activities-zone">${actHtml}</div>

                ${colorRowHtml}
                ${dvrZoneHtml}

                <div class="grid-row-2" id="exit-menu-zone">
                    <div class="match-zone" data-btn="exit"><div class="btn">Exit</div></div>
                    <div class="match-zone" data-btn="menu"><div class="btn">Menu</div></div>
                </div>

                <div class="dpad-container">
                    <div class="rocker">
                        <div class="match-zone" data-btn="vol_up"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/></svg></div></div>
                        <div class="rocker-divider"></div>
                        <div class="match-zone" data-btn="vol_down"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M19,13H5V11H19V13Z"/></svg></div></div>
                    </div>
                    <div class="dpad-ring">
                        <div class="dpad-empty"></div>
                        <div class="match-zone dpad-cell" data-btn="dir_up"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"/></svg></div></div>
                        <div class="dpad-empty"></div>
                        <div class="match-zone dpad-cell" data-btn="dir_left"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/></svg></div></div>
                        <div class="match-zone dpad-cell" data-btn="ok"><div class="btn" style="font-weight:bold;">OK</div></div>
                        <div class="match-zone dpad-cell" data-btn="dir_right"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg></div></div>
                        <div class="dpad-empty"></div>
                        <div class="match-zone dpad-cell" data-btn="dir_down"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M7.41,8.59L12,13.17L16.59,8.59L18,10L12,16L6,10L7.41,8.59Z"/></svg></div></div>
                        <div class="dpad-empty"></div>
                    </div>
                    <div class="rocker">
                        <div class="match-zone" data-btn="ch_up"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"/></svg></div></div>
                        <div class="rocker-divider"></div>
                        <div class="match-zone" data-btn="ch_down"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M7.41,8.59L12,13.17L16.59,8.59L18,10L12,16L6,10L7.41,8.59Z"/></svg></div></div>
                    </div>
                </div>

                <div class="grid-row-2">
                    <div class="match-zone" data-btn="mute"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18.04,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"/></svg></div></div>
                    <div class="match-zone" data-btn="back"><div class="btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/></svg></div></div>
                </div>

                ${t1Html}
                ${t2Html}
                ${numHtml}

                <div class="grid-dyn" id="bottom-zone">${botHtml}</div>
            </div>
        `;

        const root = this.shadowRoot.getElementById('remote-root');
        if (root) {
            root.onclick = (e) => {
                const target = e.target.closest('.match-zone');
                if (!target) return;
                const btnId = target.getAttribute('data-btn');
                if (btnId) this._executeAction(btnId);
            };
        }

        // Power-Button im Display
        const pwrBtn = this.shadowRoot.getElementById('display-power');
        if (pwrBtn) pwrBtn.onclick = (e) => { e.stopPropagation(); this._executeAction('off'); };

        // Drei-Punkte-Menue: oeffnet Camera-Entity (Live-Stream) wenn konfiguriert, sonst Media-Player
        const dotsBtn = this.shadowRoot.getElementById('display-dots');
        if (dotsBtn) dotsBtn.onclick = (e) => {
            e.stopPropagation();
            const camEid   = (this.config.activity_camera && this.config.activity_camera[this._lastActivity]) || null;
            const mediaEid = (this.config.activity_media  && this.config.activity_media[this._lastActivity])  || null;
            const eid = camEid || mediaEid;
            if (!eid) return;
            this.dispatchEvent(new CustomEvent('hass-more-info', {
                bubbles: true, composed: true, detail: { entityId: eid }
            }));
        };

        // Progress-Bar: Klick = Seek
        const progBar = this.shadowRoot.getElementById('display-progress');
        if (progBar) progBar.onclick = (e) => {
            e.stopPropagation();
            const rect = progBar.getBoundingClientRect();
            const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            this._seekMedia(pct);
        };

        this._rendered = true;
        this._lastActivity = null;
        this._updateZoneVisibility('PowerOff');
        if (this._hass) this._updateLiveUI();
    }

    // -------- ACTIONS --------
    _executeAction(btnId) {
        if (!this._hass || !this.config) return;

        if (btnId === 'off') {
            this._hass.callService('remote', 'turn_off', { entity_id: this.config.entity })
                .catch(() => {});
            return;
        }

        const currentAct = this._lastActivity || 'PowerOff';

        // Aktivitaets-Slots: starten immer die zugehoerige Activity
        if (btnId.indexOf('act_') === 0) {
            const slot = (this.config.dynamic_slots && this.config.dynamic_slots[btnId]) || null;
            if (slot && slot.action) { this._fireCommand(slot.action); return; }
            const idx = parseInt(btnId.split('_')[1], 10) - 1;
            const ordered = this._getOrderedActivities();
            if (ordered[idx]) {
                this._hass.callService('remote', 'turn_on', {
                    entity_id: this.config.entity,
                    activity: ordered[idx].name
                }).catch(() => {});
            }
            return;
        }

        // Alle anderen Buttons: explizite Konfiguration (kein Fallback-Auto-Mapping mehr)
        let cfg = null;
        if (this.config.buttons) {
            const actBtns   = this.config.buttons[currentAct];
            const globalBtns = this.config.buttons.global;
            if (actBtns   && actBtns[btnId])   cfg = actBtns[btnId];
            else if (globalBtns && globalBtns[btnId]) cfg = globalBtns[btnId];
        }
        if (cfg) { this._fireCommand(cfg); return; }

        // bot_* pruefen zusaetzlich dynamic_slots
        if (btnId.indexOf('bot_') === 0) {
            const slot = (this.config.dynamic_slots && this.config.dynamic_slots[btnId]) || null;
            if (slot && slot.action) this._fireCommand(slot.action);
        }
    }

    _fireCommand(val) {
        if (!val || !this._hass) return;
        if (val.indexOf('activity:::') === 0) {
            const parts = val.split(':::');
            this._hass.callService('remote', 'turn_on', {
                entity_id: this.config.entity, activity: parts[1]
            }).catch(() => {});
            return;
        }
        if (val.indexOf('command:::') === 0) {
            const parts = val.split(':::');
            this._hass.callService('remote', 'send_command', {
                entity_id: this.config.entity, device: parts[1], command: parts[2]
            }).catch(() => {});
            return;
        }
        if (val.indexOf('call_service:::') === 0) {
            const parts = val.split(':::');
            const svc = (parts[1] || '').split('.');
            if (svc.length >= 2) this._hass.callService(svc[0], svc[1], {}).catch(() => {});
        }
    }

    // Canvas-basierte Farbextraktion aus Thumbnail-URL.
    // Farbextraktion aehnlich wie HA (Vibrant.js-Ansatz):
    // 1. Gesamtes Bild in 16x16x16-Histogramm-Buckets quantisieren
    // 2. Haeufigste Farbe = Hintergrund
    // 3. WCAG-Kontrast >= 4.5 fuer Textfarbe suchen; Fallback: Weiss/Schwarz
    // Gibt { bg, text, subText, lum } oder null bei Fehler zurueck.
    _extractColors(imageUrl) {
        if (this._colorCache[imageUrl]) return Promise.resolve(this._colorCache[imageUrl]);
        return new Promise((resolve) => {
            const img = new Image();
            // same-origin HA-Proxy-URLs brauchen kein crossOrigin-Attribut.
            // Bei cross-origin wirft getImageData() SecurityError → catch → null-Fallback.
            img.onload = () => {
                try {
                    const W = 80, H = 80;
                    const canvas = document.createElement('canvas');
                    canvas.width = W; canvas.height = H;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, W, H);
                    const data = ctx.getImageData(0, 0, W, H).data;

                    // 16x16x16-Bucket-Histogramm (Quantisierungsschritt: 16)
                    const buckets = {};
                    for (let i = 0; i < data.length; i += 4) {
                        if (data[i + 3] < 128) continue; // transparente Pixel überspringen
                        const rq = data[i]     >> 4;    // Div 16
                        const gq = data[i + 1] >> 4;
                        const bq = data[i + 2] >> 4;
                        const key = (rq << 8) | (gq << 4) | bq;
                        if (!buckets[key]) buckets[key] = { rs: 0, gs: 0, bs: 0, n: 0 };
                        buckets[key].rs += data[i]; buckets[key].gs += data[i+1];
                        buckets[key].bs += data[i+2]; buckets[key].n++;
                    }

                    // Vibrant.js-naehnlicher Score: bevorzugt saturierte Farben mit
                    // mittlerer Helligkeit, abgewichen von Schwarz/Weiss/Grau.
                    // Farben in HSL umrechnen, scoring = Pixelanzahl * vibranceFactor.
                    const computeScore = (r, g, b, n) => {
                        const max = Math.max(r, g, b), min = Math.min(r, g, b);
                        const l   = (max + min) / 2 / 255;       // Helligkeit 0..1
                        const s   = max === min ? 0 : (max - min) / (max + min < 255 ? (max + min) : (510 - max - min));
                        // Optimal: l ~ 0.5, s ~ 0.7 (vibrant-Gewichtung).
                        const lFactor = 1 - Math.min(1, Math.abs(l - 0.5) * 2);   // peak bei l=0.5
                        const sFactor = Math.min(1, s * 1.4);                     // s>=0.7 = volle Punktzahl
                        // Mindest-Saturation 0.15 → reine Graufarben werden stark abgestuft
                        const vib     = Math.max(0.05, sFactor) * Math.max(0.3, lFactor);
                        return n * (0.4 + 0.6 * vib);   // 40 % Pixelanzahl, 60 % vibrance-gewichtet
                    };

                    const colors = Object.values(buckets)
                        .filter(b => b.n > 0)
                        .map(b => {
                            const r = Math.round(b.rs / b.n);
                            const g = Math.round(b.gs / b.n);
                            const bl = Math.round(b.bs / b.n);
                            return { r, g, b: bl, n: b.n, score: computeScore(r, g, bl, b.n) };
                        })
                        .sort((a, b) => b.score - a.score);

                    if (colors.length === 0) { resolve(null); return; }

                    // Hintergrund = bestbewertete Farbe (vibrant-gewichtet)
                    const bg = colors[0];
                    const bgLum = _hcRelativeLum(bg.r, bg.g, bg.b);

                    // Textfarbe: Weiss auf dunkel, Schwarz auf hell (HA-Stil, einfach + max. Lesbarkeit).
                    // Threshold WCAG: Lum > 0.179 → schwarz, sonst weiss
                    const fg = bgLum > 0.45
                        ? { r: 24,  g: 24,  b: 24  }   // dunkles Anthrazit auf hellem BG
                        : { r: 245, g: 245, b: 245 }; // weiss auf dunklem BG

                    // Sub-Text: gleiche Basis aber mit reduzierter Opazitaet
                    const result = {
                        bg:      'rgb(' + bg.r + ',' + bg.g + ',' + bg.b + ')',
                        text:    'rgb(' + fg.r + ',' + fg.g + ',' + fg.b + ')',
                        subText: 'rgba(' + fg.r + ',' + fg.g + ',' + fg.b + ',0.78)',
                        lum:     bgLum
                    };
                    this._colorCache[imageUrl] = result;
                    resolve(result);
                } catch (e) { resolve(null); }
            };
            img.onerror = () => resolve(null);
            img.src = imageUrl;
        });
    }

    _seekMedia(pct) {
        const eid = (this.config.activity_media && this.config.activity_media[this._lastActivity]) || null;
        const ms  = eid && this._hass ? (this._hass.states[eid] || null) : null;
        if (!ms || !ms.attributes.media_duration) return;
        this._hass.callService('media_player', 'media_seek', {
            entity_id: eid, seek_position: pct * ms.attributes.media_duration
        }).catch(() => {});
    }

    // Laedt ein Sender-Logo (Picon) asynchron vor.
    // Ergebnis wird in _logoCache gespeichert. Nach dem Laden (Erfolg oder Fehler) wird
    // ein erneutes Rendern der Karte ausgeloest.
    // Status: 'loading' | 'loaded' | 'failed'
    _preloadLogo(url) {
        if (!url || this._logoCache[url]) return;
        this._logoCache[url] = 'loading';
        const img = new Image();
        img.onload  = () => {
            this._logoCache[url] = 'loaded';
            this._lastMediaFp = '';   // Re-Render ausloesen
            if (this._rendered) this._updateLiveUI();
        };
        img.onerror = () => {
            this._logoCache[url] = 'failed';
            this._lastMediaFp = '';   // Re-Render ausloesen (TV-Icon wird angezeigt)
            if (this._rendered) this._updateLiveUI();
        };
        img.src = url;
    }

    _startProgressTimer() {
        this._stopProgressTimer();
        this._progressTimer = setInterval(() => { this._updateProgressBar(); }, 1000);
    }

    _stopProgressTimer() {
        if (this._progressTimer) { clearInterval(this._progressTimer); this._progressTimer = null; }
    }

    // Berechnet Fortschritt [0..1] aus Entity-Attributen.
    // Prioritaet:
    //   1. Enigma2: currservice_begin_timestamp / currservice_end_timestamp (Unix-Sekunden)
    //   2. Standard HA: media_duration / media_position / media_position_updated_at
    // Gibt null zurueck wenn keine Zeitdaten verfuegbar.
    _mediaPctFromAttrs(attrs) {
        if (!attrs) return null;

        // 1) Enigma2 Unix-Timestamps (aus extra_state_attributes der HA-Integration)
        //    Vorteil: Mitternachts-Probleme und Zeitzonenversatz kein Thema.
        const bts = attrs.currservice_begin_timestamp;
        const ets = attrs.currservice_end_timestamp;
        if (bts && ets) {
            const beginMs = bts * 1000;
            const endMs   = ets * 1000;
            const total   = endMs - beginMs;
            const elapsed = Date.now() - beginMs;
            if (total > 0) return Math.max(0, Math.min(1, elapsed / total));
        }

        // 2) Standard HA media player: media_duration / media_position
        if (attrs.media_duration) {
            const dur     = attrs.media_duration;
            const posBase = attrs.media_position || 0;
            const updTs   = attrs.media_position_updated_at
                ? new Date(attrs.media_position_updated_at).getTime()
                : Date.now();
            const elapsed = Math.max(0, (Date.now() - updTs) / 1000);
            const pos     = Math.min(dur, posBase + elapsed);
            return Math.max(0, Math.min(1, pos / dur));
        }

        return null;
    }

    _updateProgressBar() {
        if (!this.shadowRoot || !this._rendered) return;
        const fill = this.shadowRoot.getElementById('display-progress-fill');
        if (!fill) return;

        // Progress-Wert ermitteln
        let pct = null;
        // 1) TV-Fortschritt aus OpenWebIF-EPG-Zeitstempel (HH:MM)
        if (this._tvData) pct = this._tvProgress();

        // 2) Fallback: HA-Entity-Fortschritt (Kodi/Plex/Enigma2)
        let haAttrs = null;
        if (pct === null) {
            const eid = (this.config.activity_media && this.config.activity_media[this._lastActivity]) || null;
            const ms  = eid && this._hass ? (this._hass.states[eid] || null) : null;
            if (ms) {
                haAttrs = ms.attributes || {};
                pct = this._mediaPctFromAttrs(haAttrs);
            }
        }

        if (pct !== null) {
            fill.style.width = (pct * 100).toFixed(2) + '%';
        }

        // Restzeit-Text live aktualisieren (sekuendlich)
        const timeEl = this.shadowRoot.getElementById('display-time');
        if (timeEl && timeEl.style.display !== 'none') {
            // haAttrs ggf. nachladen wenn TV-Pfad gewonnen hat
            if (!haAttrs) {
                const eid = (this.config.activity_media && this.config.activity_media[this._lastActivity]) || null;
                const ms  = eid && this._hass ? (this._hass.states[eid] || null) : null;
                if (ms) haAttrs = ms.attributes || {};
            }
            const remStr = this._computeTimeRemaining(this._tvData, haAttrs);
            if (remStr) timeEl.textContent = remStr;
        }
    }

    // -------- TV / ENIGMA2 --------

    _isTVActivity(act) {
        const acts = this.config && this.config.enigma2_activities;
        return !!(acts && Array.isArray(acts) && acts.includes(act));
    }

    // Berechnet Fortschritt [0..1] aus begin/end-Zeitstrings ("HH:MM").
    // Mitternachts-Fix: Sendung beginnt z.B. 23:42, jetzt ist 00:05 → nowS um 86400 erhoehen.
    _tvProgress() {
        if (!this._tvData || !this._tvData.beginStr || !this._tvData.endStr) return null;
        const parseHHMM = (s) => {
            const p = s.split(':');
            if (p.length < 2) return NaN;
            const h = parseInt(p[0], 10), m = parseInt(p[1], 10);
            return isNaN(h) || isNaN(m) ? NaN : h * 3600 + m * 60;
        };
        const now  = new Date();
        let   nowS = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        let   begin = parseHHMM(this._tvData.beginStr);
        let   end   = parseHHMM(this._tvData.endStr);
        if (isNaN(begin) || isNaN(end)) return null;
        if (end < begin) end += 86400;           // Sendung geht ueber Mitternacht
        if (nowS < begin && end > 86400) nowS += 86400; // Zuschauer ist bereits nach Mitternacht
        const total   = end - begin;
        const elapsed = nowS - begin;
        if (total <= 0 || elapsed < 0) return null;
        return Math.min(1, elapsed / total);
    }

    _getMediaTitle(attrs) {
        if (!attrs) return '';
        const ch     = attrs.media_channel       || '';
        const title  = attrs.media_title         || '';
        const series = attrs.media_series_title  || '';
        const artist = attrs.media_artist        || '';
        if (ch && title)     return ch     + '  ·  ' + title;
        if (series && title) return series + '  ·  ' + title;
        if (artist && title) return artist + '  –  ' + title;
        return title;
    }

    // Parst Kanal und Sendungstitel fuer TV-Aktivitaeten aus HA-Enigma2-Entity.
    // Die Enigma2-HA-Integration liefert haeufig media_channel leer und
    // kombiniert beides in media_title als "Kanalname - Sendungstitel".
    // Gibt { channel, title } zurueck.
    _parseTVTitle(haAttrs) {
        if (!haAttrs) return { channel: '', title: '' };

        // Bevorzugt: Enigma2 extra_state_attributes (currservice_station / currservice_name)
        // Diese werden von der HA-Integration immer separat gesetzt und sind zuverlaessiger
        // als media_channel (das manchmal leer ist).
        const csStn  = (haAttrs.currservice_station || '').trim();
        const csName = (haAttrs.currservice_name    || '').trim();
        if (csStn && csName) return { channel: csStn, title: csName };
        if (csStn)           return { channel: csStn, title: '' };

        // Fallback: Standard media_channel / media_title
        const ch = (haAttrs.media_channel || '').trim();
        const t  = (haAttrs.media_title   || '').trim();
        if (ch) return { channel: ch, title: t };

        // Automatische Trennung: "Kanal - Sendung" (erstes ' - ' als Trennzeichen)
        const sep = t.indexOf(' - ');
        if (sep > 0) {
            return {
                channel: t.substring(0, sep).trim(),
                title:   t.substring(sep + 3).trim()
            };
        }
        return { channel: '', title: t };
    }

    // Liefert eine Zeit-Restanzeige in der Form "1h 34m bis 21:35".
    // Quellen (in Reihenfolge):
    //   1. OpenWebIF (_tvData.endStr "HH:MM")
    //   2. HA-Entity media_duration / media_position / media_position_updated_at
    // Gibt '' zurueck wenn keine Daten verfuegbar.
    _computeTimeRemaining(tvData, haAttrs) {
        const fmtClock = (h, m) =>
            (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
        const fmtDur = (totalSec) => {
            if (totalSec <= 0) return '';
            const h = Math.floor(totalSec / 3600);
            const m = Math.floor((totalSec % 3600) / 60);
            if (h > 0)         return h + 'h ' + (m < 10 ? '0' : '') + m + 'm';
            if (m > 0)         return m + 'm';
            return Math.floor(totalSec) + 's';
        };

        // 1) OpenWebIF: endStr "HH:MM" -> berechne Endzeit relativ zu jetzt
        if (tvData && tvData.endStr) {
            const parts = tvData.endStr.split(':');
            if (parts.length >= 2) {
                const eh = parseInt(parts[0], 10), em = parseInt(parts[1], 10);
                if (!isNaN(eh) && !isNaN(em)) {
                    const now    = new Date();
                    const endDt  = new Date(now);
                    endDt.setHours(eh, em, 0, 0);
                    // Endet "morgen" (z.B. Sendung ueber Mitternacht)
                    if (endDt.getTime() <= now.getTime() - 60000) endDt.setDate(endDt.getDate() + 1);
                    const remSec = Math.max(0, (endDt.getTime() - now.getTime()) / 1000);
                    return fmtDur(remSec) + ' bis ' + fmtClock(eh, em) + ' Uhr';
                }
            }
        }

        // 2) Enigma2 Unix-Timestamps (aus HA extra_state_attributes, z.B. media_player.vu_office)
        //    Praeziser als HH:MM-Strings, kein Mitternachts-Overflow.
        if (haAttrs && haAttrs.currservice_end_timestamp) {
            const endTs  = haAttrs.currservice_end_timestamp * 1000;
            const remSec = Math.max(0, (endTs - Date.now()) / 1000);
            const endDt  = new Date(endTs);
            return fmtDur(remSec) + ' bis ' + fmtClock(endDt.getHours(), endDt.getMinutes()) + ' Uhr';
        }

        // 3) Enigma2 HH:MM-Strings als Fallback (currservice_end im HA-Entity)
        if (haAttrs && haAttrs.currservice_end && !haAttrs.currservice_end_timestamp) {
            const parts = (haAttrs.currservice_end || '').split(':');
            if (parts.length >= 2) {
                const eh = parseInt(parts[0], 10), em = parseInt(parts[1], 10);
                if (!isNaN(eh) && !isNaN(em)) {
                    const now    = new Date();
                    const endDt  = new Date(now);
                    endDt.setHours(eh, em, 0, 0);
                    if (endDt.getTime() <= now.getTime() - 60000) endDt.setDate(endDt.getDate() + 1);
                    const remSec = Math.max(0, (endDt.getTime() - now.getTime()) / 1000);
                    return fmtDur(remSec) + ' bis ' + fmtClock(eh, em) + ' Uhr';
                }
            }
        }

        // 4) Standard HA: media_duration / media_position
        if (haAttrs && haAttrs.media_duration) {
            const dur     = haAttrs.media_duration;
            const posBase = haAttrs.media_position || 0;
            const updTs   = haAttrs.media_position_updated_at
                ? new Date(haAttrs.media_position_updated_at).getTime()
                : Date.now();
            const elapsed = Math.max(0, (Date.now() - updTs) / 1000);
            const pos     = Math.min(dur, posBase + elapsed);
            const remSec  = Math.max(0, dur - pos);
            const endDt   = new Date(Date.now() + remSec * 1000);
            return fmtDur(remSec) + ' bis ' + fmtClock(endDt.getHours(), endDt.getMinutes()) + ' Uhr';
        }

        return '';
    }


    // colors = { bg, text, subText, lum } | null (Fallback)
    _renderDisplayContent(act, mediaStateObj, colors) {
        const root    = this.shadowRoot;
        if (!root) return;
        const display   = root.getElementById('harmony-display');
        const actEl     = root.getElementById('display-activity');
        const chanEl    = root.getElementById('display-channel');
        const titleEl   = root.getElementById('display-title');
        const timeEl    = root.getElementById('display-time');
        const logoEl    = root.getElementById('display-logo');
        const bgEl      = root.getElementById('display-bg');
        const gradEl    = root.getElementById('display-gradient');
        const pwrEl     = root.getElementById('display-power');
        const dotsEl    = root.getElementById('display-dots');
        const progEl    = root.getElementById('display-progress');
        const fillEl    = root.getElementById('display-progress-fill');
        if (!display || !actEl) return;

        // TV-Modus A/B: OpenWebIF-Daten vorhanden (_tvData gesetzt)?
        const isTVAct   = this._isTVActivity(act);
        const isTVMode  = isTVAct && !!this._tvData;
        const tvData    = isTVMode ? this._tvData : null;
        const enigma2B  = (this.config.enigma2_url || '').replace(/\/+$/, '');
        // HA-Entity-Attribute (immer verfuegbar wenn activity_media gesetzt)
        const haAttrs   = (mediaStateObj && mediaStateObj.attributes) ? mediaStateObj.attributes : null;

        // Abspielen-Status:
        // TV mit OpenWebIF → "playing" wenn Daten vorhanden
        // TV ohne OpenWebIF (Modus B/C) → per Definition "playing" wenn TV-Aktivitaet aktiv
        //   (Nutzer hat TV-Aktivitaet gewaehlt → Receiver ist an)
        // Kodi → aus HA-Entity-State
        const isPlaying = tvData
            ? !!(tvData.channel || tvData.title)
            : isTVAct
                ? true  // TV-Aktivitaet = Receiver laeuft (auch ohne OpenWebIF-Daten)
                : !!(mediaStateObj && ['playing', 'paused', 'on'].includes(mediaStateObj.state));

        // Kanalname + Titel:
        // tvData (OpenWebIF) → direkt aus OpenWebIF-Daten
        // TV ohne OpenWebIF (Modus C) → _parseTVTitle() teilt "Kanal - Sendung" aus media_title auf
        // Kodi → zusammengesetzter Titel aus _getMediaTitle()
        let channel, title, rawTitle;
        if (tvData) {
            channel  = tvData.channel;
            title    = tvData.title;
            rawTitle = title;
        } else if (isTVAct && haAttrs) {
            const parsed = this._parseTVTitle(haAttrs);
            channel  = parsed.channel;
            title    = parsed.title;
            rawTitle = haAttrs.currservice_name || haAttrs.media_title || '';
        } else {
            channel  = '';
            title    = haAttrs ? this._getMediaTitle(haAttrs) : '';
            rawTitle = haAttrs ? (haAttrs.media_title || '') : '';
        }

        // Hintergrundbild:
        // TV mit OpenWebIF-Daten → tvData.thumbUrl (bereits gecacht)
        // TV OHNE OpenWebIF aber mit enigma2_url → /grab direkt (CSS, kein CORS noetig)
        //   Grab-URL wird nur beim Programmwechsel (Titelaenderung) erneuert
        // Kodi → HA-Proxy (entity_picture_local, same-origin)
        let thumb;
        if (tvData) {
            thumb = tvData.thumbUrl;
        } else if (isTVAct && enigma2B) {
            // Modus C: kein _tvData, aber grab-URL direkt nutzen
            if (rawTitle !== this._tvLastTitle) {
                this._tvLastTitle = rawTitle;
                this._tvGrabUrl   = enigma2B + '/grab?format=jpg&r=480&mode=video&_t=' + Date.now();
            }
            thumb = this._tvGrabUrl;
        } else {
            thumb = haAttrs ? (haAttrs.entity_picture_local || haAttrs.entity_picture || null) : null;
        }

        // Sender-Logo: bevorzugt picon_url aus dem enigma2_epg-Sensor (_tvData.piconUrl),
        // Fallback: direkt konstruiert aus enigma2_url + /picon/ + Kanalname.
        // CSS background-image umgeht CORS vollstaendig – kein JS fetch noetig.
        const logoUrl = isTVAct
            ? (this._tvData && this._tvData.piconUrl)
              || (enigma2B && haAttrs && haAttrs.currservice_station
                  ? enigma2B + '/picon/' + encodeURIComponent(haAttrs.currservice_station) + '.png'
                  : null)
            : null;

        // Fortschritt: TV-OpenWebIF-Daten → EPG-Zeit; sonst HA-Entity media_duration
        const hasDur    = !!(haAttrs && haAttrs.media_duration);
        const mediaEid  = (this.config.activity_media && this.config.activity_media[act]) || null;
        const hasChannel = isPlaying && !!channel;

        // ---- Texte & Layout ----
        actEl.textContent = act;

        if (hasChannel) {
            // 3-Zeilen: Aktivitaet (klein) | Kanal (mittel) | Titel (adaptiv)
            actEl.style.fontSize = '11px';
            actEl.style.fontWeight = 'normal';
            actEl.style.opacity  = '0.72';
            if (chanEl) {
                chanEl.textContent   = channel;
                chanEl.style.display = '';
                chanEl.style.fontSize = '16px';
            }
            if (titleEl) {
                const tLen = title.length;
                titleEl.textContent   = title;
                titleEl.style.display = title ? '' : 'none';
                titleEl.style.fontSize = tLen > 45 ? '10px'
                                       : tLen > 35 ? '11px'
                                       : tLen > 25 ? '12px'
                                       : tLen > 15 ? '13px' : '14px';
                titleEl.style.fontWeight = 'normal';
            }
        } else if (isPlaying && title) {
            // 2-Zeilen: Aktivitaet (klein) | Titel (gross)
            actEl.style.fontSize   = '12px';
            actEl.style.fontWeight = 'normal';
            actEl.style.opacity    = '0.72';
            if (chanEl) chanEl.style.display = 'none';
            if (titleEl) {
                const tLen = title.length;
                titleEl.textContent   = title;
                titleEl.style.display = '';
                titleEl.style.fontSize = tLen > 35 ? '13px'
                                       : tLen > 25 ? '15px' : '17px';
                titleEl.style.fontWeight = 'bold';
            }
        } else {
            // Idle: nur Aktivitaetsname gross
            actEl.style.fontSize   = '18px';
            actEl.style.fontWeight = 'bold';
            actEl.style.opacity    = '1';
            if (chanEl)  chanEl.style.display  = 'none';
            if (titleEl) titleEl.style.display = 'none';
            if (timeEl)  timeEl.style.display  = 'none';
        }

        // Layout-Inline-Styles zuruecksetzen (Vorbereitung fuer _applyDisplayLayout).
        this._clearDisplayLayout(display);

        // Drei-Punkte (nur wenn Media-Entity konfiguriert)
        if (dotsEl) dotsEl.style.display = mediaEid ? 'flex' : 'none';

        // TV-Modus-Klasse: Logo links, groesseres Padding-Left fuer Text-Spalte.
        // Immer aktiv wenn TV-Aktivitaet und playing – auch ohne Logo-Bild
        // (Fallback-TV-Icon wird angezeigt).
        const useTVLayout    = isTVAct && isPlaying;
        const useMediaMode   = !isTVAct && isPlaying;
        display.classList.toggle('tv-mode',    useTVLayout);
        display.classList.toggle('media-mode', useMediaMode);

        // Layout-Inline-Styles aus Config anwenden (TV oder Kodi)
        if      (useTVLayout)    this._applyDisplayLayout(display, 'tv');
        else if (useMediaMode)   this._applyDisplayLayout(display, 'media');

        // ---- Restzeit-Anzeige (1h 34m bis 21:35) ----
        // Quellen: OpenWebIF endStr ODER HA-Entity media_duration/_position
        if (timeEl) {
            const remStr = isPlaying
                ? this._computeTimeRemaining(tvData, haAttrs)
                : '';
            if (remStr) {
                timeEl.textContent   = remStr;
                timeEl.style.display = 'block';
            } else {
                timeEl.textContent   = '';
                timeEl.style.display = 'none';
            }
            // Position wird durch _applyDisplayLayout gesetzt – kein Reset noetig.
        }

        // ---- Fortschrittsbalken ----
        // Sichtbar wenn entweder OpenWebIF-EPG-Zeit ODER HA-Entity media_duration ODER
        // Enigma2 currservice_begin/end_timestamp verfuegbar ist.
        const tvPct = (tvData && this._tvData) ? this._tvProgress() : null;
        const haPct = this._mediaPctFromAttrs(haAttrs);   // null wenn keine Daten
        if (isTVAct) {
            console.debug('[HarmonyCard] TV-Fortschritt: tvPct=' + tvPct + ', haPct=' + haPct +
                ', bts=' + (haAttrs && haAttrs.currservice_begin_timestamp) +
                ', ets=' + (haAttrs && haAttrs.currservice_end_timestamp));
        }
        const showProgress = (tvPct !== null) || (haPct !== null);
        if (progEl) progEl.style.display = showProgress ? 'block' : 'none';
        if (showProgress) {
            // Sofortige Initialbreite, danach laufende Aktualisierung jede Sekunde
            if (fillEl) {
                const pct = (tvPct !== null) ? tvPct : haPct;
                fillEl.style.width = (pct * 100).toFixed(2) + '%';
            }
            this._startProgressTimer();
            this._updateProgressBar();
        } else {
            this._stopProgressTimer();
        }

        // ---- Hintergrund, Gradient, Farben ----
        const FALLBACK_BG   = 'rgb(42,42,60)';      // Dunkles Blau-Grau (passt zu TV)
        const FALLBACK_TEXT = 'rgb(220,220,220)';
        const LCD_BG        = 'linear-gradient(145deg, #d4d4d4, #f0f0f0)';

        const applyColors = (bgColor, textColor, subColor) => {
            // Gradient: HA-Ansatz – Vollfarbe links → transparent rechts
            const bgTrans = bgColor.startsWith('rgb(')
                ? bgColor.replace('rgb(', 'rgba(').replace(')', ',0)')
                : bgColor + '00';
            if (gradEl) gradEl.style.background =
                'linear-gradient(to right, ' + bgColor + ' 35%, ' + bgTrans + ' 75%)';
            display.style.background = bgColor;
            display.style.color      = textColor;
            if (actEl)   actEl.style.color   = subColor;
            if (chanEl)  chanEl.style.color  = textColor;
            if (titleEl) titleEl.style.color = subColor;
            if (timeEl)  timeEl.style.color  = subColor;
            if (pwrEl)   pwrEl.style.color   = textColor;
            if (dotsEl)  dotsEl.style.color  = subColor;
            if (fillEl)  fillEl.style.background = textColor;
        };

        // Sender-Logo anzeigen / verstecken (TV-Aktivitaet).
        // Vorgehendes Laden per _logoCache:
        //   'loaded'  → Picon-Bild zeigen
        //   'failed'  → HC_TV_ICON (SVG-Fallback) zeigen
        //   'loading' → HC_TV_ICON zeigen bis Ergebnis vorliegt
        //   nicht im Cache → _preloadLogo() starten + HC_TV_ICON bis Ergebnis
        // Bei Kodi oder Idle: ausblenden.
        if (logoEl) {
            if (isTVAct && isPlaying) {
                let bgImg;
                if (logoUrl) {
                    const status = this._logoCache[logoUrl];
                    if (!status) this._preloadLogo(logoUrl);
                    bgImg = (status === 'loaded') ? 'url(' + logoUrl + ')' : HC_TV_ICON;
                } else {
                    bgImg = HC_TV_ICON;
                }
                logoEl.style.backgroundImage = bgImg;
                logoEl.style.display = 'block';
            } else {
                logoEl.style.backgroundImage = '';
                logoEl.style.display = 'none';
            }
        }

        if (isPlaying && thumb) {
            if (bgEl) {
                const newImg = 'url(' + thumb + ')';
                const isNewImage = (bgEl.dataset.src !== thumb);
                bgEl.style.backgroundImage = newImg;
                bgEl.style.display = 'block';
                bgEl.dataset.src = thumb;
                // Fade-Zoom-Animation neu triggern (wie HA Media-Player)
                if (isNewImage) {
                    bgEl.classList.remove('animate');
                    // Reflow erzwingen, damit die Animation neu startet
                    void bgEl.offsetWidth;
                    bgEl.classList.add('animate');
                }
            }
            // Grab-Bild alle 500 ms neu laden (TV-Hintergrund "Pseudo-Video")
            // Nur bei TV-Modus mit Grab-URL starten; bei Kodi/anderen stoppen.
            if (isTVAct && thumb && thumb.includes('/grab')) {
                this._startGrabRefresh(thumb);
            } else {
                this._stopGrabRefresh();
            }
            const bgC  = (colors && colors.bg)      || FALLBACK_BG;
            const txtC = (colors && colors.text)    || FALLBACK_TEXT;
            const subC = (colors && colors.subText) || FALLBACK_TEXT;
            applyColors(bgC, txtC, subC);
        } else if (isPlaying) {
            if (bgEl) {
                bgEl.style.backgroundImage = '';
                bgEl.style.display = 'none';
                bgEl.classList.remove('animate');
                bgEl.dataset.src = '';
            }
            this._stopGrabRefresh();
            if (gradEl) gradEl.style.background = '';
            applyColors(FALLBACK_BG, FALLBACK_TEXT, FALLBACK_TEXT);
        } else {
            // Idle
            if (bgEl) {
                bgEl.style.backgroundImage = '';
                bgEl.style.display = 'none';
                bgEl.classList.remove('animate');
                bgEl.dataset.src = '';
            }
            this._stopGrabRefresh();
            if (gradEl) gradEl.style.background = '';
            display.classList.remove('tv-mode');
            this._stopProgressTimer();
            display.style.background = LCD_BG;
            display.style.color      = '#333333';
            if (actEl)   actEl.style.color   = '';
            if (chanEl)  chanEl.style.color  = '';
            if (titleEl) titleEl.style.color = '';
            if (timeEl)  timeEl.style.color  = '';
            if (pwrEl)   pwrEl.style.color   = '';
            if (dotsEl)  dotsEl.style.color  = '';
        }
    }

    _updateLiveUI() {
        if (!this._hass || !this.config || !this._rendered) return;
        const stateObj = this._hass.states[this.config.entity];
        if (!stateObj) return;
        const currentAct = (stateObj.attributes && stateObj.attributes.current_activity) || 'PowerOff';
        if (this._parsedHarmonyData && this._parsedHarmonyData.Error) return;

        const activityChanged = (this._lastActivity !== currentAct);
        if (activityChanged) {
            this._lastActivity = currentAct;
            this._updateZoneVisibility(currentAct);
        }

        // activity_media-Entity IMMER lesen (Kodi UND TV-Fallback, z.B. media_player.vu_office)
        const mediaEntityId = (this.config.activity_media && this.config.activity_media[currentAct]) || null;
        const mediaStateObj = mediaEntityId ? (this._hass.states[mediaEntityId] || null) : null;

        const isTVAct     = this._isTVActivity(currentAct);
        const enigma2Base = (this.config.enigma2_url || '').replace(/\/+$/, '');
        const enigma2Eid  = this.config.enigma2_entity || null;   // optionaler HA REST-Sensor
        let mediaFp = '';

        if (isTVAct) {
            if (enigma2Eid) {
                // --- MODUS A: enigma2_epg-Sensor (server-seitig, kein CORS) ---
                // Beim Aktivitaetswechsel sofortigen Sensor-Refresh ausloesen:
                // HA ruft /api/statusinfo am Receiver auf → Entity aktualisiert sich in ~1s.
                if (activityChanged) {
                    this._hass.callService('homeassistant', 'update_entity', { entity_id: enigma2Eid })
                        .catch(() => {});
                }
                const ss = this._hass.states[enigma2Eid];
                if (ss) {
                    const sa           = ss.attributes || {};
                    const newBegin     = sa.currservice_begin || '';
                    const newStation   = sa.currservice_station || '';
                    const newServiceref = sa.currservice_serviceref || '';
                    const prevBegin    = this._tvData ? this._tvData.beginStr    : null;
                    const prevStation  = this._tvData ? this._tvData.station     : null;
                    const prevSvcRef   = this._tvData ? this._tvData.serviceref  : null;
                    // Kanal ODER Programm gewechselt → neues Grab-Bild laden
                    const progChange = (prevBegin !== newBegin)
                        || (prevStation  !== null && prevStation  !== newStation)
                        || (prevSvcRef   !== null && prevSvcRef   !== newServiceref);
                    const oldThumb = this._tvData ? this._tvData.thumbUrl : null;
                    // grab_url direkt vom Sensor (bereits vollstaendige URL inkl. Host)
                    // Fallback: enigma2_url aus Sensor-Attribut (kein manuelles Eintragen noetig)
                    const sensorBase = (sa.enigma2_url || '').replace(/\/+$/, '');
                    const effectiveBase = enigma2Base || sensorBase;
                    const grabBase = sa.grab_url
                        || (effectiveBase ? effectiveBase + '/grab?format=jpg&r=480&mode=video' : null);
                    this._tvData = {
                        channel:    newStation || ss.state || '',
                        title:      sa.currservice_name || '',
                        beginStr:   newBegin,
                        endStr:     sa.currservice_end  || '',
                        piconUrl:   sa.picon_url        || null,
                        station:    newStation,
                        serviceref: newServiceref,
                        thumbUrl:   grabBase
                            ? (progChange ? grabBase + '&_t=' + Date.now() : oldThumb)
                            : null
                    };
                } else { this._tvData = null; }
                mediaFp = this._tvData
                    ? [this._tvData.channel, this._tvData.title, this._tvData.beginStr].join('|') : '';

            } else {
                // Kein enigma2_epg-Sensor → nur HA-Entity-Fallback (Modus C)
                this._tvData = null;
                mediaFp = '';
            }

            // --- MODUS C: Immer HA-Entity als Fallback-Fingerabdruck einbeziehen ---
            // Damit aendert sich der FP auch wenn sich Kanal/Titel/Logo im HA-Entity aendern,
            // selbst wenn kein OpenWebIF-Datum verfuegbar ist.
            if (mediaStateObj) {
                const ma = mediaStateObj.attributes || {};
                const haFp = [
                    mediaStateObj.state,
                    ma.media_channel          || '',
                    ma.media_title            || '',
                    ma.currservice_station    || '',
                    ma.currservice_name       || '',
                    ma.currservice_begin_timestamp || '',
                    ma.entity_picture_local   || ma.entity_picture || ''
                ].join('|');
                mediaFp = mediaFp ? mediaFp + '|' + haFp : haFp;
            }

        } else {
            // Nicht-TV (Kodi etc.): TV-Daten zuruecksetzen, HA-Entity-Fingerabdruck
            if (activityChanged) this._tvData = null;
            mediaFp = mediaStateObj
                ? [mediaStateObj.state,
                   (mediaStateObj.attributes.media_title        || ''),
                   (mediaStateObj.attributes.media_channel      || ''),
                   (mediaStateObj.attributes.media_artist       || ''),
                   (mediaStateObj.attributes.media_series_title || ''),
                   (mediaStateObj.attributes.entity_picture_local || mediaStateObj.attributes.entity_picture || '')].join('|')
                : '';
        }
        const mediaChanged = (mediaFp !== this._lastMediaFp);
        this._lastMediaFp = mediaFp;

        // Progress-Bar immer aktualisieren (laeuft sekuendlich weiter)
        this._updateProgressBar();

        if (!activityChanged && !mediaChanged) return;

        // Hoehe sofort anpassen (CSS-Transition laeuft parallel zum Fade)
        const msAttrs   = mediaStateObj ? (mediaStateObj.attributes || {}) : {};
        // TV-Aktivitaet = per Definition immer "playing" (Nutzer hat TV-Aktivitaet gewaehlt).
        // Kodi/andere = aus HA-Entity-State.
        const isPlaying = isTVAct
            ? true
            : !!(mediaStateObj && ['playing', 'paused', 'on'].includes(mediaStateObj.state));
        // Expand: TV = wenn irgendetwas anzuzeigen (Kanal/Titel/Logo aus tvData ODER haAttrs)
        const hasTVData = isTVAct && (
            !!(this._tvData && (this._tvData.channel || this._tvData.title)) ||
            !!(msAttrs && (msAttrs.media_channel    || msAttrs.media_title    ||
                           msAttrs.currservice_station || msAttrs.currservice_name ||
                           msAttrs.entity_picture_local || msAttrs.entity_picture))
        );
        const hasTitle  = isTVAct
            ? hasTVData
            : !!(isPlaying && this._getMediaTitle(msAttrs));
        const willExpand = isPlaying && hasTitle;
        const display = this.shadowRoot.getElementById('harmony-display');
        if (display) display.style.minHeight = willExpand ? '150px' : '';

        if (!display) return;

        // Thumbnail-URL vorab extrahieren (fuer Farb-Extraktion VOR Fade)
        // TV (isTVAct): Picons und Grab-URL sind cross-origin – getImageData() wuerde
        //   SecurityError werfen. Farb-Extraktion wird uebersprungen (null → Fallback-Farben).
        // Kodi: entity_picture_local ist same-origin via HA-Proxy → Farb-Extraktion funktioniert.
        const msEntityAttrs = (mediaStateObj && mediaStateObj.attributes) ? mediaStateObj.attributes : null;
        const thumbUrl = (!isTVAct && isPlaying && msEntityAttrs)
            ? (msEntityAttrs.entity_picture_local || msEntityAttrs.entity_picture || null)
            : null;
        const capturedAct   = currentAct;
        const capturedMedia = mediaStateObj;

        const doFade = (colors) => {
            if (!this.shadowRoot) return;
            const disp = this.shadowRoot.getElementById('harmony-display');
            if (!disp) return;
            if (this._fadeTimer) { clearTimeout(this._fadeTimer); this._fadeTimer = null; }
            disp.style.opacity = '0';
            const myGen = this._renderGen;
            this._fadeTimer = setTimeout(() => {
                this._fadeTimer = null;
                if (this._renderGen !== myGen) return;
                this._renderDisplayContent(capturedAct, capturedMedia, colors);
                disp.style.opacity = '1';
            }, 150);
        };

        if (thumbUrl) {
            this._extractColors(thumbUrl).then(doFade).catch(() => doFade(null));
        } else {
            doFade(null);
        }
    }

    // -------- GRAB-IMAGE REFRESH (TV-Hintergrund Polling) --------
    // Aktualisiert das TV-Hintergrundbild periodisch via /grab-Endpoint.
    // Intervall konfigurierbar via epg_grab_interval (Sekunden, Default: 30).
    // Durch Cache-Busting (_t=Timestamp) laedt der Browser jeweils ein neues Bild.
    // Hinweis: Das Bild in der Python-Integration ("TV"-Entity) wird separat
    //          von HA via stream_source / async_camera_image geladen (~500ms).
    _startGrabRefresh(baseUrl) {
        // Intervall aus Konfiguration lesen (Sekunden → Millisekunden, Default 30s)
        const intervalMs = Math.max(5, (this.config.epg_grab_interval || 30)) * 1000;
        // Timestamp-Parameter aus vorherigem Aufruf entfernen (saubere Basis-URL)
        const cleanUrl = baseUrl.replace(/([&?])_t=\d+/, '');
        // Timer nur neu starten wenn andere URL / anderes Intervall oder kein Timer laeuft
        if (this._grabRefreshBase === cleanUrl && this._grabRefreshTimer &&
            this._grabRefreshInterval === intervalMs) return;
        this._stopGrabRefresh();
        this._grabRefreshBase     = cleanUrl;
        this._grabRefreshInterval = intervalMs;
        const sep = cleanUrl.includes('?') ? '&' : '?';
        this._grabRefreshTimer = setInterval(() => {
            const bgEl = this.shadowRoot && this.shadowRoot.getElementById('display-bg');
            if (!bgEl || bgEl.style.display === 'none') return;
            const newUrl = cleanUrl + sep + '_t=' + Date.now();
            // backgroundImage direkt setzen – Browser zeigt altes Bild waehrend des Ladens
            // (kein Flackern), wechselt erst wenn neues Bild vollstaendig geladen ist.
            bgEl.style.backgroundImage = 'url(' + newUrl + ')';
            bgEl.dataset.src = newUrl;
        }, intervalMs);
    }

    _stopGrabRefresh() {
        if (this._grabRefreshTimer) {
            clearInterval(this._grabRefreshTimer);
            this._grabRefreshTimer = null;
        }
        this._grabRefreshBase = null;
    }

    // Setzt alle Layout-Inline-Styles zurück, damit CSS-Basisregeln greifen (Idle-Modus).
    _clearDisplayLayout(display) {
        const props = ['position','left','top','right','bottom','transform',
                       'width','height','lineHeight','margin','zIndex','overflow'];
        ['display-power','display-logo','display-activity',
         'display-channel','display-title','display-time'].forEach(id => {
            const el = display.querySelector('#' + id);
            if (!el) return;
            props.forEach(p => { el.style[p] = ''; });
        });
    }

    // Wendet Layout-Positionen aus Config (tv_layout / media_layout) als Inline-Styles an.
    _applyDisplayLayout(display, mode) {
        const cfgKey = mode === 'tv' ? 'tv_layout' : 'media_layout';
        const stored = (this.config && this.config[cfgKey]) || {};
        const defs   = hcDefaultLayout(mode);
        const layout = {};
        new Set([...Object.keys(defs), ...Object.keys(stored)])
            .forEach(k => { layout[k] = { ...(defs[k] || {}), ...(stored[k] || {}) }; });

        const idMap = {
            power: 'display-power', logo: 'display-logo',
            activity: 'display-activity', channel: 'display-channel',
            title: 'display-title', time: 'display-time',
        };
        Object.entries(layout).forEach(([key, def]) => {
            const el = display.querySelector('#' + (idMap[key] || ''));
            if (!el) return;
            if (def.visible === false) { el.style.display = 'none'; return; }
            el.style.position  = 'absolute';
            el.style.left      = def.left + 'px';
            el.style.top       = def.top  + 'px';
            el.style.right     = 'auto';
            el.style.bottom    = 'auto';
            el.style.transform = 'none';
            el.style.margin    = '0';
            el.style.zIndex    = '3';
            el.style.width     = def.w + 'px';
            el.style.height    = def.h + 'px';
            el.style.overflow  = 'hidden';
            if (key !== 'logo' && key !== 'power') el.style.lineHeight = def.h + 'px';
            if (key === 'activity') { el.style.display = 'flex'; el.style.alignItems = 'center'; }
        });
    }

    disconnectedCallback() {
        if (this._fadeTimer)    { clearTimeout(this._fadeTimer);      this._fadeTimer    = null; }
        if (this._progressTimer){ clearInterval(this._progressTimer); this._progressTimer = null; }
        this._stopGrabRefresh();
    }
}

customElements.define('harmony-companion-card', HarmonyCompanionCard);


// ============================================================================
// GUI EDITOR
// ============================================================================
class HarmonyCompanionEditor extends HTMLElement {
    constructor() {
        super();
        this._config = {};
        this._hass = null;
        this._initialized = false;
        this._loaded = false;
        this._loading = false;
        this._loadError = null;
        this._confData = null;          // Rohdaten der .conf-Datei (fuer Auto-Befuellen)
        this._cmdOptions = [];
        this._contextOptions = [{ label: 'Globale Standardbelegung', value: 'global' }];
        this._activitiesList = [];
        this._currentContext = 'global';
        this._openedSections = new Set(['sec-hub']);
        this._slotCounts = { act: null, bot: null };

        this._buttonIds = [
            // DVR-Zone (jetzt in physischer Tastenbelegung)
            'dvr_1', 'dvr_2', 'dvr_3',
            // Farbtasten
            'red', 'green', 'yellow', 'blue',
            // Navigation
            'exit', 'menu', 'back', 'ok',
            'dir_up', 'dir_down', 'dir_left', 'dir_right',
            // Audio/Kanal
            'vol_up', 'vol_down', 'mute', 'ch_up', 'ch_down',
            // Playback
            'skip_back', 'rewind', 'play', 'pause', 'fast_forward', 'skip_forward',
            'record', 'stop',
            // Numpad
            'num_1', 'num_2', 'num_3', 'num_4', 'num_5', 'num_6',
            'num_7', 'num_8', 'num_9', 'num_0', 'num_minus', 'num_enter'
        ];
    }

    setConfig(config) {
        this._config = JSON.parse(JSON.stringify(config || {}));
        this._config.type = this._config.type || 'custom:harmony-companion-card';
        if (this._config.entity === undefined) this._config.entity = '';
        if (!this._config.config_file) this._config.config_file = '/local/harmony_12563120.conf';
        if (!this._config.buttons) this._config.buttons = { global: {} };
        if (!this._config.dynamic_slots) this._config.dynamic_slots = {};
        if (!this._config.activity_media) this._config.activity_media = {};
        // Editor-Zustand bei neuer Config zurücksetzen
        this._leLayouts = {};

        if (this._loaded) { this._tryBuild(); return; }
        if (this._loading) return;
        this._loading = true;
        this._fetchConf()
            .then(() => { this._loading = false; this._loaded = true; this._tryBuild(); })
            .catch((err) => { this._loading = false; this._loaded = true; console.error('Harmony editor fetch:', err); this._tryBuild(); });
    }

    set hass(hass) {
        this._hass = hass;
        this._tryBuild();
        this.querySelectorAll('ha-selector').forEach((el) => { el.hass = hass; });
    }

    _tryBuild() {
        if (!this._hass || !this._loaded) return;
        if (!this._initialized) { this._buildDOM(); this._initialized = true; }
    }

    async _fetchConf() {
        const url = this._config.config_file || '/local/harmony_12563120.conf';
        try {
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            this._confData = data;       // Rohdaten fuer Auto-Befuellen speichern
            this._cmdOptions = [];
            this._contextOptions = [{ label: 'Globale Standardbelegung', value: 'global' }];
            this._activitiesList = [];

            if (data && data.Activities) {
                const ids = Object.keys(data.Activities).sort((a, b) => {
                    const an = parseInt(a, 10), bn = parseInt(b, 10);
                    if (isNaN(an) || isNaN(bn)) return String(a).localeCompare(String(b));
                    return an - bn;
                });
                ids.forEach((id) => {
                    if (id === '-1') return;
                    const name = data.Activities[id];
                    this._activitiesList.push({ name, actionValue: 'activity:::' + name });
                    this._cmdOptions.push({ label: name + ' (Aktivitaet)', value: 'activity:::' + name });
                    this._contextOptions.push({ label: 'Aktion: ' + name, value: name });
                });
            }
            if (data && data.Devices) {
                Object.keys(data.Devices).forEach((devName) => {
                    const dev = data.Devices[devName];
                    if (!dev || !Array.isArray(dev.commands)) return;
                    const short = devName.length > 22 ? devName.substring(0, 22) + '...' : devName;
                    dev.commands.forEach((cmd) => {
                        this._cmdOptions.push({
                            label: cmd + '  (' + short + ')',
                            value: 'command:::' + dev.id + ':::' + cmd
                        });
                    });
                });
            }
        } catch (err) {
            this._loadError = 'Config-Datei nicht geladen: ' + url +
                ' — Datei nach /config/www/ kopieren und Pfad als /local/<name>.conf angeben.';
        }
    }

    // -------- DOM AUFBAU --------
    _buildDOM() {
        if (!this.isConnected) return;
        this.querySelectorAll('details').forEach((d) => {
            if (!d.id) return;
            if (d.open) this._openedSections.add(d.id);
            else this._openedSections.delete(d.id);
        });

        try {
            this.innerHTML = `
                <style>
                    .hc-edt { padding: 8px 4px; display: flex; flex-direction: column; gap: 12px; }
                    .hc-edt details {
                        border: 1px solid var(--divider-color, #ccc);
                        border-radius: 8px; background: var(--card-background-color); overflow: visible;
                    }
                    .hc-edt summary {
                        cursor: pointer; padding: 12px; outline: none;
                        font-weight: 600; list-style: none;
                        display: flex; align-items: center; gap: 8px;
                        color: var(--primary-text-color);
                    }
                    .hc-edt summary::-webkit-details-marker { display: none; }
                    .hc-edt .chev { transition: transform 0.2s; color: var(--secondary-text-color); }
                    .hc-edt details[open] .chev { transform: rotate(90deg); }
                    .hc-edt .body { padding: 0 12px 12px; display: flex; flex-direction: column; gap: 12px; }
                    .hc-edt .btn-row {
                        display: grid; gap: 8px; align-items: center;
                        grid-template-columns: 130px 1fr;
                    }
                    .hc-edt ha-textfield, .hc-edt ha-selector { width: 100%; display: block; }
                    .hc-edt .lbl { font-size: 12px; color: var(--secondary-text-color); margin-bottom: 2px; font-weight: 500; }
                    .hc-edt .add-btn {
                        background: var(--primary-color); color: var(--text-primary-color, #fff);
                        border: none; border-radius: 4px; padding: 8px 14px;
                        cursor: pointer; font-weight: 600; align-self: flex-start;
                        display: inline-flex; align-items: center; gap: 6px;
                    }
                    .hc-edt .auto-btn {
                        background: var(--secondary-background-color, #e8e8e8);
                        color: var(--primary-text-color);
                        border: 1px solid var(--divider-color, #ccc);
                        border-radius: 4px; padding: 8px 14px;
                        cursor: pointer; font-weight: 600;
                        display: inline-flex; align-items: center; gap: 6px;
                        font-size: 13px;
                    }
                    .hc-edt .auto-btn:hover { background: var(--primary-color); color: var(--text-primary-color, #fff); }
                    .hc-edt .del-btn {
                        background: transparent; border: none;
                        color: var(--error-color, #cc0000);
                        cursor: pointer; padding: 4px;
                        display: flex; align-items: center; justify-content: center;
                    }
                    .hc-edt .err {
                        padding: 12px; border-radius: 6px;
                        background: rgba(204,0,0,0.08); color: var(--error-color, #cc0000); font-size: 0.95em;
                    }
                    .hc-edt .btn-label { font-family: monospace; font-size: 13px; color: var(--primary-text-color); }
                    .hc-edt .ctx-row { display: flex; gap: 8px; align-items: flex-end; flex-wrap: wrap; }
                    .hc-edt .ctx-row > *:first-child { flex: 1; min-width: 160px; }
                    /* Such-Dropdown */
                    .hc-sel-wrap { position: relative; }
                    .hc-sel-input {
                        width: 100%; height: 44px; padding: 4px 10px;
                        border: 1px solid var(--divider-color, #888); border-radius: 4px;
                        background: var(--input-fill-color, var(--card-background-color, #fff));
                        color: var(--primary-text-color, #212121);
                        font-size: 13px; font-family: inherit;
                        box-sizing: border-box; cursor: text; outline: none;
                    }
                    .hc-sel-input:focus { border-color: var(--primary-color, #03a9f4); }
                    .hc-sel-drop {
                        display: none; position: absolute; top: 100%; left: 0; right: 0; z-index: 9999;
                        max-height: 240px; overflow-y: auto;
                        background: var(--card-background-color, #fff);
                        border: 1px solid var(--divider-color, #888);
                        border-top: none; border-radius: 0 0 4px 4px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.18);
                    }
                    .hc-sel-grp {
                        padding: 5px 10px 3px; font-size: 11px; font-weight: 700;
                        color: var(--secondary-text-color, #888); text-transform: uppercase;
                        letter-spacing: 0.06em;
                        background: var(--primary-background-color, #f5f5f5);
                        position: sticky; top: 0; z-index: 1;
                    }
                    .hc-sel-item {
                        padding: 7px 12px; font-size: 13px;
                        color: var(--primary-text-color, #212121);
                        cursor: pointer; white-space: nowrap;
                        overflow: hidden; text-overflow: ellipsis;
                    }
                    .hc-sel-item:hover, .hc-sel-item[data-sel] {
                        background: var(--secondary-background-color, #e8e8e8);
                    }
                    .hc-sel-empty {
                        padding: 10px 12px; font-size: 13px;
                        color: var(--secondary-text-color, #888); font-style: italic;
                    }
                </style>
                <div class="hc-edt"></div>
            `;
            const root = this.querySelector('.hc-edt');
            if (this._loadError) {
                const err = document.createElement('div');
                err.className = 'err';
                err.textContent = this._loadError;
                root.appendChild(err);
            }
            root.appendChild(this._sectionHub());
            root.appendChild(this._sectionEnigma2());
            root.appendChild(this._sectionSlots('act', 'Aktivitaeten-Slots (Hauptbereich)'));
            root.appendChild(this._sectionSlots('bot', 'Extra-Slots (Unten)'));
            root.appendChild(this._sectionButtons());
        } catch (err) {
            console.error('Harmony Editor build error:', err);
            this.innerHTML = '<div style="padding:16px;color:var(--error-color,#cc0000);">Editor-Fehler: ' +
                escHtml(err && err.message ? err.message : String(err)) + '</div>';
        }
    }

    _details(id, title) {
        const det = document.createElement('details');
        det.id = id;
        if (this._openedSections.has(id)) det.open = true;
        const sum = document.createElement('summary');
        const chev = document.createElement('ha-icon');
        chev.setAttribute('icon', 'mdi:chevron-right');
        chev.className = 'chev';
        const span = document.createElement('span');
        span.textContent = title;
        sum.appendChild(chev);
        sum.appendChild(span);
        det.appendChild(sum);
        const body = document.createElement('div');
        body.className = 'body';
        det.appendChild(body);
        return { det, body };
    }

    // -------- SECTION: HUB --------
    _sectionHub() {
        const { det, body } = this._details('sec-hub', 'Hub-Konfiguration');
        body.appendChild(this._labeled('Harmony Hub Entitaet',
            this._haSelector({ entity: { domain: 'remote' } }, this._config.entity || '',
                (v) => this._patchTop('entity', v || ''))
        ));
        const cfg = document.createElement('ha-textfield');
        cfg.label = 'Pfad zur Config-Datei';
        cfg.helper = 'z.B. /local/harmony_12563120.conf';
        cfg.helperPersistent = true;
        cfg.value = this._config.config_file || '';
        cfg.onchange = (e) => this._patchTop('config_file', e.target.value);
        body.appendChild(cfg);
        return det;
    }

    // -------- SECTION: DISPLAY LAYOUT (visueller Editor) --------
    // Anzeigeskalierung: Grid wird 2× vergrößert dargestellt für bessere Bedienbarkeit.
    // Alle gespeicherten Koordinaten bleiben in echten Pixeln (10px/7px Raster).
    get _leScale() { return 2; }

    _sectionLayout() {
        if (!this._leMode)    this._leMode    = 'tv';
        if (!this._leLayouts) this._leLayouts = {};

        const { det, body } = this._details('sec-layout', 'Display-Layout');
        const S = this._leScale;

        // Tabs TV / Kodi
        const tabBar = document.createElement('div');
        tabBar.style.cssText = 'display:flex;gap:8px;margin-bottom:12px;';
        ['tv', 'media'].forEach(m => {
            const b = document.createElement('button');
            b.textContent = m === 'tv' ? 'Fernsehen (TV)' : 'Kodi';
            const act = m === this._leMode;
            b.style.cssText = 'padding:5px 14px;border-radius:16px;border:2px solid;cursor:pointer;font-size:12px;transition:all .15s;' +
                (act ? 'background:var(--primary-color,#03a9f4);color:#fff;border-color:var(--primary-color,#03a9f4);'
                      : 'background:transparent;color:inherit;border-color:var(--divider-color,#ccc);');
            b.onclick = () => { this._leMode = m; this._buildDOM(); };
            tabBar.appendChild(b);
        });
        body.appendChild(tabBar);

        const mode = this._leMode;
        if (!this._leLayouts[mode]) this._leLayouts[mode] = this._leLoadLayout(mode);

        // Grid (2× vergrößert: 640×252 px)
        const grid = document.createElement('div');
        grid.style.cssText = [
            `width:${HC_DISP_W * S}px;height:${HC_DISP_H * S}px;`,
            'position:relative;overflow:hidden;',
            'background:#1a1a2e;',
            `background-image:linear-gradient(rgba(255,255,255,0.13) 1px,transparent 1px),`,
            `linear-gradient(90deg,rgba(255,255,255,0.13) 1px,transparent 1px);`,
            `background-size:${HC_COL_W * S}px ${HC_ROW_H * S}px;`,
            'border:2px solid rgba(255,255,255,0.35);border-radius:5px;',
            'box-sizing:border-box;cursor:crosshair;flex-shrink:0;touch-action:none;',
        ].join('');
        this._leGridEl = grid;

        // Snap-Preview (zeigt Zielposition beim Ziehen)
        const snapPrev = document.createElement('div');
        snapPrev.style.cssText = [
            'position:absolute;pointer-events:none;display:none;z-index:5;',
            'border:2px dashed rgba(255,255,255,0.9);box-sizing:border-box;',
            'background:rgba(255,255,255,0.12);border-radius:2px;',
        ].join('');
        grid.appendChild(snapPrev);
        this._leSnapPrev = snapPrev;

        const coordTip = document.createElement('div');
        coordTip.style.cssText = 'font-size:11px;color:var(--secondary-text-color);min-height:16px;margin-top:4px;font-family:monospace;letter-spacing:0.02em;';
        this._leCoordTip = coordTip;

        grid.addEventListener('pointermove', (e) => {
            if (this._leDrag) return;
            const r = grid.getBoundingClientRect();
            const gx = Math.max(0, Math.min(HC_DISP_W, Math.round((e.clientX - r.left) / (HC_COL_W * S)) * HC_COL_W));
            const gy = Math.max(0, Math.min(HC_DISP_H, Math.round((e.clientY - r.top)  / (HC_ROW_H * S)) * HC_ROW_H));
            coordTip.textContent = 'x: ' + gx + 'px  y: ' + gy + 'px';
        });
        grid.addEventListener('pointerleave', () => { if (!this._leDrag) coordTip.textContent = ''; });

        this._leRenderGridEls(mode);

        // Scrollbarer Wrapper (falls Config-Panel schmäler als 640px)
        const scrollWrap = document.createElement('div');
        scrollWrap.style.cssText = 'overflow-x:auto;width:100%;-webkit-overflow-scrolling:touch;padding-bottom:2px;';
        scrollWrap.appendChild(grid);
        body.appendChild(scrollWrap);
        body.appendChild(coordTip);

        // Palette
        const palLbl = document.createElement('div');
        palLbl.style.cssText = 'font-size:11px;color:var(--secondary-text-color);margin-top:10px;margin-bottom:6px;';
        palLbl.textContent = 'Auf das Raster ziehen · vom Raster wegziehen zum Entfernen:';
        body.appendChild(palLbl);

        const palette = document.createElement('div');
        palette.style.cssText = 'display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px;';
        this._lePaletteEl = palette;
        this._leRenderPaletteItems(mode, palette);
        body.appendChild(palette);

        // Aktions-Buttons
        const actRow = document.createElement('div');
        actRow.style.cssText = 'display:flex;gap:8px;';

        const btnReset = document.createElement('button');
        btnReset.textContent = 'Zurücksetzen';
        btnReset.style.cssText = 'padding:6px 12px;border-radius:6px;border:1px solid var(--divider-color,#ccc);cursor:pointer;font-size:12px;background:transparent;color:inherit;';
        btnReset.onclick = () => {
            this._leLayouts[mode] = hcDefaultLayout(mode);
            this._leRenderGridEls(mode);
            this._leRenderPaletteItems(mode, this._lePaletteEl);
        };

        const btnApply = document.createElement('button');
        btnApply.textContent = 'Übernehmen';
        btnApply.style.cssText = 'padding:6px 14px;border-radius:6px;border:none;cursor:pointer;font-size:12px;font-weight:600;background:var(--primary-color,#03a9f4);color:#fff;';
        btnApply.onclick = () => {
            const cfgKey = mode === 'tv' ? 'tv_layout' : 'media_layout';
            this._patchTop(cfgKey, this._leLayouts[mode] || this._leLoadLayout(mode));
        };

        actRow.appendChild(btnReset);
        actRow.appendChild(btnApply);
        body.appendChild(actRow);

        return det;
    }

    _leLoadLayout(mode) {
        const cfgKey = mode === 'tv' ? 'tv_layout' : 'media_layout';
        const stored = this._config && this._config[cfgKey];
        const def = hcDefaultLayout(mode);
        if (!stored) return def;
        const merged = { ...def };
        Object.keys(stored).forEach(k => { merged[k] = { ...(def[k] || {}), ...stored[k] }; });
        return merged;
    }

    _leRenderGridEls(mode) {
        const grid = this._leGridEl;
        if (!grid) return;
        grid.querySelectorAll('.le-el').forEach(el => el.remove());
        const layout = this._leLayouts[mode] || (this._leLayouts[mode] = this._leLoadLayout(mode));
        Object.entries(layout).forEach(([key, def]) => {
            if (!def.visible) return;
            const cat = hcCatalogFor(key, def);
            if (!cat) return;
            grid.appendChild(this._leCreateEl(key, def, cat, mode));
        });
    }

    _leRenderPaletteItems(mode, container) {
        if (!container) return;
        container.innerHTML = '';
        const layout = this._leLayouts[mode] || {};
        HC_MODE_ELEMS[mode].forEach(catalogKey => {
            const cat = HC_ELEM_CATALOG[catalogKey];
            const lKey = catalogKey.startsWith('logo') ? 'logo' : catalogKey;
            const placed = layout[lKey];
            const isPlaced = placed && placed.visible &&
                (lKey !== 'logo' || (catalogKey === 'logo_l' ? placed.h >= 60 : placed.h < 60));
            const item = document.createElement('div');
            item.style.cssText = [
                'padding:4px 10px;border-radius:5px;border:1px solid rgba(255,255,255,0.25);',
                `background:${cat.color};color:${cat.fg};`,
                'font-size:11px;font-weight:600;cursor:grab;user-select:none;white-space:nowrap;',
                `opacity:${isPlaced ? '0.35' : '1'};transition:opacity .15s;touch-action:none;`,
            ].join('');
            item.textContent = cat.label + ' ' + cat.w + '×' + cat.h;
            item.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                this._leStartDrag(e, catalogKey, item, mode);
            });
            container.appendChild(item);
        });
    }

    _leCreateEl(key, def, cat, mode) {
        const S = this._leScale;
        const el = document.createElement('div');
        el.className = 'le-el';
        el.dataset.key = key;
        el.style.cssText = [
            'position:absolute;',
            `left:${def.left * S}px;top:${def.top * S}px;`,
            `width:${cat.w * S}px;height:${cat.h * S}px;`,
            `background:${cat.color};color:${cat.fg};`,
            'font-size:10px;font-weight:700;',
            'display:flex;align-items:center;justify-content:center;text-align:center;',
            'border-radius:3px;cursor:grab;user-select:none;touch-action:none;',
            'box-sizing:border-box;z-index:2;overflow:hidden;white-space:nowrap;',
            'border:1px solid rgba(255,255,255,0.3);',
        ].join('');
        const catalogKey = key === 'logo' ? (def.h >= 60 ? 'logo_l' : 'logo_s') : key;
        el.textContent = cat.label + ' ' + cat.w + '×' + cat.h;
        el.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this._leStartDrag(e, catalogKey, el, mode);
        });
        return el;
    }

    _leStartDrag(e, catalogKey, sourceEl, mode) {
        const cat = HC_ELEM_CATALOG[catalogKey];
        if (!cat) return;
        const S = this._leScale;

        // Offset: Mitte des Elements als Ankerpunkt
        const offsetX = cat.w * S / 2;
        const offsetY = cat.h * S / 2;

        this._leDrag = { catalogKey, offsetX, offsetY, mode };

        const grid = this._leGridEl;

        const onMove = (ev) => {
            if (!grid) return;
            const gr = grid.getBoundingClientRect();
            const relX = ev.clientX - gr.left - offsetX;
            const relY = ev.clientY - gr.top  - offsetY;
            const inGrid = relX > -cat.w * S * 0.5 && relX < HC_DISP_W * S - cat.w * S * 0.5 &&
                           relY > -cat.h * S * 0.5 && relY < HC_DISP_H * S - cat.h * S * 0.5;
            const sp = this._leSnapPrev;
            if (inGrid && sp) {
                const sl = Math.max(0, Math.min(HC_DISP_W - cat.w, Math.round((relX / S) / HC_COL_W) * HC_COL_W));
                const st = Math.max(0, Math.min(HC_DISP_H - cat.h, Math.round((relY / S) / HC_ROW_H) * HC_ROW_H));
                sp.style.display = 'block';
                sp.style.left    = (sl * S) + 'px';
                sp.style.top     = (st * S) + 'px';
                sp.style.width   = (cat.w * S) + 'px';
                sp.style.height  = (cat.h * S) + 'px';
                if (this._leCoordTip) this._leCoordTip.textContent = '→ x: ' + sl + 'px  y: ' + st + 'px';
            } else {
                if (sp) sp.style.display = 'none';
                if (this._leCoordTip) this._leCoordTip.textContent = '';
            }
        };
        const onUp = (ev) => {
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup',   onUp);
            if (this._leSnapPrev) this._leSnapPrev.style.display = 'none';
            this._leDrop(ev, catalogKey, offsetX, offsetY, mode);
            this._leDrag = null;
            if (this._leCoordTip) this._leCoordTip.textContent = '';
        };
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup',   onUp);
    }

    _leDrop(e, catalogKey, offsetX, offsetY, mode) {
        const grid = this._leGridEl;
        if (!grid) return;
        const cat       = HC_ELEM_CATALOG[catalogKey];
        const layoutKey = catalogKey.startsWith('logo') ? 'logo' : catalogKey;
        const S         = this._leScale;
        const gr        = grid.getBoundingClientRect();
        const relX      = e.clientX - gr.left - offsetX;
        const relY      = e.clientY - gr.top  - offsetY;

        if (!this._leLayouts[mode]) this._leLayouts[mode] = this._leLoadLayout(mode);
        const layout = { ...this._leLayouts[mode] };

        const inGrid = relX > -cat.w * S * 0.5 && relX < HC_DISP_W * S - cat.w * S * 0.5 &&
                       relY > -cat.h * S * 0.5 && relY < HC_DISP_H * S - cat.h * S * 0.5;
        if (inGrid) {
            const left = Math.max(0, Math.min(HC_DISP_W - cat.w, Math.round((relX / S) / HC_COL_W) * HC_COL_W));
            const top  = Math.max(0, Math.min(HC_DISP_H - cat.h, Math.round((relY / S) / HC_ROW_H) * HC_ROW_H));
            layout[layoutKey] = { left, top, w: cat.w, h: cat.h, visible: true };
        } else {
            delete layout[layoutKey];
        }

        this._leLayouts[mode] = layout;
        this._leRenderGridEls(mode);
        this._leRenderPaletteItems(mode, this._lePaletteEl);
    }

    // -------- SECTION: ENIGMA2 / OPENWEBIF --------
    _sectionEnigma2() {
        const { det, body } = this._details('sec-enigma2', 'TV-Receiver (OpenWebIF / Enigma2)');

        // Info-Box
        const info = document.createElement('div');
        info.style.cssText = 'font-size:12px; color:var(--secondary-text-color); margin-bottom:10px; line-height:1.5;';
        info.innerHTML = '<b>Empfohlen:</b> HA REST-Sensor als Proxy (kein CORS noetig).<br>'
            + 'Alternativ: Direkt-URL mit CORS-Freigabe am Receiver.';
        body.appendChild(info);

        // HA-Sensor (bevorzugt – kein CORS)
        body.appendChild(this._labeled(
            'HA REST-Sensor fuer EPG-Daten (empfohlen)',
            this._haSelector(
                { entity: { domain: 'sensor' } },
                this._config.enigma2_entity || '',
                (v) => this._patchTop('enigma2_entity', v || undefined)
            )
        ));


        // Grab-Bild Aktualisierungsintervall
        const grabIntRow = document.createElement('div');
        grabIntRow.style.cssText = 'display:flex; align-items:center; gap:8px; margin-top:8px;';
        const grabIntField = document.createElement('ha-textfield');
        grabIntField.type    = 'number';
        grabIntField.label   = 'Hintergrundbild Refresh (Sekunden)';
        grabIntField.helper  = 'Wie oft das Grab-Bild in der Karte aktualisiert wird (min. 5, Default 30)';
        grabIntField.helperPersistent = true;
        grabIntField.min     = '5';
        grabIntField.step    = '5';
        grabIntField.style.cssText = 'flex:1;';
        grabIntField.value   = String(this._config.epg_grab_interval || 30);
        grabIntField.onchange = (e) => {
            const v = Math.max(5, parseInt(e.target.value, 10) || 30);
            this._patchTop('epg_grab_interval', v);
        };
        grabIntRow.appendChild(grabIntField);
        body.appendChild(grabIntRow);

        // Aktivitaeten-Auswahl: Checkboxen fuer jede konfigurierte Aktivitaet
        const acts = this._allActivityNames();
        if (acts.length > 0) {
            const label = document.createElement('div');
            label.style.cssText = 'margin-top:12px; font-size:12px; color:var(--secondary-text-color);';
            label.textContent = 'Aktivitaeten, die den Receiver nutzen:';
            body.appendChild(label);

            const current = Array.isArray(this._config.enigma2_activities) ? this._config.enigma2_activities : [];
            acts.forEach(actName => {
                const row = document.createElement('div');
                row.style.cssText = 'display:flex; align-items:center; gap:8px; margin-top:6px;';
                const cb = document.createElement('ha-checkbox');
                cb.checked = current.includes(actName);
                cb.onchange = (e) => this._patchEnigma2Activity(actName, e.target.checked);
                const lbl = document.createElement('span');
                lbl.style.cssText = 'font-size:14px; cursor:pointer;';
                lbl.textContent = actName;
                lbl.onclick = () => { cb.checked = !cb.checked; cb.onchange({ target: cb }); };
                row.appendChild(cb);
                row.appendChild(lbl);
                body.appendChild(row);
            });
        }
        body.appendChild(this._sectionLayout());
        return det;
    }

    _allActivityNames() {
        // _activitiesList wird beim Laden der Config-Datei befuellt (siehe _fetchConf)
        return (this._activitiesList || []).map(a => a.name).filter(Boolean);
    }

    _patchEnigma2Activity(actName, enabled) {
        const next = JSON.parse(JSON.stringify(this._config));
        if (!Array.isArray(next.enigma2_activities)) next.enigma2_activities = [];
        if (enabled) {
            if (!next.enigma2_activities.includes(actName)) next.enigma2_activities.push(actName);
        } else {
            next.enigma2_activities = next.enigma2_activities.filter(a => a !== actName);
        }
        if (next.enigma2_activities.length === 0) delete next.enigma2_activities;
        this._config = next;
        this._dispatch();
    }

    // -------- SECTION: SLOTS --------
    _sectionSlots(prefix, title) {
        const { det, body } = this._details('sec-slots-' + prefix, title);
        const slots = this._config.dynamic_slots || {};

        let lastFilled = 0;
        for (let i = 1; i <= 9; i++) {
            const s = slots[prefix + '_' + i];
            if (s && (s.text || s.icon || s.action)) lastFilled = i;
        }
        const actMin = (prefix === 'act' && this._activitiesList) ? this._activitiesList.length : 0;
        const autoMin = Math.max(actMin + 1, lastFilled + 1, 1);
        const explicit = this._slotCounts[prefix];
        const showCount = Math.min(9, explicit !== null ? Math.max(lastFilled, explicit) : autoMin);

        for (let i = 1; i <= showCount; i++) body.appendChild(this._slotRow(prefix, i, showCount));

        if (showCount < 9) {
            const add = document.createElement('button');
            add.type = 'button'; add.className = 'add-btn';
            const ic = document.createElement('ha-icon');
            ic.setAttribute('icon', 'mdi:plus');
            add.appendChild(ic);
            add.appendChild(document.createTextNode(' Slot hinzufuegen'));
            add.onclick = () => { this._slotCounts[prefix] = showCount + 1; this._buildDOM(); };
            body.appendChild(add);
        }
        return det;
    }

    _slotRow(prefix, idx, showCount) {
        const slotId = prefix + '_' + idx;
        const slot = (this._config.dynamic_slots && this._config.dynamic_slots[slotId]) || {};
        let defaultAction = '';
        if (prefix === 'act' && !slot.action && this._activitiesList && this._activitiesList[idx - 1]) {
            defaultAction = this._activitiesList[idx - 1].actionValue;
        }
        const currentAction = slot.action || defaultAction;
        const currentText   = slot.text || '';

        const card = document.createElement('div');
        card.style.cssText = 'border:1px solid var(--divider-color,#ccc);border-radius:6px;padding:8px;display:flex;flex-direction:column;gap:8px;';

        const r1 = document.createElement('div');
        r1.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 36px;gap:8px;align-items:end;';
        r1.appendChild(this._labeled('Icon (Slot ' + idx + ')',
            this._haSelector({ icon: {} }, slot.icon || '', (v) => this._patchSlot(slotId, 'icon', v || ''))
        ));
        const txt = document.createElement('ha-textfield');
        txt.label = 'Text'; txt.value = currentText; txt.style.width = '100%';
        txt.onchange = (e) => this._patchSlot(slotId, 'text', e.target.value);
        r1.appendChild(txt);

        const del = document.createElement('button');
        del.type = 'button'; del.className = 'del-btn'; del.title = 'Slot entfernen';
        const dic = document.createElement('ha-icon'); dic.setAttribute('icon', 'mdi:close');
        del.appendChild(dic);
        del.onclick = () => {
            if (this._config.dynamic_slots) delete this._config.dynamic_slots[slotId];
            this._slotCounts[prefix] = Math.max(0, idx - 1);
            this._dispatch(); this._buildDOM();
        };
        r1.appendChild(del);
        card.appendChild(r1);

        const r2 = document.createElement('div');
        r2.appendChild(this._labeled('Aktion',
            this._searchSelect(this._cmdOptions, currentAction, '-- Aktion waehlen --',
                (v) => this._patchSlot(slotId, 'action', v || ''))
        ));
        card.appendChild(r2);
        return card;
    }

    // -------- SECTION: PHYSISCHE TASTEN --------
    _sectionButtons() {
        const { det, body } = this._details('sec-buttons', 'Physische Tastenbelegung');

        // Kontext-Zeile: Auswahl + Auto-Befuellen-Button
        const ctxRow = document.createElement('div');
        ctxRow.className = 'ctx-row';

        ctxRow.appendChild(this._labeled('Kontext (Aktivitaet)',
            this._nativeSelect(this._contextOptions, this._currentContext, '-- Kontext --',
                (v) => { this._currentContext = v || 'global'; this._buildDOM(); })
        ));

        const autoBtn = document.createElement('button');
        autoBtn.type = 'button';
        autoBtn.className = 'auto-btn';
        autoBtn.title = 'Befuellt leere Felder automatisch aus der Harmony-Conf';
        const autoIc = document.createElement('ha-icon');
        autoIc.setAttribute('icon', 'mdi:lightning-bolt');
        autoBtn.appendChild(autoIc);
        autoBtn.appendChild(document.createTextNode(' Auto-befuellen'));
        autoBtn.onclick = () => this._applyAutoMapping(this._currentContext);
        ctxRow.appendChild(autoBtn);

        body.appendChild(ctxRow);

        // Media-Entity + Camera-Entity fuer diese Aktivitaet (nur bei nicht-globalem Kontext)
        if (this._currentContext !== 'global') {
            const mediaEntityId  = (this._config.activity_media  && this._config.activity_media[this._currentContext])  || '';
            body.appendChild(this._labeled(
                'Media-Entity fuer diese Aktivitaet (optional)',
                this._haSelector(
                    { entity: { domain: 'media_player' } },
                    mediaEntityId,
                    (v) => this._patchActivityMedia(this._currentContext, v || '')
                )
            ));
        }

        // Hinweis
        const hint = document.createElement('div');
        hint.style.cssText = 'font-size:12px;color:var(--secondary-text-color);padding:4px 0 4px;';
        hint.textContent = 'Auto-befuellen: befuellt leere Felder mit dem ersten passenden Befehl aus der Conf. Bereits belegte Felder werden nicht ueberschrieben.';
        body.appendChild(hint);

        const ctxButtons = (this._config.buttons && this._config.buttons[this._currentContext]) || {};
        this._buttonIds.forEach((btnId) => {
            const r = document.createElement('div');
            r.className = 'btn-row';
            const lbl = document.createElement('div');
            lbl.className = 'btn-label';
            lbl.textContent = this._btnLabel(btnId);
            r.appendChild(lbl);
            r.appendChild(this._searchSelect(
                this._cmdOptions, ctxButtons[btnId] || '', '-- Befehl --',
                (v) => this._patchButton(this._currentContext, btnId, v || '')
            ));
            body.appendChild(r);
        });
        return det;
    }

    // Auto-Befuellen: schreibt fuer den angegebenen Kontext alle leeren Button-Slots
    // mit dem ersten passenden Befehl aus der Harmony-Conf (via HARMONY_FALLBACKS).
    _applyAutoMapping(ctx) {
        if (!this._confData) {
            console.warn('Harmony Auto-Mapping: keine Conf-Daten vorhanden.');
            return;
        }
        const devices = this._confData.Devices || {};
        const next = JSON.parse(JSON.stringify(this._config));
        if (!next.buttons) next.buttons = {};
        if (!next.buttons[ctx]) next.buttons[ctx] = {};

        let filled = 0;
        for (const btnId of this._buttonIds) {
            if (next.buttons[ctx][btnId]) continue;          // nicht ueberschreiben
            const fallbacks = HARMONY_FALLBACKS[btnId];
            if (!fallbacks) continue;

            let found = false;
            for (let fi = 0; fi < fallbacks.length && !found; fi++) {
                const candidate = fallbacks[fi];
                for (const devName in devices) {
                    const dev = devices[devName];
                    if (!dev || !Array.isArray(dev.commands)) continue;
                    if (dev.commands.indexOf(candidate) !== -1) {
                        next.buttons[ctx][btnId] = 'command:::' + dev.id + ':::' + candidate;
                        filled++;
                        found = true;
                        break;
                    }
                }
            }
        }

        this._config = next;
        this._dispatch();
        this._initialized = false;
        this._buildDOM();
        this._initialized = true;
        console.info('Harmony Auto-Mapping: ' + filled + ' Felder befuellt fuer Kontext "' + ctx + '"');
    }

    // -------- BAUSTEINE --------

    // Such-Dropdown: Textfilter + Geraetename in Label und nach Auswahl.
    // Ersetzt _nativeSelect fuer alle Befehls-Auswahlen.
    _searchSelect(options, currentValue, placeholder, onChange) {
        // Label aus Value erzeugen: "CommandName  (DeviceName)" oder Aktivitaetsname
        const makeLabel = (opt) => {
            const v = opt.value || '';
            if (v.startsWith('activity:::')) return opt.label.replace(' (Aktivitaet)', '');
            if (v.startsWith('command:::')) {
                const parts = v.split(':::');
                const cmdName = parts[2] || v;
                const m = opt.label.match(/\(([^)]+)\)\s*$/);
                const devName = m ? m[1].trim() : '';
                return devName ? cmdName + '  (' + devName + ')' : cmdName;
            }
            return opt.label || v;
        };

        const currentOpt = (options || []).find((o) => o.value === currentValue);
        const currentLabel = currentOpt ? makeLabel(currentOpt) : (currentValue ? currentValue : '');
        let selectedValue = currentValue || '';

        const wrap = document.createElement('div');
        wrap.className = 'hc-sel-wrap';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'hc-sel-input';
        input.value = currentLabel;
        input.placeholder = placeholder || '-- Suchen...';
        input.autocomplete = 'off';
        input.spellcheck = false;

        const drop = document.createElement('div');
        drop.className = 'hc-sel-drop';

        const renderDrop = (filter) => {
            drop.innerHTML = '';
            const f = (filter || '').trim().toLowerCase();

            // Gruppen aufbauen
            const actItems = [];
            const devMap   = {};

            (options || []).forEach((opt) => {
                const v   = opt.value || '';
                const lbl = makeLabel(opt);
                // Filtern: Label oder Geraetename oder Aktivitaet muss treffer enthalten
                if (f && !lbl.toLowerCase().includes(f) && !(opt.label || '').toLowerCase().includes(f)) return;

                if (v.startsWith('activity:::')) {
                    actItems.push({ label: lbl, value: v });
                } else if (v.startsWith('command:::')) {
                    const m = opt.label.match(/\(([^)]+)\)\s*$/);
                    const devLabel = m ? m[1].trim() : 'Geraet';
                    if (!devMap[devLabel]) devMap[devLabel] = [];
                    devMap[devLabel].push({ label: lbl, value: v });
                }
            });

            const addGroup = (groupTitle, items) => {
                if (!items || items.length === 0) return;
                const grp = document.createElement('div');
                grp.className = 'hc-sel-grp';
                grp.textContent = groupTitle;
                drop.appendChild(grp);
                items.forEach((item) => {
                    const el = document.createElement('div');
                    el.className = 'hc-sel-item';
                    el.textContent = item.label;
                    if (item.value === selectedValue) el.setAttribute('data-sel', '1');
                    // onmousedown + preventDefault verhindert blur vor dem click
                    el.onmousedown = (e) => {
                        e.preventDefault();
                        selectedValue = item.value;
                        input.value = item.label;
                        drop.style.display = 'none';
                        try { onChange(item.value); }
                        catch (err) { console.error('Harmony search-select error:', err); }
                    };
                    drop.appendChild(el);
                });
            };

            addGroup('Aktivitaeten', actItems);
            Object.keys(devMap).forEach((dev) => addGroup(dev, devMap[dev]));

            if (drop.children.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'hc-sel-empty';
                empty.textContent = f ? 'Keine Ergebnisse fuer "' + f + '"' : 'Keine Optionen';
                drop.appendChild(empty);
            }
        };

        input.onfocus = () => {
            input.select();
            renderDrop('');
            drop.style.display = 'block';
        };
        input.oninput = () => {
            renderDrop(input.value);
            drop.style.display = 'block';
        };
        input.onblur = () => {
            // Verzoegerung: mousedown auf Item laeuft zuerst durch
            setTimeout(() => {
                drop.style.display = 'none';
                // Eingabe-Text auf aktuell gespeichertes Label zuruecksetzen
                const selOpt = (options || []).find((o) => o.value === selectedValue);
                input.value = selOpt ? makeLabel(selOpt) : (selectedValue || '');
            }, 200);
        };

        // Leeren-Button (x) rechts im Feld
        input.onkeydown = (e) => {
            if (e.key === 'Escape') {
                drop.style.display = 'none';
                const selOpt = (options || []).find((o) => o.value === selectedValue);
                input.value = selOpt ? makeLabel(selOpt) : (selectedValue || '');
                input.blur();
            }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (input.value === '' || (input.selectionStart === 0 && input.selectionEnd === input.value.length)) {
                    // Feld leeren → Aktion loeschen
                    selectedValue = '';
                    input.value = '';
                    try { onChange(''); }
                    catch (err) { console.error('Harmony search-select clear error:', err); }
                }
            }
        };

        wrap.appendChild(input);
        wrap.appendChild(drop);
        return wrap;
    }

    // _nativeSelect: bleibt fuer Kontext-Auswahl (wenige Optionen, kein Command-Format)
    _nativeSelect(options, currentValue, placeholder, onChange) {
        const sel = document.createElement('select');
        sel.style.cssText = [
            'width:100%; height:44px; padding:4px 8px;',
            'border:1px solid var(--divider-color,#888); border-radius:4px;',
            'background:var(--input-fill-color, var(--card-background-color,#fff));',
            'color:var(--primary-text-color,#212121);',
            'font-size:14px; font-family:inherit; cursor:pointer; box-sizing:border-box;'
        ].join('');
        const empty = document.createElement('option');
        empty.value = ''; empty.textContent = placeholder || '-- waehlen --';
        if (!currentValue) empty.selected = true;
        sel.appendChild(empty);
        (options || []).forEach((opt) => {
            const o = document.createElement('option');
            o.value = opt.value || '';
            o.textContent = opt.label || opt.value;
            if (opt.value === currentValue) o.selected = true;
            sel.appendChild(o);
        });
        sel.onchange = (e) => {
            try { onChange(e.target.value); }
            catch (err) { console.error('Harmony select error:', err); }
        };
        return sel;
    }

    _haSelector(selector, value, onChange) {
        const el = document.createElement('ha-selector');
        el.hass = this._hass; el.selector = selector; el.value = value;
        el.addEventListener('value-changed', (e) => {
            e.stopPropagation(); e.preventDefault();
            const val = (e.detail !== null && e.detail !== undefined) ? e.detail.value : undefined;
            setTimeout(() => {
                try { onChange(val); }
                catch (err) { console.error('Harmony selector error:', err); }
            }, 0);
        });
        return el;
    }

    _btnLabel(btnId) {
        const map = {
            dvr_1: 'DVR', dvr_2: 'Guide', dvr_3: 'Info',
            red: 'Rot', green: 'Gruen', yellow: 'Gelb', blue: 'Blau',
            exit: 'Exit', menu: 'Menue', back: 'Zurueck', ok: 'OK',
            dir_up: 'Oben', dir_down: 'Unten', dir_left: 'Links', dir_right: 'Rechts',
            vol_up: 'Lautstaerke +', vol_down: 'Lautstaerke -', mute: 'Stumm',
            ch_up: 'Kanal +', ch_down: 'Kanal -',
            skip_back: 'Skip -', rewind: 'Rueckspulen', play: 'Play',
            pause: 'Pause', fast_forward: 'Vorspulen', skip_forward: 'Skip +',
            record: 'Aufnahme', stop: 'Stop',
            num_1: '1', num_2: '2', num_3: '3', num_4: '4', num_5: '5', num_6: '6',
            num_7: '7', num_8: '8', num_9: '9', num_0: '0',
            num_minus: 'Minus (−)', num_enter: 'E (Eingabe)'
        };
        return map[btnId] || btnId.toUpperCase().replace(/_/g, ' ');
    }

    _labeled(text, el) {
        const wrap = document.createElement('div');
        const lbl = document.createElement('div');
        lbl.className = 'lbl'; lbl.textContent = text;
        wrap.appendChild(lbl); wrap.appendChild(el);
        return wrap;
    }

    // -------- PATCH / DISPATCH --------
    _patchActivityMedia(actName, entityId) {
        const next = JSON.parse(JSON.stringify(this._config));
        if (!next.activity_media) next.activity_media = {};
        if (!entityId) delete next.activity_media[actName];
        else next.activity_media[actName] = entityId;
        if (Object.keys(next.activity_media).length === 0) delete next.activity_media;
        this._config = next;
        this._dispatch();
    }

    _patchActivityCamera(actName, entityId) {
        const next = JSON.parse(JSON.stringify(this._config));
        if (!next.activity_camera) next.activity_camera = {};
        if (!entityId) delete next.activity_camera[actName];
        else next.activity_camera[actName] = entityId;
        if (Object.keys(next.activity_camera).length === 0) delete next.activity_camera;
        this._config = next;
        this._dispatch();
    }

    _patchTop(key, value) {
        const next = Object.assign({}, this._config);
        next[key] = value; this._config = next; this._dispatch();
    }

    _patchSlot(slotId, field, value) {
        const next = JSON.parse(JSON.stringify(this._config));
        if (!next.dynamic_slots) next.dynamic_slots = {};
        if (!next.dynamic_slots[slotId]) next.dynamic_slots[slotId] = {};
        const slot = next.dynamic_slots[slotId];
        if (value === '' || value === null || value === undefined) delete slot[field];
        else slot[field] = value;
        if (!slot.text && !slot.icon && !slot.action) delete next.dynamic_slots[slotId];
        this._config = next; this._dispatch();
    }

    _patchButton(ctx, btnId, value) {
        const next = JSON.parse(JSON.stringify(this._config));
        if (!next.buttons) next.buttons = {};
        if (!next.buttons[ctx]) next.buttons[ctx] = {};
        if (!value) delete next.buttons[ctx][btnId];
        else next.buttons[ctx][btnId] = value;
        if (ctx !== 'global' && next.buttons[ctx] && Object.keys(next.buttons[ctx]).length === 0) {
            delete next.buttons[ctx];
        }
        this._config = next; this._dispatch();
    }

    _dispatch() {
        this.dispatchEvent(new CustomEvent('config-changed', {
            detail: { config: this._config }, bubbles: true, composed: true
        }));
    }
}

customElements.define('harmony-companion-editor', HarmonyCompanionEditor);


// ============================================================================
// REGISTRY
// ============================================================================
window.customCards = window.customCards || [];
window.customCards.push({
    type: 'harmony-companion-card',
    name: 'Logitech Harmony Companion',
    preview: false,
    description: 'Digital Twin der Logitech Harmony Companion Fernbedienung.'
});
