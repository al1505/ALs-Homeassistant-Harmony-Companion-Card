// ============================================================================
// ALs HARMONY CARD V2
// Mobile-first HA custom card for Logitech Harmony Hub
// Pixel 8 Pro · Device Quick Sheet · No editor · Same config schema as V1
// Version: 2.0.0
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

const HCV2_VERSION = '2.2.1';
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

// ============================================================================

class HarmonyCardV2 extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._hass       = null;
        this.config      = null;
        this._conf       = { Devices: {}, Activities: {} };
        this._lastAct    = null;
        this._rendered   = false;
        this._numOpen    = false;
        this._playing    = false;  // play/pause toggle state
        this._sheetMode  = null;   // null | 'devices' | 'commands'
        this._sheetDev   = null;
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
        if (!cfg || !cfg.entity) throw new Error('harmony-card-v2: entity required');
        this.config = JSON.parse(JSON.stringify(cfg));
        this._loadConf();
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
        }
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
        this._render();
        this._rendered = true;
    }

    // ── Data helpers ─────────────────────────────────────────────────────────

    _activities() {
        const raw = this._conf.Activities || {};
        return Object.entries(raw)
            .filter(([id]) => id !== '-1')
            .map(([id, name]) => {
                const slotIdx = this._actSlotIndex(name);
                const slot    = slotIdx >= 0 && this.config.dynamic_slots
                    ? (this.config.dynamic_slots['act_' + (slotIdx + 1)] || null) : null;
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

        const pillsHtml = acts.map(a => {
            const active = a.name === current;
            const iconHtml = a.icon
                ? `<ha-icon icon="${_e(a.icon)}" style="--mdc-icon-size:18px;margin-right:4px;"></ha-icon>`
                : '';
            return `<div class="pill${active ? ' pill--on' : ''}" data-act="${_e(a.name)}">${iconHtml}${_e(a.label)}</div>`;
        }).join('');

        this.shadowRoot.innerHTML = this._css() + `
<div class="card">
<div class="flt-remote" id="hcv2-card">

  <!-- Topbar: power · status · devices -->
  <div class="flt-top">
    <button class="flt-circ flt-pwr" data-btn="off">${_svg('power',20)}</button>
    <div class="flt-st" id="hcv2-status"></div>
    <button class="flt-circ" id="hcv2-devbtn">${_svg('devices',20)}</button>
  </div>

  <!-- Activity pills -->
  <div class="act-scroll" id="hcv2-pills">${pillsHtml || '<span class="pill-empty">Config laden…</span>'}</div>

  ${this.config.show_display ? `
  <!-- Activity display bar -->
  <div class="flt-display" id="hcv2-display">
    <div class="disp-dot" id="hcv2-disp-dot"></div>
    <span class="disp-act" id="hcv2-disp-act">Kein Gerät aktiv</span>
  </div>` : ''}

  ${this._conf._err ? `<div class="conf-err">Conf-Fehler: ${_e(this._conf._err)}</div>` : ''}

  <!-- Vol + CH rockers -->
  <div class="volch" id="hcv2-volch">
    <div class="rocker-v">
      <button class="rb rb-top" data-btn="vol_up">${_svg('vol_up',20)}</button>
      <span class="rk-lbl">VOL</span>
      <button class="rb rb-bot" data-btn="vol_down">${_svg('vol_down',20)}</button>
    </div>
    <button class="fn-btn" data-btn="mute">${_svg('mute',24)}<span>Mute</span></button>
    <div class="rocker-v">
      <button class="rb rb-top" data-btn="ch_up">${_svg('dir_up',20)}</button>
      <span class="rk-lbl">CH</span>
      <button class="rb rb-bot" data-btn="ch_down">${_svg('dir_down',20)}</button>
    </div>
  </div>

  <!-- D-Pad area -->
  <div class="dpad-area">
    <div class="fn-row" id="hcv2-exitmenu">
      <button class="fn-btn" data-btn="exit">${_svg('exit',22)}<span>Exit</span></button>
      <button class="fn-btn" data-btn="menu">${_svg('menu',22)}<span>Menu</span></button>
    </div>
    <div class="dpad">
      <div class="dp-top"><button class="dp-btn" data-btn="dir_up">${_svg('dir_up',28)}</button></div>
      <div class="dp-mid">
        <button class="dp-btn" data-btn="dir_left">${_svg('dir_left',28)}</button>
        <button class="dp-ok" data-btn="ok">OK</button>
        <button class="dp-btn" data-btn="dir_right">${_svg('dir_right',28)}</button>
      </div>
      <div class="dp-bot"><button class="dp-btn" data-btn="dir_down">${_svg('dir_down',28)}</button></div>
    </div>
    <div class="fn-row">
      <button class="fn-btn" data-btn="back">${_svg('back',22)}<span>Back</span></button>
      <button class="fn-btn" data-btn="info">${_svg('info',22)}<span>Info</span></button>
    </div>
  </div>

  <!-- Color buttons (contextual) -->
  <div class="color-row" id="hcv2-color">
    <button class="color-btn c-red"    data-btn="red"></button>
    <button class="color-btn c-green"  data-btn="green"></button>
    <button class="color-btn c-yellow" data-btn="yellow"></button>
    <button class="color-btn c-blue"   data-btn="blue"></button>
  </div>

  <!-- Transport: 3×2 grid, play/pause toggle (contextual) -->
  <div id="hcv2-t1">
    <div class="tp-row">
      <button class="tp-btn" data-btn="skip_back">${_svg('skip_back',22)}</button>
      <button class="tp-btn tp-play" id="hcv2-pp" data-btn="play">${_svg('play',28)}</button>
      <button class="tp-btn" data-btn="skip_forward">${_svg('skip_fwd',22)}</button>
    </div>
    <div class="tp-row">
      <button class="tp-btn" data-btn="rewind">${_svg('rewind',22)}</button>
      <button class="tp-btn tp-stop" data-btn="stop">${_svg('stop',22)}</button>
      <button class="tp-btn" data-btn="fast_forward">${_svg('fwd',22)}</button>
    </div>
  </div>

  <!-- Numpad (contextual, collapsible) -->
  <div class="num-section" id="hcv2-num">
    <button class="num-toggle" id="hcv2-numtgl">${_svg('numpad',18)} Zifferntasten
      <svg class="chev" id="hcv2-chev" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="${_P.chev_down}"/></svg>
    </button>
    <div class="num-grid" id="hcv2-numgrid">
      ${[1,2,3,4,5,6,7,8,9].map(n=>`<button class="num-btn" data-btn="num_${n}">${n}</button>`).join('')}
      <button class="num-btn" data-btn="num_minus">−</button>
      <button class="num-btn" data-btn="num_0">0</button>
      <button class="num-btn" data-btn="num_enter">OK</button>
    </div>
  </div>

</div><!-- /flt-remote -->
</div><!-- /card -->

<!-- Device Quick Sheet -->
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

        // Status row
        const sr = root.getElementById('hcv2-status');
        if (sr) {
            if (activeSkin && activeSkin !== 'flat') {
                sr.textContent = isOn ? current : '';
            } else {
                sr.innerHTML = `
              <div class="st-dot ${isOn ? 'dot-on' : 'dot-off'}"></div>
              <span class="st-txt">${_e(isOn ? current : 'Kein Gerät aktiv')}</span>
            `;
            }
        }

        // Activity display bar (flat skin, show_display: true)
        const dispAct = root.getElementById('hcv2-disp-act');
        const dispDot = root.getElementById('hcv2-disp-dot');
        if (dispAct) dispAct.textContent = isOn ? current : 'Kein Gerät aktiv';
        if (dispDot) dispDot.classList.toggle('disp-dot--on', isOn);

        // Reset play/pause button icon on activity change
        const pp = root.getElementById('hcv2-pp');
        if (pp) pp.innerHTML = _svg(this._playing ? 'pause' : 'play', 28);

        // Zone visibility — flat skin only (non-flat skins manage their own visibility)
        const flatSkin = !activeSkin || activeSkin === 'flat';
        if (flatSkin) {
            const vis = (id, on) => { const el = root.getElementById(id); if (el) el.style.display = on ? '' : 'none'; };
            vis('hcv2-volch',    this._zoneOn(['vol_up','vol_down','mute','ch_up','ch_down']));
            vis('hcv2-exitmenu', this._zoneOn(['exit','menu']));
            vis('hcv2-color',    this._zoneOn(['red','green','yellow','blue']));
            vis('hcv2-t1',       this._zoneOn(['skip_back','rewind','play','pause','stop','fast_forward','skip_forward']));
            vis('hcv2-num',      this._zoneOn(['num_1','num_2','num_3','num_4','num_5','num_6','num_7','num_8','num_9','num_0','num_minus','num_enter']));
        }
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
            this._doCmd(btn.dataset.btn);
        });

        // Status row power button (rendered dynamically — use delegation on status row)
        root.getElementById('hcv2-status').addEventListener('click', e => {
            const btn = e.target.closest('[data-btn]');
            if (!btn) return;
            this._vib();
            this._doCmd(btn.dataset.btn);
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
            e.currentTarget.innerHTML = _svg(this._playing ? 'pause' : 'play', 28);
        });

        // Numpad toggle (flat skin: hcv2-chev; all skins: hcv2-numgrid + .open class on button)
        root.getElementById('hcv2-numtgl')?.addEventListener('click', e => {
            this._vib();
            this._numOpen = !this._numOpen;
            root.getElementById('hcv2-numgrid')?.classList.toggle('open', this._numOpen);
            const chev = root.getElementById('hcv2-chev');
            if (chev) chev.style.transform = this._numOpen ? 'rotate(180deg)' : '';
            e.currentTarget.classList.toggle('open', this._numOpen);
        });
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
        const val    = actMap[btnId] || gb[btnId];
        if (val) this._fire(val);
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
:host{display:block;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
button{background:none;border:none;cursor:pointer;font:inherit;color:inherit;-webkit-tap-highlight-color:transparent;}

/* Outer card — thin wrapper */
.card{background:var(--ha-card-background,var(--card-background-color,#fff));border-radius:var(--ha-card-border-radius,12px);padding:8px;}

/* Remote body — physical frame */
.flt-remote{
  background:var(--secondary-background-color,#f0f0f2);
  border-radius:28px;
  max-width:272px;margin:0 auto;
  padding:16px 14px 22px;
  display:flex;flex-direction:column;align-items:center;gap:10px;
  box-shadow:0 0 0 1px var(--divider-color,rgba(0,0,0,.10)),inset 0 1px 0 rgba(255,255,255,.4);
}

/* Topbar */
.flt-top{width:100%;display:flex;align-items:center;justify-content:space-between;}
.flt-circ{width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,.06);display:flex;align-items:center;justify-content:center;color:var(--secondary-text-color,#666);transition:background .12s;}
.flt-circ:active{background:rgba(0,0,0,.14);}
.flt-pwr{color:#ef4444;}
.flt-st{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:0 6px;}

/* Activity pills */
.act-scroll{width:100%;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:2px 0;}
.act-scroll::-webkit-scrollbar{display:none;}
.pill{flex-shrink:0;height:36px;padding:0 14px;border-radius:18px;display:flex;align-items:center;font-size:12px;font-weight:700;white-space:nowrap;cursor:pointer;user-select:none;background:rgba(0,0,0,.06);color:var(--secondary-text-color,#666);transition:all .15s;}
.pill--on{background:var(--primary-color,#03a9f4);color:#fff;box-shadow:0 2px 8px color-mix(in srgb,var(--primary-color,#03a9f4) 35%,transparent);}
.pill:active{opacity:.75;}
.pill-empty{font-size:12px;color:var(--secondary-text-color,#999);padding:0 4px;}

/* Status */
.st-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.dot-on{background:#22c55e;animation:hcv2p 2s ease infinite;}
.dot-off{background:#94a3b8;}
@keyframes hcv2p{0%,100%{opacity:1}50%{opacity:.3}}
.st-txt{font-size:11px;font-weight:600;color:var(--secondary-text-color,#666);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:140px;}
.conf-err{font-size:11px;color:#ef4444;padding:4px 8px;background:rgba(239,68,68,.06);border-radius:8px;}

/* Activity display bar */
.flt-display{width:100%;display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:14px;background:rgba(0,0,0,.06);min-height:38px;}
.disp-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;background:#94a3b8;transition:background .3s;}
.disp-dot--on{background:#22c55e;}
.disp-act{font-size:12px;font-weight:600;color:var(--primary-text-color,#333);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

/* Vol/CH */
.volch{display:flex;align-items:center;justify-content:center;gap:10px;}
.rocker-v{display:flex;flex-direction:column;align-items:center;background:rgba(0,0,0,.05);border-radius:20px;overflow:hidden;width:68px;}
.rb{width:68px;height:42px;display:flex;align-items:center;justify-content:center;color:var(--primary-text-color,#333);transition:background .1s;}
.rb-top{border-radius:20px 20px 0 0;}.rb-bot{border-radius:0 0 20px 20px;}
.rb:active{background:rgba(0,0,0,.10);}
.rk-lbl{font-size:9px;font-weight:700;letter-spacing:.5px;color:var(--secondary-text-color,#888);padding:1px 0;line-height:1;}
.fn-btn{width:60px;height:60px;border-radius:18px;background:rgba(0,0,0,.05);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:var(--primary-text-color,#333);font-size:9px;font-weight:700;transition:background .12s;}
.fn-btn:active{background:rgba(0,0,0,.10);}

/* D-Pad */
.dpad-area{display:flex;flex-direction:column;align-items:center;gap:8px;}
.fn-row{display:flex;gap:10px;justify-content:center;}
.dpad{display:flex;flex-direction:column;align-items:center;gap:2px;background:rgba(0,0,0,.04);border-radius:26px;padding:8px;width:206px;}
.dp-top,.dp-bot{display:flex;justify-content:center;width:100%;}
.dp-mid{display:flex;align-items:center;justify-content:center;gap:4px;width:100%;}
.dp-btn{width:58px;height:58px;border-radius:16px;display:flex;align-items:center;justify-content:center;color:var(--primary-text-color,#333);transition:background .1s;}
.dp-btn:active{background:rgba(0,0,0,.10);}
.dp-ok{width:70px;height:58px;border-radius:20px;background:var(--primary-color,#03a9f4);color:#fff;font-size:16px;font-weight:900;box-shadow:0 3px 10px color-mix(in srgb,var(--primary-color,#03a9f4) 30%,transparent);transition:opacity .1s;}
.dp-ok:active{opacity:.8;}

/* Color row */
.color-row{display:flex;gap:8px;justify-content:center;}
.color-btn{width:52px;height:28px;border-radius:8px;transition:opacity .1s;}
.color-btn:active{opacity:.75;}
.c-red{background:#ef4444;}.c-green{background:#22c55e;}.c-yellow{background:#eab308;}.c-blue{background:#3b82f6;}

/* Transport 3×2 */
#hcv2-t1{display:flex;flex-direction:column;gap:6px;width:100%;}
.tp-row{display:flex;gap:6px;justify-content:center;}
.tp-btn{flex:1;max-width:80px;height:52px;border-radius:15px;background:rgba(0,0,0,.05);display:flex;align-items:center;justify-content:center;color:var(--primary-text-color,#333);transition:background .1s;}
.tp-btn:active{background:rgba(0,0,0,.10);}
.tp-play{background:rgba(3,169,244,.08);color:var(--primary-color,#03a9f4);}
.tp-play:active{background:rgba(3,169,244,.16);}
.tp-stop{background:rgba(0,0,0,.05);}

/* Numpad */
.num-section{display:flex;flex-direction:column;gap:0;width:100%;}
.num-toggle{display:flex;align-items:center;gap:6px;height:44px;padding:0 14px;border-radius:13px;background:rgba(0,0,0,.04);font-size:13px;font-weight:600;color:var(--secondary-text-color,#666);transition:background .12s;width:100%;}
.num-toggle:active{background:rgba(0,0,0,.10);}
.chev{margin-left:auto;transition:transform .2s;}
.num-grid{display:none;grid-template-columns:repeat(3,1fr);gap:6px;padding-top:8px;}
.num-grid.open{display:grid;}
.num-btn{height:54px;border-radius:13px;background:rgba(0,0,0,.04);font-size:19px;font-weight:700;color:var(--primary-text-color,#333);transition:background .1s;}
.num-btn:active{background:rgba(0,0,0,.10);}

/* Device Quick Sheet */
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
.sh-overlay.open .sh-backdrop{background:rgba(0,0,0,.38);}
.sh-panel{
  position:relative;width:100%;max-width:320px;max-height:72vh;
  margin:0 auto 14px;
  background:var(--ha-card-background,var(--card-background-color,#fff));
  border-radius:26px;
  display:flex;flex-direction:column;
  transform:translateY(120%);
  transition:transform .28s cubic-bezier(.4,0,.2,1);
  overflow:hidden;
  box-shadow:0 0 0 1px var(--divider-color,rgba(0,0,0,.12)),0 12px 40px rgba(0,0,0,.40);
}
.sh-overlay.open .sh-panel{transform:translateY(0);}
.sh-handle{
  width:40px;height:4px;border-radius:2px;
  background:rgba(0,0,0,.12);
  align-self:center;margin:10px 0 0;flex-shrink:0;
}
.sh-head{
  display:flex;align-items:center;padding:8px 8px 12px;gap:4px;flex-shrink:0;
}
.sh-title{
  flex:1;text-align:center;
  font-size:15px;font-weight:800;
  color:var(--primary-text-color,#333);
}
.sh-nav{
  width:42px;height:42px;border-radius:13px;
  display:flex;align-items:center;justify-content:center;
  color:var(--secondary-text-color,#666);
  transition:background .12s;
}
.sh-nav:active{background:rgba(0,0,0,.08);}
.sh-body{overflow-y:auto;padding:0 12px 20px;flex:1;}
.sh-empty{
  padding:28px 0;text-align:center;
  color:var(--secondary-text-color,#888);font-size:13px;line-height:1.6;
}
.sh-empty small{font-size:11px;}
.sh-empty code{background:rgba(0,0,0,.06);border-radius:4px;padding:1px 4px;}

/* Device list */
.dev-row{
  display:flex;align-items:center;gap:12px;
  padding:15px 8px;border-radius:14px;
  cursor:pointer;transition:background .12s;
}
.dev-row:active{background:rgba(0,0,0,.06);}
.dev-name{flex:1;font-size:15px;font-weight:700;color:var(--primary-text-color,#333);}

/* Command grid */
.cmd-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:4px 0;}
.cmd-btn{
  min-height:64px;border-radius:16px;
  background:rgba(0,0,0,.04);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
  font-size:10px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;
  color:var(--primary-text-color,#333);
  transition:background .12s;overflow:hidden;padding:6px 4px;
}
.cmd-btn:active{background:rgba(0,0,0,.10);}
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
        this._currentContext = 'global';
        this._confData       = null;
        this._loading        = false;
        this._loaded         = false;
        this._loadError      = null;
        this._openSections   = new Set(['sec-hub']);
        this._buttonIds = [
            'exit','menu','back','ok',
            'dir_up','dir_down','dir_left','dir_right',
            'vol_up','vol_down','mute','ch_up','ch_down',
            'play','pause','stop',
            'skip_back','skip_forward','rewind','fast_forward','record',
            'info','source',
            'num_1','num_2','num_3','num_4','num_5','num_6',
            'num_7','num_8','num_9','num_0','num_minus','num_enter',
            'dvr_1','dvr_2','dvr_3',
            'red','green','yellow','blue',
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

    async _fetchConf() {
        const url = this._config.config_file || '/local/harmony_12563120.conf';
        this._loadError = null;
        try {
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            this._confData       = data;
            this._cmdOptions     = [];
            this._contextOptions = [{ label: 'Globale Standardbelegung', value: 'global' }];

            if (data.Activities) {
                const ids = Object.keys(data.Activities).filter(id => id !== '-1');
                ids.sort((a, b) => { const an=parseInt(a),bn=parseInt(b); return(isNaN(an)||isNaN(bn))?String(a).localeCompare(String(b)):an-bn; });
                ids.forEach(id => {
                    const name = data.Activities[id];
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
ha-entity-picker,ha-textfield{display:block;width:100%;}
.conf-row{display:flex;gap:8px;align-items:flex-end;}
.conf-row ha-textfield{flex:1;}
.reload-btn{height:56px;padding:0 14px;border-radius:4px;border:1px solid var(--divider-color,#ccc);background:var(--secondary-background-color,#e8e8e8);cursor:pointer;white-space:nowrap;font-size:13px;flex-shrink:0;}
.toggle-row{display:flex;align-items:center;gap:10px;padding:4px 0;}
.toggle-row label{font-size:14px;color:var(--primary-text-color);cursor:pointer;}
.hint{font-size:12px;color:var(--secondary-text-color,#888);padding:4px 0;}
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
        edtRoot.appendChild(this._sectionHub());
        edtRoot.appendChild(this._sectionSkin());
        edtRoot.appendChild(this._sectionButtons());
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
        const { det, body } = this._details('sec-hub', 'Hub');

        const ep = document.createElement('ha-entity-picker');
        ep.hass = this._hass;
        ep.label = 'Harmony Entity (remote.*)';
        ep.value = this._config.entity || '';
        ep.setAttribute('domain-filter', 'remote');
        ep.setAttribute('allow-custom-entity', '');
        ep.addEventListener('value-changed', e => this._up('entity', e.detail.value));
        body.appendChild(this._labeled('Harmony Entity', ep));

        const confRow = document.createElement('div');
        confRow.className = 'conf-row';
        const tf = document.createElement('ha-textfield');
        tf.label = 'Config-Datei (.conf)';
        tf.placeholder = '/local/harmony_XXXXXXXX.conf';
        tf.value = this._config.config_file || '/local/harmony_12563120.conf';
        tf.addEventListener('change', e => this._up('config_file', e.target.value));
        const reloadBtn = document.createElement('button');
        reloadBtn.textContent = '↺ Neu laden';
        reloadBtn.className = 'reload-btn';
        reloadBtn.type = 'button';
        reloadBtn.onclick = () => {
            this._loaded = false; this._loadError = null; this._loading = true;
            this._fetchConf()
                .then(() => { this._loading = false; this._loaded = true; this._buildDOM(); })
                .catch(() => { this._loading = false; this._loaded = true; this._buildDOM(); });
        };
        confRow.appendChild(tf); confRow.appendChild(reloadBtn);
        body.appendChild(confRow);

        return det;
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

        // Context selector + auto-fill
        const ctxRow = document.createElement('div');
        ctxRow.className = 'ctx-row';
        ctxRow.appendChild(this._labeled('Kontext',
            this._nativeSelect(this._contextOptions, this._currentContext, '-- Kontext --',
                v => { this._currentContext = v || 'global'; this._buildDOM(); })
        ));
        const autoBtn = document.createElement('button');
        autoBtn.type = 'button'; autoBtn.className = 'auto-btn';
        const autoIco = document.createElement('ha-icon');
        autoIco.setAttribute('icon','mdi:lightning-bolt');
        autoBtn.appendChild(autoIco);
        autoBtn.appendChild(document.createTextNode(' Auto-befüllen'));
        autoBtn.onclick = () => this._applyAutoMapping(this._currentContext);
        ctxRow.appendChild(autoBtn);
        body.appendChild(ctxRow);

        const hint = document.createElement('div');
        hint.className = 'hint';
        hint.textContent = 'Auto-befüllen: befüllt leere Felder mit dem ersten passenden Befehl aus der Conf. Bereits belegte Felder werden nicht überschrieben.';
        body.appendChild(hint);

        const ctxButtons = (this._config.buttons && this._config.buttons[this._currentContext]) || {};
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
        const cfg  = JSON.parse(JSON.stringify(this._config));
        if (!cfg.buttons)      cfg.buttons      = {};
        if (!cfg.buttons[ctx]) cfg.buttons[ctx] = {};
        if (!value) delete cfg.buttons[ctx][btnId];
        else        cfg.buttons[ctx][btnId] = value;
        if (ctx !== 'global' && Object.keys(cfg.buttons[ctx]).length === 0) {
            delete cfg.buttons[ctx];
        }
        this._config = cfg;
        this._dispatch();
    }

    _applyAutoMapping(ctx) {
        if (!this._confData) return;
        const devices = this._confData.Devices || {};
        const cfg     = JSON.parse(JSON.stringify(this._config));
        if (!cfg.buttons)      cfg.buttons      = {};
        if (!cfg.buttons[ctx]) cfg.buttons[ctx] = {};
        const ctxBtns = cfg.buttons[ctx];
        let filled = 0;
        for (const btnId of this._buttonIds) {
            if (ctxBtns[btnId]) continue;
            const raw = HCV2_FALLBACKS[btnId];
            if (!raw) continue;
            const candidates = Array.isArray(raw) ? raw : [raw];
            for (const candidate of candidates) {
                let found = false;
                for (const devName in devices) {
                    const dev = devices[devName];
                    if (!dev || !Array.isArray(dev.commands)) continue;
                    if (dev.commands.indexOf(candidate) !== -1) {
                        ctxBtns[btnId] = 'command:::' + dev.id + ':::' + candidate;
                        filled++; found = true; break;
                    }
                }
                if (found) break;
            }
        }
        this._config = cfg;
        this._dispatch();
        this._buildDOM();
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
