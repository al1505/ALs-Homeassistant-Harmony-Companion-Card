// ============================================================================
// ALs HARMONY CARD V2
// Mobile-first HA custom card for Logitech Harmony Hub
// Pixel 8 Pro · Device Quick Sheet · No editor · Same config schema as V1
// Version: 2.8.2
// ============================================================================
// SETUP:
//   1. Copy to /config/www/community/harmony-companion-card/harmony-card-v2.js
//   2. Register resource in HA: /local/community/harmony-companion-card/harmony-card-v2.js
//   3. Use in dashboard:
//      type: custom:harmony-card-v2
//      entity: remote.harmony_hub
//      config_file: /local/harmony_12563120.conf
//      buttons:
//        global:
//          vol_up: "command:::LG Fernseher:::VolumeUp"
//          ...
// ============================================================================

const HCV2_VERSION = '2.8.2';
console.info(
    '%c ALs HARMONY CARD V2 %c v' + HCV2_VERSION + ' ',
    'color:#fff;background:#0d9488;font-weight:bold;',
    'color:#0d9488;background:#f0fdfa;font-weight:bold;'
);

const _e = (s) => {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
};

// MDI SVG paths used in the card
const _P = {
    vol_up:       'M3,9V15H7L12,20V4L7,9H3M19,11H17V9H15V11H13V13H15V15H17V13H19V11Z',
    vol_down:     'M3,9V15H7L12,20V4L7,9H3M13,11H19V13H13Z',
    mute:         'M3,9V15H7L12,20V4L7,9M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.01,19.86 21,16.28 21,12C21,7.72 18.01,4.14 14,3.23Z',
    dir_up:       'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z',
    dir_down:     'M7.41,8.59L12,13.17L16.59,8.59L18,10L12,16L6,10L7.41,8.59Z',
    dir_left:     'M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z',
    dir_right:    'M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z',
    back:         'M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z',
    info:         'M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
    exit:         'M13,3H11V13H13V3M17.83,5.17L16.41,6.59C18.05,7.91 19,9.9 19,12C19,15.87 15.87,19 12,19C8.13,19 5,15.87 5,12C5,9.9 5.95,7.91 7.58,6.58L6.17,5.17C4.23,6.82 3,9.26 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12C21,9.26 19.77,6.82 17.83,5.17Z',
    menu:         'M3,18H21V16H3V18M3,13H21V11H3V13M3,6V8H21V6H3Z',
    play:         'M8,5.14V19.14L19,12.14L8,5.14Z',
    pause:        'M14,19H18V5H14M6,19H10V5H6V19Z',
    stop:         'M18,18H6V6H18V18Z',
    skip_back:    'M20,5V19L13,12M6,5V19H4V5M13,5V19L6,12',
    skip_fwd:     'M4,5V19L11,12M18,5V19H20V5M11,5V19L18,12',
    rewind:       'M11.5,12L20,18V6M11,18V6L2.5,12L11,18Z',
    fwd:          'M13,6V18L21.5,12M4,18L12.5,12L4,6V18Z',
    power:        'M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.82 4,9.26 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.26 18.64,6.82 16.56,5.44M13,3H11V13H13',
    devices:      'M4,6H2V20A2,2 0 0,0 4,22H18V20H4M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H8V4H20',
    close:        'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z',
    chev_left:    'M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z',
    chev_down:    'M7.41,8.59L12,13.17L16.59,8.59L18,10L12,16L6,10L7.41,8.59Z',
    numpad:       'M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4A2,2 0 0,1 4,2M6,7V9H8V7H6M10,7V9H12V7H10M14,7V9H16V7H14M6,11V13H8V11H6M10,11V13H12V11H10M14,11V13H16V11H14Z',
    source:       'M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M19,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.9 20.1,3 19,3M17,15L15.65,13.65C15.88,13.15 16,12.59 16,12C16,11.41 15.88,10.85 15.65,10.35L17,9A7,7 0 0,1 7,9L8.35,10.35C8.12,10.85 8,11.41 8,12C8,12.59 8.12,13.15 8.35,13.65L7,15A5,5 0 0,1 17,15Z',
};

// Icon keys mapped to known btnId names
const _ICON_FOR_BTN = {
    vol_up:'vol_up', vol_down:'vol_down', mute:'mute',
    dir_up:'dir_up', dir_down:'dir_down', dir_left:'dir_left', dir_right:'dir_right',
    back:'back', info:'info', exit:'exit', menu:'menu',
    ch_up:'dir_up', ch_down:'dir_down',
    play:'play', pause:'pause', stop:'stop',
    skip_back:'skip_back', skip_forward:'skip_fwd',
    rewind:'rewind', fast_forward:'fwd',
    power:'power', source:'source',
};

function _svg(key, sz, fill) {
    sz = sz || 22; fill = fill || 'currentColor';
    if (key === 'record') {
        return `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="#ef4444"/></svg>`;
    }
    const d = _P[key];
    if (!d) return '';
    return `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="${fill}"><path d="${d}"/></svg>`;
}

// Auto-fill fallback command names per button (matched against Harmony Conf)
const HCV2_FALLBACKS = {
    vol_up:'VolumeUp', vol_down:'VolumeDown', mute:'Mute',
    ch_up:'ChannelUp', ch_down:'ChannelDown',
    ch_prev:['ChannelPrev','PreviousChannel','Last'],
    dir_up:'DirectionUp', dir_down:'DirectionDown',
    dir_left:'DirectionLeft', dir_right:'DirectionRight',
    ok:['OK','Select','Enter'], back:['Back','Return','Exit'],
    exit:['Exit','Back','Return'], menu:['Menu','ContextMenu'],
    info:['Info','DisplayInfo'], source:['InputToggle','Input','Source'],
    play:'Play', pause:'Pause', stop:'Stop',
    rewind:'Rewind', fast_forward:'FastForward',
    skip_back:['SkipBack','SkipBackward','Previous'],
    skip_forward:['SkipForward','Next'],
    record:'Record', power:'PowerOff',
    red:'Red', green:'Green', yellow:'Yellow', blue:'Blue',
    dvr_1:['DVR','PVR'], dvr_2:['Guide','EPG'], dvr_3:'Info',
    num_0:['Number0','0'], num_1:['Number1','1'], num_2:['Number2','2'],
    num_3:['Number3','3'], num_4:['Number4','4'], num_5:['Number5','5'],
    num_6:['Number6','6'], num_7:['Number7','7'], num_8:['Number8','8'],
    num_9:['Number9','9'], num_minus:['Dash','Minus','-'],
    num_enter:['Enter','Select','OK'],
};

// ── Display engine constants (ported from V1) ───────────────────────────────
// Design canvas 320×126 plus configurable offset → effective 370×147 px default.
const HCV2_BASE_W           = 320;
const HCV2_BASE_H           = 126;
const HCV2_DEFAULT_OFFSET_W = 50;
const HCV2_DEFAULT_OFFSET_H = 21;
// Default smoked-glass background color of the display zone
const HCV2_DEFAULT_DISPLAY_BG = '#2A2A3C';

// Fallback TV icon (SVG data URI) for the logo slot when no picon can be loaded
const HCV2_TV_ICON = 'url("data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
    '<path fill="rgba(255,255,255,0.55)" d="M21,17H3V5H21M21,3H3C1.89,3 1,3.89 1,5V17A2,2 0 0,0 3,19' +
    'H10V21H14V19H21A2,2 0 0,0 23,17V5C23,3.89 22.1,3 21,3Z"/></svg>'
) + '")';

// hex → subtle two-tone glass gradient (lighter top-left, darker bottom-right)
function hcv2DisplayBgGradient(hex) {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || HCV2_DEFAULT_DISPLAY_BG);
    let r = 42, g = 42, b = 60;
    if (m) { r = parseInt(m[1],16); g = parseInt(m[2],16); b = parseInt(m[3],16); }
    const lt = (c) => Math.min(255, Math.round(c + 22));
    const dk = (c) => Math.max(0,   Math.round(c - 18));
    return `linear-gradient(135deg, rgba(${lt(r)},${lt(g)},${lt(b)},0.96) 0%, rgba(${dk(r)},${dk(g)},${dk(b)},0.98) 100%)`;
}

