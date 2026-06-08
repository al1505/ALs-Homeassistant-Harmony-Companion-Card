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

const HCV2_VERSION = '2.0.0';
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
    vol_up:       'M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z',
    vol_down:     'M5,9V15H9L14,20V4L9,9M21.89,13.54C21.96,13.03 22,12.52 22,12C22,9.26 20.76,6.82 18.83,5.17L17.41,6.59C18.91,7.91 19.9,9.84 19.9,12A7.9,7.9 0 0,1 12,19.9C10.62,19.9 9.32,19.54 8.18,18.91L6.69,20.39C8.24,21.37 10.05,21.9 12,21.9C14.37,21.9 16.56,21.06 18.27,19.65L19.59,20.97L21.07,19.47L20.02,18.42C20.96,17.28 21.63,15.95 21.89,14.46M3.27,4.27L2,5.55L4.39,7.94C3.53,9.21 3,10.55 3,12C3,15.79 5.21,19 8.4,20.8L9.88,19.32C7.1,17.9 5.1,15.17 5.1,12C5.1,10.93 5.35,9.92 5.8,9.01L7.41,10.62C7.15,11.07 7,11.52 7,12A5,5 0 0,0 12,17C12.5,17 12.96,16.87 13.4,16.7L15.12,18.42L16.88,16.68L5.55,5.55L3.27,4.27Z',
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
        return Object.values(this._conf.Devices || {});
    }

    // All configured buttons across all activities targeting a specific device
    _btnsForDevice(devName) {
        if (!this.config || !this.config.buttons) return [];
        const seen = new Set();
        const out  = [];
        const scan = (map) => {
            for (const [btnId, val] of Object.entries(map || {})) {
                if (seen.has(btnId) || typeof val !== 'string') continue;
                if (val.startsWith('command:::')) {
                    const p = val.split(':::');
                    if (p[1] === devName) {
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
<div class="card" id="hcv2-card">

  <!-- Activity bar -->
  <div class="act-bar">
    <div class="act-scroll" id="hcv2-pills">${pillsHtml || '<span class="pill-empty">Config laden…</span>'}</div>
    <button class="icon-btn dev-fab" id="hcv2-devbtn" title="Gerät direkt steuern">${_svg('devices',22)}</button>
  </div>

  <!-- Status -->
  <div class="status-row" id="hcv2-status"></div>

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

    <!-- Exit / Menu row (contextual) -->
    <div class="fn-row" id="hcv2-exitmenu">
      <button class="fn-btn" data-btn="exit">${_svg('exit',22)}<span>Exit</span></button>
      <button class="fn-btn" data-btn="menu">${_svg('menu',22)}<span>Menu</span></button>
    </div>

    <!-- D-Pad -->
    <div class="dpad">
      <div class="dp-top"><button class="dp-btn" data-btn="dir_up">${_svg('dir_up',28)}</button></div>
      <div class="dp-mid">
        <button class="dp-btn" data-btn="dir_left">${_svg('dir_left',28)}</button>
        <button class="dp-ok" data-btn="ok">OK</button>
        <button class="dp-btn" data-btn="dir_right">${_svg('dir_right',28)}</button>
      </div>
      <div class="dp-bot"><button class="dp-btn" data-btn="dir_down">${_svg('dir_down',28)}</button></div>
    </div>

    <!-- Back / Info row -->
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

  <!-- Transport row 1 (contextual) -->
  <div class="tp-row" id="hcv2-t1">
    <button class="tp-btn" data-btn="skip_back">${_svg('skip_back',22)}</button>
    <button class="tp-btn" data-btn="rewind">${_svg('rewind',22)}</button>
    <button class="tp-btn tp-play" data-btn="play">${_svg('play',28)}</button>
    <button class="tp-btn" data-btn="fast_forward">${_svg('fwd',22)}</button>
    <button class="tp-btn" data-btn="skip_forward">${_svg('skip_fwd',22)}</button>
  </div>

  <!-- Transport row 2: Rec/Pause/Stop (contextual) -->
  <div class="tp-row" id="hcv2-t2">
    <button class="tp-btn" data-btn="record">${_svg('record',22)}</button>
    <button class="tp-btn" data-btn="pause">${_svg('pause',22)}</button>
    <button class="tp-btn" data-btn="stop">${_svg('stop',22)}</button>
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
        const root    = this.shadowRoot;
        if (!root) return;
        const current = this._lastAct || 'PowerOff';
        const isOn    = current && current !== 'PowerOff';

        // Activity pills
        root.querySelectorAll('.pill[data-act]').forEach(el => {
            el.classList.toggle('pill--on', el.dataset.act === current);
        });

        // Status row
        const sr = root.getElementById('hcv2-status');
        if (sr) {
            sr.innerHTML = `
              <div class="st-dot ${isOn ? 'dot-on' : 'dot-off'}"></div>
              <span class="st-txt">${_e(isOn ? current + ' · aktiv' : 'Kein Gerät aktiv')}</span>
              ${isOn ? `<button class="pwr-btn icon-btn" data-btn="off" title="Ausschalten">${_svg('power',18)}</button>` : ''}
            `;
        }

        // Zone visibility
        const vis = (id, on) => { const el = root.getElementById(id); if (el) el.style.display = on ? '' : 'none'; };
        vis('hcv2-volch',    this._zoneOn(['vol_up','vol_down','mute','ch_up','ch_down']));
        vis('hcv2-exitmenu', this._zoneOn(['exit','menu']));
        vis('hcv2-color',    this._zoneOn(['red','green','yellow','blue']));
        vis('hcv2-t1',       this._zoneOn(['skip_back','rewind','play','fast_forward','skip_forward']));
        vis('hcv2-t2',       this._zoneOn(['record','pause','stop']));
        vis('hcv2-num',      this._zoneOn(['num_1','num_2','num_3','num_4','num_5','num_6','num_7','num_8','num_9','num_0','num_minus','num_enter']));
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
            const pill = e.target.closest('.pill[data-act]');
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

        // Numpad toggle
        root.getElementById('hcv2-numtgl').addEventListener('click', () => {
            this._vib();
            this._numOpen = !this._numOpen;
            root.getElementById('hcv2-numgrid').classList.toggle('open', this._numOpen);
            root.getElementById('hcv2-chev').style.transform = this._numOpen ? 'rotate(180deg)' : '';
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

    _sheetRenderCmds(devName) {
        const btns = this._btnsForDevice(devName);
        const body = this.shadowRoot.getElementById('hcv2-sh-body');
        if (!body) return;
        if (!btns.length) {
            body.innerHTML = `<p class="sh-empty">Keine konfigurierten Befehle für „${_e(devName)}".<br><small>In der Card-Config unter <code>buttons:</code> eintragen.</small></p>`;
            return;
        }
        const cells = btns.map(b => {
            const ik = _ICON_FOR_BTN[b.btnId];
            const ic = ik ? _svg(ik, 22) : (b.btnId === 'record' ? _svg('record', 22) : '');
            const lbl = b.btnId === 'ok' ? 'OK' : _e(b.cmd);
            return `<button class="cmd-btn" data-cv="${_e(b.val)}">${ic}<span>${lbl}</span></button>`;
        }).join('');
        body.innerHTML = `<div class="cmd-grid">${cells}</div>`;
        body.querySelectorAll('.cmd-btn').forEach(el => {
            el.addEventListener('click', () => { this._vib(); this._fire(el.dataset.cv); });
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

    // ── CSS ───────────────────────────────────────────────────────────────────

    _css() { return `<style>
:host{display:block;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
button{background:none;border:none;cursor:pointer;font:inherit;color:inherit;-webkit-tap-highlight-color:transparent;}

/* Card shell */
.card{
  background:var(--ha-card-background,var(--card-background-color,#fff));
  border-radius:var(--ha-card-border-radius,12px);
  padding:12px 10px 18px;
  display:flex;flex-direction:column;gap:10px;
}

/* Activity bar */
.act-bar{display:flex;align-items:center;gap:8px;}
.act-scroll{
  flex:1;display:flex;gap:6px;
  overflow-x:auto;scrollbar-width:none;
  padding:2px 0;
}
.act-scroll::-webkit-scrollbar{display:none;}
.pill{
  flex-shrink:0;height:48px;padding:0 16px;
  border-radius:24px;
  display:flex;align-items:center;
  font-size:13px;font-weight:700;white-space:nowrap;
  cursor:pointer;user-select:none;
  background:rgba(0,0,0,.05);
  color:var(--secondary-text-color,#666);
  transition:all .15s;
}
.pill--on{
  background:var(--primary-color,#03a9f4);
  color:#fff;
  box-shadow:0 3px 10px color-mix(in srgb,var(--primary-color,#03a9f4) 35%,transparent);
}
.pill:active{opacity:.75;}
.pill-empty{font-size:12px;color:var(--secondary-text-color,#999);padding:0 4px;}
.icon-btn{
  width:48px;height:48px;border-radius:14px;
  background:rgba(0,0,0,.05);
  display:flex;align-items:center;justify-content:center;
  color:var(--secondary-text-color,#666);
  transition:background .12s;
}
.icon-btn:active{background:rgba(0,0,0,.12);}
.dev-fab{flex-shrink:0;}

/* Status */
.status-row{display:flex;align-items:center;gap:8px;padding:0 4px;min-height:36px;}
.st-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.dot-on{background:#22c55e;animation:hcv2p 2s ease infinite;}
.dot-off{background:#94a3b8;}
@keyframes hcv2p{0%,100%{opacity:1}50%{opacity:.3}}
.st-txt{font-size:13px;font-weight:600;color:var(--secondary-text-color,#666);flex:1;}
.pwr-btn{
  width:36px;height:36px;border-radius:10px;
  background:rgba(239,68,68,.08);color:#ef4444;
  display:flex;align-items:center;justify-content:center;
  transition:background .12s;
}
.pwr-btn:active{background:rgba(239,68,68,.18);}
.conf-err{font-size:11px;color:#ef4444;padding:4px 8px;background:rgba(239,68,68,.06);border-radius:8px;}

/* Vol/CH */
.volch{display:flex;align-items:center;justify-content:center;gap:14px;}
.rocker-v{
  display:flex;flex-direction:column;align-items:center;
  background:rgba(0,0,0,.04);border-radius:20px;overflow:hidden;width:72px;
}
.rb{
  width:72px;height:44px;display:flex;align-items:center;justify-content:center;
  color:var(--primary-text-color,#333);transition:background .1s;
}
.rb-top{border-radius:20px 20px 0 0;}
.rb-bot{border-radius:0 0 20px 20px;}
.rb:active{background:rgba(0,0,0,.10);}
.rk-lbl{font-size:10px;font-weight:700;letter-spacing:.5px;color:var(--secondary-text-color,#888);padding:1px 0;line-height:1;}
.fn-btn{
  width:64px;height:64px;border-radius:18px;
  background:rgba(0,0,0,.04);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  color:var(--primary-text-color,#333);
  font-size:10px;font-weight:700;
  transition:background .12s;
}
.fn-btn:active{background:rgba(0,0,0,.10);}

/* D-Pad */
.dpad-area{display:flex;flex-direction:column;align-items:center;gap:8px;}
.fn-row{display:flex;gap:12px;justify-content:center;}
.dpad{
  display:flex;flex-direction:column;align-items:center;gap:2px;
  background:rgba(0,0,0,.03);border-radius:26px;padding:8px;width:210px;
}
.dp-top,.dp-bot{display:flex;justify-content:center;width:100%;}
.dp-mid{display:flex;align-items:center;justify-content:center;gap:4px;width:100%;}
.dp-btn{
  width:60px;height:60px;border-radius:16px;
  display:flex;align-items:center;justify-content:center;
  color:var(--primary-text-color,#333);
  transition:background .1s;
}
.dp-btn:active{background:rgba(0,0,0,.10);}
.dp-ok{
  width:74px;height:60px;border-radius:20px;
  background:var(--primary-color,#03a9f4);color:#fff;
  font-size:17px;font-weight:900;
  box-shadow:0 3px 12px color-mix(in srgb,var(--primary-color,#03a9f4) 30%,transparent);
  transition:opacity .1s;
}
.dp-ok:active{opacity:.8;}

/* Color row */
.color-row{display:flex;gap:8px;justify-content:center;}
.color-btn{width:54px;height:30px;border-radius:9px;transition:opacity .1s;}
.color-btn:active{opacity:.75;}
.c-red{background:#ef4444;} .c-green{background:#22c55e;} .c-yellow{background:#eab308;} .c-blue{background:#3b82f6;}

/* Transport */
.tp-row{display:flex;gap:6px;justify-content:center;}
.tp-btn{
  width:58px;height:54px;border-radius:16px;
  background:rgba(0,0,0,.04);
  display:flex;align-items:center;justify-content:center;
  color:var(--primary-text-color,#333);
  transition:background .1s;
}
.tp-play{width:70px;background:rgba(3,169,244,.08);color:var(--primary-color,#03a9f4);}
.tp-btn:active{background:rgba(0,0,0,.10);}

/* Numpad */
.num-section{display:flex;flex-direction:column;gap:0;}
.num-toggle{
  display:flex;align-items:center;gap:6px;
  height:44px;padding:0 14px;border-radius:13px;
  background:rgba(0,0,0,.04);
  font-size:13px;font-weight:600;
  color:var(--secondary-text-color,#666);
  transition:background .12s;
}
.num-toggle:active{background:rgba(0,0,0,.10);}
.chev{margin-left:auto;transition:transform .2s;}
.num-grid{display:none;grid-template-columns:repeat(3,1fr);gap:6px;padding-top:8px;}
.num-grid.open{display:grid;}
.num-btn{
  height:54px;border-radius:13px;
  background:rgba(0,0,0,.04);
  font-size:19px;font-weight:700;
  color:var(--primary-text-color,#333);
  transition:background .1s;
}
.num-btn:active{background:rgba(0,0,0,.10);}

/* Device Quick Sheet */
.sh-overlay{
  position:fixed;inset:0;z-index:9999;
  display:flex;align-items:flex-end;
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
  position:relative;width:100%;max-height:72vh;
  background:var(--ha-card-background,var(--card-background-color,#fff));
  border-radius:24px 24px 0 0;
  display:flex;flex-direction:column;
  transform:translateY(100%);
  transition:transform .28s cubic-bezier(.4,0,.2,1);
  overflow:hidden;
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
</style>`; }

}

customElements.define('harmony-card-v2', HarmonyCardV2);

window.customCards = window.customCards || [];
window.customCards.push({
    type:        'harmony-card-v2',
    name:        'Harmony Card V2 (Mobile)',
    description: 'Mobile-first Harmony Hub card mit Device Quick Sheet. Pixel 8 Pro optimiert.',
    preview:     false,
    documentationURL: 'https://github.com/al1505/ALs-Homeassistant-Harmony-Companion-Card',
});