// WCAG relative luminance (sRGB gamma corrected) — used by _extractColors()
const _hcv2RelativeLum = (r, g, b) => {
    const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

// Layout key classification: 'panel'/'panel_N' and 'line'/'line_N'
function hcv2IsPanel(key) { return key === 'panel' || (typeof key === 'string' && key.startsWith('panel_')); }
function hcv2IsLine(key)  { return key === 'line'  || (typeof key === 'string' && key.startsWith('line_')); }
const HCV2_TEXT_ELEM_KEYS = ['activity', 'channel', 'title', 'time', 'timespan', 'menu'];
function hcv2IsTextEl(key) { return HCV2_TEXT_ELEM_KEYS.includes(key); }

// hex + alpha → rgba() string for panel backgrounds
function hcv2PanelBg(def) {
    const hex = (def && def.bgColor) || '#404040';
    const a   = (def && def.bgAlpha != null) ? Math.max(0, Math.min(1, def.bgAlpha)) : 0.5;
    const m   = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    const r = m ? parseInt(m[1],16) : 64;
    const g = m ? parseInt(m[2],16) : 64;
    const b = m ? parseInt(m[3],16) : 64;
    return `rgba(${r},${g},${b},${a})`;
}

// Default layouts — fixed values for the 370×147 px design canvas (offset 50×21).
function hcv2DefaultLayout(mode) {
    if (mode === 'tv') return {
        power:    { left: 0,   top: 0,   w: 25,  h: 24, visible: true },
        menu:     { left: 345, top: 0,   w: 25,  h: 24, visible: true },
        panel:    { left: 0,   top: 102, w: 370, h: 42, bgColor: '#6d7083', radius: 4, bgAlpha: 0.37, visible: true },
        logo:     { left: 0,   top: 105, w: 60,  h: 36, visible: true },
        activity: { left: 30,  top: 12,  w: 65,  h: 12, visible: true, fontSize: 12, fontFamily: 'Roboto, sans-serif' },
        channel:  { left: 65,  top: 108, w: 140, h: 15, visible: true },
        title:    { left: 65,  top: 126, w: 200, h: 15, visible: true },
        time:     { left: 330, top: 117, w: 35,  h: 9,  visible: true },
        timespan: { left: 300, top: 132, w: 65,  h: 9,  visible: true, fontSize: 10 },
    };
    // Kodi / media mode (no logo/channel)
    return {
        power:    { left: 0,   top: 0,   w: 25,  h: 24, visible: true },
        menu:     { left: 345, top: 0,   w: 25,  h: 24, visible: true },
        logo:     { visible: false },
        channel:  { visible: false },
        activity: { left: 30,  top: 15,  w: 80,  h: 9,  visible: true },
        title:    { left: 5,   top: 108, w: 305, h: 15, visible: true },
        time:     { left: 5,   top: 129, w: 35,  h: 9,  visible: true },
        timespan: { left: 45,  top: 129, w: 65,  h: 9,  visible: true },
    };
}

// Buttons that switch channels → trigger a delayed EPG refresh after sending
const HCV2_CHANNEL_BTNS = new Set([
    'ch_up', 'ch_down', 'ch_prev',
    'num_0','num_1','num_2','num_3','num_4',
    'num_5','num_6','num_7','num_8','num_9',
    'num_enter',
]);

// Per-hub config fields: when a hub is active, these override the top-level config.
const HCV2_HUB_FIELDS = [
    'name', 'entity', 'config_file', 'color',
    'activity_media', 'activity_camera',
    'enigma2_url', 'enigma2_entity', 'enigma2_activities',
    'buttons', 'dynamic_slots',
];
const HCV2_MAX_HUBS   = 5;

// Layout-editor grid snap constants (match V1)
const HCV2_COL_W = 5;
const HCV2_ROW_H = 3;
const HCV2_PBAR_H = 4;

// Hub color palette (one color per hub, cycles)
const HCV2_HUB_COLORS = [
    '#03a9f4',  // blue  (hub 1)
    '#27ae60',  // green
    '#e67e22',  // orange
    '#9b59b6',  // purple
    '#e74c3c',  // red
];
function hcv2HubColor(hub, idx) {
    return (hub && hub.color) || HCV2_HUB_COLORS[(idx || 0) % HCV2_HUB_COLORS.length];
}

// Element catalog for the layout editor
const HCV2_ELEM_CATALOG = {
    power:    { label: 'Power',    w: 25,  h: 24, color: '#b52929', fg: '#fff' },
    menu:     { label: 'Menü',     w: 25,  h: 24, color: '#16a085', fg: '#fff' },
    logo_xl:  { label: 'Logo XL',  w: 70,  h: 48, color: '#1a3a99', fg: '#fff' },
    logo_l:   { label: 'Logo L',   w: 60,  h: 36, color: '#2255aa', fg: '#fff' },
    logo_m:   { label: 'Logo M',   w: 50,  h: 33, color: '#3366bb', fg: '#fff' },
    logo_s:   { label: 'Logo S',   w: 35,  h: 27, color: '#4477cc', fg: '#fff' },
    activity: { label: 'Activity', w: 80,  h: 9,  color: '#dd7700', fg: '#fff' },
    channel:  { label: 'Sender',   w: 160, h: 18, color: '#1a6633', fg: '#fff' },
    title:    { label: 'Titel',    w: 200, h: 15, color: '#7a1f5a', fg: '#fff' },
    time:     { label: 'Zeit',     w: 35,  h: 9,  color: '#e8cc00', fg: '#111' },
    timespan: { label: 'Beg-End',  w: 65,  h: 9,  color: '#b8a000', fg: '#fff' },
    panel:    { label: 'Panel',    w: 20,  h: 20, color: '#404040', fg: '#fff' },
    line:     { label: 'Linie',    w: 50,  h: 2,  color: '#888888', fg: '#fff' },
};

// Available elements per display mode (palette order)
const HCV2_MODE_ELEMS = {
    tv:    ['power', 'menu', 'panel', 'line', 'logo_xl', 'logo_l', 'logo_m', 'logo_s', 'activity', 'channel', 'title', 'time', 'timespan'],
    media: ['power', 'menu', 'panel', 'line', 'activity', 'title', 'time', 'timespan'],
};

// Returns catalog entry for a given layout key
function hcv2CatalogFor(layoutKey, def) {
    if (layoutKey === 'logo') {
        const h = (def && def.h) || 0;
        if (h >= 42) return HCV2_ELEM_CATALOG.logo_xl;
        if (h >= 35) return HCV2_ELEM_CATALOG.logo_l;
        if (h >= 30) return HCV2_ELEM_CATALOG.logo_m;
        return HCV2_ELEM_CATALOG.logo_s;
    }
    if (hcv2IsPanel(layoutKey)) return HCV2_ELEM_CATALOG.panel;
    if (hcv2IsLine(layoutKey))  return HCV2_ELEM_CATALOG.line;
    return HCV2_ELEM_CATALOG[layoutKey] || null;
}

// Font families for the layout editor text-element dropdown
const HCV2_FONT_FAMILIES = [
    { value: '',                                  label: 'Standard (vom Theme)' },
    { value: 'Arial, sans-serif',                 label: 'Arial' },
    { value: 'Helvetica, sans-serif',             label: 'Helvetica' },
    { value: 'Roboto, sans-serif',                label: 'Roboto' },
    { value: 'Verdana, sans-serif',               label: 'Verdana' },
    { value: 'Tahoma, sans-serif',                label: 'Tahoma' },
    { value: 'Trebuchet MS, sans-serif',          label: 'Trebuchet MS' },
    { value: '"Times New Roman", serif',          label: 'Times New Roman' },
    { value: 'Georgia, serif',                    label: 'Georgia' },
    { value: '"Courier New", monospace',          label: 'Courier New' },
    { value: 'monospace',                         label: 'Monospace' },
    { value: '"Segoe UI", system-ui, sans-serif', label: 'Segoe UI' },
];

// ============================================================================

class HarmonyCardV2 extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._hass       = null;
        this.config      = null;
        this._origConfig = null;   // master config before active-hub merge
        this._activeHubIndex = 0;  // which hub is currently shown
        this._conf       = { Devices: {}, Activities: {} };
        this._lastAct    = null;
        this._rendered   = false;
        this._numOpen    = false;
        this._numTimer   = null;   // auto-close timer for the numpad overlay
        this._onResize   = null;   // window resize handler (auto-fit)
        this._playing    = false;  // play/pause toggle state
        this._sheetMode  = null;   // null | 'devices' | 'commands'
        this._sheetDev   = null;
        // Display engine state (ported from V1)
        this._tvData     = null;   // EPG snapshot built from the enigma2 sensor
        this._logoCache  = {};     // picon URL → 'loading' | 'loaded' | 'failed'
        this._colorCache = {};     // thumb URL → extracted color set
        this._lastDispFp = '';     // display data fingerprint (set hass fast path)
        this._lastEpgAct = null;   // last activity an EPG sensor refresh was fired for
        this._appliedLayoutMode = null;  // 'tv' | 'media' currently applied to the DOM
        this._curLayout  = null;   // merged layout of the applied mode
        this._curThumb   = null;   // current background thumb URL (color-extract guard)
        this._dispBgConf = null;   // last applied display_bg_color
        this._tvLastTitle = '';    // mode C: grab cache-bust only on title change
        this._tvGrabUrl   = null;
        this._progressTimer    = null;  // 1s ticker for progress fill + remaining time
        this._grabRefreshTimer = null;  // periodic /grab background reload
        this._grabRefreshBase  = null;
        this._grabRefreshInterval = 0;
        this._epgRefreshTimer  = null;  // delayed EPG refresh after channel switch
        this._epgRefreshTimer2 = null;
    }

    connectedCallback() {
        if (!this._onResize) {
            this._onResize = () => this._fitRemote();
            window.addEventListener('resize', this._onResize, { passive: true });
        }
        if (this._rendered) {
            this._fitRemote();
            this._updateDisplay();   // restart display timers after re-attach
        }
    }

    disconnectedCallback() {
        if (this._onResize) {
            window.removeEventListener('resize', this._onResize);
            this._onResize = null;
        }
        if (this._numTimer) { clearTimeout(this._numTimer); this._numTimer = null; }
        // Display engine timers
        this._stopProgressTimer();
        this._stopGrabRefresh();
        if (this._epgRefreshTimer)  { clearTimeout(this._epgRefreshTimer);  this._epgRefreshTimer  = null; }
        if (this._epgRefreshTimer2) { clearTimeout(this._epgRefreshTimer2); this._epgRefreshTimer2 = null; }
    }

    // Auto-fit the flat remote into the visible area (Pixel 8 Pro etc.):
    // scale = min(availWidth / naturalWidth, availHeight / naturalHeight).
    // Guarantees the whole remote is visible regardless of which zones are active.
    _fitRemote() {
        const root = this.shadowRoot;
        if (!root) return;
        const el = root.querySelector('.flt-remote');
        if (!el) return;                 // auto-fit applies to the flat skin only
        el.style.zoom = '1';             // measure unscaled
        const nW = el.offsetWidth, nH = el.offsetHeight;
        if (!nW || !nH) return;
        const rect   = this.getBoundingClientRect();
        const availW = this.clientWidth || rect.width || window.innerWidth || 448;
        const vh     = window.innerHeight || document.documentElement.clientHeight || 900;
        const availH = Math.max(140, vh - rect.top - 8);
        const scale  = Math.min(availW / nW, availH / nH);
        el.style.zoom = String(Math.max(0.5, Math.min(scale, 2.4)));
    }

    static getStubConfig() {
        return {
            type: 'custom:harmony-card-v2',
            entity: 'remote.harmony_hub',
            config_file: '/local/harmony_12563120.conf',
            buttons: { global: {} },
            dynamic_slots: {}
        };
    }

    static getConfigElement() {
        return document.createElement('harmony-card-v2-editor');
    }

    setConfig(cfg) {
        if (!cfg) throw new Error('harmony-card-v2: config required');
        const hasEntity = !!cfg.entity;
        const hasHubs   = Array.isArray(cfg.hubs) && cfg.hubs.length && cfg.hubs[0] && cfg.hubs[0].entity;
        if (!hasEntity && !hasHubs) throw new Error('harmony-card-v2: entity (or hubs[].entity) required');
        this._origConfig = JSON.parse(JSON.stringify(cfg));
        // Restore last-used hub: localStorage > config.active_hub > 0
        try {
            const stored = localStorage.getItem('hcv2_active_hub');
            this._activeHubIndex = (stored !== null) ? (parseInt(stored, 10) || 0) : (Number(cfg.active_hub) || 0);
        } catch (e) { this._activeHubIndex = Number(cfg.active_hub) || 0; }
        this._applyActiveHub();
        this._loadConf();
    }

    // ── Multi-hub ──────────────────────────────────────────────────────────────

    _getHubs() {
        const c = this._origConfig || this.config || {};
        if (Array.isArray(c.hubs) && c.hubs.length) return c.hubs.slice(0, HCV2_MAX_HUBS);
        return [this._buildLegacyHub(c)];   // single-hub (legacy) config
    }

    _buildLegacyHub(c) {
        const hub = { name: c.name || 'Hub' };
        HCV2_HUB_FIELDS.forEach(f => { if (c[f] !== undefined) hub[f] = c[f]; });
        return hub;
    }

    _currentHub() {
        const hubs = this._getHubs();
        const idx  = Math.max(0, Math.min(hubs.length - 1, this._activeHubIndex || 0));
        return hubs[idx] || {};
    }

    // Merge the active hub's fields onto a fresh clone of the master config.
    _applyActiveHub() {
        const cfg  = JSON.parse(JSON.stringify(this._origConfig || {}));
        const hubs = this._getHubs();
        const idx  = Math.max(0, Math.min(hubs.length - 1, this._activeHubIndex || 0));
        const hub  = hubs[idx] || {};
        HCV2_HUB_FIELDS.forEach(f => { if (hub[f] !== undefined) cfg[f] = hub[f]; });
        this.config = cfg;
    }

    _isHubOnline(hub) {
        if (!this._hass || !hub || !hub.entity) return false;
        const st = this._hass.states[hub.entity];
        return !!st && st.state !== 'unavailable' && st.state !== 'unknown';
    }

    _switchToHub(idx) {
        const hubs = this._getHubs();
        if (!hubs.length) return;
        const n = Math.max(0, Math.min(hubs.length - 1, idx));
        this._closeHubDd();
        if (n === this._activeHubIndex) return;
        this._activeHubIndex = n;
        try { localStorage.setItem('hcv2_active_hub', String(n)); } catch (e) {}
        this._applyActiveHub();
        // Reset per-hub state, then reload the new hub's conf (re-renders)
        this._conf    = { Devices: {}, Activities: {} };
        this._lastAct = null;
        this._playing = false;
        this._tvData      = null;   // display engine: per-hub EPG state
        this._lastEpgAct  = null;
        this._lastDispFp  = '';
        this._tvLastTitle = '';
        this._tvGrabUrl   = null;
        this._stopGrabRefresh();
        this._stopProgressTimer();
        this._rendered = false;   // force full rebuild — pills/slots/accent are per-hub
        this._loadConf();
    }

    _cycleHub(dir) {
        const hubs = this._getHubs();
        if (hubs.length < 2) return;
        let n = (this._activeHubIndex || 0) + dir;
        if (n < 0) n = hubs.length - 1;
        if (n >= hubs.length) n = 0;
        this._switchToHub(n);
    }

    _closeHubDd() {
        const cur = this.shadowRoot && this.shadowRoot.getElementById('hcv2-hub-current');
        if (cur) cur.classList.remove('open');
    }

    _renderHubBar() {
        const root = this.shadowRoot;
        const chip = root && root.getElementById('hcv2-hub-current');
        if (!chip) return;                      // flat skin only
        const hubs = this._getHubs();
        if (hubs.length < 2) { chip.style.display = 'none'; return; }
        chip.style.display = 'flex';
        const idx = Math.max(0, Math.min(hubs.length - 1, this._activeHubIndex || 0));
        const hub = hubs[idx] || {};
        const nameEl = root.getElementById('hcv2-hub-name');
        if (nameEl) nameEl.textContent = hub.name || ('Hub ' + (idx + 1));
        // Dot color: online → hub color (fallback green), offline → red
        const dotColor = (h, on) => on ? ((h && h.color) || '#22c55e') : '#ef4444';
        const dot = root.getElementById('hcv2-hub-dot');
        if (dot) dot.style.background = dotColor(hub, this._isHubOnline(hub));
        // Rebuild dropdown only while closed (avoids click races)
        const dd = root.getElementById('hcv2-hub-dd');
        if (dd && !chip.classList.contains('open')) {
            dd.innerHTML = hubs.map((h, i) => {
                const on = this._isHubOnline(h);
                return `<div class="hub-dd-item${i === idx ? ' active' : ''}" data-hub="${i}">
                    <span class="hub-dot" style="background:${_e(dotColor(h, on))}"></span>
                    <span>${_e(h.name || ('Hub ' + (i + 1)))}</span>
                </div>`;
            }).join('');
        }
    }

    set hass(hass) {
        if (!hass) return;
        this._hass = hass;
        const st  = hass.states[this.config && this.config.entity];
        const act = (st && st.attributes && st.attributes.current_activity) || null;
        if (act !== this._lastAct) {
            this._lastAct = act;
            this._playing = false; // reset play/pause on activity change
            if (this._rendered) this._updateLive();
            return;
        }
        // Same activity: refresh only the display when its data fingerprint
        // (EPG sensor, media entity, hub online states) changed. No full re-render —
        // _updateDisplay() is idempotent and only patches text/style.
        if (!this._rendered) return;
        const fp = this._displayFingerprint();
        if (fp !== this._lastDispFp) {
            this._lastDispFp = fp;
            this._renderHubBar();
            this._updateDisplay();
        }
    }

    // Cheap change detector for the display zone: EPG sensor, media entity
    // and hub online states. Compared on every hass update.
    _displayFingerprint() {
        if (!this._hass || !this.config) return '';
        const parts = [];
        const eid = this.config.enigma2_entity;
        if (eid) {
            const ss = this._hass.states[eid];
            const sa = ss ? (ss.attributes || {}) : {};
            parts.push(ss ? ss.state : '',
                sa.currservice_name || '', sa.currservice_begin || '',
                sa.currservice_station || '');
        }
        const act  = this._lastAct;
        const mEid = (act && this.config.activity_media && this.config.activity_media[act]) || null;
        if (mEid) {
            const ms = this._hass.states[mEid];
            const ma = ms ? (ms.attributes || {}) : {};
            parts.push(ms ? ms.state : '',
                ma.media_title || '', String(ma.media_position || ''),
                ma.entity_picture_local || ma.entity_picture || '');
        }
        this._getHubs().forEach(h => parts.push(this._isHubOnline(h) ? '1' : '0'));
        return parts.join('|');
    }

    getCardSize() { return 8; }

    // ── Config file loading ──────────────────────────────────────────────────

    async _loadConf() {
        const url = (this.config && this.config.config_file) || '/local/harmony_12563120.conf';
        try {
            const r = await fetch(url, { cache: 'no-store' });
            if (!r.ok) throw new Error('HTTP ' + r.status);
            this._conf = (await r.json()) || { Devices: {}, Activities: {} };
        } catch (e) {
            this._conf = { Devices: {}, Activities: {}, _err: String(e) };
        }
        // Sync current activity from the (possibly just-switched) hub entity
        const st = this._hass && this._hass.states[this.config && this.config.entity];
        this._lastAct = (st && st.attributes && st.attributes.current_activity) || null;
        this._render();
        this._rendered = true;
    }

    // ── Data helpers ─────────────────────────────────────────────────────────

    _activities() {
        const raw = this._conf.Activities || {};
        return Object.entries(raw)
            .filter(([id]) => id !== '-1')
            .map(([id, name]) => {
                const slot = this._actSlotForName(name);
                return {
                    id,
                    name,
                    label: (slot && slot.text) || name,
                    icon:  (slot && slot.icon) || null,
                };
            })
            .sort((a, b) => {
                const ai = parseInt(a.id, 10), bi = parseInt(b.id, 10);
                return (isNaN(ai) || isNaN(bi)) ? String(a.id).localeCompare(String(b.id)) : ai - bi;
            });
    }

    // Resolve the dynamic_slot (label/icon) that belongs to an activity.
    // Primary match is by the slot's own action ("activity:::<name>"), so slot
    // numbering need not follow the conf-sorted order. Falls back to the legacy
    // index-by-conf-order only for slots that carry no activity action, so a
    // slot explicitly bound to a different activity is never mis-borrowed
    // (previously act_N was matched purely by position → swapped labels).
    _actSlotForName(name) {
        const ds = (this.config && this.config.dynamic_slots) || {};
        for (let i = 1; i <= 9; i++) {
            const s = ds['act_' + i];
            if (s && s.action === 'activity:::' + name) return s;
        }
        const idx = this._actSlotIndex(name);
        if (idx >= 0) {
            const s = ds['act_' + (idx + 1)];
            if (s && !(typeof s.action === 'string' && s.action.indexOf('activity:::') === 0)) return s;
        }
        return null;
    }

    // Returns 0-based index of activity in sorted order, -1 if not found
    _actSlotIndex(actName) {
        const raw = this._conf.Activities || {};
        const sorted = Object.entries(raw)
            .filter(([id]) => id !== '-1')
            .sort((a, b) => { const ai=parseInt(a[0],10),bi=parseInt(b[0],10); return(isNaN(ai)||isNaN(bi))?String(a[0]).localeCompare(String(b[0])):ai-bi; });
        return sorted.findIndex(([, n]) => n === actName);
    }

    _devices() {
        return Object.keys(this._conf.Devices || {});
    }

    // All configured buttons across all activities targeting a specific device
    _btnsForDevice(devName) {
        if (!this.config || !this.config.buttons) return [];
        const devObj = (this._conf.Devices || {})[devName];
        const devId  = devObj ? String(devObj.id) : null;
        const seen = new Set();
        const out  = [];
        const scan = (map) => {
            for (const [btnId, val] of Object.entries(map || {})) {
                if (seen.has(btnId) || typeof val !== 'string') continue;
                if (val.startsWith('command:::')) {
                    const p = val.split(':::');
                    if (devId && p[1] === devId) {
                        seen.add(btnId);
                        out.push({ btnId, cmd: p[2], val });
                    }
                }
            }
        };
        scan(this.config.buttons.global);
        for (const [k, m] of Object.entries(this.config.buttons)) {
            if (k !== 'global') scan(m);
        }
        return out;
    }

    // Whether at least one button from the list is configured for current or global context
    _zoneOn(btnIds) {
        if (!this.config || !this.config.buttons) return false;
        const act     = this._lastAct;
        const actBtns = act && act !== 'PowerOff' && this.config.buttons[act]
            ? this.config.buttons[act] : {};
        const gb = this.config.buttons.global || {};
        return btnIds.some(id => actBtns[id] || gb[id]);
    }

    // True when btnId is mapped for the current activity or globally.
    // Special case: 'info' also counts as mapped when 'dvr_3' is mapped
    // (legacy DVR info slot — _doCmd falls back to it accordingly).
    _btnMapped(btnId) {
        if (!this.config || !this.config.buttons) return false;
        const act     = this._lastAct;
        const actBtns = act && act !== 'PowerOff' && this.config.buttons[act]
            ? this.config.buttons[act] : {};
        const gb = this.config.buttons.global || {};
        if (actBtns[btnId] || gb[btnId]) return true;
        if (btnId === 'info') return !!(actBtns['dvr_3'] || gb['dvr_3']);
        return false;
    }

    // ── Render ───────────────────────────────────────────────────────────────

    _render() {
        const skin = this.config && this.config.skin;
        if (skin === 'fire-tv')    { this._renderFireTv();    return; }
        if (skin === 'apple-tv')   { this._renderAppleTv();   return; }
        if (skin === 'chromecast') { this._renderChromecast(); return; }
        if (skin === 'roku')       { this._renderRoku();       return; }
        if (skin === 'nvidia')     { this._renderNvidia();     return; }
        if (skin === 'jvc')        { this._renderJvc();        return; }
        if (skin === 'onn')        { this._renderOnn();        return; }
        const acts    = this._activities();
        const current = this._lastAct || 'PowerOff';
        const hub     = this._currentHub();
        // Accent color: active hub color, falling back to the HA primary color
        const accent  = (hub && hub.color) || 'var(--primary-color,#03a9f4)';

        const pillsHtml = acts.map(a => {
            const active = a.name === current;
            const iconHtml = a.icon
                ? `<ha-icon icon="${_e(a.icon)}" style="--mdc-icon-size:18px;margin-right:4px;"></ha-icon>`
                : '';
            return `<div class="pill${active ? ' pill--on' : ''}" data-act="${_e(a.name)}">${iconHtml}${_e(a.label)}</div>`;
        }).join('');

        // Extra slots (bot_1..bot_9): one tile per configured slot, zone omitted when empty
        const ds = this.config.dynamic_slots || {};
        const slotBtns = [];
        for (let i = 1; i <= 9; i++) {
            const s = ds['bot_' + i];
            if (!s || !s.action) continue;
            slotBtns.push(`<button class="slot-btn" data-slot="bot_${i}">`
                + (s.icon ? `<ha-icon icon="${_e(s.icon)}" style="--mdc-icon-size:20px;"></ha-icon>` : '')
                + `<span>${_e(s.text || '')}</span></button>`);
        }
        const slotsHtml = slotBtns.length ? `<div id="hcv2-slots">${slotBtns.join('')}</div>` : '';

        this.shadowRoot.innerHTML = this._css() + `
<div class="card">
<div class="flt-remote" id="hcv2-card" style="--hcv2-accent:${_e(accent)}">

  <!-- Zone 1: display (EPG/media data engine, design canvas 370×147 scaled) -->
  <div class="hcv2-disp" id="hcv2-disp"${this.config.show_display === false ? ' style="display:none"' : ''}>
    <div id="hcv2-disp-canvas">
      <div id="hcv2-disp-bg"></div>
      <div id="hcv2-disp-grad"></div>
      <div id="hcv2-disp-power">${_svg('power',18)}</div>
      <div id="hcv2-disp-dots">&#8942;</div>
      <div id="hcv2-disp-activity"></div>
      <div id="hcv2-disp-channel" style="display:none"></div>
      <div id="hcv2-disp-title" style="display:none"></div>
      <div id="hcv2-disp-time"></div>
      <div id="hcv2-disp-timespan"></div>
      <div id="hcv2-disp-logo"></div>
      <div id="hcv2-disp-progress" style="display:none"><div id="hcv2-disp-progress-fill"></div></div>
    </div>
  </div>

  ${this._conf._err ? `<div class="conf-err">Conf-Fehler: ${_e(this._conf._err)}</div>` : ''}

  <!-- Zone 2: hub chip + activity pills -->
  <div class="flt-zone2" id="hcv2-pills">
    <div class="hub-chip" id="hcv2-hub-current" style="display:none">
      <span class="hub-dot" id="hcv2-hub-dot"></span>
      <span class="hub-name" id="hcv2-hub-name">&mdash;</span>
      <span class="hub-caret">${_svg('chev_down',16)}</span>
      <div class="hub-dropdown" id="hcv2-hub-dd" role="menu"></div>
    </div>
    ${pillsHtml || '<span class="pill-empty">Config laden…</span>'}
  </div>

  <!-- Zone 3: nav cluster (VOL rocker · D-pad · CH rocker) -->
  <div class="flt-nav">
    <div class="flt-rk">
      <button class="rk-b rk-sign" data-btn="vol_up">+</button>
      <span class="rk-lbl">VOL</span>
      <button class="rk-b rk-sign" data-btn="vol_down">&minus;</button>
      <div class="rk-sep"></div>
      <button class="rk-b" data-btn="mute">${_svg('mute',18)}</button>
    </div>
    <div class="flt-dpad">
      <button class="dp-c dp-tl" data-btn="menu">${_svg('menu',16)}</button>
      <button class="dp-c dp-tr" data-btn="exit">${_svg('exit',16)}</button>
      <button class="dp-c dp-bl" data-btn="back">${_svg('back',16)}</button>
      <button class="dp-c dp-br" data-btn="info">${_svg('info',16)}</button>
      <button class="dp-a dp-up"    data-btn="dir_up">${_svg('dir_up',30)}</button>
      <button class="dp-a dp-down"  data-btn="dir_down">${_svg('dir_down',30)}</button>
      <button class="dp-a dp-left"  data-btn="dir_left">${_svg('dir_left',30)}</button>
      <button class="dp-a dp-right" data-btn="dir_right">${_svg('dir_right',30)}</button>
      <button class="dp-ok" data-btn="ok">OK</button>
    </div>
    <div class="flt-rk">
      <button class="rk-b" data-btn="ch_up">${_svg('dir_up',20)}</button>
      <span class="rk-lbl">CH</span>
      <button class="rk-b" data-btn="ch_down">${_svg('dir_down',20)}</button>
      <div class="rk-sep"></div>
      <button class="rk-b" data-btn="ch_prev">${_svg('back',16)}</button>
    </div>
  </div>

  <!-- Zone 4: color buttons (contextual) -->
  <div class="color-row" id="hcv2-color">
    <button class="color-btn c-red"    data-btn="red"></button>
    <button class="color-btn c-green"  data-btn="green"></button>
    <button class="color-btn c-yellow" data-btn="yellow"></button>
    <button class="color-btn c-blue"   data-btn="blue"></button>
  </div>

  <!-- Zone 5: transport, single row, play/pause toggle (contextual) -->
  <div class="tp-row" id="hcv2-t1">
    <button class="tp-btn" data-btn="skip_back">${_svg('skip_back',20)}</button>
    <button class="tp-btn" data-btn="rewind">${_svg('rewind',20)}</button>
    <button class="tp-btn tp-play" id="hcv2-pp" data-btn="play">${_svg('play',24)}</button>
    <button class="tp-btn" data-btn="fast_forward">${_svg('fwd',20)}</button>
    <button class="tp-btn" data-btn="skip_forward">${_svg('skip_fwd',20)}</button>
    <button class="tp-btn" data-btn="stop">${_svg('stop',20)}</button>
  </div>

  <!-- Zone 6: extra slots (bot_N, omitted when none configured) -->
  ${slotsHtml}

  <!-- Zone 7: footer — numpad toggle (overlay opens UPWARD) + device sheet -->
  <div class="flt-foot">
    <div class="num-section" id="hcv2-num">
      <button class="num-toggle" id="hcv2-numtgl">${_svg('numpad',16)}<span>Ziffern</span></button>
      <div class="num-grid" id="hcv2-numgrid">
        ${[1,2,3,4,5,6,7,8,9].map(n=>`<button class="num-btn" data-btn="num_${n}">${n}</button>`).join('')}
        <button class="num-btn" data-btn="num_minus">&minus;</button>
        <button class="num-btn" data-btn="num_0">0</button>
        <button class="num-btn num-ok" data-btn="num_enter">OK</button>
      </div>
    </div>
    <button class="foot-btn" id="hcv2-devbtn">${_svg('devices',16)}<span>Geräte</span></button>
  </div>

</div><!-- /flt-remote -->
</div><!-- /card -->
${this._sheetHtml()}
`;
        // Display DOM was rebuilt → force a fresh layout apply + background
        this._appliedLayoutMode = null;
        this._curLayout         = null;
        this._dispBgConf        = null;
        this._bindEvents();
        this._updateLive();
    }

    _updateLive() {
        const root       = this.shadowRoot;
        if (!root) return;
        const current    = this._lastAct || 'PowerOff';
        const isOn       = current && current !== 'PowerOff';
        const activeSkin = this.config && this.config.skin;

        // Activity pills (flat: .pill; fire-tv: .ftv-app; all others: .act-pill)
        root.querySelectorAll('[data-act]').forEach(el => {
            const on = el.dataset.act === current;
            el.classList.toggle('pill--on', on);
            el.classList.toggle('ftv-app--on', on);
            el.classList.toggle('act-pill--on', on);
        });

        // Status row (non-flat skins only — flat shows the activity in the display zone)
        const sr = root.getElementById('hcv2-status');
        if (sr && activeSkin && activeSkin !== 'flat') sr.textContent = isOn ? current : '';

        // Hub chip (name + online dot + dropdown items)
        this._renderHubBar();

        // Reset play/pause button icon on activity change
        const pp = root.getElementById('hcv2-pp');
        if (pp) pp.innerHTML = _svg(this._playing ? 'pause' : 'play', 24);

        // Zone visibility — flat skin only (non-flat skins manage their own visibility)
        const flatSkin = !activeSkin || activeSkin === 'flat';
        if (flatSkin) {
            const vis = (id, on) => { const el = root.getElementById(id); if (el) el.style.display = on ? '' : 'none'; };
            vis('hcv2-color', this._zoneOn(['red','green','yellow','blue']));
            vis('hcv2-t1',    this._zoneOn(['skip_back','rewind','play','pause','stop','fast_forward','skip_forward']));
            vis('hcv2-num',   this._zoneOn(['num_1','num_2','num_3','num_4','num_5','num_6','num_7','num_8','num_9','num_0','num_minus','num_enter']));
            // Optional buttons: dim + disable when unmapped in the current context
            ['menu','exit','back','info','mute','ch_prev'].forEach(id => {
                const el = root.querySelector(`[data-btn="${id}"]`);
                if (el) el.classList.toggle('is-off', !this._btnMapped(id));
            });
            this._updateDisplay();
        }
        // Re-fit: active zones (and thus the remote height) just changed
        this._fitRemote();
        if (!this._fitRaf) {
            this._fitRaf = requestAnimationFrame(() => { this._fitRaf = null; this._fitRemote(); });
        }
    }

    // ── Display zone (flat skin) — data engine ported from V1 ────────────────

    // Effective design-canvas size from config offsets (defaults → 370×147)
    get _dispW() {
        const o = this.config && Number(this.config.display_offset_w);
        return HCV2_BASE_W + (Number.isFinite(o) ? o : HCV2_DEFAULT_OFFSET_W);
    }
    get _dispH() {
        const o = this.config && Number(this.config.display_offset_h);
        return HCV2_BASE_H + (Number.isFinite(o) ? o : HCV2_DEFAULT_OFFSET_H);
    }

    // Scale the fixed-size design canvas to the actual container width.
    // Canvas keeps its design dimensions; transform: scale() does the fitting.
    _sizeDisplay() {
        const root = this.shadowRoot;
        if (!root) return;
        const disp   = root.getElementById('hcv2-disp');
        const canvas = root.getElementById('hcv2-disp-canvas');
        if (!disp || !canvas) return;
        const w = disp.offsetWidth;
        if (!w) return;
        const dispW = this._dispW, dispH = this._dispH;
        const scale = w / dispW;
        canvas.style.width           = dispW + 'px';
        canvas.style.height          = dispH + 'px';
        canvas.style.transform       = 'scale(' + scale.toFixed(4) + ')';
        canvas.style.transformOrigin = 'top left';
        disp.style.height            = Math.round(dispH * scale) + 'px';
    }

    // Entity behind the display "more" dots: per-activity camera, else media player
    _dispMoreEntity() {
        const act = this._lastAct;
        if (!act || !this.config) return null;
        const cam = this.config.activity_camera && this.config.activity_camera[act];
        const med = this.config.activity_media  && this.config.activity_media[act];
        return cam || med || null;
    }

    // True when the activity is listed in config.enigma2_activities
    _isTVActivity(act) {
        const acts = this.config && this.config.enigma2_activities;
        return !!(acts && Array.isArray(acts) && acts.includes(act));
    }

    // Parses channel + programme title for TV activities from HA enigma2 attrs.
    // Prefers currservice_station/currservice_name; falls back to media_channel
    // or the "Channel - Programme" split of media_title.
    _parseTVTitle(haAttrs) {
        if (!haAttrs) return { channel: '', title: '' };
        const csStn  = (haAttrs.currservice_station || '').trim();
        const csName = (haAttrs.currservice_name    || '').trim();
        if (csStn && csName) return { channel: csStn, title: csName };
        if (csStn)           return { channel: csStn, title: '' };
        const ch = (haAttrs.media_channel || '').trim();
        const t  = (haAttrs.media_title   || '').trim();
        if (ch) return { channel: ch, title: t };
        const sep = t.indexOf(' - ');
        if (sep > 0) {
            return { channel: t.substring(0, sep).trim(), title: t.substring(sep + 3).trim() };
        }
        return { channel: '', title: t };
    }

    // Composite media title for non-TV players (Kodi/Plex etc.)
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

    // Progress [0..1] from EPG begin/end "HH:MM" strings (midnight-safe)
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
        const begin = parseHHMM(this._tvData.beginStr);
        let   end   = parseHHMM(this._tvData.endStr);
        if (isNaN(begin) || isNaN(end)) return null;
        if (end < begin) end += 86400;                  // programme crosses midnight
        if (nowS < begin && end > 86400) nowS += 86400; // viewer is already past midnight
        const total   = end - begin;
        const elapsed = nowS - begin;
        if (total <= 0 || elapsed < 0) return null;
        return Math.min(1, elapsed / total);
    }

    // Progress [0..1] from entity attributes.
    // Priority: enigma2 unix timestamps, then media_duration/media_position
    // extrapolated from media_position_updated_at. null when no time data.
    _mediaPctFromAttrs(attrs) {
        if (!attrs) return null;
        const bts = attrs.currservice_begin_timestamp;
        const ets = attrs.currservice_end_timestamp;
        if (bts && ets) {
            const total   = (ets - bts) * 1000;
            const elapsed = Date.now() - bts * 1000;
            if (total > 0) return Math.max(0, Math.min(1, elapsed / total));
        }
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

    // Remaining seconds from EPG/entity data, null when unknown
    _computeRemainingSeconds(tvData, haAttrs) {
        // 1) EPG endStr "HH:MM" relative to now
        if (tvData && tvData.endStr) {
            const parts = tvData.endStr.split(':');
            if (parts.length >= 2) {
                const eh = parseInt(parts[0], 10), em = parseInt(parts[1], 10);
                if (!isNaN(eh) && !isNaN(em)) {
                    const now   = new Date();
                    const endDt = new Date(now);
                    endDt.setHours(eh, em, 0, 0);
                    if (endDt.getTime() <= now.getTime() - 60000) endDt.setDate(endDt.getDate() + 1);
                    return Math.max(0, (endDt.getTime() - now.getTime()) / 1000);
                }
            }
        }
        // 2) Enigma2 unix timestamps
        if (haAttrs && haAttrs.currservice_end_timestamp) {
            return Math.max(0, (haAttrs.currservice_end_timestamp * 1000 - Date.now()) / 1000);
        }
        // 3) Enigma2 HH:MM string fallback
        if (haAttrs && haAttrs.currservice_end && !haAttrs.currservice_end_timestamp) {
            const parts = (haAttrs.currservice_end || '').split(':');
            if (parts.length >= 2) {
                const eh = parseInt(parts[0], 10), em = parseInt(parts[1], 10);
                if (!isNaN(eh) && !isNaN(em)) {
                    const now   = new Date();
                    const endDt = new Date(now);
                    endDt.setHours(eh, em, 0, 0);
                    if (endDt.getTime() <= now.getTime() - 60000) endDt.setDate(endDt.getDate() + 1);
                    return Math.max(0, (endDt.getTime() - now.getTime()) / 1000);
                }
            }
        }
        // 4) Standard HA media player
        if (haAttrs && haAttrs.media_duration) {
            const dur     = haAttrs.media_duration;
            const posBase = haAttrs.media_position || 0;
            const updTs   = haAttrs.media_position_updated_at
                ? new Date(haAttrs.media_position_updated_at).getTime()
                : Date.now();
            const elapsed = Math.max(0, (Date.now() - updTs) / 1000);
            const pos     = Math.min(dur, posBase + elapsed);
            return Math.max(0, dur - pos);
        }
        return null;
    }

    // Remaining time as "+Xm" (minutes), '' when unknown
    _computeTimeRemaining(tvData, haAttrs) {
        const remSec = this._computeRemainingSeconds(tvData, haAttrs);
        if (remSec === null || remSec <= 0) return '';
        const m = Math.max(0, Math.floor(remSec / 60));
        return '+' + m + 'm';
    }

    // Programme span as "HH:MM - HH:MM", '' when unknown
    _computeTimeSpan(tvData, haAttrs) {
        const fmtClock = (h, m) =>
            (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
        const fromTs = (ts) => {
            const d = new Date(ts);
            return fmtClock(d.getHours(), d.getMinutes());
        };
        if (tvData && tvData.beginStr && tvData.endStr) {
            return tvData.beginStr + ' - ' + tvData.endStr;
        }
        if (haAttrs && haAttrs.currservice_begin_timestamp && haAttrs.currservice_end_timestamp) {
            return fromTs(haAttrs.currservice_begin_timestamp * 1000) + ' - ' +
                   fromTs(haAttrs.currservice_end_timestamp * 1000);
        }
        if (haAttrs && haAttrs.currservice_begin && haAttrs.currservice_end) {
            return haAttrs.currservice_begin + ' - ' + haAttrs.currservice_end;
        }
        if (haAttrs && haAttrs.media_duration) {
            const dur     = haAttrs.media_duration;
            const posBase = haAttrs.media_position || 0;
            const updTs   = haAttrs.media_position_updated_at
                ? new Date(haAttrs.media_position_updated_at).getTime()
                : Date.now();
            const elapsed = Math.max(0, (Date.now() - updTs) / 1000);
            const pos     = Math.min(dur, posBase + elapsed);
            const beginDt = new Date(Date.now() - pos * 1000);
            const endDt   = new Date(Date.now() + (dur - pos) * 1000);
            return fmtClock(beginDt.getHours(), beginDt.getMinutes()) + ' - ' +
                   fmtClock(endDt.getHours(), endDt.getMinutes());
        }
        return '';
    }

    // Preload a channel logo (picon). Result cached in _logoCache; on settle the
    // display refreshes once so the loaded image (or the TV-icon fallback) shows.
    _preloadLogo(url) {
        if (!url || this._logoCache[url]) return;
        this._logoCache[url] = 'loading';
        const img = new Image();
        img.onload = () => {
            this._logoCache[url] = 'loaded';
            this._lastDispFp = '';
            if (this._rendered) this._updateDisplay();
        };
        img.onerror = () => {
            this._logoCache[url] = 'failed';
            this._lastDispFp = '';
            if (this._rendered) this._updateDisplay();
        };
        img.src = url;
    }

    // Canvas-based color extraction (Vibrant.js style) from a same-origin thumb.
    // Cross-origin images make getImageData() throw → resolves null (neutral colors).
    _extractColors(imageUrl) {
        if (this._colorCache[imageUrl]) return Promise.resolve(this._colorCache[imageUrl]);
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const W = 80, H = 80;
                    const canvas = document.createElement('canvas');
                    canvas.width = W; canvas.height = H;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, W, H);
                    const data = ctx.getImageData(0, 0, W, H).data;
                    // 16x16x16 bucket histogram (quantization step 16)
                    const buckets = {};
                    for (let i = 0; i < data.length; i += 4) {
                        if (data[i + 3] < 128) continue;   // skip transparent pixels
                        const rq = data[i]     >> 4;
                        const gq = data[i + 1] >> 4;
                        const bq = data[i + 2] >> 4;
                        const key = (rq << 8) | (gq << 4) | bq;
                        if (!buckets[key]) buckets[key] = { rs: 0, gs: 0, bs: 0, n: 0 };
                        buckets[key].rs += data[i]; buckets[key].gs += data[i+1];
                        buckets[key].bs += data[i+2]; buckets[key].n++;
                    }
                    // Vibrant-like score: prefer saturated mid-lightness colors
                    const computeScore = (r, g, b, n) => {
                        const max = Math.max(r, g, b), min = Math.min(r, g, b);
                        const l   = (max + min) / 2 / 255;
                        const s   = max === min ? 0 : (max - min) / (max + min < 255 ? (max + min) : (510 - max - min));
                        const lFactor = 1 - Math.min(1, Math.abs(l - 0.5) * 2);
                        const sFactor = Math.min(1, s * 1.4);
                        const vib     = Math.max(0.05, sFactor) * Math.max(0.3, lFactor);
                        return n * (0.4 + 0.6 * vib);
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
                    const bg    = colors[0];
                    const bgLum = _hcv2RelativeLum(bg.r, bg.g, bg.b);
                    const fg = bgLum > 0.45
                        ? { r: 24,  g: 24,  b: 24  }
                        : { r: 245, g: 245, b: 245 };
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

    // Gradient overlay + progress color from extracted thumb colors (or neutral).
    // Neutral fallback = CSS defaults (display stays smoked-glass, fill = accent).
    _applyDispColors(colors) {
        const root = this.shadowRoot;
        if (!root) return;
        const gradEl = root.getElementById('hcv2-disp-grad');
        const fillEl = root.getElementById('hcv2-disp-progress-fill');
        if (colors && colors.bg) {
            const bgTrans = colors.bg.startsWith('rgb(')
                ? colors.bg.replace('rgb(', 'rgba(').replace(')', ',0)')
                : colors.bg + '00';
            if (gradEl) gradEl.style.background =
                'linear-gradient(to right, ' + colors.bg + ' 35%, ' + bgTrans + ' 75%)';
            if (fillEl) fillEl.style.background = colors.text || '';
        } else {
            if (gradEl) gradEl.style.background = '';
            if (fillEl) fillEl.style.background = '';
        }
    }

    // Seek the activity's media player to pct (only when a duration is known)
    _seekMedia(pct) {
        const eid = (this.config && this.config.activity_media &&
                     this.config.activity_media[this._lastAct]) || null;
        const ms  = eid && this._hass ? (this._hass.states[eid] || null) : null;
        if (!ms || !ms.attributes.media_duration) return;
        this._hass.callService('media_player', 'media_seek', {
            entity_id: eid, seek_position: pct * ms.attributes.media_duration
        }).catch(() => {});
    }

    // ── Progress timer (1s tick: fill width + remaining time) ────────────────

    _startProgressTimer() {
        if (this._progressTimer) return;   // already ticking
        this._progressTimer = setInterval(() => this._updateProgressBar(), 1000);
    }

    _stopProgressTimer() {
        if (this._progressTimer) { clearInterval(this._progressTimer); this._progressTimer = null; }
    }

    _updateProgressBar() {
        if (!this.shadowRoot || !this._rendered || !this.config) return;
        const fill = this.shadowRoot.getElementById('hcv2-disp-progress-fill');
        if (!fill) return;
        let pct = null;
        if (this._tvData) pct = this._tvProgress();
        let haAttrs = null;
        const eid = (this.config.activity_media && this.config.activity_media[this._lastAct]) || null;
        const ms  = eid && this._hass ? (this._hass.states[eid] || null) : null;
        if (ms) haAttrs = ms.attributes || {};
        if (pct === null) pct = this._mediaPctFromAttrs(haAttrs);
        if (pct !== null) fill.style.width = (pct * 100).toFixed(2) + '%';
        // Live remaining-time text ("+Xm")
        const timeEl = this.shadowRoot.getElementById('hcv2-disp-time');
        if (timeEl && timeEl.style.display !== 'none') {
            const remStr = this._computeTimeRemaining(this._tvData, haAttrs);
            if (remStr) timeEl.textContent = remStr;
        }
    }

    // ── Grab-image refresh (TV background polling via /grab endpoint) ────────

    _startGrabRefresh(baseUrl) {
        // Interval from config (seconds → ms, default 30s, minimum 5s)
        const intervalMs = Math.max(5, (this.config.epg_grab_interval || 30)) * 1000;
        const cleanUrl   = baseUrl.replace(/([&?])_t=\d+/, '');
        if (this._grabRefreshBase === cleanUrl && this._grabRefreshTimer &&
            this._grabRefreshInterval === intervalMs) return;
        this._stopGrabRefresh();
        this._grabRefreshBase     = cleanUrl;
        this._grabRefreshInterval = intervalMs;
        const sep = cleanUrl.includes('?') ? '&' : '?';
        this._grabRefreshTimer = setInterval(() => {
            const bgEl = this.shadowRoot && this.shadowRoot.getElementById('hcv2-disp-bg');
            if (!bgEl || bgEl.style.display === 'none') return;
            const newUrl = cleanUrl + sep + '_t=' + Date.now();
            // Browser keeps showing the old image until the new one is loaded — no flicker
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

    // Delayed EPG sensor refresh after a channel switch (receiver needs ~1-2s).
    // Rapid key presses (digits) collapse into a single refresh.
    _scheduleEpgRefresh() {
        if (!this._hass || !this.config) return;
        const eid = this.config.enigma2_entity;
        if (!eid) return;
        if (this._epgRefreshTimer) clearTimeout(this._epgRefreshTimer);
        this._epgRefreshTimer = setTimeout(() => {
            this._epgRefreshTimer = null;
            if (this._hass) {
                this._hass.callService('homeassistant', 'update_entity', { entity_id: eid })
                    .catch(() => {});
            }
            // Second refresh 2s later in case the receiver had not switched yet
            this._epgRefreshTimer2 = setTimeout(() => {
                this._epgRefreshTimer2 = null;
                if (this._hass) {
                    this._hass.callService('homeassistant', 'update_entity', { entity_id: eid })
                        .catch(() => {});
                }
            }, 2000);
        }, 1500);
    }

    // ── Layout system (design-canvas absolute positioning) ───────────────────

    // Merged layout for a mode: config (tv_layout/media_layout) wins element-wise
    _effLayout(mode) {
        const cfgKey = mode === 'tv' ? 'tv_layout' : 'media_layout';
        const stored = (this.config && this.config[cfgKey]) || {};
        const defs   = hcv2DefaultLayout(mode);
        const layout = {};
        new Set([...Object.keys(defs), ...Object.keys(stored)])
            .forEach(k => { layout[k] = { ...(defs[k] || {}), ...(stored[k] || {}) }; });
        return layout;
    }

    // Positions all display elements absolutely on the design canvas.
    // Heavy DOM writes — called only on mode change or after a full render.
    _applyDisplayLayout(mode) {
        const root = this.shadowRoot;
        if (!root) return;
        const disp   = root.getElementById('hcv2-disp');
        const canvas = root.getElementById('hcv2-disp-canvas');
        if (!disp || !canvas) return;
        const layout = this._effLayout(mode);
        this._curLayout         = layout;
        this._appliedLayoutMode = mode;
        disp.classList.toggle('hcv2-disp--tv',    mode === 'tv');
        disp.classList.toggle('hcv2-disp--media', mode === 'media');
        const dispW = this._dispW;
        const idMap = {
            power: 'hcv2-disp-power', menu: 'hcv2-disp-dots', logo: 'hcv2-disp-logo',
            activity: 'hcv2-disp-activity', channel: 'hcv2-disp-channel',
            title: 'hcv2-disp-title', time: 'hcv2-disp-time', timespan: 'hcv2-disp-timespan',
        };
        // Drop previously created panels and lines
        canvas.querySelectorAll('.hcv2-panel,.hcv2-line').forEach(el => el.remove());
        Object.entries(layout).forEach(([key, def]) => {
            const isPanel = hcv2IsPanel(key);
            const isLine  = hcv2IsLine(key);
            let el;
            if (isPanel || isLine) {
                if (def.visible === false) return;
                el = document.createElement('div');
                el.className = isPanel ? 'hcv2-panel' : 'hcv2-line';
                el.dataset.elemKey = key;
                canvas.appendChild(el);
            } else {
                el = root.getElementById(idMap[key] || '');
                if (!el) return;
                if (def.visible === false) { el.style.display = 'none'; return; }
                // Clear a stale 'none' from the previous mode — the content pass
                // in _updateDisplay() re-decides visibility right afterwards.
                el.style.display = '';
            }
            const isIcon = (key === 'logo' || key === 'power' || key === 'menu');
            const w = def.w || 30;
            const h = def.h || 14;
            // Element center decides right-aligned text for time/timespan
            const cx = (def.left || 0) + w / 2;
            const inRightArea = cx > dispW * 0.5;
            el.style.position  = 'absolute';
            el.style.left      = (def.left || 0) + 'px';
            el.style.top       = (def.top  || 0) + 'px';
            el.style.right     = 'auto';
            el.style.bottom    = 'auto';
            el.style.transform = isLine ? 'rotate(' + (def.rotation || 0) + 'deg)' : 'none';
            el.style.margin    = '0';
            el.style.zIndex    = (isPanel || isLine) ? '2' : '3';
            el.style.width     = w + 'px';
            el.style.overflow  = 'hidden';
            if (isLine) {
                el.style.height          = h + 'px';
                el.style.background      = def.color || '#888888';
                el.style.borderRadius    = '0';
                el.style.transformOrigin = 'center center';
                el.style.pointerEvents   = 'none';
                return;
            }
            if (isPanel) {
                el.style.height        = h + 'px';
                el.style.background    = hcv2PanelBg(def);
                el.style.borderRadius  = ((def.radius != null) ? def.radius : 8) + 'px';
                el.style.pointerEvents = 'none';
            } else if (isIcon) {
                el.style.height     = h + 'px';
                el.style.lineHeight = '';
            } else {
                el.style.height     = 'auto';
                el.style.lineHeight = '1.2';
            }
            if (key === 'activity') { el.style.display = 'flex'; el.style.alignItems = 'center'; }
            if (key === 'time' || key === 'timespan') {
                el.style.textAlign    = inRightArea ? 'right' : 'left';
                el.style.paddingRight = inRightArea ? '5px'   : '0';
                el.style.paddingLeft  = inRightArea ? '0'     : '5px';
            }
            // Text element overrides: font size, font family, color
            if (hcv2IsTextEl(key)) {
                if (def.fontSize)   el.style.fontSize   = def.fontSize + 'px';
                if (def.fontFamily) el.style.fontFamily = def.fontFamily;
                else                el.style.fontFamily = '';
                if (def.color && def.color !== 'auto') el.style.color = def.color;
                else                                   el.style.color = '';
            }
        });
        this._sizeDisplay();
    }

    // ── Display refresh (idempotent, light: textContent/style patches only) ──

    _updateDisplay() {
        const root = this.shadowRoot;
        if (!root || !this.config) return;
        const disp = root.getElementById('hcv2-disp');
        if (!disp) return;                   // flat skin only
        const act     = this._lastAct || 'PowerOff';
        const isOn    = !!act && act !== 'PowerOff';
        const isTVAct = this._isTVActivity(act);

        // -- EPG data (mode A): enigma2 sensor attributes → this._tvData --
        const enigma2Base = (this.config.enigma2_url || '').replace(/\/+$/, '');
        const enigma2Eid  = this.config.enigma2_entity || null;
        if (isTVAct && enigma2Eid && this._hass) {
            // Activity just switched to TV → request an immediate sensor poll
            if (this._lastEpgAct !== act) {
                this._hass.callService('homeassistant', 'update_entity', { entity_id: enigma2Eid })
                    .catch(() => {});
            }
            const ss = this._hass.states[enigma2Eid];
            if (ss) {
                const sa            = ss.attributes || {};
                const newBegin      = sa.currservice_begin || '';
                const newStation    = sa.currservice_station || '';
                const newServiceref = sa.currservice_serviceref || '';
                const prevBegin     = this._tvData ? this._tvData.beginStr   : null;
                const prevStation   = this._tvData ? this._tvData.station    : null;
                const prevSvcRef    = this._tvData ? this._tvData.serviceref : null;
                // Channel OR programme changed → bust the grab-image cache
                const progChange = (prevBegin !== newBegin)
                    || (prevStation !== null && prevStation !== newStation)
                    || (prevSvcRef  !== null && prevSvcRef  !== newServiceref);
                const oldThumb   = this._tvData ? this._tvData.thumbUrl : null;
                // grab_url from the sensor (full URL incl. host); fallback to
                // enigma2_url (config or sensor attribute) + /grab
                const sensorBase = (sa.enigma2_url || '').replace(/\/+$/, '');
                const effBase    = enigma2Base || sensorBase;
                const grabBase   = sa.grab_url
                    || (effBase ? effBase + '/grab?format=jpg&r=480&mode=video' : null);
                this._tvData = {
                    channel:    newStation || ss.state || '',
                    title:      sa.currservice_name || '',
                    beginStr:   newBegin,
                    endStr:     sa.currservice_end || '',
                    piconUrl:   sa.picon_url || null,
                    station:    newStation,
                    serviceref: newServiceref,
                    thumbUrl:   grabBase
                        ? (progChange ? grabBase + '&_t=' + Date.now() : oldThumb)
                        : null,
                };
            } else { this._tvData = null; }
        } else if (!isTVAct) {
            this._tvData = null;
        }
        this._lastEpgAct = act;

        // -- Media entity (activity_media) --
        const mediaEid = (this.config.activity_media && this.config.activity_media[act]) || null;
        const ms       = mediaEid && this._hass ? (this._hass.states[mediaEid] || null) : null;
        const haAttrs  = ms ? (ms.attributes || {}) : null;
        const tvData   = isTVAct ? this._tvData : null;

        // Playing state: a selected TV activity counts as playing by definition
        const isPlaying = tvData
            ? !!(tvData.channel || tvData.title)
            : isTVAct
                ? true
                : !!(ms && ['playing', 'paused', 'on'].includes(ms.state));

        // Channel + title
        let channel, title, rawTitle;
        if (tvData) {
            channel = tvData.channel; title = tvData.title; rawTitle = title;
        } else if (isTVAct && haAttrs) {
            const parsed = this._parseTVTitle(haAttrs);
            channel  = parsed.channel; title = parsed.title;
            rawTitle = haAttrs.currservice_name || haAttrs.media_title || '';
        } else {
            channel  = '';
            title    = haAttrs ? this._getMediaTitle(haAttrs) : '';
            rawTitle = haAttrs ? (haAttrs.media_title || '') : '';
        }

        // Background thumb: sensor grab URL → direct grab (mode C) → HA proxy picture
        let thumb;
        if (tvData) {
            thumb = tvData.thumbUrl;
        } else if (isTVAct && enigma2Base) {
            // Mode C: no sensor data — use /grab directly, cache-bust on title change
            if (rawTitle !== this._tvLastTitle || !this._tvGrabUrl) {
                this._tvLastTitle = rawTitle;
                this._tvGrabUrl   = enigma2Base + '/grab?format=jpg&r=480&mode=video&_t=' + Date.now();
            }
            thumb = this._tvGrabUrl;
        } else {
            thumb = haAttrs ? (haAttrs.entity_picture_local || haAttrs.entity_picture || null) : null;
        }

        // -- Layout: apply only when the mode changed (fast path stays cheap) --
        const layoutMode = (isTVAct && isOn) ? 'tv'
                         : isOn              ? 'media'
                         : this._appliedLayoutMode || 'media';
        if (layoutMode !== this._appliedLayoutMode) this._applyDisplayLayout(layoutMode);
        const layout = this._curLayout || this._effLayout(layoutMode);
        const vis = k => !layout[k] || layout[k].visible !== false;

        // -- Element refs --
        const actEl   = root.getElementById('hcv2-disp-activity');
        const chanEl  = root.getElementById('hcv2-disp-channel');
        const titleEl = root.getElementById('hcv2-disp-title');
        const timeEl  = root.getElementById('hcv2-disp-time');
        const spanEl  = root.getElementById('hcv2-disp-timespan');
        const logoEl  = root.getElementById('hcv2-disp-logo');
        const bgEl    = root.getElementById('hcv2-disp-bg');
        const dotsEl  = root.getElementById('hcv2-disp-dots');
        const progEl  = root.getElementById('hcv2-disp-progress');
        const fillEl  = root.getElementById('hcv2-disp-progress-fill');

        // Smoked-glass base background (configurable, applied once per value)
        const bgConf = this.config.display_bg_color || HCV2_DEFAULT_DISPLAY_BG;
        if (this._dispBgConf !== bgConf) {
            this._dispBgConf = bgConf;
            disp.style.background = hcv2DisplayBgGradient(bgConf);
        }

        // -- Texts + visibility --
        if (actEl) actEl.textContent = isOn ? act : 'Kein Gerät aktiv';
        const showChannel = isPlaying && !!channel && vis('channel');
        if (chanEl) {
            chanEl.textContent   = showChannel ? channel : '';
            chanEl.style.display = showChannel ? '' : 'none';
        }
        const showTitle = isPlaying && !!title && vis('title');
        if (titleEl) {
            titleEl.textContent   = showTitle ? title : '';
            titleEl.style.display = showTitle ? '' : 'none';
            // Adaptive font size only when the layout does not pin one
            if (showTitle && !(layout.title && layout.title.fontSize)) {
                const tLen = title.length;
                titleEl.style.fontSize = tLen > 45 ? '10px'
                                       : tLen > 35 ? '11px'
                                       : tLen > 25 ? '12px'
                                       : tLen > 15 ? '13px' : '14px';
            }
        }
        const remStr = isPlaying ? this._computeTimeRemaining(tvData, haAttrs) : '';
        if (timeEl) {
            timeEl.textContent   = remStr;
            timeEl.style.display = (remStr && vis('time')) ? '' : 'none';
        }
        const spanStr = isPlaying ? this._computeTimeSpan(tvData, haAttrs) : '';
        if (spanEl) {
            spanEl.textContent   = spanStr;
            spanEl.style.display = (spanStr && vis('timespan')) ? '' : 'none';
        }

        // Dots (more-info) only when a camera/media entity exists and device is on
        if (dotsEl) dotsEl.style.display = (isOn && this._dispMoreEntity() && vis('menu')) ? 'flex' : 'none';

        // -- Picon / logo --
        if (logoEl) {
            if (isTVAct && isPlaying && vis('logo')) {
                const station = tvData ? tvData.station
                    : (haAttrs ? (haAttrs.currservice_station || '') : '');
                const logoUrl = (tvData && tvData.piconUrl)
                    || (enigma2Base && station
                        ? enigma2Base + '/picon/' + encodeURIComponent(station) + '.png'
                        : null);
                let bgImg;
                if (logoUrl) {
                    const status = this._logoCache[logoUrl];
                    if (!status) this._preloadLogo(logoUrl);
                    bgImg = (status === 'loaded') ? 'url(' + logoUrl + ')' : HCV2_TV_ICON;
                } else {
                    bgImg = HCV2_TV_ICON;
                }
                logoEl.style.backgroundImage = bgImg;
                logoEl.style.display = 'block';
            } else {
                logoEl.style.backgroundImage = '';
                logoEl.style.display = 'none';
            }
        }

        // -- Background image, grab polling, gradient colors --
        if (isPlaying && thumb) {
            if (bgEl) {
                const isNewImage = (bgEl.dataset.src !== thumb);
                if (isNewImage) {
                    bgEl.style.backgroundImage = 'url(' + thumb + ')';
                    bgEl.dataset.src = thumb;
                    // Restart fade-zoom (HA media player style)
                    bgEl.classList.remove('animate');
                    void bgEl.offsetWidth;   // force reflow so the animation restarts
                    bgEl.classList.add('animate');
                }
                bgEl.style.display = 'block';
            }
            if (isTVAct && thumb.includes('/grab')) this._startGrabRefresh(thumb);
            else this._stopGrabRefresh();
            this._curThumb = thumb;
            if (!isTVAct) {
                // Kodi thumbs come through the same-origin HA proxy → extraction works.
                // Guard against stale async results via _curThumb.
                this._extractColors(thumb).then(colors => {
                    if (!this.shadowRoot || this._curThumb !== thumb) return;
                    this._applyDispColors(colors);
                }).catch(() => this._applyDispColors(null));
            } else {
                this._applyDispColors(null);   // grab is cross-origin → neutral
            }
        } else {
            if (bgEl) {
                bgEl.style.backgroundImage = '';
                bgEl.style.display = 'none';
                bgEl.classList.remove('animate');
                bgEl.dataset.src = '';
            }
            this._stopGrabRefresh();
            this._curThumb = null;
            this._applyDispColors(null);
        }

        // -- Progress bar (TV EPG progress preferred, else media entity) --
        const tvPct = tvData ? this._tvProgress() : null;
        const haPct = this._mediaPctFromAttrs(haAttrs);
        const showProgress = isPlaying && ((tvPct !== null) || (haPct !== null));
        if (progEl) progEl.style.display = showProgress ? 'block' : 'none';
        if (showProgress) {
            if (fillEl) {
                const pct = (tvPct !== null) ? tvPct : haPct;
                fillEl.style.width = (pct * 100).toFixed(2) + '%';
            }
            this._startProgressTimer();
        } else {
            this._stopProgressTimer();
        }

        this._sizeDisplay();
    }

    // ── Events ───────────────────────────────────────────────────────────────

    _bindEvents() {
        const root = this.shadowRoot;

        // Button delegation (D-Pad, Vol, Color, Transport, Numpad, Power-off)
        root.getElementById('hcv2-card').addEventListener('click', e => {
            const btn = e.target.closest('[data-btn]');
            if (!btn) return;
            e.stopPropagation();
            this._vib();
            const id = btn.dataset.btn;
            this._doCmd(id);
            // Numpad UX: OK closes it immediately, any digit re-arms the 5s auto-close
            if (id === 'num_enter')               this._closeNum();
            else if (id && id.indexOf('num_') === 0) this._armNumTimer();
        });

        // Display: power button + more-info dots (flat skin only)
        root.getElementById('hcv2-disp-power')?.addEventListener('click', e => {
            e.stopPropagation();
            this._vib();
            this._doCmd('off');
        });
        root.getElementById('hcv2-disp-dots')?.addEventListener('click', e => {
            e.stopPropagation();
            const ent = this._dispMoreEntity();
            if (!ent) return;
            this._vib();
            this.dispatchEvent(new CustomEvent('hass-more-info', {
                detail: { entityId: ent }, bubbles: true, composed: true,
            }));
        });

        // Display: progress click = seek (only when the media entity has a duration)
        root.getElementById('hcv2-disp-progress')?.addEventListener('click', e => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            if (!rect.width) return;
            const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            this._seekMedia(pct);
        });

        // Display: horizontal swipe (>50px within 600ms) cycles through hubs
        const dispEl = root.getElementById('hcv2-disp');
        if (dispEl) {
            let sx = null, sy = null, t0 = 0;
            dispEl.addEventListener('pointerdown', e => {
                if (this._getHubs().length < 2) return;
                sx = e.clientX; sy = e.clientY; t0 = Date.now();
            }, { passive: true });
            dispEl.addEventListener('pointerup', e => {
                if (sx === null) return;
                const dx = e.clientX - sx, dy = e.clientY - sy, dt = Date.now() - t0;
                sx = null; sy = null;
                if (dt > 600) return;
                if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
                this._cycleHub(dx > 0 ? -1 : 1);
            }, { passive: true });
            dispEl.addEventListener('pointercancel', () => { sx = null; sy = null; }, { passive: true });
        }

        // Extra slots (bot_N) — fire the configured action directly
        root.getElementById('hcv2-slots')?.addEventListener('click', e => {
            const btn = e.target.closest('[data-slot]');
            if (!btn) return;
            e.stopPropagation();
            const slot = (this.config.dynamic_slots || {})[btn.dataset.slot];
            if (!slot || !slot.action) return;
            this._vib();
            this._fire(slot.action);
        });

        // Activity pills
        root.getElementById('hcv2-pills').addEventListener('click', e => {
            const pill = e.target.closest('[data-act]');
            if (!pill || !this._hass || !this.config) return;
            this._vib();
            this._hass.callService('remote', 'turn_on', {
                entity_id: this.config.entity,
                activity: pill.dataset.act,
            }).catch(() => {});
        });

        // Hub chip: dropdown toggle + dropdown item select
        const hubCur = root.getElementById('hcv2-hub-current');
        if (hubCur) {
            hubCur.addEventListener('click', e => {
                if (e.target.closest('.hub-dd-item')) return;   // item click handled below
                this._vib();
                hubCur.classList.toggle('open');
            });
            root.getElementById('hcv2-hub-dd')?.addEventListener('click', e => {
                const item = e.target.closest('.hub-dd-item');
                if (!item) return;
                e.stopPropagation();
                this._vib();
                this._switchToHub(parseInt(item.dataset.hub, 10));
            });
        }

        // Device Quick Sheet open
        root.getElementById('hcv2-devbtn').addEventListener('click', () => { this._vib(); this._sheetOpen(); });

        // Sheet close / back / backdrop
        root.getElementById('hcv2-sh-close').addEventListener('click', () => this._sheetClose());
        root.getElementById('hcv2-sh-back').addEventListener('click',  () => this._sheetBack());
        root.getElementById('hcv2-bd').addEventListener('click',       () => this._sheetClose());

        // Play/pause toggle (flat skin)
        root.getElementById('hcv2-pp')?.addEventListener('click', e => {
            e.stopPropagation();
            this._vib();
            const cmd = this._playing ? 'pause' : 'play';
            this._doCmd(cmd);
            this._playing = !this._playing;
            e.currentTarget.innerHTML = _svg(this._playing ? 'pause' : 'play', 24);
        });

        // Numpad toggle — opens the upward overlay, OK or 5s inactivity closes it
        root.getElementById('hcv2-numtgl')?.addEventListener('click', () => {
            this._vib();
            if (this._numOpen) this._closeNum(); else this._openNum();
        });
    }

    _openNum() {
        const root = this.shadowRoot;
        this._numOpen = true;
        root.getElementById('hcv2-numgrid')?.classList.add('open');
        root.getElementById('hcv2-numtgl')?.classList.add('open');
        const chev = root.getElementById('hcv2-chev');
        if (chev) chev.style.transform = 'rotate(180deg)';
        this._armNumTimer();
    }

    _closeNum() {
        const root = this.shadowRoot;
        this._numOpen = false;
        root.getElementById('hcv2-numgrid')?.classList.remove('open');
        root.getElementById('hcv2-numtgl')?.classList.remove('open');
        const chev = root.getElementById('hcv2-chev');
        if (chev) chev.style.transform = '';
        if (this._numTimer) { clearTimeout(this._numTimer); this._numTimer = null; }
    }

    _armNumTimer() {
        if (this._numTimer) clearTimeout(this._numTimer);
        this._numTimer = setTimeout(() => this._closeNum(), 5000);
    }

    // ── Sheet ─────────────────────────────────────────────────────────────────

    _sheetOpen() {
        const root = this.shadowRoot;
        this._sheetMode = 'devices';
        this._sheetDev  = null;
        root.getElementById('hcv2-sh-back').style.visibility = 'hidden';
        root.getElementById('hcv2-sh-title').textContent = 'Gerät wählen';
        this._sheetRenderDevices();
        root.getElementById('hcv2-sheet').classList.add('open');
    }

    _sheetClose() {
        this.shadowRoot.getElementById('hcv2-sheet').classList.remove('open');
        this._sheetMode = null;
        this._sheetDev  = null;
    }

    _sheetBack() {
        if (this._sheetMode !== 'commands') return;
        this._sheetMode = 'devices';
        this._sheetDev  = null;
        const root = this.shadowRoot;
        root.getElementById('hcv2-sh-back').style.visibility = 'hidden';
        root.getElementById('hcv2-sh-title').textContent = 'Gerät wählen';
        this._sheetRenderDevices();
    }

    _sheetRenderDevices() {
        const devs = this._devices();
        const body = this.shadowRoot.getElementById('hcv2-sh-body');
        if (!body) return;
        if (!devs.length) {
            body.innerHTML = '<p class="sh-empty">Keine Geräte in der Conf-Datei.</p>';
            return;
        }
        body.innerHTML = devs.map(d => `
          <div class="dev-row" data-dev="${_e(d)}">
            ${_svg('devices',22,'#5a6882')}
            <span class="dev-name">${_e(d)}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#94a3b8"><path d="${_P.dir_right}"/></svg>
          </div>
        `).join('');
        body.querySelectorAll('.dev-row').forEach(el => {
            el.addEventListener('click', () => { this._vib(); this._sheetOpenCmds(el.dataset.dev); });
        });
    }

    _sheetOpenCmds(devName) {
        this._sheetMode = 'commands';
        this._sheetDev  = devName;
        const root = this.shadowRoot;
        root.getElementById('hcv2-sh-back').style.visibility = 'visible';
        root.getElementById('hcv2-sh-title').textContent = devName;
        this._sheetRenderCmds(devName);
    }

    // Map a device's full Harmony command list (from the .conf) to logical
    // remote slots, so the sheet can show a real remote — not just text.
    _deviceRemoteModel(devName) {
        const devObj = (this._conf.Devices || {})[devName];
        if (!devObj) return null;
        const devId = String(devObj.id);
        const all   = Array.isArray(devObj.commands) ? devObj.commands : [];
        const set   = new Set(all);
        const pick  = (...cands) => cands.find(c => set.has(c)) || null;
        return {
            devId, all,
            power:    pick('PowerToggle'),
            powerOn:  pick('PowerOn'),
            powerOff: pick('PowerOff'),
            volUp:    pick('VolumeUp'),
            volDown:  pick('VolumeDown'),
            mute:     pick('Mute'),
            chUp:     pick('ChannelUp'),
            chDown:   pick('ChannelDown', 'ChannelPrev'),
            up:       pick('DirectionUp'),
            down:     pick('DirectionDown'),
            left:     pick('DirectionLeft'),
            right:    pick('DirectionRight'),
            ok:       pick('OK', 'Select', 'Enter'),
            source:   pick('Source', 'InputToggle', 'Input'),
            menu:     pick('Menu'),
            exit:     pick('Exit'),
            back:     pick('Return', 'Back'),
            info:     pick('Info'),
            guide:    pick('Guide', 'EPG'),
            home:     pick('SmartHub', 'Home'),
        };
    }

    _sheetRenderCmds(devName) {
        const body = this.shadowRoot.getElementById('hcv2-sh-body');
        if (!body) return;
        const m = this._deviceRemoteModel(devName);
        if (!m) {
            body.innerHTML = `<p class="sh-empty">Gerät „${_e(devName)}" nicht in der Conf-Datei.</p>`;
            return;
        }
        const cv = (cmd) => _e('command:::' + m.devId + ':::' + cmd);
        // Remote button — disabled (dimmed) when the command is absent on the device
        const rb = (cmd, cls, inner) => cmd
            ? `<button class="${cls}" data-cv="${cv(cmd)}">${inner}</button>`
            : `<button class="${cls} sr-dis">${inner}</button>`;

        // Power: separate Ein/Aus when both exist, else a single toggle button
        let powerHtml;
        if (m.powerOn && m.powerOff) {
            powerHtml = rb(m.powerOn,  'sr-pill sr-on',  _svg('power', 18) + '<span>Ein</span>')
                      + rb(m.powerOff, 'sr-pill sr-off', _svg('power', 18) + '<span>Aus</span>');
        } else {
            powerHtml = rb(m.power || m.powerOff || m.powerOn, 'sr-pill sr-off',
                           _svg('power', 18) + '<span>Power</span>');
        }
        const sourceHtml = rb(m.source, 'sr-pill sr-src', _svg('source', 18) + '<span>Source</span>');

        // Function row — only the buttons the device actually has
        const fnHtml = [
            [m.menu,  'menu',    'Menu'],
            [m.home,  'devices', 'Home'],
            [m.guide, 'info',    'Guide'],
            [m.info,  'info',    'Info'],
            [m.back,  'back',    'Back'],
            [m.exit,  'exit',    'Exit'],
        ].filter(([c]) => c)
         .map(([c, ic, lbl]) => `<button class="sr-fn" data-cv="${cv(c)}">${_svg(ic, 20)}<span>${lbl}</span></button>`)
         .join('');

        // Everything else → collapsible "Alle Befehle" grid (nothing gets lost)
        const used = new Set([
            m.power, m.powerOn, m.powerOff, m.volUp, m.volDown, m.mute,
            m.chUp, m.chDown, m.up, m.down, m.left, m.right, m.ok, m.source,
            m.menu, m.exit, m.back, m.info, m.guide, m.home,
        ].filter(Boolean));
        const rest = (m.all || []).filter(c => !used.has(c));
        const restHtml = rest.map(c => `<button class="sr-gbtn" data-cv="${cv(c)}">${_e(c)}</button>`).join('');

        body.innerHTML = `
<div class="sr-wrap">
  <div class="sr-top">
    <div class="sr-pw-grp">${powerHtml}</div>
    ${sourceHtml}
  </div>

  <div class="sr-volch">
    <div class="sr-rocker">
      ${rb(m.volUp,   'sr-rb sr-rb-top', _svg('vol_up', 20))}
      <span class="sr-rk-lbl">VOL</span>
      ${rb(m.volDown, 'sr-rb sr-rb-bot', _svg('vol_down', 20))}
    </div>
    ${m.mute
        ? `<button class="sr-mute" data-cv="${cv(m.mute)}">${_svg('mute', 22)}<span>Mute</span></button>`
        : `<button class="sr-mute sr-dis">${_svg('mute', 22)}<span>Mute</span></button>`}
    ${(m.chUp || m.chDown) ? `
    <div class="sr-rocker">
      ${rb(m.chUp,   'sr-rb sr-rb-top', _svg('dir_up', 20))}
      <span class="sr-rk-lbl">CH</span>
      ${rb(m.chDown, 'sr-rb sr-rb-bot', _svg('dir_down', 20))}
    </div>` : ''}
  </div>

  <div class="sr-dpad">
    <div class="sr-dp-row">${rb(m.up, 'sr-dp', _svg('dir_up', 28))}</div>
    <div class="sr-dp-row">
      ${rb(m.left, 'sr-dp', _svg('dir_left', 28))}
      ${m.ok ? `<button class="sr-ok" data-cv="${cv(m.ok)}">OK</button>` : `<button class="sr-ok sr-dis">OK</button>`}
      ${rb(m.right, 'sr-dp', _svg('dir_right', 28))}
    </div>
    <div class="sr-dp-row">${rb(m.down, 'sr-dp', _svg('dir_down', 28))}</div>
  </div>

  ${fnHtml ? `<div class="sr-fnrow">${fnHtml}</div>` : ''}

  ${restHtml ? `
  <div class="sr-more" id="hcv2-srmore">
    <button class="sr-more-tg" id="hcv2-srmore-tg">${_svg('numpad', 18)}<span>Alle Befehle (${rest.length})</span><span class="chev">${_svg('chev_down', 18)}</span></button>
    <div class="sr-grid">${restHtml}</div>
  </div>` : ''}
</div>`;

        body.querySelectorAll('[data-cv]').forEach(el => {
            el.addEventListener('click', () => { this._vib(); this._fire(el.dataset.cv); });
        });
        const moreTg = body.querySelector('#hcv2-srmore-tg');
        if (moreTg) moreTg.addEventListener('click', () => {
            body.querySelector('#hcv2-srmore').classList.toggle('open');
        });
    }

    // ── Commands ──────────────────────────────────────────────────────────────

    _doCmd(btnId) {
        if (!this._hass || !this.config) return;
        if (btnId === 'off') {
            this._hass.callService('remote', 'turn_off', { entity_id: this.config.entity }).catch(() => {});
            return;
        }
        const act    = this._lastAct || 'PowerOff';
        const actMap = act !== 'PowerOff' && this.config.buttons && this.config.buttons[act]
            ? this.config.buttons[act] : {};
        const gb     = (this.config.buttons && this.config.buttons.global) || {};
        let val      = actMap[btnId] || gb[btnId];
        // 'info' unmapped → fall back to the legacy DVR info slot 'dvr_3'
        if (!val && btnId === 'info') val = actMap['dvr_3'] || gb['dvr_3'];
        if (val) {
            this._fire(val);
            // Channel-switching buttons on a TV activity → delayed EPG refresh
            if (this._isTVActivity(act) && HCV2_CHANNEL_BTNS.has(btnId)) {
                this._scheduleEpgRefresh();
            }
        }
    }

    _fire(val) {
        if (!val || !this._hass || !this.config) return;
        if (val.startsWith('activity:::')) {
            this._hass.callService('remote', 'turn_on', {
                entity_id: this.config.entity,
                activity: val.split(':::')[1],
            }).catch(() => {});
        } else if (val.startsWith('command:::')) {
            const p = val.split(':::');
            this._hass.callService('remote', 'send_command', {
                entity_id: this.config.entity,
                device:    p[1],
                command:   p[2],
            }).catch(() => {});
        } else if (val.startsWith('call_service:::')) {
            const p = val.split(':::');
            const s = (p[1] || '').split('.');
            if (s.length >= 2) this._hass.callService(s[0], s[1], {}).catch(() => {});
        }
    }

    _vib() { try { navigator.vibrate && navigator.vibrate(30); } catch(e) {} }

    // ── Fire-TV Skin ──────────────────────────────────────────────────────────

    _renderFireTv() {
        const acts    = this._activities();
        const current = this._lastAct || 'PowerOff';

        const appsHtml = acts.map(a => {
            const ico = a.icon
                ? `<ha-icon icon="${_e(a.icon)}" style="--mdc-icon-size:15px;margin-right:4px;vertical-align:middle;"></ha-icon>`
                : '';
            return `<div class="ftv-app" data-act="${_e(a.name)}">${ico}${_e(a.label)}</div>`;
        }).join('');

        this.shadowRoot.innerHTML = this._cssFireTv() + `
<div class="card">
<div class="ftv-remote" id="hcv2-card">

  <div class="ftv-topbar">
    <button class="ftv-circ" data-btn="off" title="Power">${_svg('power',20)}</button>
    <span class="ftv-status" id="hcv2-status"></span>
    <button class="ftv-circ" id="hcv2-devbtn" title="Gerät wählen">${_svg('devices',20)}</button>
  </div>

  <div class="ftv-kb-row">
    <button class="ftv-kb" data-btn="source">${_svg('source',24)}</button>
  </div>

  <div class="ftv-ring-wrap">
    <div class="ftv-ring-outer">
      <button class="ftv-dir" data-btn="dir_up">${_svg('dir_up',28)}</button>
      <div class="ftv-ring-mid">
        <button class="ftv-dir" data-btn="dir_left">${_svg('dir_left',28)}</button>
        <button class="ftv-ok" data-btn="ok">OK</button>
        <button class="ftv-dir" data-btn="dir_right">${_svg('dir_right',28)}</button>
      </div>
      <button class="ftv-dir" data-btn="dir_down">${_svg('dir_down',28)}</button>
    </div>
  </div>

  <div class="ftv-row3">
    <button class="ftv-rnd" data-btn="back">${_svg('back',22)}<span>Back</span></button>
    <button class="ftv-rnd" data-btn="exit">${_svg('exit',22)}<span>Home</span></button>
    <button class="ftv-rnd" data-btn="menu">${_svg('menu',22)}<span>Menu</span></button>
  </div>

  <div class="ftv-row3">
    <button class="ftv-rnd" data-btn="rewind">${_svg('rewind',22)}</button>
    <button class="ftv-rnd ftv-play" data-btn="play">${_svg('play',28)}</button>
    <button class="ftv-rnd" data-btn="fast_forward">${_svg('fwd',22)}</button>
  </div>

  <div class="ftv-volch" id="hcv2-volch">
    <div class="ftv-rockerv">
      <button class="ftv-rb" data-btn="vol_up">${_svg('vol_up',18)}</button>
      <span class="ftv-rklbl">VOL</span>
      <button class="ftv-rb" data-btn="vol_down">${_svg('vol_down',18)}</button>
    </div>
    <button class="ftv-circ ftv-circ--mid" data-btn="mute">${_svg('mute',22)}</button>
    <div class="ftv-rockerv">
      <button class="ftv-rb" data-btn="ch_up">${_svg('dir_up',18)}</button>
      <span class="ftv-rklbl">CH</span>
      <button class="ftv-rb" data-btn="ch_down">${_svg('dir_down',18)}</button>
    </div>
  </div>

  <div class="ftv-row3">
    <button class="ftv-rnd" data-btn="skip_back">${_svg('skip_back',22)}</button>
    <button class="ftv-rnd" data-btn="info">${_svg('info',22)}<span>Info</span></button>
    <button class="ftv-rnd" data-btn="skip_forward">${_svg('skip_fwd',22)}</button>
  </div>

  <div class="ftv-apps" id="hcv2-pills">
    ${appsHtml || '<span class="ftv-noapps">Keine Activities</span>'}
  </div>

  ${this._numpadHtml()}
  ${this._conf._err ? `<div class="conf-err">Conf-Fehler: ${_e(this._conf._err)}</div>` : ''}

</div>
</div>

<div class="sh-overlay" id="hcv2-sheet">
  <div class="sh-backdrop" id="hcv2-bd"></div>
  <div class="sh-panel">
    <div class="sh-handle"></div>
    <div class="sh-head">
      <button class="sh-nav" id="hcv2-sh-back" style="visibility:hidden">${_svg('chev_left',22)}</button>
      <span class="sh-title" id="hcv2-sh-title">Gerät wählen</span>
      <button class="sh-nav" id="hcv2-sh-close">${_svg('close',22)}</button>
    </div>
    <div class="sh-body" id="hcv2-sh-body"></div>
  </div>
</div>
`;
        this._bindEvents();
        this._updateLive();
    }

    _cssFireTv() { return `<style>
:host{display:block;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
button{background:none;border:none;cursor:pointer;font:inherit;color:inherit;-webkit-tap-highlight-color:transparent;}

.card{background:transparent;padding:8px;}

.ftv-remote{
  background:linear-gradient(180deg,#242428 0%,#1c1c20 100%);
  border-radius:52px;
  padding:22px 16px 26px;
  max-width:284px;
  margin:0 auto;
  display:flex;flex-direction:column;align-items:center;gap:14px;
  box-shadow:0 8px 32px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.06);
}

.ftv-topbar{
  width:100%;display:flex;align-items:center;justify-content:space-between;padding:0 4px;
}
.ftv-circ{
  width:42px;height:42px;border-radius:50%;
  background:rgba(255,255,255,.06);
  display:flex;align-items:center;justify-content:center;
  color:#9090a0;transition:background .12s;
}
.ftv-circ:active{background:rgba(255,255,255,.13);}
.ftv-circ--mid{width:52px;height:52px;background:#2a2a30;}
.ftv-status{flex:1;text-align:center;font-size:11px;font-weight:700;color:#606070;letter-spacing:.4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 6px;}

.ftv-kb-row{display:flex;justify-content:center;}
.ftv-kb{
  width:56px;height:56px;border-radius:50%;
  background:radial-gradient(circle at 40% 35%,#1ab3a8,#0d6e66);
  display:flex;align-items:center;justify-content:center;
  color:#fff;
  box-shadow:0 4px 18px rgba(13,148,136,.40);
  transition:opacity .12s;
}
.ftv-kb:active{opacity:.75;}

.ftv-ring-wrap{display:flex;justify-content:center;}
.ftv-ring-outer{
  width:226px;height:226px;border-radius:50%;
  background:radial-gradient(circle,#2e2e34 60%,#252528 100%);
  box-shadow:inset 0 2px 6px rgba(0,0,0,.5),0 2px 8px rgba(0,0,0,.3);
  display:grid;grid-template-rows:1fr auto 1fr;
  align-items:center;justify-items:center;
}
.ftv-ring-mid{
  display:flex;align-items:center;width:100%;justify-content:space-between;padding:0 8px;
}
.ftv-dir{
  width:62px;height:62px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  color:#c0c0d0;transition:background .1s;
}
.ftv-dir:active{background:rgba(255,255,255,.10);}
.ftv-ok{
  flex:1;height:96px;border-radius:22px;
  background:linear-gradient(180deg,#3a3a42 0%,#2e2e36 100%);
  color:#e8e8f2;font-size:18px;font-weight:900;
  display:flex;align-items:center;justify-content:center;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 2px 6px rgba(0,0,0,.3);
  transition:background .1s;margin:0 6px;
}
.ftv-ok:active{background:linear-gradient(180deg,#46464f 0%,#3a3a42 100%);}

.ftv-row3{
  display:flex;gap:8px;justify-content:center;width:100%;
}
.ftv-rnd{
  flex:1;height:54px;border-radius:18px;
  background:rgba(255,255,255,.055);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;
  color:#a0a0b0;font-size:9px;font-weight:700;letter-spacing:.3px;
  transition:background .12s;
}
.ftv-rnd:active{background:rgba(255,255,255,.11);}
.ftv-rnd span{font-size:9px;margin-top:1px;}
.ftv-play{background:rgba(59,130,246,.12);color:#60a5fa;}
.ftv-play:active{background:rgba(59,130,246,.20);}

.ftv-volch{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;}
.ftv-rockerv{
  flex:1;display:flex;flex-direction:column;align-items:center;
  background:rgba(255,255,255,.055);border-radius:22px;overflow:hidden;
}
.ftv-rb{
  width:100%;height:42px;
  display:flex;align-items:center;justify-content:center;
  color:#b0b0c0;transition:background .1s;
}
.ftv-rb:active{background:rgba(255,255,255,.10);}
.ftv-rklbl{font-size:9px;font-weight:700;letter-spacing:.5px;color:#505060;line-height:1;padding:2px 0;}

.ftv-apps{
  display:flex;flex-wrap:wrap;gap:6px;justify-content:center;width:100%;padding-top:4px;
}
.ftv-app{
  height:36px;padding:0 14px;border-radius:18px;
  display:flex;align-items:center;
  font-size:12px;font-weight:700;white-space:nowrap;
  cursor:pointer;user-select:none;
  background:rgba(255,255,255,.07);color:#7070808;
  color:#808090;
  transition:all .15s;
}
.ftv-app--on{
  background:var(--primary-color,#03a9f4);color:#fff;
  box-shadow:0 2px 10px color-mix(in srgb,var(--primary-color,#03a9f4) 40%,transparent);
}
.ftv-app:active{opacity:.75;}
.ftv-noapps{font-size:11px;color:#404050;}
.conf-err{font-size:11px;color:#ef4444;padding:4px 8px;background:rgba(239,68,68,.06);border-radius:8px;}

.sh-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:flex-end;justify-content:center;padding:0 12px;pointer-events:none;}
.sh-overlay.open{pointer-events:all;}
.sh-backdrop{position:absolute;inset:0;background:rgba(0,0,0,0);transition:background .25s;}
.sh-overlay.open .sh-backdrop{background:rgba(0,0,0,.45);}
.sh-panel{position:relative;width:100%;max-width:320px;max-height:72vh;margin:0 auto 14px;background:var(--ha-card-background,var(--card-background-color,#1e1e24));border-radius:26px;display:flex;flex-direction:column;transform:translateY(120%);transition:transform .28s cubic-bezier(.4,0,.2,1);overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,.08),0 12px 40px rgba(0,0,0,.55);}
.sh-overlay.open .sh-panel{transform:translateY(0);}
.sh-handle{width:40px;height:4px;border-radius:2px;background:rgba(255,255,255,.14);align-self:center;margin:10px 0 0;flex-shrink:0;}
.sh-head{display:flex;align-items:center;padding:8px 8px 12px;gap:4px;flex-shrink:0;}
.sh-title{flex:1;text-align:center;font-size:15px;font-weight:800;color:var(--primary-text-color,#e0e0e8);}
.sh-nav{width:42px;height:42px;border-radius:13px;display:flex;align-items:center;justify-content:center;color:#707080;transition:background .12s;}
.sh-nav:active{background:rgba(255,255,255,.08);}
.sh-body{overflow-y:auto;padding:0 12px 20px;flex:1;}
.sh-empty{padding:28px 0;text-align:center;color:#707080;font-size:13px;line-height:1.6;}
.sh-empty small{font-size:11px;}
.sh-empty code{background:rgba(255,255,255,.07);border-radius:4px;padding:1px 4px;}
.dev-row{display:flex;align-items:center;gap:12px;padding:15px 8px;border-radius:14px;cursor:pointer;transition:background .12s;}
.dev-row:active{background:rgba(255,255,255,.07);}
.dev-name{flex:1;font-size:15px;font-weight:700;color:var(--primary-text-color,#e0e0e8);}
.cmd-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:4px 0;}
.cmd-btn{min-height:64px;border-radius:16px;background:rgba(255,255,255,.06);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:10px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#c0c0d0;transition:background .12s;overflow:hidden;padding:6px 4px;}
.cmd-btn:active{background:rgba(255,255,255,.12);}
.cmd-btn span{max-width:92%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
${this._numpadCss()}</style>`; }

    // ── CSS ───────────────────────────────────────────────────────────────────

    _css() { return `<style>
:host{display:block;background:#101218;min-height:100%;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
button{background:none;border:none;cursor:pointer;font:inherit;color:inherit;-webkit-tap-highlight-color:transparent;}

/* Outer card — transparent wrapper, the remote body carries the chrome */
.card{background:transparent;padding:0;}

/* Remote body — fills the card width (max 448px); _fitRemote() scales via zoom.
   --hcv2-accent (hub color) is set inline on this element by _render(). */
.flt-remote{
  background:#101218;
  border-radius:28px;
  width:100%;max-width:448px;margin:0 auto;
  padding:12px;
  display:flex;flex-direction:column;gap:16px;
  box-shadow:0 0 0 1px rgba(255,255,255,.04),0 10px 36px rgba(0,0,0,.5);
}

/* Zone 1 — display: fixed design canvas (370×147 default), scaled via transform.
   _sizeDisplay() sets canvas width/height/scale and the container height. */
.hcv2-disp{position:relative;width:100%;border-radius:14px;overflow:hidden;background:linear-gradient(135deg,#30344a 0%,#1d2030 100%);touch-action:pan-y;}
#hcv2-disp-canvas{position:absolute;left:0;top:0;transform-origin:top left;}
#hcv2-disp-bg{position:absolute;inset:0;z-index:0;background-size:cover;background-position:center;background-repeat:no-repeat;display:none;will-change:transform,opacity;}
#hcv2-disp-bg.animate{animation:hcv2BgFadeZoom 1.2s ease-out;}
@keyframes hcv2BgFadeZoom{from{opacity:0;transform:scale(1.10);}to{opacity:1;transform:scale(1.00);}}
#hcv2-disp-grad{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(16,18,24,0) 35%,rgba(16,18,24,.55) 100%);}
#hcv2-disp-power{position:absolute;left:12px;top:50%;transform:translateY(-50%);width:38px;height:38px;z-index:3;border-radius:50%;background:rgba(255,255,255,.10);display:flex;align-items:center;justify-content:center;color:#dfe5f0;cursor:pointer;transition:background .12s;}
#hcv2-disp-power:active{background:rgba(255,255,255,.20);}
#hcv2-disp-dots{position:absolute;right:4px;top:4px;width:32px;height:32px;z-index:3;border-radius:50%;display:none;align-items:center;justify-content:center;color:#dfe5f0;font-size:18px;font-weight:700;cursor:pointer;}
#hcv2-disp-activity{position:absolute;top:10px;left:14px;right:44px;z-index:3;font-size:12px;font-weight:600;color:#8a93a8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
#hcv2-disp-channel{position:absolute;top:28px;left:14px;z-index:3;font-size:16px;font-weight:800;color:#dfe5f0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
#hcv2-disp-title{position:absolute;left:62px;right:14px;bottom:26px;z-index:3;font-size:13px;font-weight:700;color:#dfe5f0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
#hcv2-disp-time{position:absolute;left:62px;bottom:10px;z-index:3;font-size:11px;color:#e8cc66;white-space:nowrap;}
#hcv2-disp-timespan{position:absolute;right:14px;bottom:10px;z-index:3;font-size:11px;color:#8a93a8;white-space:nowrap;}
#hcv2-disp-logo{position:absolute;z-index:3;display:none;background-size:contain;background-position:center;background-repeat:no-repeat;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6));}
.hcv2-panel{position:absolute;z-index:2;pointer-events:none;border-radius:8px;background:rgba(40,40,40,.5);}
.hcv2-line{position:absolute;z-index:2;pointer-events:none;background:#888888;transform-origin:center center;}
#hcv2-disp-progress{position:absolute;left:0;right:0;bottom:0;height:4px;z-index:4;cursor:pointer;background:rgba(255,255,255,.12);}
#hcv2-disp-progress-fill{height:100%;width:0%;background:var(--hcv2-accent);}

/* Zone 2 — hub chip + activity pills */
.flt-zone2{width:100%;display:flex;flex-wrap:wrap;gap:8px;}
.hub-chip{position:relative;display:flex;align-items:center;gap:8px;height:44px;padding:0 14px;border-radius:14px;background:#1b1e29;cursor:pointer;user-select:none;}
.hub-chip:active{background:#232736;}
.hub-dot{width:8px;height:8px;border-radius:50%;background:#8a93a8;flex-shrink:0;}
.hub-name{font-size:13px;font-weight:700;color:#dfe5f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;}
.hub-caret{display:flex;color:#8a93a8;transition:transform .2s;}
.hub-chip.open .hub-caret{transform:rotate(180deg);}
.hub-dropdown{position:absolute;top:calc(100% + 6px);left:0;min-width:180px;background:#1d2130;border:1px solid #343b50;border-radius:12px;box-shadow:0 10px 28px rgba(0,0,0,.5);max-height:240px;overflow-y:auto;z-index:40;display:none;padding:4px;}
.hub-chip.open .hub-dropdown{display:block;}
.hub-dd-item{display:flex;align-items:center;gap:10px;height:44px;padding:0 12px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;color:#dfe5f0;transition:background .12s;}
.hub-dd-item:active{background:rgba(255,255,255,.10);}
.hub-dd-item.active{background:rgba(255,255,255,.07);}
.pill{flex:1 1 30%;min-width:30%;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;white-space:nowrap;cursor:pointer;user-select:none;background:#1b1e29;color:#8a93a8;transition:all .15s;overflow:hidden;}
.pill--on{background:var(--hcv2-accent);color:#fff;}
.pill:active{opacity:.75;}
.pill-empty{font-size:12px;color:#8a93a8;padding:0 4px;align-self:center;}
.conf-err{font-size:11px;color:#ef4444;padding:4px 8px;background:rgba(239,68,68,.10);border-radius:8px;}

/* Zone 3 — nav cluster: VOL rocker · D-pad · CH rocker */
.flt-nav{width:100%;display:flex;gap:10px;align-items:stretch;}
.flt-rk{width:74px;flex-shrink:0;background:#1b1e29;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:10px 0;}
.rk-b{width:100%;height:44px;display:flex;align-items:center;justify-content:center;color:#dfe5f0;transition:background .1s;}
.rk-b:active{background:rgba(255,255,255,.08);}
.rk-sign{font-size:22px;font-weight:600;}
.rk-lbl{font-size:10px;font-weight:700;letter-spacing:.5px;color:#666e80;line-height:1;}
.rk-sep{width:32px;height:1px;background:#2e3342;flex-shrink:0;}
.flt-dpad{flex:1;position:relative;background:#171a23;border-radius:22px;height:300px;}
.dp-c{position:absolute;width:48px;height:48px;border-radius:50%;background:#232736;display:flex;align-items:center;justify-content:center;color:#dfe5f0;transition:background .1s;}
.dp-c:active{background:#2e3342;}
.dp-tl{top:10px;left:10px;} .dp-tr{top:10px;right:10px;}
.dp-bl{bottom:10px;left:10px;} .dp-br{bottom:10px;right:10px;}
.dp-a{position:absolute;width:64px;height:64px;border-radius:18px;display:flex;align-items:center;justify-content:center;color:#dfe5f0;transition:background .1s;}
.dp-a:active{background:rgba(255,255,255,.08);}
.dp-up{top:6px;left:50%;transform:translateX(-50%);}
.dp-down{bottom:6px;left:50%;transform:translateX(-50%);}
.dp-left{left:6px;top:50%;transform:translateY(-50%);}
.dp-right{right:6px;top:50%;transform:translateY(-50%);}
.dp-ok{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:108px;height:92px;border-radius:24px;background:var(--hcv2-accent);color:#fff;font-size:18px;font-weight:800;transition:opacity .1s;}
.dp-ok:active{opacity:.8;}
.is-off{opacity:.22;pointer-events:none;}

/* Zone 4 — color buttons */
.color-row{width:100%;display:flex;gap:8px;}
.color-btn{flex:1;height:48px;border-radius:12px;transition:opacity .1s;}
.color-btn:active{opacity:.75;}
.c-red{background:#d94c4c;}.c-green{background:#4f9e44;}.c-yellow{background:#e0a32e;}.c-blue{background:#3f7fd9;}

/* Zone 5 — transport (single row, play/pause grows) */
.tp-row{width:100%;display:flex;gap:8px;}
.tp-btn{flex:1;height:52px;border-radius:12px;background:#1b1e29;display:flex;align-items:center;justify-content:center;color:#dfe5f0;transition:background .1s;}
.tp-btn:active{background:#232736;}
.tp-play{flex:1.3;background:color-mix(in srgb,var(--hcv2-accent) 40%,#1b1e29);color:#fff;}

/* Zone 6 — extra slots (bot_N) */
#hcv2-slots{width:100%;display:grid;grid-template-columns:repeat(auto-fit,minmax(64px,1fr));gap:8px;}
.slot-btn{height:58px;border-radius:12px;background:#1b1e29;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#cdd4e2;transition:background .1s;}
.slot-btn:active{background:#232736;}
.slot-btn span{font-size:11px;font-weight:600;max-width:95%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

/* Zone 7 — footer; numpad opens UPWARD as a floating overlay anchored to it */
.flt-foot{position:relative;width:100%;display:flex;gap:8px;}
.num-section{flex:1;display:flex;}
.num-toggle,.foot-btn{flex:1;height:48px;border-radius:12px;background:#1b1e29;display:flex;align-items:center;justify-content:center;gap:8px;font-size:13px;font-weight:600;color:#dfe5f0;transition:background .12s;}
.num-toggle:active,.num-toggle.open,.foot-btn:active{background:#232736;}
.num-grid{
  display:grid;grid-template-columns:repeat(3,1fr);gap:6px;
  position:absolute;left:0;right:0;bottom:calc(100% + 8px);
  background:#1d2130;border:1px solid #343b50;
  padding:10px;border-radius:16px;
  box-shadow:0 -8px 24px rgba(0,0,0,.45);
  opacity:0;visibility:hidden;transform:translateY(8px);
  transition:opacity .18s ease,transform .18s ease,visibility .18s;
  z-index:30;
}
.num-grid.open{opacity:1;visibility:visible;transform:translateY(0);}
.num-btn{height:56px;border-radius:12px;background:#2a2f40;font-size:18px;font-weight:700;color:#e8ecf5;transition:background .1s;}
.num-btn:active{background:#343b50;}
.num-ok{background:var(--hcv2-accent);color:#fff;}

/* Device Quick Sheet (dark) */
.sh-overlay{
  position:fixed;inset:0;z-index:9999;
  display:flex;align-items:flex-end;justify-content:center;
  padding:0 12px;
  pointer-events:none;
}
.sh-overlay.open{pointer-events:all;}
.sh-backdrop{
  position:absolute;inset:0;
  background:rgba(0,0,0,0);
  transition:background .25s;
}
.sh-overlay.open .sh-backdrop{background:rgba(0,0,0,.45);}
.sh-panel{
  position:relative;width:100%;max-width:320px;max-height:72vh;
  margin:0 auto 14px;
  background:#1a1d27;
  border-radius:26px;
  display:flex;flex-direction:column;
  transform:translateY(120%);
  transition:transform .28s cubic-bezier(.4,0,.2,1);
  overflow:hidden;
  box-shadow:0 0 0 1px rgba(255,255,255,.08),0 12px 40px rgba(0,0,0,.55);
}
.sh-overlay.open .sh-panel{transform:translateY(0);}
.sh-handle{
  width:40px;height:4px;border-radius:2px;
  background:rgba(255,255,255,.14);
  align-self:center;margin:10px 0 0;flex-shrink:0;
}
.sh-head{
  display:flex;align-items:center;padding:8px 8px 12px;gap:4px;flex-shrink:0;
}
.sh-title{
  flex:1;text-align:center;
  font-size:15px;font-weight:800;
  color:#f2f5fb;
}
.sh-nav{
  width:42px;height:42px;border-radius:13px;
  display:flex;align-items:center;justify-content:center;
  color:#8a93a8;
  transition:background .12s;
}
.sh-nav:active{background:rgba(255,255,255,.08);}
.sh-body{overflow-y:auto;padding:0 12px 20px;flex:1;}
.sh-empty{
  padding:28px 0;text-align:center;
  color:#8a93a8;font-size:13px;line-height:1.6;
}
.sh-empty small{font-size:11px;}
.sh-empty code{background:rgba(255,255,255,.07);border-radius:4px;padding:1px 4px;}

/* Device list */
.dev-row{
  display:flex;align-items:center;gap:12px;
  padding:15px 8px;border-radius:14px;
  cursor:pointer;transition:background .12s;
}
.dev-row:active{background:rgba(255,255,255,.06);}
.dev-name{flex:1;font-size:15px;font-weight:700;color:#e8edf5;}

/* Command grid */
.cmd-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:4px 0;}
.cmd-btn{
  min-height:64px;border-radius:16px;
  background:rgba(255,255,255,.06);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
  font-size:10px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;
  color:#cdd6e6;
  transition:background .12s;overflow:hidden;padding:6px 4px;
}
.cmd-btn:active{background:rgba(255,255,255,.12);}
.cmd-btn span{max-width:92%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

/* Device remote (dark) — same shape as the main remote, darker theme */
.sr-wrap{
  background:linear-gradient(160deg,#222a3a 0%,#1a202c 100%);
  border-radius:24px;padding:16px 14px 20px;margin:2px 0 6px;
  display:flex;flex-direction:column;align-items:center;gap:13px;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 4px 16px rgba(0,0,0,.30);
}
.sr-top{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;}
.sr-pw-grp{display:flex;gap:8px;}
.sr-pill{
  height:42px;padding:0 15px;border-radius:14px;
  display:flex;align-items:center;gap:6px;
  font-size:12px;font-weight:800;letter-spacing:.3px;
  background:rgba(255,255,255,.07);color:#e8edf5;transition:background .12s,opacity .1s;
}
.sr-pill:active{opacity:.72;}
.sr-on{background:rgba(34,197,94,.18);color:#4ade80;}
.sr-off{background:rgba(239,68,68,.18);color:#f87171;}
.sr-src{background:rgba(96,165,250,.16);color:#93c5fd;}
.sr-volch{display:flex;align-items:center;justify-content:center;gap:12px;}
.sr-rocker{display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,.05);border-radius:20px;overflow:hidden;width:66px;}
.sr-rb{width:66px;height:42px;display:flex;align-items:center;justify-content:center;color:#e8edf5;transition:background .1s;}
.sr-rb:active{background:rgba(255,255,255,.12);}
.sr-rb-top{border-radius:20px 20px 0 0;}.sr-rb-bot{border-radius:0 0 20px 20px;}
.sr-rk-lbl{font-size:9px;font-weight:700;letter-spacing:.5px;color:#8b97ad;padding:1px 0;line-height:1;}
.sr-mute{width:58px;height:58px;border-radius:18px;background:rgba(255,255,255,.05);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#e8edf5;font-size:9px;font-weight:700;transition:background .12s;}
.sr-mute:active{background:rgba(255,255,255,.12);}
.sr-dpad{display:flex;flex-direction:column;align-items:center;gap:3px;background:rgba(0,0,0,.20);border-radius:26px;padding:8px;width:206px;}
.sr-dp-row{display:flex;align-items:center;justify-content:center;gap:5px;width:100%;}
.sr-dp{width:58px;height:56px;border-radius:16px;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center;color:#e8edf5;transition:background .1s;}
.sr-dp:active{background:rgba(255,255,255,.14);}
.sr-ok{width:72px;height:56px;border-radius:18px;background:var(--primary-color,#03a9f4);color:#fff;font-size:16px;font-weight:900;box-shadow:0 3px 12px color-mix(in srgb,var(--primary-color,#03a9f4) 35%,transparent);transition:opacity .1s;}
.sr-ok:active{opacity:.8;}
.sr-fnrow{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;width:100%;}
.sr-fn{min-width:54px;height:48px;padding:0 10px;border-radius:14px;background:rgba(255,255,255,.05);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#cdd6e6;font-size:9px;font-weight:700;transition:background .12s;}
.sr-fn:active{background:rgba(255,255,255,.12);}
.sr-dis{opacity:.22;pointer-events:none;}
.sr-more{width:100%;margin-top:2px;}
.sr-more-tg{display:flex;align-items:center;gap:6px;width:100%;height:42px;padding:0 14px;border-radius:13px;background:rgba(255,255,255,.04);color:#aeb8cc;font-size:12px;font-weight:700;transition:background .12s;}
.sr-more-tg:active{background:rgba(255,255,255,.10);}
.sr-more-tg .chev{margin-left:auto;transition:transform .2s;}
.sr-more.open .chev{transform:rotate(180deg);}
.sr-grid{display:none;grid-template-columns:repeat(3,1fr);gap:7px;padding-top:8px;}
.sr-more.open .sr-grid{display:grid;}
.sr-gbtn{min-height:50px;border-radius:12px;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center;text-align:center;font-size:10px;font-weight:600;color:#cdd6e6;padding:4px;transition:background .12s;overflow:hidden;word-break:break-word;}
.sr-gbtn:active{background:rgba(255,255,255,.12);}
</style>`; }

// ── Sheet Helpers ─────────────────────────────────────────────────────────

    _sheetHtml() { return `<div class="sh-overlay" id="hcv2-sheet">
  <div class="sh-backdrop" id="hcv2-bd"></div>
  <div class="sh-panel">
    <div class="sh-handle"></div>
    <div class="sh-head">
      <button class="sh-nav" id="hcv2-sh-back" style="visibility:hidden">${_svg('chev_left',22)}</button>
      <span class="sh-title" id="hcv2-sh-title">Gerät wählen</span>
      <button class="sh-nav" id="hcv2-sh-close">${_svg('close',22)}</button>
    </div>
    <div class="sh-body" id="hcv2-sh-body"></div>
  </div>
</div>`; }

    _sheetCss() { return `
.sh-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:flex-end;justify-content:center;padding:0 12px;pointer-events:none;}
.sh-overlay.open{pointer-events:all;}
.sh-backdrop{position:absolute;inset:0;background:rgba(0,0,0,0);transition:background .25s;}
.sh-overlay.open .sh-backdrop{background:rgba(0,0,0,.42);}
.sh-panel{position:relative;width:100%;max-width:320px;max-height:72vh;margin:0 auto 14px;background:var(--ha-card-background,var(--card-background-color,#fff));border-radius:26px;display:flex;flex-direction:column;transform:translateY(120%);transition:transform .28s cubic-bezier(.4,0,.2,1);overflow:hidden;box-shadow:0 0 0 1px var(--divider-color,rgba(0,0,0,.12)),0 12px 40px rgba(0,0,0,.40);}
.sh-overlay.open .sh-panel{transform:translateY(0);}
.sh-handle{width:40px;height:4px;border-radius:2px;background:rgba(0,0,0,.12);align-self:center;margin:10px 0 0;flex-shrink:0;}
.sh-head{display:flex;align-items:center;padding:8px 8px 12px;gap:4px;flex-shrink:0;}
.sh-title{flex:1;text-align:center;font-size:15px;font-weight:800;color:var(--primary-text-color,#333);}
.sh-nav{width:42px;height:42px;border-radius:13px;display:flex;align-items:center;justify-content:center;color:var(--secondary-text-color,#666);transition:background .12s;}
.sh-nav:active{background:rgba(0,0,0,.08);}
.sh-body{overflow-y:auto;padding:0 12px 20px;flex:1;}
.sh-empty{padding:28px 0;text-align:center;color:var(--secondary-text-color,#888);font-size:13px;line-height:1.6;}
.sh-empty small{font-size:11px;} .sh-empty code{background:rgba(0,0,0,.06);border-radius:4px;padding:1px 4px;}
.dev-row{display:flex;align-items:center;gap:12px;padding:15px 8px;border-radius:14px;cursor:pointer;transition:background .12s;}
.dev-row:active{background:rgba(0,0,0,.06);}
.dev-name{flex:1;font-size:15px;font-weight:700;color:var(--primary-text-color,#333);}
.cmd-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:4px 0;}
.cmd-btn{min-height:64px;border-radius:16px;background:rgba(0,0,0,.04);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:10px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:var(--primary-text-color,#333);transition:background .12s;overflow:hidden;padding:6px 4px;}
.cmd-btn:active{background:rgba(0,0,0,.10);}
.cmd-btn span{max-width:92%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}`; }

    _numpadHtml() { return `
<div class="snp-wrap">
  <button id="hcv2-numtgl" class="snp-toggle"><span>123</span>${_svg('chev_down',16)}</button>
  <div id="hcv2-numgrid" class="snp-grid">
    <button class="snp-btn" data-btn="num_1">1</button>
    <button class="snp-btn" data-btn="num_2">2</button>
    <button class="snp-btn" data-btn="num_3">3</button>
    <button class="snp-btn" data-btn="num_4">4</button>
    <button class="snp-btn" data-btn="num_5">5</button>
    <button class="snp-btn" data-btn="num_6">6</button>
    <button class="snp-btn" data-btn="num_7">7</button>
    <button class="snp-btn" data-btn="num_8">8</button>
    <button class="snp-btn" data-btn="num_9">9</button>
    <button class="snp-btn snp-back" data-btn="back">⌫</button>
    <button class="snp-btn" data-btn="num_0">0</button>
    <button class="snp-btn snp-ok" data-btn="ok">OK</button>
  </div>
</div>`; }

    _numpadCss() { return `
.snp-wrap{width:100%;margin-top:4px;}
.snp-toggle{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;height:40px;border-radius:12px;background:rgba(128,128,128,.09);font-size:12px;font-weight:700;color:inherit;letter-spacing:.5px;transition:background .12s;}
.snp-toggle:active{background:rgba(128,128,128,.18);}
.snp-toggle svg{transition:transform .2s;opacity:.55;}
.snp-toggle.open svg{transform:rotate(180deg);}
.snp-grid{display:none;grid-template-columns:repeat(3,1fr);gap:6px;padding:8px 0 2px;}
.snp-grid.open{display:grid;}
.snp-btn{height:48px;border-radius:12px;background:rgba(128,128,128,.08);font-size:18px;font-weight:700;color:inherit;transition:background .1s;}
.snp-btn:active{background:rgba(128,128,128,.18);}
.snp-back{font-size:15px;}
.snp-ok{font-size:13px;font-weight:800;letter-spacing:.5px;}`; }

// ============================================================================
// Apple TV Skin (Siri Remote 3rd Gen)
// ============================================================================

    _renderAppleTv() {
        const acts = this._activities();
        const appsHtml = acts.map(a => {
            const ico = a.icon ? `<ha-icon icon="${_e(a.icon)}" style="--mdc-icon-size:15px;margin-right:4px;vertical-align:middle;"></ha-icon>` : '';
            return `<div class="act-pill" data-act="${_e(a.name)}">${ico}${_e(a.label)}</div>`;
        }).join('');
        this.shadowRoot.innerHTML = this._cssAppleTv() + `
<div class="card"><div class="atv-remote" id="hcv2-card">
  <div class="atv-topbar">
    <button class="atv-circ" id="hcv2-devbtn">${_svg('devices',18)}</button>
    <span class="atv-st" id="hcv2-status"></span>
    <button class="atv-circ" data-btn="off">${_svg('power',18)}</button>
  </div>
  <div class="atv-pad-wrap"><div class="atv-pad">
    <button class="atv-dir" data-btn="dir_up">${_svg('dir_up',26)}</button>
    <div class="atv-mid">
      <button class="atv-dir" data-btn="dir_left">${_svg('dir_left',26)}</button>
      <button class="atv-ok" data-btn="ok">OK</button>
      <button class="atv-dir" data-btn="dir_right">${_svg('dir_right',26)}</button>
    </div>
    <button class="atv-dir" data-btn="dir_down">${_svg('dir_down',26)}</button>
  </div></div>
  <div class="atv-r2">
    <button class="atv-b2" data-btn="back">${_svg('back',22)}<span>Back</span></button>
    <button class="atv-b2" data-btn="exit">${_svg('exit',22)}<span>Home</span></button>
  </div>
  <div class="atv-r2">
    <button class="atv-b2" data-btn="mute">${_svg('mute',22)}<span>Mute</span></button>
    <button class="atv-b2 atv-play" data-btn="play">${_svg('play',28)}</button>
  </div>
  <div class="atv-volch" id="hcv2-volch">
    <button class="atv-vol" data-btn="vol_down">${_svg('vol_down',20)}<span>Vol−</span></button>
    <button class="atv-vol" data-btn="vol_up">${_svg('vol_up',20)}<span>Vol+</span></button>
  </div>
  <div class="act-pills" id="hcv2-pills">${appsHtml}</div>
  ${this._numpadHtml()}
  ${this._conf._err ? `<div class="conf-err">Conf: ${_e(this._conf._err)}</div>` : ''}
</div></div>${this._sheetHtml()}`;
        this._bindEvents(); this._updateLive();
    }

    _cssAppleTv() { return `<style>
:host{display:block;}*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
button{background:none;border:none;cursor:pointer;font:inherit;color:inherit;}
.card{background:var(--ha-card-background,var(--card-background-color,#000));padding:8px;border-radius:var(--ha-card-border-radius,12px);}
.atv-remote{background:linear-gradient(180deg,#282828 0%,#1a1a1a 100%);border-radius:44px;padding:20px 18px 24px;max-width:268px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:12px;box-shadow:0 8px 28px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.07);}
.atv-topbar{width:100%;display:flex;align-items:center;justify-content:space-between;padding:0 2px;}
.atv-circ{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center;color:#909090;transition:background .12s;}
.atv-circ:active{background:rgba(255,255,255,.14);}
.atv-st{flex:1;text-align:center;font-size:10px;font-weight:600;color:#505050;padding:0 4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.atv-pad-wrap{display:flex;justify-content:center;}
.atv-pad{width:212px;height:212px;border-radius:50%;background:radial-gradient(circle,#343434 55%,#282828 100%);box-shadow:inset 0 2px 8px rgba(0,0,0,.5),0 2px 8px rgba(0,0,0,.4);display:grid;grid-template-rows:1fr auto 1fr;align-items:center;justify-items:center;}
.atv-mid{display:flex;align-items:center;width:100%;justify-content:space-between;padding:0 8px;}
.atv-dir{width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#d0d0d0;transition:background .1s;}
.atv-dir:active{background:rgba(255,255,255,.13);}
.atv-ok{flex:1;height:88px;border-radius:20px;background:linear-gradient(180deg,#3e3e3e 0%,#2e2e2e 100%);color:#f0f0f0;font-size:16px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 0 rgba(255,255,255,.08);transition:background .1s;margin:0 6px;}
.atv-ok:active{background:linear-gradient(180deg,#4a4a4a 0%,#3a3a3a 100%);}
.atv-r2{display:flex;gap:10px;width:100%;}
.atv-b2{flex:1;height:50px;border-radius:16px;background:rgba(255,255,255,.065);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#a0a0a0;font-size:9px;font-weight:700;letter-spacing:.3px;transition:background .12s;}
.atv-b2:active{background:rgba(255,255,255,.13);}
.atv-play{background:rgba(255,255,255,.10);color:#f0f0f0;}
.atv-play:active{background:rgba(255,255,255,.18);}
.atv-volch{display:flex;gap:8px;width:100%;}
.atv-vol{flex:1;height:46px;border-radius:14px;background:rgba(255,255,255,.065);display:flex;gap:8px;align-items:center;justify-content:center;color:#a0a0a0;font-size:10px;font-weight:700;transition:background .12s;}
.atv-vol:active{background:rgba(255,255,255,.13);}
.act-pills{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;width:100%;padding-top:2px;}
.act-pill{height:34px;padding:0 14px;border-radius:17px;display:flex;align-items:center;font-size:12px;font-weight:700;white-space:nowrap;cursor:pointer;user-select:none;background:rgba(255,255,255,.07);color:#707070;transition:all .15s;}
.act-pill--on{background:var(--primary-color,#03a9f4);color:#fff;box-shadow:0 2px 10px color-mix(in srgb,var(--primary-color,#03a9f4) 40%,transparent);}
.act-pill:active{opacity:.75;}
.conf-err{font-size:11px;color:#ef4444;padding:4px 8px;background:rgba(239,68,68,.06);border-radius:8px;}
${this._sheetCss()}${this._numpadCss()}</style>`; }

// ============================================================================
// Chromecast Skin (Google TV, light)
// ============================================================================

    _renderChromecast() {
        const acts = this._activities();
        const appsHtml = acts.map(a => {
            const ico = a.icon ? `<ha-icon icon="${_e(a.icon)}" style="--mdc-icon-size:15px;margin-right:4px;vertical-align:middle;"></ha-icon>` : '';
            return `<div class="act-pill" data-act="${_e(a.name)}">${ico}${_e(a.label)}</div>`;
        }).join('');
        this.shadowRoot.innerHTML = this._cssChromecast() + `
<div class="card"><div class="cc-remote" id="hcv2-card">
  <div class="cc-pad-wrap"><div class="cc-pad">
    <button class="cc-dir" data-btn="dir_up">${_svg('dir_up',26)}</button>
    <div class="cc-mid">
      <button class="cc-dir" data-btn="dir_left">${_svg('dir_left',26)}</button>
      <button class="cc-ok" data-btn="ok">OK</button>
      <button class="cc-dir" data-btn="dir_right">${_svg('dir_right',26)}</button>
    </div>
    <button class="cc-dir" data-btn="dir_down">${_svg('dir_down',26)}</button>
  </div></div>
  <div class="cc-r4">
    <button class="cc-b4" data-btn="back">${_svg('back',20)}<span>Back</span></button>
    <button class="cc-b4" data-btn="exit">${_svg('exit',20)}<span>Home</span></button>
    <button class="cc-b4" data-btn="mute">${_svg('mute',20)}<span>Mute</span></button>
    <button class="cc-b4" data-btn="menu">${_svg('menu',20)}<span>Menu</span></button>
  </div>
  <div class="cc-tp">
    <button class="cc-tp-btn" data-btn="rewind">${_svg('rewind',22)}</button>
    <button class="cc-tp-btn cc-play" data-btn="play">${_svg('play',28)}</button>
    <button class="cc-tp-btn" data-btn="fast_forward">${_svg('fwd',22)}</button>
  </div>
  <div class="cc-volch" id="hcv2-volch">
    <div class="cc-rck">
      <button class="cc-rb" data-btn="vol_up">${_svg('vol_up',18)}</button>
      <span class="cc-rklbl">VOL</span>
      <button class="cc-rb" data-btn="vol_down">${_svg('vol_down',18)}</button>
    </div>
    <div class="cc-rck">
      <button class="cc-rb" data-btn="ch_up">${_svg('dir_up',18)}</button>
      <span class="cc-rklbl">CH</span>
      <button class="cc-rb" data-btn="ch_down">${_svg('dir_down',18)}</button>
    </div>
  </div>
  <div class="cc-bot">
    <button class="cc-circ" data-btn="off">${_svg('power',18)}</button>
    <span class="cc-st" id="hcv2-status"></span>
    <button class="cc-circ" id="hcv2-devbtn">${_svg('devices',18)}</button>
  </div>
  <div class="act-pills" id="hcv2-pills">${appsHtml}</div>
  ${this._numpadHtml()}
  ${this._conf._err ? `<div class="conf-err">Conf: ${_e(this._conf._err)}</div>` : ''}
</div></div>${this._sheetHtml()}`;
        this._bindEvents(); this._updateLive();
    }

    _cssChromecast() { return `<style>
:host{display:block;}*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
button{background:none;border:none;cursor:pointer;font:inherit;color:inherit;}
.card{background:var(--ha-card-background,var(--card-background-color,#f5f5f0));padding:8px;border-radius:var(--ha-card-border-radius,12px);}
.cc-remote{background:#ebebea;border-radius:40px;padding:20px 18px 24px;max-width:272px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:14px;box-shadow:0 4px 20px rgba(0,0,0,.15),inset 0 1px 0 rgba(255,255,255,.8);}
.cc-pad-wrap{display:flex;justify-content:center;}
.cc-pad{width:214px;height:214px;border-radius:50%;background:radial-gradient(circle,#ffffff 50%,#e0e0de 100%);box-shadow:0 3px 12px rgba(0,0,0,.15),inset 0 1px 2px rgba(255,255,255,.9);display:grid;grid-template-rows:1fr auto 1fr;align-items:center;justify-items:center;}
.cc-mid{display:flex;align-items:center;width:100%;justify-content:space-between;padding:0 8px;}
.cc-dir{width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#3c4043;transition:background .1s;}
.cc-dir:active{background:rgba(0,0,0,.08);}
.cc-ok{flex:1;height:88px;border-radius:20px;background:#ffffff;color:#3c4043;font-size:16px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,.12);transition:background .1s;margin:0 6px;}
.cc-ok:active{background:#f0f0f0;}
.cc-r4{display:flex;gap:8px;width:100%;}
.cc-b4{flex:1;height:52px;border-radius:16px;background:rgba(0,0,0,.055);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#5f6368;font-size:9px;font-weight:700;letter-spacing:.3px;transition:background .12s;}
.cc-b4:active{background:rgba(0,0,0,.10);}
.cc-tp{display:flex;gap:8px;width:100%;}
.cc-tp-btn{flex:1;height:50px;border-radius:16px;background:rgba(0,0,0,.055);display:flex;align-items:center;justify-content:center;color:#5f6368;transition:background .12s;}
.cc-tp-btn:active{background:rgba(0,0,0,.10);}
.cc-play{background:rgba(66,133,244,.1);color:#4285f4;}
.cc-play:active{background:rgba(66,133,244,.18);}
.cc-volch{display:flex;gap:8px;width:100%;}
.cc-rck{flex:1;display:flex;flex-direction:column;align-items:center;background:rgba(0,0,0,.055);border-radius:20px;overflow:hidden;}
.cc-rb{width:100%;height:40px;display:flex;align-items:center;justify-content:center;color:#5f6368;transition:background .1s;}
.cc-rb:active{background:rgba(0,0,0,.08);}
.cc-rklbl{font-size:9px;font-weight:700;letter-spacing:.5px;color:#9aa0a6;line-height:1;padding:2px 0;}
.cc-bot{width:100%;display:flex;align-items:center;justify-content:space-between;padding:0 4px;}
.cc-circ{width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,.06);display:flex;align-items:center;justify-content:center;color:#5f6368;transition:background .12s;}
.cc-circ:active{background:rgba(0,0,0,.12);}
.cc-st{flex:1;text-align:center;font-size:10px;font-weight:600;color:#9aa0a6;padding:0 4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.act-pills{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;width:100%;padding-top:2px;}
.act-pill{height:34px;padding:0 14px;border-radius:17px;display:flex;align-items:center;font-size:12px;font-weight:700;white-space:nowrap;cursor:pointer;user-select:none;background:rgba(0,0,0,.07);color:#5f6368;transition:all .15s;}
.act-pill--on{background:var(--primary-color,#4285f4);color:#fff;box-shadow:0 2px 10px color-mix(in srgb,var(--primary-color,#4285f4) 40%,transparent);}
.act-pill:active{opacity:.75;}
.conf-err{font-size:11px;color:#ef4444;padding:4px 8px;background:rgba(239,68,68,.06);border-radius:8px;}
${this._sheetCss()}${this._numpadCss()}</style>`; }

// ============================================================================
// Roku Skin (Voice Remote Pro, purple accents)
// ============================================================================

    _renderRoku() {
        const acts = this._activities();
        const appsHtml = acts.map(a => {
            const ico = a.icon ? `<ha-icon icon="${_e(a.icon)}" style="--mdc-icon-size:15px;margin-right:4px;vertical-align:middle;"></ha-icon>` : '';
            return `<div class="act-pill" data-act="${_e(a.name)}">${ico}${_e(a.label)}</div>`;
        }).join('');
        this.shadowRoot.innerHTML = this._cssRoku() + `
<div class="card"><div class="rku-remote" id="hcv2-card">
  <div class="rku-topbar">
    <button class="rku-circ" data-btn="off">${_svg('power',20)}</button>
    <span class="rku-st" id="hcv2-status"></span>
    <button class="rku-circ" id="hcv2-devbtn">${_svg('devices',20)}</button>
  </div>
  <div class="rku-r2">
    <button class="rku-b2" data-btn="back">${_svg('back',22)}<span>Back</span></button>
    <button class="rku-b2" data-btn="exit">${_svg('exit',22)}<span>Home</span></button>
  </div>
  <div class="rku-pad-wrap"><div class="rku-pad">
    <button class="rku-dir" data-btn="dir_up">${_svg('dir_up',28)}</button>
    <div class="rku-mid">
      <button class="rku-dir" data-btn="dir_left">${_svg('dir_left',28)}</button>
      <button class="rku-ok" data-btn="ok">OK</button>
      <button class="rku-dir" data-btn="dir_right">${_svg('dir_right',28)}</button>
    </div>
    <button class="rku-dir" data-btn="dir_down">${_svg('dir_down',28)}</button>
  </div></div>
  <div class="rku-r3">
    <button class="rku-b3" data-btn="rewind">${_svg('rewind',22)}</button>
    <button class="rku-b3 rku-play" data-btn="play">${_svg('play',28)}</button>
    <button class="rku-b3" data-btn="fast_forward">${_svg('fwd',22)}</button>
  </div>
  <div class="rku-r2">
    <button class="rku-b2" data-btn="menu">${_svg('menu',22)}<span>Options</span></button>
    <button class="rku-b2" data-btn="info">${_svg('info',22)}<span>Info</span></button>
  </div>
  <div class="rku-volch" id="hcv2-volch">
    <div class="rku-rck">
      <button class="rku-rb" data-btn="vol_up">${_svg('vol_up',18)}</button>
      <span class="rku-rklbl">VOL</span>
      <button class="rku-rb" data-btn="vol_down">${_svg('vol_down',18)}</button>
    </div>
    <button class="rku-mute" data-btn="mute">${_svg('mute',22)}</button>
    <div class="rku-rck">
      <button class="rku-rb" data-btn="ch_up">${_svg('dir_up',18)}</button>
      <span class="rku-rklbl">CH</span>
      <button class="rku-rb" data-btn="ch_down">${_svg('dir_down',18)}</button>
    </div>
  </div>
  <div class="act-pills" id="hcv2-pills">${appsHtml}</div>
  ${this._numpadHtml()}
  ${this._conf._err ? `<div class="conf-err">Conf: ${_e(this._conf._err)}</div>` : ''}
</div></div>${this._sheetHtml()}`;
        this._bindEvents(); this._updateLive();
    }

    _cssRoku() { return `<style>
:host{display:block;}*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
button{background:none;border:none;cursor:pointer;font:inherit;color:inherit;}
.card{background:var(--ha-card-background,var(--card-background-color,#0f1117));padding:8px;border-radius:var(--ha-card-border-radius,12px);}
.rku-remote{background:linear-gradient(180deg,#1a1a2e 0%,#111122 100%);border-radius:48px;padding:20px 16px 24px;max-width:276px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:12px;box-shadow:0 8px 28px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.04);}
.rku-topbar{width:100%;display:flex;align-items:center;justify-content:space-between;padding:0 4px;}
.rku-circ{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;color:#8b8ba0;transition:background .12s;}
.rku-circ:active{background:rgba(255,255,255,.13);}
.rku-st{flex:1;text-align:center;font-size:10px;font-weight:600;color:#4a4a6a;padding:0 4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.rku-r2{display:flex;gap:10px;width:100%;}
.rku-b2{flex:1;height:50px;border-radius:16px;background:rgba(255,255,255,.055);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#8b8ba0;font-size:9px;font-weight:700;letter-spacing:.3px;transition:background .12s;}
.rku-b2:active{background:rgba(255,255,255,.12);}
.rku-pad-wrap{display:flex;justify-content:center;}
.rku-pad{width:218px;height:218px;border-radius:50%;background:radial-gradient(circle,#28284a 55%,#1e1e38 100%);box-shadow:inset 0 2px 8px rgba(0,0,0,.5),0 2px 8px rgba(0,0,0,.4);display:grid;grid-template-rows:1fr auto 1fr;align-items:center;justify-items:center;}
.rku-mid{display:flex;align-items:center;width:100%;justify-content:space-between;padding:0 8px;}
.rku-dir{width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#9090b8;transition:background .1s;}
.rku-dir:active{background:rgba(139,92,246,.2);}
.rku-ok{flex:1;height:90px;border-radius:20px;background:linear-gradient(180deg,#3a2d6e 0%,#2e2258 100%);color:#e0d8ff;font-size:16px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 0 rgba(139,92,246,.3);transition:background .1s;margin:0 6px;}
.rku-ok:active{background:linear-gradient(180deg,#452f80 0%,#38266a 100%);}
.rku-r3{display:flex;gap:8px;width:100%;}
.rku-b3{flex:1;height:52px;border-radius:16px;background:rgba(255,255,255,.055);display:flex;align-items:center;justify-content:center;color:#8b8ba0;transition:background .12s;}
.rku-b3:active{background:rgba(255,255,255,.12);}
.rku-play{background:rgba(139,92,246,.15);color:#8b5cf6;}
.rku-play:active{background:rgba(139,92,246,.25);}
.rku-volch{display:flex;gap:10px;align-items:center;width:100%;}
.rku-rck{flex:1;display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,.055);border-radius:20px;overflow:hidden;}
.rku-rb{width:100%;height:40px;display:flex;align-items:center;justify-content:center;color:#8b8ba0;transition:background .1s;}
.rku-rb:active{background:rgba(255,255,255,.10);}
.rku-rklbl{font-size:9px;font-weight:700;letter-spacing:.5px;color:#4a4a6a;line-height:1;padding:2px 0;}
.rku-mute{width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,.055);display:flex;align-items:center;justify-content:center;color:#8b8ba0;transition:background .12s;}
.rku-mute:active{background:rgba(255,255,255,.12);}
.act-pills{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;width:100%;padding-top:2px;}
.act-pill{height:34px;padding:0 14px;border-radius:17px;display:flex;align-items:center;font-size:12px;font-weight:700;white-space:nowrap;cursor:pointer;user-select:none;background:rgba(255,255,255,.07);color:#606080;transition:all .15s;}
.act-pill--on{background:var(--primary-color,#8b5cf6);color:#fff;box-shadow:0 2px 10px color-mix(in srgb,var(--primary-color,#8b5cf6) 40%,transparent);}
.act-pill:active{opacity:.75;}
.conf-err{font-size:11px;color:#ef4444;padding:4px 8px;background:rgba(239,68,68,.06);border-radius:8px;}
${this._sheetCss()}${this._numpadCss()}</style>`; }

// ============================================================================
// NVIDIA Shield Skin (Shield Remote Style 2, green accents)
// ============================================================================

    _renderNvidia() {
        const acts = this._activities();
        const appsHtml = acts.map(a => {
            const ico = a.icon ? `<ha-icon icon="${_e(a.icon)}" style="--mdc-icon-size:15px;margin-right:4px;vertical-align:middle;"></ha-icon>` : '';
            return `<div class="act-pill" data-act="${_e(a.name)}">${ico}${_e(a.label)}</div>`;
        }).join('');
        this.shadowRoot.innerHTML = this._cssNvidia() + `
<div class="card"><div class="nvd-remote" id="hcv2-card">
  <div class="nvd-topbar">
    <button class="nvd-b2" data-btn="off">${_svg('power',18)}<span>Power</span></button>
    <span class="nvd-st" id="hcv2-status"></span>
    <button class="nvd-b2" data-btn="menu">${_svg('menu',18)}<span>Menu</span></button>
  </div>
  <div class="nvd-devrow">
    <button class="nvd-circ" id="hcv2-devbtn">${_svg('devices',20)}</button>
  </div>
  <div class="nvd-pad-wrap"><div class="nvd-pad">
    <button class="nvd-dir" data-btn="dir_up">${_svg('dir_up',26)}</button>
    <div class="nvd-mid">
      <button class="nvd-dir" data-btn="dir_left">${_svg('dir_left',26)}</button>
      <button class="nvd-ok" data-btn="ok">OK</button>
      <button class="nvd-dir" data-btn="dir_right">${_svg('dir_right',26)}</button>
    </div>
    <button class="nvd-dir" data-btn="dir_down">${_svg('dir_down',26)}</button>
  </div></div>
  <div class="nvd-r2">
    <button class="nvd-b2" data-btn="back">${_svg('back',22)}<span>Back</span></button>
    <button class="nvd-b2" data-btn="exit">${_svg('exit',22)}<span>Home</span></button>
  </div>
  <div class="nvd-tp">
    <button class="nvd-tp-btn" data-btn="rewind">${_svg('rewind',22)}</button>
    <button class="nvd-tp-btn nvd-play" data-btn="play">${_svg('play',28)}</button>
    <button class="nvd-tp-btn" data-btn="fast_forward">${_svg('fwd',22)}</button>
  </div>
  <div class="nvd-volch" id="hcv2-volch">
    <div class="nvd-rck">
      <button class="nvd-rb" data-btn="vol_up">${_svg('vol_up',18)}</button>
      <span class="nvd-rklbl">VOL</span>
      <button class="nvd-rb" data-btn="vol_down">${_svg('vol_down',18)}</button>
    </div>
    <button class="nvd-mute" data-btn="mute">${_svg('mute',22)}</button>
    <div class="nvd-rck">
      <button class="nvd-rb" data-btn="ch_up">${_svg('dir_up',18)}</button>
      <span class="nvd-rklbl">CH</span>
      <button class="nvd-rb" data-btn="ch_down">${_svg('dir_down',18)}</button>
    </div>
  </div>
  <div class="act-pills" id="hcv2-pills">${appsHtml}</div>
  ${this._numpadHtml()}
  ${this._conf._err ? `<div class="conf-err">Conf: ${_e(this._conf._err)}</div>` : ''}
</div></div>${this._sheetHtml()}`;
        this._bindEvents(); this._updateLive();
    }

    _cssNvidia() { return `<style>
:host{display:block;}*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
button{background:none;border:none;cursor:pointer;font:inherit;color:inherit;}
.card{background:var(--ha-card-background,var(--card-background-color,#000));padding:8px;border-radius:var(--ha-card-border-radius,12px);}
.nvd-remote{background:linear-gradient(180deg,#141414 0%,#0a0a0a 100%);border-radius:22px;padding:18px 16px 22px;max-width:280px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:12px;box-shadow:0 8px 28px rgba(0,0,0,.7),inset 0 1px 0 rgba(118,185,0,.1);}
.nvd-topbar{width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;}
.nvd-b2{flex:1;height:46px;border-radius:12px;background:rgba(255,255,255,.055);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#888;font-size:8px;font-weight:700;letter-spacing:.3px;transition:background .12s;}
.nvd-b2:active{background:rgba(255,255,255,.12);}
.nvd-st{flex:2;text-align:center;font-size:10px;font-weight:600;color:#404040;padding:0 4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.nvd-devrow{display:flex;justify-content:center;}
.nvd-circ{width:44px;height:44px;border-radius:50%;background:rgba(118,185,0,.12);display:flex;align-items:center;justify-content:center;color:#76b900;transition:background .12s;}
.nvd-circ:active{background:rgba(118,185,0,.22);}
.nvd-pad-wrap{display:flex;justify-content:center;}
.nvd-pad{width:214px;height:214px;border-radius:16px;background:radial-gradient(circle,#1e1e1e 50%,#141414 100%);box-shadow:inset 0 2px 8px rgba(0,0,0,.6),0 0 0 1px rgba(118,185,0,.08);display:grid;grid-template-rows:1fr auto 1fr;align-items:center;justify-items:center;}
.nvd-mid{display:flex;align-items:center;width:100%;justify-content:space-between;padding:0 8px;}
.nvd-dir{width:58px;height:58px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#b0b0b0;transition:background .1s;}
.nvd-dir:active{background:rgba(118,185,0,.15);}
.nvd-ok{flex:1;height:88px;border-radius:16px;background:linear-gradient(180deg,rgba(118,185,0,.18) 0%,rgba(118,185,0,.08) 100%);color:#76b900;font-size:16px;font-weight:900;display:flex;align-items:center;justify-content:center;border:1px solid rgba(118,185,0,.2);transition:background .1s;margin:0 6px;}
.nvd-ok:active{background:linear-gradient(180deg,rgba(118,185,0,.28) 0%,rgba(118,185,0,.15) 100%);}
.nvd-r2{display:flex;gap:8px;width:100%;}
.nvd-tp{display:flex;gap:8px;width:100%;}
.nvd-tp-btn{flex:1;height:50px;border-radius:12px;background:rgba(255,255,255,.055);display:flex;align-items:center;justify-content:center;color:#888;transition:background .12s;}
.nvd-tp-btn:active{background:rgba(255,255,255,.12);}
.nvd-play{background:rgba(118,185,0,.12);color:#76b900;}
.nvd-play:active{background:rgba(118,185,0,.22);}
.nvd-volch{display:flex;gap:10px;align-items:center;width:100%;}
.nvd-rck{flex:1;display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,.055);border-radius:16px;overflow:hidden;}
.nvd-rb{width:100%;height:40px;display:flex;align-items:center;justify-content:center;color:#888;transition:background .1s;}
.nvd-rb:active{background:rgba(255,255,255,.10);}
.nvd-rklbl{font-size:9px;font-weight:700;letter-spacing:.5px;color:#3a3a3a;line-height:1;padding:2px 0;}
.nvd-mute{width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,.055);display:flex;align-items:center;justify-content:center;color:#888;transition:background .12s;}
.nvd-mute:active{background:rgba(255,255,255,.12);}
.act-pills{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;width:100%;padding-top:2px;}
.act-pill{height:34px;padding:0 14px;border-radius:17px;display:flex;align-items:center;font-size:12px;font-weight:700;white-space:nowrap;cursor:pointer;user-select:none;background:rgba(255,255,255,.06);color:#606060;transition:all .15s;}
.act-pill--on{background:var(--primary-color,#76b900);color:#fff;box-shadow:0 2px 10px color-mix(in srgb,var(--primary-color,#76b900) 40%,transparent);}
.act-pill:active{opacity:.75;}
.conf-err{font-size:11px;color:#ef4444;padding:4px 8px;background:rgba(239,68,68,.06);border-radius:8px;}
${this._sheetCss()}${this._numpadCss()}</style>`; }

    // ── JVC Skin ─────────────────────────────────────────────────────────────

    _renderJvc() {
        const acts     = this._activities();
        const current  = this._lastAct || 'PowerOff';
        const appsHtml = acts.map(a => {
            const ico = a.icon ? `<ha-icon icon="${_e(a.icon)}" style="--mdc-icon-size:15px;margin-right:4px;vertical-align:middle;"></ha-icon>` : '';
            return `<div class="act-pill" data-act="${_e(a.name)}">${ico}${_e(a.label)}</div>`;
        }).join('');
        this.shadowRoot.innerHTML = this._cssJvc() + `
<div class="card"><div class="jvc-remote" id="hcv2-card">

  <div class="jvc-topbar">
    <button class="jvc-circ" data-btn="off">${_svg('power',20)}</button>
    <span class="jvc-status" id="hcv2-status"></span>
    <button class="jvc-circ" id="hcv2-devbtn">${_svg('devices',20)}</button>
  </div>

  <div class="jvc-ring-wrap"><div class="jvc-ring">
    <button class="jvc-dir" data-btn="dir_up">${_svg('dir_up',26)}</button>
    <div class="jvc-ring-mid">
      <button class="jvc-dir" data-btn="dir_left">${_svg('dir_left',26)}</button>
      <button class="jvc-ok" data-btn="ok">OK</button>
      <button class="jvc-dir" data-btn="dir_right">${_svg('dir_right',26)}</button>
    </div>
    <button class="jvc-dir" data-btn="dir_down">${_svg('dir_down',26)}</button>
  </div></div>

  <div class="jvc-row3">
    <button class="jvc-rnd" data-btn="back">${_svg('back',20)}<span>Back</span></button>
    <button class="jvc-rnd" data-btn="exit">${_svg('exit',20)}<span>Home</span></button>
    <button class="jvc-rnd" data-btn="menu">${_svg('menu',20)}<span>Menu</span></button>
  </div>

  <div class="jvc-row3">
    <button class="jvc-rnd" data-btn="rewind">${_svg('rewind',20)}</button>
    <button class="jvc-rnd jvc-play" data-btn="play">${_svg('play',26)}</button>
    <button class="jvc-rnd" data-btn="fast_forward">${_svg('fwd',20)}</button>
  </div>

  <div class="jvc-volch">
    <div class="jvc-rck">
      <button class="jvc-rb" data-btn="vol_up">${_svg('vol_up',18)}</button>
      <span class="jvc-rklbl">VOL</span>
      <button class="jvc-rb" data-btn="vol_down">${_svg('vol_down',18)}</button>
    </div>
    <button class="jvc-mute" data-btn="mute">${_svg('mute',22)}</button>
    <div class="jvc-rck">
      <button class="jvc-rb" data-btn="ch_up">${_svg('dir_up',18)}</button>
      <span class="jvc-rklbl">CH</span>
      <button class="jvc-rb" data-btn="ch_down">${_svg('dir_down',18)}</button>
    </div>
  </div>

  <div class="jvc-color">
    <button class="jvc-col c-red"  data-btn="red"></button>
    <button class="jvc-col c-green" data-btn="green"></button>
    <button class="jvc-col c-yellow" data-btn="yellow"></button>
    <button class="jvc-col c-blue"  data-btn="blue"></button>
  </div>

  <div class="act-pills" id="hcv2-pills">${appsHtml}</div>
  ${this._numpadHtml()}
  ${this._conf._err ? `<div class="conf-err">Conf: ${_e(this._conf._err)}</div>` : ''}
</div></div>${this._sheetHtml()}`;
        this._bindEvents(); this._updateLive();
    }

    _cssJvc() { return `<style>
:host{display:block;}*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
button{background:none;border:none;cursor:pointer;font:inherit;color:inherit;}
.card{background:var(--ha-card-background,var(--card-background-color,#000));padding:8px;border-radius:var(--ha-card-border-radius,12px);}
.jvc-remote{background:linear-gradient(180deg,#252525 0%,#1a1a1a 100%);border-radius:28px;padding:18px 16px 22px;max-width:272px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:12px;box-shadow:0 8px 32px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.06);}
.jvc-topbar{width:100%;display:flex;align-items:center;justify-content:space-between;padding:0 2px;}
.jvc-status{flex:1;text-align:center;font-size:10px;font-weight:600;color:#505050;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 4px;}
.jvc-circ{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center;color:#909090;transition:background .12s;}
.jvc-circ:active{background:rgba(255,255,255,.14);}
.jvc-ring-wrap{display:flex;justify-content:center;}
.jvc-ring{width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,#2e2e2e 52%,#222 100%);box-shadow:inset 0 2px 10px rgba(0,0,0,.6),0 4px 12px rgba(0,0,0,.5);display:grid;grid-template-rows:1fr auto 1fr;align-items:center;justify-items:center;}
.jvc-ring-mid{display:flex;align-items:center;width:100%;justify-content:space-between;padding:0 6px;}
.jvc-dir{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#c0c0c0;transition:background .1s;}
.jvc-dir:active{background:rgba(255,255,255,.12);}
.jvc-ok{flex:1;height:80px;border-radius:18px;background:linear-gradient(180deg,#3c3c3c 0%,#2c2c2c 100%);color:#f0f0f0;font-size:15px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 0 rgba(255,255,255,.08);transition:background .1s;margin:0 4px;}
.jvc-ok:active{background:linear-gradient(180deg,#484848 0%,#383838 100%);}
.jvc-row3{display:flex;gap:8px;width:100%;}
.jvc-rnd{flex:1;height:48px;border-radius:14px;background:rgba(255,255,255,.065);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#a0a0a0;font-size:9px;font-weight:700;letter-spacing:.3px;transition:background .12s;}
.jvc-rnd:active{background:rgba(255,255,255,.13);}
.jvc-play{background:rgba(255,255,255,.10);color:#f0f0f0;}
.jvc-play:active{background:rgba(255,255,255,.18);}
.jvc-volch{display:flex;gap:10px;align-items:center;width:100%;}
.jvc-rck{flex:1;display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,.055);border-radius:16px;overflow:hidden;}
.jvc-rb{width:100%;height:40px;display:flex;align-items:center;justify-content:center;color:#888;transition:background .1s;}
.jvc-rb:active{background:rgba(255,255,255,.10);}
.jvc-rklbl{font-size:9px;font-weight:700;letter-spacing:.5px;color:#3a3a3a;line-height:1;padding:2px 0;}
.jvc-mute{width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,.055);display:flex;align-items:center;justify-content:center;color:#888;transition:background .12s;}
.jvc-mute:active{background:rgba(255,255,255,.12);}
.jvc-color{display:flex;gap:8px;justify-content:center;width:100%;}
.jvc-col{height:28px;border-radius:8px;flex:1;max-width:52px;transition:opacity .1s;}
.jvc-col:active{opacity:.7;}
.c-red{background:#e53935;} .c-green{background:#43a047;} .c-yellow{background:#fdd835;} .c-blue{background:#1e88e5;}
.act-pills{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;width:100%;padding-top:2px;}
.act-pill{height:34px;padding:0 14px;border-radius:17px;display:flex;align-items:center;font-size:12px;font-weight:700;white-space:nowrap;cursor:pointer;user-select:none;background:rgba(255,255,255,.07);color:#707070;transition:all .15s;}
.act-pill--on{background:var(--primary-color,#e53935);color:#fff;box-shadow:0 2px 10px color-mix(in srgb,var(--primary-color,#e53935) 40%,transparent);}
.act-pill:active{opacity:.75;}
.conf-err{font-size:11px;color:#ef4444;padding:4px 8px;background:rgba(239,68,68,.06);border-radius:8px;}
${this._sheetCss()}${this._numpadCss()}</style>`; }

    // ── Onn. Skin (Google TV) ─────────────────────────────────────────────────

    _renderOnn() {
        const acts     = this._activities();
        const appsHtml = acts.map(a => {
            const ico = a.icon ? `<ha-icon icon="${_e(a.icon)}" style="--mdc-icon-size:15px;margin-right:4px;vertical-align:middle;"></ha-icon>` : '';
            return `<div class="act-pill" data-act="${_e(a.name)}">${ico}${_e(a.label)}</div>`;
        }).join('');
        this.shadowRoot.innerHTML = this._cssOnn() + `
<div class="card"><div class="onn-remote" id="hcv2-card">

  <div class="onn-topbar">
    <button class="onn-circ onn-pwr" data-btn="off">${_svg('power',18)}</button>
    <span class="onn-status" id="hcv2-status"></span>
    <button class="onn-circ onn-src" data-btn="source">${_svg('source',18)}</button>
  </div>

  <div class="onn-kb-row">
    <button class="onn-kb" id="hcv2-devbtn">${_svg('devices',20)}</button>
  </div>

  <div class="onn-ring-wrap"><div class="onn-ring">
    <button class="onn-dir" data-btn="dir_up">${_svg('dir_up',26)}</button>
    <div class="onn-ring-mid">
      <button class="onn-dir" data-btn="dir_left">${_svg('dir_left',26)}</button>
      <button class="onn-ok" data-btn="ok">OK</button>
      <button class="onn-dir" data-btn="dir_right">${_svg('dir_right',26)}</button>
    </div>
    <button class="onn-dir" data-btn="dir_down">${_svg('dir_down',26)}</button>
  </div></div>

  <div class="onn-row3">
    <button class="onn-b3" data-btn="back">${_svg('back',20)}<span>Back</span></button>
    <button class="onn-b3" data-btn="exit">${_svg('exit',20)}<span>Home</span></button>
    <button class="onn-b3" data-btn="menu">${_svg('menu',20)}<span>Menu</span></button>
  </div>

  <div class="onn-volch">
    <div class="onn-rck">
      <button class="onn-rb" data-btn="vol_up">${_svg('vol_up',18)}</button>
      <span class="onn-rklbl">VOL</span>
      <button class="onn-rb" data-btn="vol_down">${_svg('vol_down',18)}</button>
    </div>
    <button class="onn-mute" data-btn="mute">${_svg('mute',22)}</button>
    <div class="onn-rck">
      <button class="onn-rb" data-btn="ch_up">${_svg('dir_up',18)}</button>
      <span class="onn-rklbl">CH</span>
      <button class="onn-rb" data-btn="ch_down">${_svg('dir_down',18)}</button>
    </div>
  </div>

  <div class="act-pills" id="hcv2-pills">${appsHtml}</div>
  ${this._numpadHtml()}
  ${this._conf._err ? `<div class="conf-err">Conf: ${_e(this._conf._err)}</div>` : ''}
</div></div>${this._sheetHtml()}`;
        this._bindEvents(); this._updateLive();
    }

    _cssOnn() { return `<style>
:host{display:block;}*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
button{background:none;border:none;cursor:pointer;font:inherit;color:inherit;}
.card{background:var(--ha-card-background,var(--card-background-color,#f5f5f0));padding:8px;border-radius:var(--ha-card-border-radius,12px);}
.onn-remote{background:linear-gradient(180deg,#eeeeec 0%,#e4e4e2 100%);border-radius:36px;padding:18px 16px 22px;max-width:272px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:12px;box-shadow:0 4px 20px rgba(0,0,0,.14),inset 0 1px 0 rgba(255,255,255,.9);}
.onn-topbar{width:100%;display:flex;align-items:center;justify-content:space-between;padding:0 4px;}
.onn-status{flex:1;text-align:center;font-size:10px;font-weight:600;color:#9aa0a6;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 4px;}
.onn-circ{width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.07);display:flex;align-items:center;justify-content:center;color:#5f6368;transition:background .12s;}
.onn-circ:active{background:rgba(0,0,0,.14);}
.onn-pwr{color:#e53935;}
.onn-kb-row{display:flex;justify-content:center;}
.onn-kb{width:42px;height:42px;border-radius:50%;background:rgba(0,0,0,.07);display:flex;align-items:center;justify-content:center;color:#5f6368;transition:background .12s;}
.onn-kb:active{background:rgba(0,0,0,.14);}
.onn-ring-wrap{display:flex;justify-content:center;}
.onn-ring{width:204px;height:204px;border-radius:50%;background:radial-gradient(circle,#383838 52%,#2a2a2a 100%);box-shadow:0 4px 14px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.06);display:grid;grid-template-rows:1fr auto 1fr;align-items:center;justify-items:center;}
.onn-ring-mid{display:flex;align-items:center;width:100%;justify-content:space-between;padding:0 6px;}
.onn-dir{width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#c0c0c0;transition:background .1s;}
.onn-dir:active{background:rgba(255,255,255,.12);}
.onn-ok{flex:1;height:84px;border-radius:18px;background:linear-gradient(180deg,#484848 0%,#363636 100%);color:#f5f5f5;font-size:15px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 0 rgba(255,255,255,.08);transition:background .1s;margin:0 4px;}
.onn-ok:active{background:linear-gradient(180deg,#545454 0%,#424242 100%);}
.onn-row3{display:flex;gap:8px;width:100%;}
.onn-b3{flex:1;height:50px;border-radius:14px;background:rgba(0,0,0,.06);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#5f6368;font-size:9px;font-weight:700;letter-spacing:.3px;transition:background .12s;}
.onn-b3:active{background:rgba(0,0,0,.12);}
.onn-volch{display:flex;gap:10px;align-items:center;width:100%;}
.onn-rck{flex:1;display:flex;flex-direction:column;align-items:center;background:rgba(0,0,0,.06);border-radius:16px;overflow:hidden;}
.onn-rb{width:100%;height:40px;display:flex;align-items:center;justify-content:center;color:#5f6368;transition:background .1s;}
.onn-rb:active{background:rgba(0,0,0,.08);}
.onn-rklbl{font-size:9px;font-weight:700;letter-spacing:.5px;color:#9aa0a6;line-height:1;padding:2px 0;}
.onn-mute{width:50px;height:50px;border-radius:50%;background:rgba(0,0,0,.06);display:flex;align-items:center;justify-content:center;color:#5f6368;transition:background .12s;}
.onn-mute:active{background:rgba(0,0,0,.12);}
.act-pills{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;width:100%;padding-top:2px;}
.act-pill{height:34px;padding:0 14px;border-radius:17px;display:flex;align-items:center;font-size:12px;font-weight:700;white-space:nowrap;cursor:pointer;user-select:none;background:rgba(0,0,0,.07);color:#5f6368;transition:all .15s;}
.act-pill--on{background:var(--primary-color,#4285f4);color:#fff;box-shadow:0 2px 10px color-mix(in srgb,var(--primary-color,#4285f4) 40%,transparent);}
.act-pill:active{opacity:.75;}
.conf-err{font-size:11px;color:#ef4444;padding:4px 8px;background:rgba(239,68,68,.06);border-radius:8px;}
${this._sheetCss()}${this._numpadCss()}</style>`; }

} // end HarmonyCardV2

// ============================================================================
// Card Editor — GUI-Konfiguration
// ============================================================================

class HarmonyCardV2Editor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._config         = {};
        this._hass           = null;
        this._cmdOptions     = [];
        this._contextOptions = [{ label: 'Globale Standardbelegung', value: 'global' }];
        this._activitiesList = [];
        this._currentContext = 'global';
        this._currentAutoDevice = '';
        this._confData       = null;
        this._loading        = false;
        this._loaded         = false;
        this._loadError      = null;
        this._openSections   = new Set(['sec-hub']);
        this._edActiveHub    = 0;
        this._slotCounts     = { act: null, bot: null };
        this._leMode         = 'tv';
        this._leLayouts      = {};
        this._buttonIds = [
            'dvr_1','dvr_2','dvr_3',
            'red','green','yellow','blue',
            'exit','menu','back','ok',
            'dir_up','dir_down','dir_left','dir_right',
            'vol_up','vol_down','mute','ch_up','ch_down',
            'skip_back','rewind','play','pause','fast_forward','skip_forward',
            'record','stop',
            'num_1','num_2','num_3','num_4','num_5','num_6',
            'num_7','num_8','num_9','num_0','num_minus','num_enter',
        ];
    }

    set hass(h) {
        this._hass = h;
        this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(el => { el.hass = h; });
        this.shadowRoot.querySelectorAll('ha-selector').forEach(el => { el.hass = h; });
    }

    setConfig(config) {
        this._config = JSON.parse(JSON.stringify(config || {}));
        if (!this._config.buttons) this._config.buttons = { global: {} };
        if (!this._leLayouts) this._leLayouts = {};

        // Preserve open/closed state of sections before rebuild
        this.shadowRoot.querySelectorAll('details').forEach(d => {
            if (d.id) { d.open ? this._openSections.add(d.id) : this._openSections.delete(d.id); }
        });

        if (this._loaded) { this._buildDOM(); return; }
        if (this._loading) return;
        this._loading = true;
        this._fetchConf()
            .then(() => { this._loading = false; this._loaded = true; this._buildDOM(); })
            .catch(() => { this._loading = false; this._loaded = true; this._buildDOM(); });
    }

    // Editor display-canvas size (mirrors HarmonyCardV2._dispW/_dispH)
    get _dispW() {
        const o = this._config && Number(this._config.display_offset_w);
        return HCV2_BASE_W + (Number.isFinite(o) ? o : HCV2_DEFAULT_OFFSET_W);
    }
    get _dispH() {
        const o = this._config && Number(this._config.display_offset_h);
        return HCV2_BASE_H + (Number.isFinite(o) ? o : HCV2_DEFAULT_OFFSET_H);
    }

    async _fetchConf() {
        // Use the active hub's config_file if available
        const hub = this._edCurrentHub();
        const url = hub.config_file || this._config.config_file || '/local/harmony_12563120.conf';
        this._loadError = null;
        try {
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            this._confData       = data;
            this._cmdOptions     = [];
            this._contextOptions = [{ label: 'Globale Standardbelegung', value: 'global' }];
            this._activitiesList = [];
            // Reset device filter if device no longer exists in new conf
            if (this._currentAutoDevice && !(data.Devices && data.Devices[this._currentAutoDevice])) {
                this._currentAutoDevice = '';
            }

            if (data.Activities) {
                const ids = Object.keys(data.Activities).filter(id => id !== '-1');
                ids.sort((a, b) => { const an=parseInt(a,10),bn=parseInt(b,10); return(isNaN(an)||isNaN(bn))?String(a).localeCompare(String(b)):an-bn; });
                ids.forEach(id => {
                    const name = data.Activities[id];
                    this._activitiesList.push({ name, actionValue: 'activity:::' + name });
                    this._cmdOptions.push({ label: name + ' (Aktivität)', value: 'activity:::' + name });
                    this._contextOptions.push({ label: 'Aktion: ' + name, value: name });
                });
            }
            if (data.Devices) {
                Object.keys(data.Devices).forEach(devName => {
                    const dev   = data.Devices[devName];
                    if (!dev || !Array.isArray(dev.commands)) return;
                    const short = devName.length > 22 ? devName.substring(0,22) + '…' : devName;
                    dev.commands.forEach(cmd => {
                        this._cmdOptions.push({ label: cmd + '  (' + short + ')', value: 'command:::' + dev.id + ':::' + cmd });
                    });
                });
            }
        } catch (err) {
            this._loadError = 'Conf nicht geladen: ' + url + ' — Datei nach /config/www/ kopieren.';
        }
    }

    // ---- Multi-hub helpers ----

    _edGetHubs() {
        const c = this._config || {};
        if (Array.isArray(c.hubs) && c.hubs.length > 0) return c.hubs.slice(0, HCV2_MAX_HUBS);
        if (c.entity || c.config_file) {
            const hub = { name: 'Hub' };
            HCV2_HUB_FIELDS.forEach(f => { if (c[f] !== undefined) hub[f] = c[f]; });
            return [hub];
        }
        return [{ name: 'Hub 1', entity: '', config_file: '/local/harmony.conf' }];
    }

    _edPatchHub(idx, field, value) {
        const hubs = this._edGetHubs().slice();
        const cur  = { ...(hubs[idx] || {}) };
        if (value === '' || value == null) delete cur[field];
        else cur[field] = value;
        hubs[idx] = cur;
        this._up('hubs', hubs);
    }

    _edCurrentHubIdx() {
        const c = this._config || {};
        if (Array.isArray(c.hubs) && c.hubs.length > 0) {
            return Math.max(0, Math.min(c.hubs.length - 1, this._edActiveHub || 0));
        }
        return -1;
    }

    _edCurrentHub() {
        const c = this._config || {};
        const idx = this._edCurrentHubIdx();
        if (idx < 0) return c;   // legacy single-hub: top-level is the hub
        return c.hubs[idx] || {};
    }

    _edSetHubField(field, value) {
        if (this._edCurrentHubIdx() < 0) {
            const next = JSON.parse(JSON.stringify(this._config || {}));
            if (value === '' || value == null) delete next[field];
            else next[field] = value;
            this._config = next; this._dispatch();
        } else {
            this._edPatchHub(this._edCurrentHubIdx(), field, value);
        }
    }

    _edTransformHubField(field, transformer) {
        if (this._edCurrentHubIdx() < 0) {
            const next = JSON.parse(JSON.stringify(this._config || {}));
            const newVal = transformer(next[field]);
            if (newVal === undefined || newVal === null ||
                (typeof newVal === 'object' && !Array.isArray(newVal) && Object.keys(newVal).length === 0) ||
                (Array.isArray(newVal) && newVal.length === 0)) {
                delete next[field];
            } else {
                next[field] = newVal;
            }
            this._config = next; this._dispatch();
        } else {
            const idx  = this._edCurrentHubIdx();
            const hubs = JSON.parse(JSON.stringify((this._config && this._config.hubs) || []));
            if (!hubs[idx]) hubs[idx] = {};
            const newVal = transformer(hubs[idx][field]);
            if (newVal === undefined || newVal === null ||
                (typeof newVal === 'object' && !Array.isArray(newVal) && Object.keys(newVal).length === 0) ||
                (Array.isArray(newVal) && newVal.length === 0)) {
                delete hubs[idx][field];
            } else {
                hubs[idx][field] = newVal;
            }
            this._up('hubs', hubs);
        }
    }

    // Banner shown inside per-hub sections to indicate which hub is being edited
    _edHubBanner() {
        const c = this._config || {};
        if (!Array.isArray(c.hubs) || c.hubs.length < 2) return null;
        const idx   = this._edCurrentHubIdx();
        const hub   = c.hubs[idx] || {};
        const color = hcv2HubColor(hub, idx);
        const banner = document.createElement('div');
        banner.style.cssText = `display:flex;align-items:center;gap:8px;padding:6px 10px;margin-bottom:10px;background:${color}22;border-left:3px solid ${color};border-radius:4px;font-size:12px;`;
        const s1 = document.createElement('span'); s1.style.fontWeight = '600'; s1.textContent = 'Bearbeitet Hub:';
        const s2 = document.createElement('span'); s2.textContent = hub.name || 'Hub ' + (idx + 1);
        const s3 = document.createElement('span'); s3.style.opacity = '0.6'; s3.textContent = '(Auswahl unter Hub-Konfiguration)';
        banner.appendChild(s1); banner.appendChild(s2); banner.appendChild(s3);
        return banner;
    }

    _buildDOM() {
        const root = this.shadowRoot;
        root.innerHTML = `<style>
:host{display:block;}*,*::before,*::after{box-sizing:border-box;}
.edt{display:flex;flex-direction:column;gap:12px;padding:4px 0;}
details{border:1px solid var(--divider-color,#ccc);border-radius:8px;background:var(--card-background-color,#fff);overflow:visible;}
summary{cursor:pointer;padding:12px;outline:none;font-weight:600;list-style:none;display:flex;align-items:center;gap:8px;color:var(--primary-text-color);}
summary::-webkit-details-marker{display:none;}
.chev{transition:transform .2s;color:var(--secondary-text-color,#888);}
details[open] .chev{transform:rotate(90deg);}
.body{padding:0 12px 12px;display:flex;flex-direction:column;gap:12px;}
.btn-row{display:grid;gap:8px;align-items:center;grid-template-columns:130px 1fr;}
.lbl{font-size:12px;color:var(--secondary-text-color,#888);margin-bottom:2px;font-weight:500;}
.btn-label{font-family:monospace;font-size:13px;color:var(--primary-text-color);}
.ctx-row{display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;}
.ctx-row>*:first-child{flex:1;min-width:160px;}
.native-sel{width:100%;height:44px;padding:4px 8px;border:1px solid var(--divider-color,#888);border-radius:4px;background:var(--input-fill-color,var(--card-background-color,#fff));color:var(--primary-text-color,#212121);font-size:14px;font-family:inherit;cursor:pointer;box-sizing:border-box;}
.auto-btn{background:var(--secondary-background-color,#e8e8e8);color:var(--primary-text-color);border:1px solid var(--divider-color,#ccc);border-radius:4px;padding:8px 14px;cursor:pointer;font-weight:600;display:inline-flex;align-items:center;gap:6px;font-size:13px;}
.auto-btn:hover{background:var(--primary-color,#03a9f4);color:#fff;}
.err{padding:12px;border-radius:6px;background:rgba(204,0,0,.08);color:var(--error-color,#cc0000);font-size:.95em;}
ha-entity-picker,ha-textfield,ha-selector{display:block;width:100%;}
.conf-row{display:flex;gap:8px;align-items:flex-end;}
.conf-row ha-textfield{flex:1;}
.reload-btn{height:56px;padding:0 14px;border-radius:4px;border:1px solid var(--divider-color,#ccc);background:var(--secondary-background-color,#e8e8e8);cursor:pointer;white-space:nowrap;font-size:13px;flex-shrink:0;}
.toggle-row{display:flex;align-items:center;gap:10px;padding:4px 0;}
.toggle-row label{font-size:14px;color:var(--primary-text-color);cursor:pointer;}
.hint{font-size:12px;color:var(--secondary-text-color,#888);padding:4px 0;}
.hc-text-input{width:100%;padding:8px;border:1px solid var(--divider-color,#ccc);border-radius:4px;background:var(--input-fill-color,var(--card-background-color,#fff));color:var(--primary-text-color);font-size:14px;font-family:inherit;box-sizing:border-box;height:44px;outline:none;}
.hc-text-input:focus{border-color:var(--primary-color,#03a9f4);}
.add-btn{background:var(--primary-color,#03a9f4);color:#fff;border:none;border-radius:4px;padding:8px 14px;cursor:pointer;font-weight:600;align-self:flex-start;display:inline-flex;align-items:center;gap:6px;}
.del-btn{background:transparent;border:none;color:var(--error-color,#cc0000);cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;}
ha-checkbox{display:inline-flex;vertical-align:middle;}
/* Searchable dropdown */
.sel-wrap{position:relative;}
.sel-input{width:100%;height:44px;padding:4px 10px;border:1px solid var(--divider-color,#888);border-radius:4px;background:var(--input-fill-color,var(--card-background-color,#fff));color:var(--primary-text-color,#212121);font-size:13px;font-family:inherit;box-sizing:border-box;cursor:text;outline:none;}
.sel-input:focus{border-color:var(--primary-color,#03a9f4);}
.sel-drop{display:none;position:absolute;top:100%;left:0;right:0;z-index:9999;max-height:240px;overflow-y:auto;background:var(--card-background-color,#fff);border:1px solid var(--divider-color,#888);border-top:none;border-radius:0 0 4px 4px;box-shadow:0 4px 12px rgba(0,0,0,.18);}
.sel-grp{padding:5px 10px 3px;font-size:11px;font-weight:700;color:var(--secondary-text-color,#888);text-transform:uppercase;letter-spacing:.06em;background:var(--primary-background-color,#f5f5f5);position:sticky;top:0;z-index:1;}
.sel-item{padding:7px 12px;font-size:13px;color:var(--primary-text-color,#212121);cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.sel-item:hover,.sel-item[data-sel]{background:var(--secondary-background-color,#e8e8e8);}
.sel-empty{padding:10px 12px;font-size:13px;color:var(--secondary-text-color,#888);font-style:italic;}
</style><div class="edt" id="edt-root"></div>`;

        const edtRoot = root.getElementById('edt-root');
        if (this._loadError) {
            const e = document.createElement('div');
            e.className = 'err'; e.textContent = this._loadError;
            edtRoot.appendChild(e);
        }
        edtRoot.appendChild(this._sectionLayout());
        edtRoot.appendChild(this._sectionHub());

        // Per-hub sections wrapped in a colored border
        const hubs    = this._edGetHubs();
        const idx     = this._edCurrentHubIdx();
        const hubObj  = (idx >= 0 && hubs[idx]) ? hubs[idx] : (hubs[0] || {});
        const hubColor = hcv2HubColor(hubObj, idx >= 0 ? idx : 0);
        const perHubWrap = document.createElement('div');
        perHubWrap.style.cssText = 'border:2px solid ' + hubColor + ';border-radius:12px;padding:8px 8px 6px;margin-top:6px;display:flex;flex-direction:column;gap:12px;background:' + hubColor + '10;';
        perHubWrap.appendChild(this._sectionEnigma2());
        perHubWrap.appendChild(this._sectionSlots('act', 'Aktivitäten-Slots (Hauptbereich)'));
        perHubWrap.appendChild(this._sectionButtons());
        perHubWrap.appendChild(this._sectionSlots('bot', 'Extra-Slots (Unten)'));
        edtRoot.appendChild(perHubWrap);

        edtRoot.appendChild(this._sectionSkin());
    }

    _details(id, title) {
        const det = document.createElement('details');
        det.id = id;
        if (this._openSections.has(id)) det.open = true;
        det.addEventListener('toggle', () => {
            det.open ? this._openSections.add(id) : this._openSections.delete(id);
        });
        const sum = document.createElement('summary');
        const chev = document.createElement('ha-icon');
        chev.setAttribute('icon', 'mdi:chevron-right');
        chev.className = 'chev';
        const span = document.createElement('span');
        span.textContent = title;
        sum.appendChild(chev); sum.appendChild(span);
        det.appendChild(sum);
        const body = document.createElement('div');
        body.className = 'body';
        det.appendChild(body);
        return { det, body };
    }

    _sectionHub() {
        const { det, body } = this._details('sec-hub', 'Hub-Konfiguration');
        const hubs = this._edGetHubs();
        if (!this._edActiveHub || this._edActiveHub >= hubs.length) this._edActiveHub = 0;

        // Tab row: one button per hub + add button
        const tabRow = document.createElement('div');
        tabRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:12px;';
        hubs.forEach((h, i) => {
            const isActive = (i === this._edActiveHub);
            const hc = hcv2HubColor(h, i);
            const tab = document.createElement('button');
            tab.type = 'button';
            tab.textContent = h.name || ('Hub ' + (i + 1));
            tab.style.cssText = 'padding:4px 12px;border-radius:14px;border:2px solid ' + hc + ';cursor:pointer;font-size:12px;font-weight:600;' +
                (isActive ? 'background:' + hc + ';color:#fff;' : 'background:' + hc + '15;color:inherit;');
            tab.onclick = () => {
                if (this._edActiveHub === i) return;
                this._edActiveHub = i;
                this._loaded = false; this._loading = false;
                this._buildDOM();
                this._fetchConf().then(() => { this._buildDOM(); });
            };
            tabRow.appendChild(tab);
        });
        if (hubs.length < HCV2_MAX_HUBS) {
            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.textContent = '+ Hub hinzufügen';
            addBtn.style.cssText = 'padding:4px 10px;border-radius:14px;border:1px dashed var(--divider-color,#ccc);background:transparent;color:inherit;cursor:pointer;font-size:12px;';
            addBtn.onclick = () => {
                const next = this._edGetHubs().slice();
                next.push({ name: 'Hub ' + (next.length + 1), entity: '', config_file: '/local/harmony.conf' });
                this._edActiveHub = next.length - 1;
                this._up('hubs', next);
                this._buildDOM();
            };
            tabRow.appendChild(addBtn);
        }
        body.appendChild(tabRow);

        const idx = this._edActiveHub;
        const hub = hubs[idx] || {};

        // Hub name
        const nameInp = document.createElement('input');
        nameInp.type = 'text'; nameInp.className = 'hc-text-input';
        nameInp.value = hub.name || ''; nameInp.placeholder = 'Hub-Name';
        nameInp.onchange = (e) => this._edPatchHub(idx, 'name', e.target.value);
        body.appendChild(this._labeled('Hub-Name (Anzeigename)', nameInp));

        // Entity picker
        body.appendChild(this._labeled('Harmony Hub Entität',
            this._haSelector({ entity: { domain: 'remote' } }, hub.entity || '',
                (v) => this._edPatchHub(idx, 'entity', v || ''))
        ));

        // Config file + reload button
        const confRow = document.createElement('div');
        confRow.style.cssText = 'display:flex;gap:8px;align-items:flex-end;';
        const cfgInp = document.createElement('input');
        cfgInp.type = 'text'; cfgInp.className = 'hc-text-input';
        cfgInp.style.flex = '1';
        cfgInp.value = hub.config_file || this._config.config_file || '';
        cfgInp.placeholder = 'z.B. /local/harmony_12563120.conf';
        cfgInp.onchange = (e) => this._edPatchHub(idx, 'config_file', e.target.value);
        const reloadBtn = document.createElement('button');
        reloadBtn.textContent = '↺ Neu laden'; reloadBtn.className = 'reload-btn'; reloadBtn.type = 'button';
        reloadBtn.onclick = () => {
            this._loaded = false; this._loadError = null; this._loading = true;
            this._fetchConf()
                .then(() => { this._loading = false; this._loaded = true; this._buildDOM(); })
                .catch(() => { this._loading = false; this._loaded = true; this._buildDOM(); });
        };
        confRow.appendChild(cfgInp); confRow.appendChild(reloadBtn);
        body.appendChild(this._labeled('Pfad zur Config-Datei', confRow));

        // Hub color picker
        const colorWrap = document.createElement('div');
        colorWrap.style.cssText = 'display:flex;align-items:center;gap:12px;margin-top:10px;';
        const colorLbl = document.createElement('label');
        colorLbl.style.cssText = 'font-size:12px;color:var(--secondary-text-color);';
        colorLbl.textContent = 'Hub-Farbe (Rahmen)';
        const colorInp = document.createElement('input');
        colorInp.type = 'color'; colorInp.value = hcv2HubColor(hub, idx);
        colorInp.style.cssText = 'width:50px;height:30px;border:1px solid var(--divider-color,#ccc);border-radius:4px;cursor:pointer;background:transparent;padding:0;';
        colorInp.oninput = (e) => this._edPatchHub(idx, 'color', e.target.value);
        colorWrap.appendChild(colorLbl); colorWrap.appendChild(colorInp);
        body.appendChild(colorWrap);

        // Remove hub button (only if more than one hub)
        if (hubs.length > 1) {
            const delBtn = document.createElement('button');
            delBtn.type = 'button'; delBtn.textContent = 'Diesen Hub entfernen';
            delBtn.style.cssText = 'margin-top:10px;padding:6px 12px;border-radius:6px;border:1px solid #c0392b;cursor:pointer;font-size:12px;background:transparent;color:#c0392b;align-self:flex-start;';
            delBtn.onclick = () => {
                const next = this._edGetHubs().filter((_, i) => i !== idx);
                this._edActiveHub = Math.max(0, idx - 1);
                this._up('hubs', next);
                this._buildDOM();
            };
            body.appendChild(delBtn);
        }

        return det;
    }

    // ---- Enigma2 / OpenWebIF section ----

    _sectionEnigma2() {
        const { det, body } = this._details('sec-enigma2', 'TV-Receiver (OpenWebIF / Enigma2)');
        const hub = this._edCurrentHub();

        const banner = this._edHubBanner();
        if (banner) body.appendChild(banner);

        const info = document.createElement('div');
        info.style.cssText = 'font-size:12px;color:var(--secondary-text-color);margin-bottom:10px;line-height:1.5;';
        info.innerHTML = '<b>Empfohlen:</b> HA REST-Sensor als Proxy (kein CORS nötig).<br>Alternativ: Direkt-URL mit CORS-Freigabe am Receiver.';
        body.appendChild(info);

        body.appendChild(this._labeled(
            'HA REST-Sensor für EPG-Daten (empfohlen)',
            this._haSelector(
                { entity: { domain: 'sensor' } },
                hub.enigma2_entity || '',
                (v) => this._edSetHubField('enigma2_entity', v || undefined)
            )
        ));

        const grabIntRow = document.createElement('div');
        grabIntRow.style.cssText = 'display:flex;align-items:center;gap:8px;margin-top:8px;';
        const grabIntField = document.createElement('input');
        grabIntField.type = 'number'; grabIntField.className = 'hc-text-input';
        grabIntField.min = '5'; grabIntField.step = '5';
        grabIntField.value = String(hub.epg_grab_interval || 30);
        grabIntField.onchange = (e) => {
            const v = Math.max(5, parseInt(e.target.value, 10) || 30);
            this._edSetHubField('epg_grab_interval', v);
        };
        const grabIntWrap = this._labeled('Hintergrundbild Refresh (Sekunden)', grabIntField);
        grabIntWrap.style.flex = '1';
        grabIntRow.appendChild(grabIntWrap);
        body.appendChild(grabIntRow);

        // Activity checkboxes
        const acts = this._allActivityNames();
        if (acts.length > 0) {
            const lbl = document.createElement('div');
            lbl.style.cssText = 'margin-top:12px;font-size:12px;color:var(--secondary-text-color);';
            lbl.textContent = 'Aktivitäten, die den Receiver nutzen:';
            body.appendChild(lbl);
            const current = Array.isArray(hub.enigma2_activities) ? hub.enigma2_activities : [];
            acts.forEach(actName => {
                const row = document.createElement('div');
                row.style.cssText = 'display:flex;align-items:center;gap:8px;margin-top:6px;';
                const cb = document.createElement('ha-checkbox');
                cb.checked = current.includes(actName);
                cb.onchange = (e) => this._patchEnigma2Activity(actName, e.target.checked);
                const span = document.createElement('span');
                span.style.cssText = 'font-size:14px;cursor:pointer;';
                span.textContent = actName;
                span.onclick = () => { cb.checked = !cb.checked; cb.onchange({ target: cb }); };
                row.appendChild(cb); row.appendChild(span);
                body.appendChild(row);
            });
        }
        return det;
    }

    _allActivityNames() {
        return (this._activitiesList || []).map(a => a.name).filter(Boolean);
    }

    _patchEnigma2Activity(actName, enabled) {
        this._edTransformHubField('enigma2_activities', (cur) => {
            let next = Array.isArray(cur) ? cur.slice() : [];
            if (enabled) { if (!next.includes(actName)) next.push(actName); }
            else         { next = next.filter(a => a !== actName); }
            return next;
        });
    }

    // ---- Slots section ----

    _sectionSlots(prefix, title) {
        const { det, body } = this._details('sec-slots-' + prefix, title);
        const banner = this._edHubBanner();
        if (banner) body.appendChild(banner);
        const slots = this._edCurrentHub().dynamic_slots || {};

        let lastFilled = 0;
        for (let i = 1; i <= 9; i++) {
            const s = slots[prefix + '_' + i];
            if (s && (s.text || s.icon || s.action)) lastFilled = i;
        }
        const actMin = (prefix === 'act' && this._activitiesList) ? this._activitiesList.length : 0;
        const baseMin = Math.max(actMin, lastFilled, 1);
        const explicit = this._slotCounts[prefix];
        const showCount = Math.min(9, explicit !== null ? Math.max(lastFilled, explicit) : baseMin);

        for (let i = 1; i <= showCount; i++) body.appendChild(this._slotRow(prefix, i));

        if (showCount < 9) {
            const add = document.createElement('button');
            add.type = 'button'; add.className = 'add-btn';
            const ic = document.createElement('ha-icon'); ic.setAttribute('icon', 'mdi:plus');
            add.appendChild(ic);
            add.appendChild(document.createTextNode(' Slot hinzufügen'));
            add.onclick = () => { this._slotCounts[prefix] = showCount + 1; this._buildDOM(); };
            body.appendChild(add);
        }
        return det;
    }

    _slotRow(prefix, idx) {
        const slotId = prefix + '_' + idx;
        const hub  = this._edCurrentHub();
        const slot = (hub.dynamic_slots && hub.dynamic_slots[slotId]) || {};
        let defaultAction = '';
        if (prefix === 'act' && !slot.action && this._activitiesList && this._activitiesList[idx - 1]) {
            defaultAction = this._activitiesList[idx - 1].actionValue;
        }
        const currentAction = slot.action || defaultAction;

        const card = document.createElement('div');
        card.style.cssText = 'border:1px solid var(--divider-color,#ccc);border-radius:6px;padding:8px;display:flex;flex-direction:column;gap:8px;';

        const r1 = document.createElement('div');
        r1.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 36px;gap:8px;align-items:end;';

        r1.appendChild(this._labeled('Icon (Slot ' + idx + ')',
            this._haSelector({ icon: {} }, slot.icon || '', (v) => this._patchSlot(slotId, 'icon', v || ''))
        ));

        const txtInput = document.createElement('input');
        txtInput.type = 'text'; txtInput.className = 'hc-text-input';
        txtInput.value = slot.text || '';
        txtInput.onchange = (e) => this._patchSlot(slotId, 'text', e.target.value);
        r1.appendChild(this._labeled('Anzeigename', txtInput));

        const del = document.createElement('button');
        del.type = 'button'; del.className = 'del-btn'; del.title = 'Slot entfernen';
        const dic = document.createElement('ha-icon'); dic.setAttribute('icon', 'mdi:close');
        del.appendChild(dic);
        del.onclick = () => {
            this._edTransformHubField('dynamic_slots', (cur) => {
                const next = { ...(cur || {}) };
                delete next[slotId];
                return next;
            });
            this._slotCounts[prefix] = Math.max(0, idx - 1);
            this._buildDOM();
        };
        r1.appendChild(del);
        card.appendChild(r1);

        const r2 = document.createElement('div');
        r2.appendChild(this._labeled('Aktion',
            this._searchSelect(this._cmdOptions, currentAction, '-- Aktion wählen --',
                (v) => this._patchSlot(slotId, 'action', v || ''))
        ));
        card.appendChild(r2);
        return card;
    }

    _patchSlot(slotId, field, value) {
        this._edTransformHubField('dynamic_slots', (cur) => {
            const next = { ...(cur || {}) };
            const slot = { ...(next[slotId] || {}) };
            if (value === '' || value === null || value === undefined) delete slot[field];
            else slot[field] = value;
            if (!slot.text && !slot.icon && !slot.action) delete next[slotId];
            else next[slotId] = slot;
            return next;
        });
    }

    // ---- ha-selector wrapper ----

    _haSelector(selector, value, onChange) {
        const el = document.createElement('ha-selector');
        el.hass = this._hass; el.selector = selector; el.value = value;
        el.addEventListener('value-changed', (e) => {
            e.stopPropagation(); e.preventDefault();
            const val = (e.detail !== null && e.detail !== undefined) ? e.detail.value : undefined;
            setTimeout(() => { try { onChange(val); } catch (err) {} }, 0);
        });
        return el;
    }

    _sectionSkin() {
        const { det, body } = this._details('sec-skin', 'Darstellung');

        const skinOpts = [
            ['flat','Flat (Standard)'],['fire-tv','Fire TV'],['apple-tv','Apple TV'],
            ['chromecast','Chromecast'],['roku','Roku'],['nvidia','NVIDIA SHIELD'],
            ['jvc','JVC'],['onn','Onn. (Google TV)'],
        ];
        const sel = document.createElement('select');
        sel.className = 'native-sel';
        const curSkin = this._config.skin || 'flat';
        skinOpts.forEach(([v,l]) => {
            const o = document.createElement('option');
            o.value = v; o.textContent = l;
            if (v === curSkin) o.selected = true;
            sel.appendChild(o);
        });
        sel.onchange = e => this._up('skin', e.target.value);
        body.appendChild(this._labeled('Skin', sel));

        const dispRow = document.createElement('div');
        dispRow.className = 'toggle-row';
        const cb = document.createElement('input');
        cb.type = 'checkbox'; cb.id = 'hcv2e-disp';
        cb.checked = !!this._config.show_display;
        cb.onchange = e => this._up('show_display', e.target.checked || null);
        const lbl = document.createElement('label');
        lbl.setAttribute('for', 'hcv2e-disp');
        lbl.textContent = 'Aktivitäts-Display anzeigen (Flat-Skin)';
        dispRow.appendChild(cb); dispRow.appendChild(lbl);
        body.appendChild(dispRow);

        return det;
    }

    _sectionButtons() {
        const { det, body } = this._details('sec-btns', 'Tastenbelegung');
        const hub = this._edCurrentHub();

        const banner = this._edHubBanner();
        if (banner) body.appendChild(banner);

        // Context selector + auto-fill + device filter
        const ctxRow = document.createElement('div');
        ctxRow.className = 'ctx-row';
        ctxRow.appendChild(this._labeled('Kontext',
            this._nativeSelect(this._contextOptions, this._currentContext, '-- Kontext --',
                v => { this._currentContext = v || 'global'; this._buildDOM(); })
        ));

        // Device filter for auto-fill
        if (this._confData && this._confData.Devices) {
            const deviceNames = Object.keys(this._confData.Devices);
            if (deviceNames.length > 0) {
                const devOpts = deviceNames.map(n => ({ label: n, value: n }));
                const devWrap = this._labeled('Gerät (Auto-Befüllen)',
                    this._nativeSelect(devOpts, this._currentAutoDevice || '', '-- Alle Geräte --',
                        v => { this._currentAutoDevice = v || ''; this._buildDOM(); })
                );
                devWrap.style.flex = '1';
                devWrap.style.minWidth = '160px';
                ctxRow.appendChild(devWrap);
            }
        }

        const autoBtn = document.createElement('button');
        autoBtn.type = 'button'; autoBtn.className = 'auto-btn';
        const autoIco = document.createElement('ha-icon');
        autoIco.setAttribute('icon','mdi:lightning-bolt');
        autoBtn.appendChild(autoIco);
        autoBtn.appendChild(document.createTextNode(' Auto-befüllen'));
        autoBtn.onclick = () => this._applyAutoMapping(this._currentContext, this._currentAutoDevice || '');
        ctxRow.appendChild(autoBtn);
        body.appendChild(ctxRow);

        // Activity-media entity picker (only for non-global context)
        if (this._currentContext !== 'global') {
            const mediaEid = (hub.activity_media && hub.activity_media[this._currentContext]) || '';
            body.appendChild(this._labeled(
                'Media-Entity für diese Aktivität (optional)',
                this._haSelector(
                    { entity: { domain: 'media_player' } },
                    mediaEid,
                    v => this._patchActivityMedia(this._currentContext, v || '')
                )
            ));
        }

        const hint = document.createElement('div');
        hint.className = 'hint';
        hint.textContent = 'Auto-befüllen: befüllt leere Felder mit dem ersten passenden Befehl. Bereits belegte Felder werden nicht überschrieben.';
        body.appendChild(hint);

        const ctxButtons = (hub.buttons && hub.buttons[this._currentContext]) || {};
        this._buttonIds.forEach(btnId => {
            const row = document.createElement('div');
            row.className = 'btn-row';
            const lbl = document.createElement('div');
            lbl.className = 'btn-label';
            lbl.textContent = this._btnLabel(btnId);
            row.appendChild(lbl);
            row.appendChild(this._searchSelect(
                this._cmdOptions, ctxButtons[btnId] || '', '-- Befehl --',
                v => this._patchButton(this._currentContext, btnId, v || '')
            ));
            body.appendChild(row);
        });

        return det;
    }

    // Searchable command dropdown (ported from V1 HarmonyCompanionEditor)
    _searchSelect(options, currentValue, placeholder, onChange) {
        const makeLabel = opt => {
            const v = opt.value || '';
            if (v.startsWith('activity:::')) return opt.label.replace(' (Aktivität)','');
            if (v.startsWith('command:::')) {
                const parts = v.split(':::');
                const cmdName = parts[2] || v;
                const m = opt.label.match(/\(([^)]+)\)\s*$/);
                const devName = m ? m[1].trim() : '';
                return devName ? cmdName + '  (' + devName + ')' : cmdName;
            }
            return opt.label || v;
        };

        const currentOpt   = (options || []).find(o => o.value === currentValue);
        const currentLabel = currentOpt ? makeLabel(currentOpt) : (currentValue ? currentValue : '');
        let selectedValue  = currentValue || '';

        const wrap  = document.createElement('div');
        wrap.className = 'sel-wrap';
        const input = document.createElement('input');
        input.type = 'text'; input.className = 'sel-input';
        input.value = currentLabel; input.placeholder = placeholder || '-- Suchen…';
        input.autocomplete = 'off'; input.spellcheck = false;
        const drop = document.createElement('div');
        drop.className = 'sel-drop';

        const renderDrop = filter => {
            drop.innerHTML = '';
            const f = (filter || '').trim().toLowerCase();
            const actItems = [];
            const devMap   = {};
            (options || []).forEach(opt => {
                const v   = opt.value || '';
                const lbl = makeLabel(opt);
                if (f && !lbl.toLowerCase().includes(f) && !(opt.label||'').toLowerCase().includes(f)) return;
                if (v.startsWith('activity:::')) {
                    actItems.push({ label: lbl, value: v });
                } else if (v.startsWith('command:::')) {
                    const m = opt.label.match(/\(([^)]+)\)\s*$/);
                    const devLabel = m ? m[1].trim() : 'Gerät';
                    if (!devMap[devLabel]) devMap[devLabel] = [];
                    devMap[devLabel].push({ label: lbl, value: v });
                }
            });
            const addGroup = (title, items) => {
                if (!items || !items.length) return;
                const grp = document.createElement('div');
                grp.className = 'sel-grp'; grp.textContent = title;
                drop.appendChild(grp);
                items.forEach(item => {
                    const el = document.createElement('div');
                    el.className = 'sel-item'; el.textContent = item.label;
                    if (item.value === selectedValue) el.setAttribute('data-sel','1');
                    el.onmousedown = e => {
                        e.preventDefault();
                        selectedValue = item.value;
                        input.value = item.label;
                        drop.style.display = 'none';
                        try { onChange(item.value); } catch(err) {}
                    };
                    drop.appendChild(el);
                });
            };
            addGroup('Aktivitäten', actItems);
            Object.keys(devMap).forEach(dev => addGroup(dev, devMap[dev]));
            if (drop.children.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'sel-empty';
                empty.textContent = f ? 'Keine Ergebnisse für "' + f + '"' : 'Keine Optionen — Conf laden?';
                drop.appendChild(empty);
            }
        };

        input.onfocus = () => { input.select(); renderDrop(''); drop.style.display = 'block'; };
        input.oninput = () => { renderDrop(input.value); drop.style.display = 'block'; };
        input.onblur = () => {
            setTimeout(() => {
                drop.style.display = 'none';
                const selOpt = (options||[]).find(o => o.value === selectedValue);
                input.value = selOpt ? makeLabel(selOpt) : (selectedValue || '');
            }, 200);
        };
        input.onkeydown = e => {
            if (e.key === 'Escape') { drop.style.display = 'none'; input.blur(); }
            if ((e.key === 'Delete' || e.key === 'Backspace') && input.value === '') {
                selectedValue = ''; input.value = '';
                try { onChange(''); } catch(err) {}
            }
        };

        wrap.appendChild(input); wrap.appendChild(drop);
        return wrap;
    }

    _nativeSelect(options, currentValue, placeholder, onChange) {
        const sel = document.createElement('select');
        sel.className = 'native-sel';
        const empty = document.createElement('option');
        empty.value = ''; empty.textContent = placeholder || '-- wählen --';
        if (!currentValue) empty.selected = true;
        sel.appendChild(empty);
        (options || []).forEach(opt => {
            const o = document.createElement('option');
            o.value = opt.value || ''; o.textContent = opt.label || opt.value;
            if (opt.value === currentValue) o.selected = true;
            sel.appendChild(o);
        });
        sel.onchange = e => { try { onChange(e.target.value); } catch(err) {} };
        return sel;
    }

    _btnLabel(btnId) {
        const map = {
            exit:'Exit', menu:'Menü', back:'Zurück', ok:'OK',
            dir_up:'Oben', dir_down:'Unten', dir_left:'Links', dir_right:'Rechts',
            vol_up:'Lautstärke +', vol_down:'Lautstärke −', mute:'Stumm',
            ch_up:'Kanal +', ch_down:'Kanal −',
            play:'Play', pause:'Pause', stop:'Stop',
            skip_back:'Skip −', skip_forward:'Skip +',
            rewind:'Zurückspulen', fast_forward:'Vorspulen',
            record:'Aufnahme', info:'Info', source:'Source',
            num_0:'0', num_1:'1', num_2:'2', num_3:'3', num_4:'4',
            num_5:'5', num_6:'6', num_7:'7', num_8:'8', num_9:'9',
            num_minus:'Minus (−)', num_enter:'E (Eingabe)',
            dvr_1:'DVR', dvr_2:'Guide', dvr_3:'Info (DVR)',
            red:'Rot', green:'Grün', yellow:'Gelb', blue:'Blau',
        };
        return map[btnId] || btnId.toUpperCase().replace(/_/g,' ');
    }

    _labeled(text, el) {
        const wrap = document.createElement('div');
        const lbl  = document.createElement('div');
        lbl.className = 'lbl'; lbl.textContent = text;
        wrap.appendChild(lbl); wrap.appendChild(el);
        return wrap;
    }

    _patchButton(ctx, btnId, value) {
        this._edTransformHubField('buttons', cur => {
            const next = { ...(cur || {}) };
            const ctxBtns = { ...(next[ctx] || {}) };
            if (!value) delete ctxBtns[btnId];
            else ctxBtns[btnId] = value;
            if (ctx !== 'global' && Object.keys(ctxBtns).length === 0) delete next[ctx];
            else next[ctx] = ctxBtns;
            return next;
        });
    }

    _applyAutoMapping(ctx, deviceFilter) {
        if (!this._confData) return;
        const devices = this._confData.Devices || {};
        this._edTransformHubField('buttons', cur => {
            const next = { ...(cur || {}) };
            if (!next[ctx]) next[ctx] = {};
            const ctxBtns = { ...next[ctx] };
            for (const btnId of this._buttonIds) {
                if (ctxBtns[btnId]) continue;
                const raw = HCV2_FALLBACKS[btnId];
                if (!raw) continue;
                const candidates = Array.isArray(raw) ? raw : [raw];
                for (const candidate of candidates) {
                    let found = false;
                    for (const devName in devices) {
                        if (deviceFilter && devName !== deviceFilter) continue;
                        const dev = devices[devName];
                        if (!dev || !Array.isArray(dev.commands)) continue;
                        if (dev.commands.indexOf(candidate) !== -1) {
                            ctxBtns[btnId] = 'command:::' + dev.id + ':::' + candidate;
                            found = true; break;
                        }
                    }
                    if (found) break;
                }
            }
            next[ctx] = ctxBtns;
            return next;
        });
        this._buildDOM();
    }

    _patchActivityMedia(actName, entityId) {
        this._edTransformHubField('activity_media', cur => {
            const next = { ...(cur || {}) };
            if (entityId) next[actName] = entityId;
            else delete next[actName];
            return next;
        });
    }

    // ---- get _leScale() ----
    get _leScale() { return 2; }

    // ---- Layout-Editor: _sectionLayout + _le* methods ----

    _sectionLayout() {
        if (!this._leMode)    this._leMode    = 'tv';
        if (!this._leLayouts) this._leLayouts = {};

        const { det, body } = this._details('sec-layout', 'Display-Layout');
        const S = this._leScale;

        // Display-Offset Konfiguration
        const offsetRow = document.createElement('div');
        offsetRow.style.cssText = 'display:flex;gap:12px;margin-bottom:14px;align-items:center;flex-wrap:wrap;';
        const mkOffset = (label, key, defVal) => {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'display:flex;flex-direction:column;gap:2px;';
            const lbl = document.createElement('label');
            lbl.style.cssText = 'font-size:11px;color:var(--secondary-text-color);';
            lbl.textContent = label;
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '0'; input.max = '200'; input.step = '1';
            input.value = (this._config && this._config[key] !== undefined) ? this._config[key] : defVal;
            input.style.cssText = 'width:80px;padding:4px 6px;border-radius:4px;border:1px solid var(--divider-color,#ccc);background:var(--card-background-color);color:inherit;font-size:13px;';
            input.onchange = (e) => {
                const v = parseInt(e.target.value, 10);
                if (Number.isFinite(v) && v >= 0) {
                    this._up(key, v);
                    this._leLayouts = {};   // Reset Editor-State (Defaults neu berechnen)
                    this._buildDOM();
                }
            };
            wrap.appendChild(lbl);
            wrap.appendChild(input);
            return wrap;
        };
        offsetRow.appendChild(mkOffset('Display-Offset Breite (px)',  'display_offset_w', HCV2_DEFAULT_OFFSET_W));
        offsetRow.appendChild(mkOffset('Display-Offset Höhe (px)',    'display_offset_h', HCV2_DEFAULT_OFFSET_H));

        // Display-Hintergrundfarbe (Smoked-Glass)
        const bgWrap = document.createElement('div');
        bgWrap.style.cssText = 'display:flex;flex-direction:column;gap:2px;';
        const bgLbl  = document.createElement('label');
        bgLbl.style.cssText = 'font-size:11px;color:var(--secondary-text-color);';
        bgLbl.textContent = 'Display-Hintergrundfarbe';
        const bgInp  = document.createElement('input');
        bgInp.type = 'color';
        bgInp.value = (this._config && this._config.display_bg_color) || HCV2_DEFAULT_DISPLAY_BG;
        bgInp.style.cssText = 'width:60px;height:30px;border:1px solid var(--divider-color,#ccc);border-radius:4px;cursor:pointer;background:transparent;padding:0;';
        bgInp.oninput = (e) => this._up('display_bg_color', e.target.value);
        bgWrap.appendChild(bgLbl);
        bgWrap.appendChild(bgInp);
        offsetRow.appendChild(bgWrap);

        const offInfo = document.createElement('div');
        offInfo.style.cssText = 'font-size:11px;color:var(--secondary-text-color);font-style:italic;flex-basis:100%;';
        offInfo.textContent = 'Display-Offset verschiebt die rechte/untere Grenze (Basis 320×126). Hintergrundfarbe = Smoked-Glass-Ton.';
        offsetRow.appendChild(offInfo);
        body.appendChild(offsetRow);

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
        const dispW = this._dispW, dispH = this._dispH;

        // Grid (2× vergrößert)
        const grid = document.createElement('div');
        grid.style.cssText = [
            `width:${dispW * S}px;height:${dispH * S}px;`,
            'position:relative;overflow:hidden;',
            'background:#1a1a2e;',
            `background-image:linear-gradient(rgba(255,255,255,0.13) 1px,transparent 1px),`,
            `linear-gradient(90deg,rgba(255,255,255,0.13) 1px,transparent 1px);`,
            `background-size:${HCV2_COL_W * S}px ${HCV2_ROW_H * S}px;`,
            'border:2px solid rgba(255,255,255,0.35);border-radius:5px;',
            'box-sizing:border-box;cursor:crosshair;flex-shrink:0;touch-action:none;',
        ].join('');
        this._leGridEl = grid;

        // Progress-Bar-Sperrzone (untere 4px = kein Snap-Bereich)
        const pbarZone = document.createElement('div');
        pbarZone.style.cssText = [
            `position:absolute;bottom:0;left:0;right:0;height:${HCV2_PBAR_H * S}px;`,
            'background:rgba(255,255,255,0.06);pointer-events:none;z-index:1;',
            'border-top:1px dashed rgba(255,255,255,0.25);',
        ].join('');
        grid.appendChild(pbarZone);

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
            const gx = Math.max(0, Math.min(this._dispW, Math.round((e.clientX - r.left) / (HCV2_COL_W * S)) * HCV2_COL_W));
            const gy = Math.max(0, Math.min(this._dispH, Math.round((e.clientY - r.top)  / (HCV2_ROW_H * S)) * HCV2_ROW_H));
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
        palLbl.textContent = 'Auf das Raster ziehen · weiße Ecke unten-rechts zum Größe ändern · vom Raster ziehen = entfernen:';
        body.appendChild(palLbl);

        const palette = document.createElement('div');
        palette.style.cssText = 'display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px;';
        this._lePaletteEl = palette;
        this._leRenderPaletteItems(mode, palette);
        body.appendChild(palette);

        // Panel-Eigenschaften (nur sichtbar wenn Panel im Layout)
        const panelBox = document.createElement('div');
        panelBox.style.cssText = 'display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:8px;padding:8px 10px;border:1px solid var(--divider-color,#ccc);border-radius:6px;background:var(--secondary-background-color,#f5f5f5);';
        this._lePanelBox = panelBox;
        this._leRenderPanelControls(mode);
        body.appendChild(panelBox);

        // Linien-Eigenschaften (nur sichtbar wenn Linie im Layout)
        const lineBox = document.createElement('div');
        lineBox.style.cssText = 'display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:8px;padding:8px 10px;border:1px solid var(--divider-color,#ccc);border-radius:6px;background:var(--secondary-background-color,#f5f5f5);';
        this._leLineBox = lineBox;
        this._leRenderLineControls(mode);
        body.appendChild(lineBox);

        // Text-Element-Eigenschaften (Schriftgröße/-art/-farbe für Activity, Sender, Titel etc.)
        const textBox = document.createElement('div');
        textBox.style.cssText = 'display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:14px;padding:8px 10px;border:1px solid var(--divider-color,#ccc);border-radius:6px;background:var(--secondary-background-color,#f5f5f5);';
        this._leTextBox = textBox;
        this._leRenderTextControls(mode);
        body.appendChild(textBox);

        // Aktions-Buttons
        const actRow = document.createElement('div');
        actRow.style.cssText = 'display:flex;gap:8px;';

        const btnReset = document.createElement('button');
        btnReset.textContent = 'Zurücksetzen';
        btnReset.style.cssText = 'padding:6px 12px;border-radius:6px;border:1px solid var(--divider-color,#ccc);cursor:pointer;font-size:12px;background:transparent;color:inherit;';
        btnReset.onclick = () => {
            this._leLayouts[mode] = hcv2DefaultLayout(mode);
            this._leRenderGridEls(mode);
            this._leRenderPaletteItems(mode, this._lePaletteEl);
        };

        const btnApply = document.createElement('button');
        btnApply.textContent = 'Übernehmen';
        btnApply.style.cssText = 'padding:6px 14px;border-radius:6px;border:none;cursor:pointer;font-size:12px;font-weight:600;background:var(--primary-color,#03a9f4);color:#fff;';
        btnApply.onclick = () => this._leSaveLayout(mode);

        actRow.appendChild(btnReset);
        actRow.appendChild(btnApply);
        body.appendChild(actRow);

        // Hinweis
        const hint = document.createElement('div');
        hint.style.cssText = 'font-size:11px;color:var(--secondary-text-color);margin-top:8px;font-style:italic;';
        hint.textContent = 'Änderungen erst durch "Übernehmen" speichern.';
        body.appendChild(hint);

        return det;
    }

    // Panel-Eigenschaften (Auswahl + Farbe/Alpha/Radius + Löschen) – nur sichtbar wenn ≥1 Panel platziert
    _leRenderPanelControls(mode) {
        const box = this._lePanelBox;
        if (!box) return;
        box.innerHTML = '';
        if (!this._leLayouts[mode]) this._leLayouts[mode] = this._leLoadLayout(mode);
        const layout = this._leLayouts[mode] || {};
        const panelKeys = Object.keys(layout).filter(k => hcv2IsPanel(k) && layout[k] && layout[k].visible !== false);
        if (panelKeys.length === 0) {
            box.style.display = 'none';
            this._leSelectedPanel = null;
            return;
        }
        box.style.display = 'flex';
        if (!this._leSelectedPanel || !panelKeys.includes(this._leSelectedPanel)) {
            this._leSelectedPanel = panelKeys[0];
        }
        const selKey = this._leSelectedPanel;
        const panel  = layout[selKey];

        const lblTitle = document.createElement('div');
        lblTitle.style.cssText = 'font-size:12px;font-weight:600;margin-right:4px;';
        lblTitle.textContent = 'Panel:';
        box.appendChild(lblTitle);

        const sel = document.createElement('select');
        sel.style.cssText = 'padding:4px 6px;border-radius:4px;border:1px solid var(--divider-color,#ccc);background:var(--card-background-color);color:inherit;font-size:12px;';
        panelKeys.forEach((k, i) => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = 'Panel ' + (i + 1) + (k === 'panel' ? '' : ' (' + k + ')');
            if (k === selKey) opt.selected = true;
            sel.appendChild(opt);
        });
        sel.onchange = (e) => {
            this._leSelectedPanel = e.target.value;
            this._leRenderPanelControls(mode);
            this._leRenderGridEls(mode);
        };
        box.appendChild(sel);

        // Farbe
        const colorWrap = document.createElement('div');
        colorWrap.style.cssText = 'display:flex;flex-direction:column;gap:2px;';
        const colorLbl = document.createElement('label');
        colorLbl.style.cssText = 'font-size:10px;color:var(--secondary-text-color);';
        colorLbl.textContent = 'Farbe';
        const colorInp = document.createElement('input');
        colorInp.type = 'color';
        colorInp.value = panel.bgColor || '#404040';
        colorInp.style.cssText = 'width:50px;height:28px;border:1px solid var(--divider-color,#ccc);border-radius:4px;cursor:pointer;background:transparent;padding:0;';
        colorInp.addEventListener('pointerdown', (e) => e.stopPropagation());
        colorInp.oninput = (e) => {
            this._leUpdateLayoutEl(mode, selKey, { bgColor: e.target.value });
            this._leRenderGridEls(mode);
        };
        colorWrap.appendChild(colorLbl);
        colorWrap.appendChild(colorInp);
        box.appendChild(colorWrap);

        // Transparenz
        const alphaWrap = document.createElement('div');
        alphaWrap.style.cssText = 'display:flex;flex-direction:column;gap:2px;min-width:160px;';
        const alphaLbl = document.createElement('label');
        alphaLbl.style.cssText = 'font-size:10px;color:var(--secondary-text-color);';
        const alphaVal = (panel.bgAlpha != null) ? panel.bgAlpha : 0.5;
        const transparency = Math.round((1 - alphaVal) * 100);
        alphaLbl.textContent = 'Transparenz: ' + transparency + '%';
        const alphaInp = document.createElement('input');
        alphaInp.type = 'range';
        alphaInp.min = '0'; alphaInp.max = '100'; alphaInp.step = '1';
        alphaInp.value = transparency;
        alphaInp.style.cssText = 'width:140px;touch-action:auto;';
        alphaInp.addEventListener('pointerdown', (e) => e.stopPropagation());
        alphaInp.addEventListener('mousedown',   (e) => e.stopPropagation());
        alphaInp.addEventListener('touchstart',  (e) => e.stopPropagation());
        alphaInp.oninput = (e) => {
            const t = Number(e.target.value);
            const a = Math.max(0, Math.min(1, 1 - t / 100));
            alphaLbl.textContent = 'Transparenz: ' + t + '%';
            this._leUpdateLayoutEl(mode, selKey, { bgAlpha: a });
            this._leRenderGridEls(mode);
        };
        alphaWrap.appendChild(alphaLbl);
        alphaWrap.appendChild(alphaInp);
        box.appendChild(alphaWrap);

        // Eckradius
        const radWrap = document.createElement('div');
        radWrap.style.cssText = 'display:flex;flex-direction:column;gap:2px;';
        const radLbl = document.createElement('label');
        radLbl.style.cssText = 'font-size:10px;color:var(--secondary-text-color);';
        radLbl.textContent = 'Eckradius (px)';
        const radInp = document.createElement('input');
        radInp.type = 'number';
        radInp.min = '0'; radInp.max = '40'; radInp.step = '1';
        radInp.value = (panel.radius != null) ? panel.radius : 8;
        radInp.style.cssText = 'width:60px;padding:4px 6px;border-radius:4px;border:1px solid var(--divider-color,#ccc);background:var(--card-background-color);color:inherit;font-size:13px;';
        radInp.addEventListener('pointerdown', (e) => e.stopPropagation());
        radInp.onchange = (e) => {
            const v = parseInt(e.target.value, 10);
            this._leUpdateLayoutEl(mode, selKey, { radius: Number.isFinite(v) ? v : 8 });
            this._leRenderGridEls(mode);
        };
        radWrap.appendChild(radLbl);
        radWrap.appendChild(radInp);
        box.appendChild(radWrap);

        // Löschen-Button
        const btnDel = document.createElement('button');
        btnDel.textContent = 'Panel löschen';
        btnDel.style.cssText = 'padding:6px 10px;border-radius:4px;border:1px solid #c0392b;cursor:pointer;font-size:11px;background:transparent;color:#c0392b;align-self:flex-end;margin-left:auto;';
        btnDel.onclick = () => {
            this._leDeleteLayoutEl(mode, selKey);
            this._leSelectedPanel = null;
            this._leRenderGridEls(mode);
            this._leRenderPaletteItems(mode, this._lePaletteEl);
        };
        box.appendChild(btnDel);
    }

    // Linien-Eigenschaften (Auswahl + Farbe/Länge/Dicke/Rotation + Löschen)
    _leRenderLineControls(mode) {
        const box = this._leLineBox;
        if (!box) return;
        box.innerHTML = '';
        if (!this._leLayouts[mode]) this._leLayouts[mode] = this._leLoadLayout(mode);
        const layout = this._leLayouts[mode] || {};
        const lineKeys = Object.keys(layout).filter(k => hcv2IsLine(k) && layout[k] && layout[k].visible !== false);
        if (lineKeys.length === 0) {
            box.style.display = 'none';
            this._leSelectedLine = null;
            return;
        }
        box.style.display = 'flex';
        if (!this._leSelectedLine || !lineKeys.includes(this._leSelectedLine)) {
            this._leSelectedLine = lineKeys[0];
        }
        const selKey = this._leSelectedLine;
        const line   = layout[selKey];

        const lblTitle = document.createElement('div');
        lblTitle.style.cssText = 'font-size:12px;font-weight:600;margin-right:4px;';
        lblTitle.textContent = 'Linie:';
        box.appendChild(lblTitle);

        const sel = document.createElement('select');
        sel.style.cssText = 'padding:4px 6px;border-radius:4px;border:1px solid var(--divider-color,#ccc);background:var(--card-background-color);color:inherit;font-size:12px;';
        lineKeys.forEach((k, i) => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = 'Linie ' + (i + 1) + (k === 'line' ? '' : ' (' + k + ')');
            if (k === selKey) opt.selected = true;
            sel.appendChild(opt);
        });
        sel.onchange = (e) => {
            this._leSelectedLine = e.target.value;
            this._leRenderLineControls(mode);
            this._leRenderGridEls(mode);
        };
        box.appendChild(sel);

        // Farbe
        const colorWrap = document.createElement('div');
        colorWrap.style.cssText = 'display:flex;flex-direction:column;gap:2px;';
        const colorLbl = document.createElement('label');
        colorLbl.style.cssText = 'font-size:10px;color:var(--secondary-text-color);';
        colorLbl.textContent = 'Farbe';
        const colorInp = document.createElement('input');
        colorInp.type = 'color';
        colorInp.value = line.color || '#888888';
        colorInp.style.cssText = 'width:50px;height:28px;border:1px solid var(--divider-color,#ccc);border-radius:4px;cursor:pointer;background:transparent;padding:0;';
        colorInp.addEventListener('pointerdown', (e) => e.stopPropagation());
        colorInp.oninput = (e) => {
            this._leUpdateLayoutEl(mode, selKey, { color: e.target.value });
            this._leRenderGridEls(mode);
        };
        colorWrap.appendChild(colorLbl);
        colorWrap.appendChild(colorInp);
        box.appendChild(colorWrap);

        // Länge
        const lenWrap = document.createElement('div');
        lenWrap.style.cssText = 'display:flex;flex-direction:column;gap:2px;';
        const lenLbl = document.createElement('label');
        lenLbl.style.cssText = 'font-size:10px;color:var(--secondary-text-color);';
        lenLbl.textContent = 'Länge (px)';
        const lenInp = document.createElement('input');
        lenInp.type = 'number';
        lenInp.min = '1'; lenInp.max = '500'; lenInp.step = '1';
        lenInp.value = line.w || 50;
        lenInp.style.cssText = 'width:60px;padding:4px 6px;border-radius:4px;border:1px solid var(--divider-color,#ccc);background:var(--card-background-color);color:inherit;font-size:13px;';
        lenInp.addEventListener('pointerdown', (e) => e.stopPropagation());
        lenInp.onchange = (e) => {
            const v = parseInt(e.target.value, 10);
            this._leUpdateLayoutEl(mode, selKey, { w: Math.max(1, Number.isFinite(v) ? v : 50) });
            this._leRenderGridEls(mode);
        };
        lenWrap.appendChild(lenLbl);
        lenWrap.appendChild(lenInp);
        box.appendChild(lenWrap);

        // Dicke
        const thickWrap = document.createElement('div');
        thickWrap.style.cssText = 'display:flex;flex-direction:column;gap:2px;';
        const thickLbl = document.createElement('label');
        thickLbl.style.cssText = 'font-size:10px;color:var(--secondary-text-color);';
        thickLbl.textContent = 'Dicke (px)';
        const thickInp = document.createElement('input');
        thickInp.type = 'number';
        thickInp.min = '1'; thickInp.max = '20'; thickInp.step = '1';
        thickInp.value = line.h || 2;
        thickInp.style.cssText = 'width:50px;padding:4px 6px;border-radius:4px;border:1px solid var(--divider-color,#ccc);background:var(--card-background-color);color:inherit;font-size:13px;';
        thickInp.addEventListener('pointerdown', (e) => e.stopPropagation());
        thickInp.onchange = (e) => {
            const v = parseInt(e.target.value, 10);
            this._leUpdateLayoutEl(mode, selKey, { h: Math.max(1, Number.isFinite(v) ? v : 2) });
            this._leRenderGridEls(mode);
        };
        thickWrap.appendChild(thickLbl);
        thickWrap.appendChild(thickInp);
        box.appendChild(thickWrap);

        // Rotation
        const rotWrap = document.createElement('div');
        rotWrap.style.cssText = 'display:flex;flex-direction:column;gap:2px;';
        const rotLbl = document.createElement('label');
        rotLbl.style.cssText = 'font-size:10px;color:var(--secondary-text-color);';
        rotLbl.textContent = 'Winkel (°)';
        const rotInp = document.createElement('input');
        rotInp.type = 'number';
        rotInp.min = '0'; rotInp.max = '359'; rotInp.step = '1';
        rotInp.value = (line.rotation != null) ? line.rotation : 0;
        rotInp.style.cssText = 'width:60px;padding:4px 6px;border-radius:4px;border:1px solid var(--divider-color,#ccc);background:var(--card-background-color);color:inherit;font-size:13px;';
        rotInp.addEventListener('pointerdown', (e) => e.stopPropagation());
        rotInp.onchange = (e) => {
            let v = parseInt(e.target.value, 10);
            if (!Number.isFinite(v)) v = 0;
            v = ((v % 360) + 360) % 360;
            this._leUpdateLayoutEl(mode, selKey, { rotation: v });
            this._leRenderGridEls(mode);
        };
        rotWrap.appendChild(rotLbl);
        rotWrap.appendChild(rotInp);
        box.appendChild(rotWrap);

        // Löschen-Button
        const btnDel = document.createElement('button');
        btnDel.textContent = 'Linie löschen';
        btnDel.style.cssText = 'padding:6px 10px;border-radius:4px;border:1px solid #c0392b;cursor:pointer;font-size:11px;background:transparent;color:#c0392b;align-self:flex-end;margin-left:auto;';
        btnDel.onclick = () => {
            this._leDeleteLayoutEl(mode, selKey);
            this._leSelectedLine = null;
            this._leRenderGridEls(mode);
            this._leRenderPaletteItems(mode, this._lePaletteEl);
        };
        box.appendChild(btnDel);
    }

    // Text-Element-Eigenschaften (Schriftgröße/-art/-farbe für sichtbare Text-Elemente)
    _leRenderTextControls(mode) {
        const box = this._leTextBox;
        if (!box) return;
        box.innerHTML = '';
        if (!this._leLayouts[mode]) this._leLayouts[mode] = this._leLoadLayout(mode);
        const layout = this._leLayouts[mode] || {};
        const labels = { activity: 'Activity', channel: 'Sender', title: 'Titel',
                         time: 'Zeit', timespan: 'Beg-End', menu: 'Menü' };
        const textKeys = HCV2_TEXT_ELEM_KEYS.filter(k => layout[k] && layout[k].visible !== false);
        if (textKeys.length === 0) {
            box.style.display = 'none';
            this._leSelectedTextEl = null;
            return;
        }
        box.style.display = 'flex';
        if (!this._leSelectedTextEl || !textKeys.includes(this._leSelectedTextEl)) {
            this._leSelectedTextEl = textKeys[0];
        }
        const selKey = this._leSelectedTextEl;
        const def    = layout[selKey];

        const lblTitle = document.createElement('div');
        lblTitle.style.cssText = 'font-size:12px;font-weight:600;margin-right:4px;';
        lblTitle.textContent = 'Text:';
        box.appendChild(lblTitle);

        // Element-Auswahl-Dropdown
        const sel = document.createElement('select');
        sel.style.cssText = 'padding:4px 6px;border-radius:4px;border:1px solid var(--divider-color,#ccc);background:var(--card-background-color);color:inherit;font-size:12px;';
        textKeys.forEach(k => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = labels[k] || k;
            if (k === selKey) opt.selected = true;
            sel.appendChild(opt);
        });
        sel.onchange = (e) => {
            this._leSelectedTextEl = e.target.value;
            this._leRenderTextControls(mode);
            this._leRenderGridEls(mode);
        };
        box.appendChild(sel);

        // Schriftgröße
        const sizeWrap = document.createElement('div');
        sizeWrap.style.cssText = 'display:flex;flex-direction:column;gap:2px;';
        const sizeLbl = document.createElement('label');
        sizeLbl.style.cssText = 'font-size:10px;color:var(--secondary-text-color);';
        sizeLbl.textContent = 'Größe (px)';
        const sizeInp = document.createElement('input');
        sizeInp.type = 'number';
        sizeInp.min = '6'; sizeInp.max = '40'; sizeInp.step = '1';
        sizeInp.placeholder = 'auto';
        sizeInp.value = def.fontSize || '';
        sizeInp.style.cssText = 'width:60px;padding:4px 6px;border-radius:4px;border:1px solid var(--divider-color,#ccc);background:var(--card-background-color);color:inherit;font-size:13px;';
        sizeInp.addEventListener('pointerdown', (e) => e.stopPropagation());
        sizeInp.onchange = (e) => {
            const v = parseInt(e.target.value, 10);
            const cur = (this._leLayouts[mode] && this._leLayouts[mode][selKey]) || {};
            const next = { ...cur };
            if (Number.isFinite(v) && v >= 6) next.fontSize = v;
            else delete next.fontSize;
            this._leReplaceLayoutEl(mode, selKey, next);
            this._leRenderGridEls(mode);
        };
        sizeWrap.appendChild(sizeLbl);
        sizeWrap.appendChild(sizeInp);
        box.appendChild(sizeWrap);

        // Schriftart
        const fontWrap = document.createElement('div');
        fontWrap.style.cssText = 'display:flex;flex-direction:column;gap:2px;';
        const fontLbl = document.createElement('label');
        fontLbl.style.cssText = 'font-size:10px;color:var(--secondary-text-color);';
        fontLbl.textContent = 'Schriftart';
        const fontSel = document.createElement('select');
        fontSel.style.cssText = 'padding:4px 6px;border-radius:4px;border:1px solid var(--divider-color,#ccc);background:var(--card-background-color);color:inherit;font-size:13px;min-width:140px;';
        HCV2_FONT_FAMILIES.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.value;
            opt.textContent = f.label;
            if ((def.fontFamily || '') === f.value) opt.selected = true;
            opt.style.fontFamily = f.value || 'inherit';
            fontSel.appendChild(opt);
        });
        fontSel.addEventListener('pointerdown', (e) => e.stopPropagation());
        fontSel.onchange = (e) => {
            const v = e.target.value;
            const cur = (this._leLayouts[mode] && this._leLayouts[mode][selKey]) || {};
            const next = { ...cur };
            if (v) next.fontFamily = v; else delete next.fontFamily;
            this._leReplaceLayoutEl(mode, selKey, next);
            this._leRenderGridEls(mode);
        };
        fontWrap.appendChild(fontLbl);
        fontWrap.appendChild(fontSel);
        box.appendChild(fontWrap);

        // Farbe (Auto / manuell)
        const colorWrap = document.createElement('div');
        colorWrap.style.cssText = 'display:flex;flex-direction:column;gap:2px;';
        const colorLbl = document.createElement('label');
        colorLbl.style.cssText = 'font-size:10px;color:var(--secondary-text-color);';
        colorLbl.textContent = 'Farbe';
        const colorRow = document.createElement('div');
        colorRow.style.cssText = 'display:flex;gap:6px;align-items:center;';
        const isAuto = !def.color || def.color === 'auto';
        const autoChk = document.createElement('label');
        autoChk.style.cssText = 'display:flex;align-items:center;gap:3px;font-size:11px;cursor:pointer;';
        const autoBox = document.createElement('input');
        autoBox.type = 'checkbox';
        autoBox.checked = isAuto;
        autoBox.style.margin = '0';
        autoChk.appendChild(autoBox);
        const autoTxt = document.createElement('span');
        autoTxt.textContent = 'Auto';
        autoChk.appendChild(autoTxt);
        const colorInp = document.createElement('input');
        colorInp.type = 'color';
        colorInp.value = (def.color && def.color !== 'auto') ? def.color : '#ffffff';
        colorInp.disabled = isAuto;
        colorInp.style.cssText = 'width:42px;height:26px;border:1px solid var(--divider-color,#ccc);border-radius:4px;cursor:pointer;background:transparent;padding:0;' + (isAuto ? 'opacity:0.4;' : '');
        autoBox.addEventListener('pointerdown', (e) => e.stopPropagation());
        colorInp.addEventListener('pointerdown', (e) => e.stopPropagation());
        autoBox.onchange = (e) => {
            const cur = (this._leLayouts[mode] && this._leLayouts[mode][selKey]) || {};
            const next = { ...cur };
            if (e.target.checked) {
                delete next.color;
                colorInp.disabled = true;
                colorInp.style.opacity = '0.4';
            } else {
                next.color = colorInp.value;
                colorInp.disabled = false;
                colorInp.style.opacity = '';
            }
            this._leReplaceLayoutEl(mode, selKey, next);
            this._leRenderGridEls(mode);
        };
        colorInp.oninput = (e) => {
            if (autoBox.checked) return;
            this._leUpdateLayoutEl(mode, selKey, { color: e.target.value });
            this._leRenderGridEls(mode);
        };
        colorRow.appendChild(autoChk);
        colorRow.appendChild(colorInp);
        colorWrap.appendChild(colorLbl);
        colorWrap.appendChild(colorRow);
        box.appendChild(colorWrap);

        // Reset-Button
        const btnReset = document.createElement('button');
        btnReset.textContent = 'Zurücksetzen';
        btnReset.style.cssText = 'padding:6px 10px;border-radius:4px;border:1px solid var(--divider-color,#ccc);cursor:pointer;font-size:11px;background:transparent;color:inherit;align-self:flex-end;margin-left:auto;';
        btnReset.onclick = () => {
            const cur = (this._leLayouts[mode] && this._leLayouts[mode][selKey]) || {};
            const next = { ...cur };
            delete next.fontSize;
            delete next.fontFamily;
            delete next.color;
            this._leReplaceLayoutEl(mode, selKey, next);
            this._leRenderGridEls(mode);
            this._leRenderTextControls(mode);
        };
        box.appendChild(btnReset);
    }

    // Immutable Update für ein Layout-Element
    _leUpdateLayoutEl(mode, key, partial) {
        if (!this._leLayouts[mode]) this._leLayouts[mode] = this._leLoadLayout(mode);
        const oldLayout = this._leLayouts[mode];
        const oldEntry  = oldLayout[key] || {};
        this._leLayouts[mode] = { ...oldLayout, [key]: { ...oldEntry, ...partial } };
    }
    _leDeleteLayoutEl(mode, key) {
        if (!this._leLayouts[mode]) return;
        const newLayout = { ...this._leLayouts[mode] };
        delete newLayout[key];
        this._leLayouts[mode] = newLayout;
    }
    _leReplaceLayoutEl(mode, key, fullDef) {
        if (!this._leLayouts[mode]) this._leLayouts[mode] = this._leLoadLayout(mode);
        this._leLayouts[mode] = { ...this._leLayouts[mode], [key]: fullDef };
    }

    _leSaveLayout(mode) {
        if (!this._leLayouts[mode]) return;
        const key = mode === 'tv' ? 'tv_layout' : 'media_layout';
        this._up(key, JSON.parse(JSON.stringify(this._leLayouts[mode])));
    }

    _leLoadLayout(mode) {
        const key = mode === 'tv' ? 'tv_layout' : 'media_layout';
        const saved = this._config && this._config[key];
        const defs = hcv2DefaultLayout(mode);
        if (!saved) return JSON.parse(JSON.stringify(defs));
        const merged = JSON.parse(JSON.stringify(defs));
        Object.keys(saved).forEach(k => { merged[k] = { ...merged[k], ...saved[k] }; });
        return merged;
    }

    _leRenderGridEls(mode) {
        const grid = this._leGridEl;
        if (!grid) return;
        grid.querySelectorAll('.le-el').forEach(el => el.remove());
        const layout = this._leLayouts[mode] || (this._leLayouts[mode] = this._leLoadLayout(mode));
        Object.entries(layout).forEach(([key, def]) => {
            if (!def.visible) return;
            const cat = hcv2CatalogFor(key, def);
            if (!cat) return;
            grid.appendChild(this._leCreateEl(key, def, cat, mode));
        });
        this._leCheckOverlaps(mode);
        this._leRenderPanelControls(mode);
        this._leRenderLineControls(mode);
        this._leRenderTextControls(mode);
    }

    _leCheckOverlaps(mode) {
        const grid = this._leGridEl;
        if (!grid) return;
        const layout = this._leLayouts[mode] || {};
        const els = [...grid.querySelectorAll('.le-el')];
        const rects = els.map(el => {
            const key = el.dataset.key;
            if (hcv2IsPanel(key) || hcv2IsLine(key)) return null;
            const def = layout[key];
            if (!def) return null;
            const cat = hcv2CatalogFor(key, def);
            if (!cat) return null;
            const w = def.w || cat.w;
            const h = def.h || cat.h;
            return { el, x1: def.left, y1: def.top, x2: def.left + w, y2: def.top + h };
        }).filter(Boolean);
        els.forEach(el => { el.style.border = '1px solid rgba(255,255,255,0.3)'; });
        for (let i = 0; i < rects.length; i++) {
            for (let j = i + 1; j < rects.length; j++) {
                const a = rects[i], b = rects[j];
                if (a.x2 > b.x1 && a.x1 < b.x2 && a.y2 > b.y1 && a.y1 < b.y2) {
                    a.el.style.border = '2px solid #ff3333';
                    b.el.style.border = '2px solid #ff3333';
                }
            }
        }
    }

    _leRenderPaletteItems(mode, container) {
        if (!container) return;
        container.innerHTML = '';
        const layout = this._leLayouts[mode] || {};
        HCV2_MODE_ELEMS[mode].forEach(catalogKey => {
            const cat = HCV2_ELEM_CATALOG[catalogKey];
            const lKey = catalogKey.startsWith('logo') ? 'logo' : catalogKey;
            const placed = layout[lKey];
            const isPlaced = catalogKey !== 'panel' && catalogKey !== 'line' && placed && placed.visible &&
                (lKey !== 'logo' || (
                    catalogKey === 'logo_xl' ? placed.h >= 42
                    : catalogKey === 'logo_l' ? (placed.h >= 35 && placed.h < 42)
                    : catalogKey === 'logo_m' ? (placed.h >= 30 && placed.h < 35)
                    : placed.h < 30
                ));
            const item = document.createElement('div');
            const isIconPal = (catalogKey === 'power' || catalogKey === 'menu' || catalogKey.startsWith('logo'));
            item.style.cssText = [
                'padding:4px 10px;border-radius:5px;border:1px solid rgba(255,255,255,0.25);',
                `background:${cat.color};color:${cat.fg};`,
                'font-size:11px;font-weight:600;cursor:grab;user-select:none;',
                isIconPal ? 'white-space:pre-line;text-align:center;line-height:1.3;' : 'white-space:nowrap;',
                `opacity:${isPlaced ? '0.35' : '1'};transition:opacity .15s;touch-action:none;`,
            ].join('');
            item.textContent = isIconPal ? (cat.label + '\n' + cat.w + '×' + cat.h) : (cat.label + ' ' + cat.w + '×' + cat.h);
            item.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                this._leStartDrag(e, catalogKey, item, mode);
            });
            container.appendChild(item);
        });
    }

    _leCreateEl(key, def, cat, mode) {
        const S = this._leScale;
        const isIcon   = (key === 'power' || key === 'logo' || key === 'menu');
        const isPanel  = hcv2IsPanel(key);
        const isLine   = hcv2IsLine(key);
        const isText   = hcv2IsTextEl(key);
        const isTime   = (key === 'time');
        const isSelectedPanel = isPanel && this._leSelectedPanel === key;
        const isSelectedLine  = isLine  && this._leSelectedLine === key;
        const isSelectedText  = isText  && this._leSelectedTextEl === key;
        const w = def.w || cat.w;
        const h = def.h || cat.h;
        const timeRight = isTime && (def.left + w > this._dispW * 0.55);
        const align = isIcon ? 'center' : (timeRight ? 'flex-end' : 'flex-start');
        const pad   = isIcon ? '' : (timeRight ? 'padding-right:10px;' : 'padding-left:10px;');
        const el = document.createElement('div');
        el.className = 'le-el';
        el.dataset.key = key;
        const bgColor = isPanel ? hcv2PanelBg(def)
                      : isLine  ? (def.color || '#888888')
                      : cat.color;
        const radius  = isPanel ? (((def.radius != null) ? def.radius : 8) + 'px')
                      : isLine  ? '0'
                      : '3px';
        const zIdx    = (isPanel || isLine) ? '1' : '2';
        const lineRot = isLine ? (def.rotation || 0) : 0;
        const transformStr = lineRot ? `transform:rotate(${lineRot}deg);transform-origin:center center;` : '';
        el.style.cssText = [
            'position:absolute;',
            `left:${def.left * S}px;top:${def.top * S}px;`,
            `width:${w * S}px;height:${h * S}px;`,
            `background:${bgColor};color:${cat.fg};`,
            'font-size:10px;font-weight:700;',
            `display:flex;align-items:center;justify-content:${align};`,
            isIcon ? 'flex-direction:column;text-align:center;' : '',
            pad,
            transformStr,
            `border-radius:${radius};cursor:grab;user-select:none;touch-action:none;`,
            `box-sizing:border-box;z-index:${zIdx};overflow:${isLine ? 'visible' : 'hidden'};white-space:nowrap;`,
            (isPanel || isLine)
                ? ((isSelectedPanel || isSelectedLine)
                    ? 'border:2px solid #03a9f4;box-shadow:0 0 0 3px rgba(3,169,244,0.35);'
                    : 'border:1px dashed rgba(255,255,255,0.6);')
                : (isSelectedText
                    ? 'border:2px solid #03a9f4;box-shadow:0 0 0 3px rgba(3,169,244,0.35);'
                    : 'border:1px solid rgba(255,255,255,0.3);'),
        ].join('');
        const catalogKey = key === 'logo'
            ? (h >= 42 ? 'logo_xl' : h >= 35 ? 'logo_l' : h >= 30 ? 'logo_m' : 'logo_s')
            : (isPanel ? 'panel' : (isLine ? 'line' : key));
        const labelEl = document.createElement('div');
        labelEl.className = 'le-el-label';
        labelEl.style.pointerEvents = 'none';
        if (isIcon) {
            labelEl.innerHTML = `<div style="line-height:1.1">${cat.label}</div><div style="font-size:9px;opacity:0.8;margin-top:1px">${w}×${h}</div>`;
        } else if (!isLine) {
            labelEl.textContent = cat.label + ' ' + w + '×' + h;
        }
        if (!isLine) el.appendChild(labelEl);
        const resizeH = document.createElement('div');
        resizeH.className = 'le-el-resize';
        resizeH.style.cssText = [
            'position:absolute;right:0;bottom:0;width:12px;height:12px;',
            'background:rgba(255,255,255,0.85);',
            'border-left:1px solid rgba(0,0,0,0.5);border-top:1px solid rgba(0,0,0,0.5);',
            'cursor:nwse-resize;z-index:10;touch-action:none;',
            'box-sizing:border-box;',
        ].join('');
        resizeH.title = 'Größe ändern';
        resizeH.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this._leStartResize(e, key, el, mode);
        });
        el.appendChild(resizeH);
        el.addEventListener('pointerdown', (e) => {
            if (e.target === resizeH) return;
            e.preventDefault();
            if (isPanel && this._leSelectedPanel !== key) {
                this._leSelectedPanel = key;
                this._leRenderPanelControls(mode);
                this._leRenderGridEls(mode);
            }
            if (isLine && this._leSelectedLine !== key) {
                this._leSelectedLine = key;
                this._leRenderLineControls(mode);
                this._leRenderGridEls(mode);
            }
            if (isText && this._leSelectedTextEl !== key) {
                this._leSelectedTextEl = key;
                this._leRenderTextControls(mode);
                this._leRenderGridEls(mode);
            }
            this._leStartDrag(e, catalogKey, el, mode);
        });
        return el;
    }

    _leStartResize(e, key, el, mode) {
        const S = this._leScale;
        if (!this._leLayouts[mode]) this._leLayouts[mode] = this._leLoadLayout(mode);
        const layout = this._leLayouts[mode];
        const def = layout[key];
        if (!def) return;
        const cat0 = hcv2CatalogFor(key, def);
        const startW = def.w || (cat0 && cat0.w) || 30;
        const startH = def.h || (cat0 && cat0.h) || 14;
        const startX = e.clientX;
        const startY = e.clientY;
        const isLine = hcv2IsLine(key);
        const minW   = isLine ? 1 : HCV2_COL_W * 2;
        const minH   = isLine ? 1 : HCV2_ROW_H * 2;
        const maxW   = this._dispW - def.left;
        const maxH   = isLine ? 20 : (this._dispH - def.top);
        const lineRot = isLine ? ((def.rotation || 0) * Math.PI / 180) : 0;
        const cosR = Math.cos(lineRot), sinR = Math.sin(lineRot);

        const labelEl = el.querySelector('.le-el-label');
        const isIcon  = (key === 'power' || key === 'logo' || key === 'menu');

        const calcSize = (ev) => {
            const dxS = (ev.clientX - startX) / S;
            const dyS = (ev.clientY - startY) / S;
            const dx = isLine ? (dxS * cosR + dyS * sinR) : dxS;
            const dy = isLine ? (-dxS * sinR + dyS * cosR) : dyS;
            let w, h;
            if (isLine) {
                w = Math.max(minW, Math.min(maxW, Math.round(startW + dx)));
                h = Math.max(minH, Math.min(maxH, Math.round(startH + dy)));
            } else {
                w = Math.max(minW, Math.min(maxW, Math.round((startW + dx) / HCV2_COL_W) * HCV2_COL_W));
                h = Math.max(minH, Math.min(maxH, Math.round((startH + dy) / HCV2_ROW_H) * HCV2_ROW_H));
            }
            return { w, h };
        };

        const updateLabel = (w, h) => {
            const cat = hcv2CatalogFor(key, { ...def, h });
            if (!cat || !labelEl) return;
            if (isIcon) {
                labelEl.innerHTML = `<div style="line-height:1.1">${cat.label}</div><div style="font-size:9px;opacity:0.8;margin-top:1px">${w}×${h}</div>`;
            } else {
                labelEl.textContent = cat.label + ' ' + w + '×' + h;
            }
        };

        const onMove = (ev) => {
            const { w, h } = calcSize(ev);
            el.style.width  = (w * S) + 'px';
            el.style.height = (h * S) + 'px';
            updateLabel(w, h);
            if (this._leCoordTip) this._leCoordTip.textContent = '↔ ' + w + 'px × ' + h + 'px';
        };
        const onUp = (ev) => {
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup',   onUp);
            const { w, h } = calcSize(ev);
            this._leUpdateLayoutEl(mode, key, { w, h });
            this._leRenderGridEls(mode);
            this._leRenderPaletteItems(mode, this._lePaletteEl);
            if (this._leCoordTip) this._leCoordTip.textContent = '';
        };
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup',   onUp);
    }

    _leStartDrag(e, catalogKey, sourceEl, mode) {
        const cat = HCV2_ELEM_CATALOG[catalogKey];
        if (!cat) return;
        const S = this._leScale;
        if (!this._leLayouts[mode]) this._leLayouts[mode] = this._leLoadLayout(mode);

        const isFromGrid = sourceEl && sourceEl.classList && sourceEl.classList.contains('le-el');
        let layoutKey;
        if (isFromGrid) {
            layoutKey = sourceEl.dataset.key || catalogKey;
        } else {
            if (catalogKey === 'panel') {
                let n = 1;
                while (this._leLayouts[mode] && this._leLayouts[mode]['panel_' + n]
                       && this._leLayouts[mode]['panel_' + n].visible !== false) n++;
                layoutKey = 'panel_' + n;
            } else if (catalogKey === 'line') {
                let n = 1;
                while (this._leLayouts[mode] && this._leLayouts[mode]['line_' + n]
                       && this._leLayouts[mode]['line_' + n].visible !== false) n++;
                layoutKey = 'line_' + n;
            } else if (catalogKey.startsWith('logo')) {
                layoutKey = 'logo';
            } else {
                layoutKey = catalogKey;
            }
        }

        let dragW = cat.w, dragH = cat.h, dragRot = 0;
        if (isFromGrid) {
            const existing = this._leLayouts[mode] && this._leLayouts[mode][layoutKey];
            if (existing && existing.visible !== false) {
                dragW = existing.w || cat.w;
                dragH = existing.h || cat.h;
                if (hcv2IsLine(layoutKey)) dragRot = existing.rotation || 0;
            }
        }

        const offsetX = dragW * S / 2;
        const offsetY = dragH * S / 2;

        this._leDrag = { catalogKey, layoutKey, offsetX, offsetY, mode, w: dragW, h: dragH, rot: dragRot };

        const grid = this._leGridEl;

        const onMove = (ev) => {
            if (!grid) return;
            const gr = grid.getBoundingClientRect();
            const relX = ev.clientX - gr.left - offsetX;
            const relY = ev.clientY - gr.top  - offsetY;
            const dispW = this._dispW, dispH = this._dispH;
            const inGrid = relX > -dragW * S * 0.5 && relX < dispW * S - dragW * S * 0.5 &&
                           relY > -dragH * S * 0.5 && relY < dispH * S - dragH * S * 0.5;
            const sp = this._leSnapPrev;
            if (inGrid && sp) {
                const sl = Math.max(0, Math.min(dispW - dragW, Math.round((relX / S) / HCV2_COL_W) * HCV2_COL_W));
                const st = Math.max(0, Math.min(dispH - dragH, Math.round((relY / S) / HCV2_ROW_H) * HCV2_ROW_H));
                sp.style.display = 'block';
                sp.style.left    = (sl * S) + 'px';
                sp.style.top     = (st * S) + 'px';
                sp.style.width   = (dragW * S) + 'px';
                sp.style.height  = (dragH * S) + 'px';
                sp.style.transform = dragRot ? `rotate(${dragRot}deg)` : '';
                sp.style.transformOrigin = 'center center';
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
            this._leDrop(ev, catalogKey, offsetX, offsetY, mode, dragW, dragH, layoutKey);
            this._leDrag = null;
            if (this._leCoordTip) this._leCoordTip.textContent = '';
        };
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup',   onUp);
    }

    _leDrop(e, catalogKey, offsetX, offsetY, mode, dragW, dragH, layoutKey) {
        const grid = this._leGridEl;
        if (!grid) return;
        const cat = HCV2_ELEM_CATALOG[catalogKey];
        if (!layoutKey) {
            layoutKey = catalogKey.startsWith('logo') ? 'logo' : catalogKey;
        }
        const S         = this._leScale;
        const gr        = grid.getBoundingClientRect();
        const relX      = e.clientX - gr.left - offsetX;
        const relY      = e.clientY - gr.top  - offsetY;
        const w         = dragW || cat.w;
        const h         = dragH || cat.h;

        if (!this._leLayouts[mode]) this._leLayouts[mode] = this._leLoadLayout(mode);
        const layout = { ...this._leLayouts[mode] };

        const dispW = this._dispW, dispH = this._dispH;
        const inGrid = relX > -w * S * 0.5 && relX < dispW * S - w * S * 0.5 &&
                       relY > -h * S * 0.5 && relY < dispH * S - h * S * 0.5;
        if (inGrid) {
            const left = Math.max(0, Math.min(dispW - w, Math.round((relX / S) / HCV2_COL_W) * HCV2_COL_W));
            const top  = Math.max(0, Math.min(dispH - h, Math.round((relY / S) / HCV2_ROW_H) * HCV2_ROW_H));
            const prev = layout[layoutKey] || {};
            layout[layoutKey] = { ...prev, left, top, w, h, visible: true };
        } else {
            delete layout[layoutKey];
        }

        this._leLayouts[mode] = layout;
        this._leRenderGridEls(mode);
        this._leRenderPaletteItems(mode, this._lePaletteEl);
    }

    _up(key, val) {
        const cfg = JSON.parse(JSON.stringify(this._config));
        if (val === null || val === undefined || val === '') delete cfg[key];
        else cfg[key] = val;
        this._config = cfg;
        this._dispatch();
    }

    _dispatch() {
        this.dispatchEvent(new CustomEvent('config-changed', {
            detail: { config: this._config }, bubbles: true, composed: true,
        }));
    }
}
customElements.define('harmony-card-v2-editor', HarmonyCardV2Editor);

customElements.define('harmony-card-v2', HarmonyCardV2);

window.customCards = window.customCards || [];
window.customCards.push({
    type:        'harmony-card-v2',
    name:        'Harmony Card V2 (Mobile)',
    description: 'Mobile-first Harmony Hub card mit Device Quick Sheet. Pixel 8 Pro optimiert.',
    preview:     false,
    documentationURL: 'https://github.com/al1505/ALs-Homeassistant-Harmony-Companion-Card',
});
