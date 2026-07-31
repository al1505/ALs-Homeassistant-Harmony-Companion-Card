# ALs Homeassistant Harmony Companion Card

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz)
[![GitHub Release](https://img.shields.io/github/v/release/al1505/ALs-Homeassistant-Harmony-Companion-Card?label=Version)](https://github.com/al1505/ALs-Homeassistant-Harmony-Companion-Card/releases)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PayPal](https://img.shields.io/badge/PayPal-Donate-0070ba?logo=paypal&style=flat-square)](https://paypal.me/al1505)

[![HACS hinzufuegen](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=al1505&repository=ALs-Homeassistant-Harmony-Companion-Card&category=plugin)

[🇩🇪 Deutsch](#deutsch) | [🇬🇧 English](#english)

---

## Deutsch

> **Lovelace Custom Card für Home Assistant — Digitaler Zwilling der Logitech Harmony Companion Fernbedienung**
> Mit visuellem Drag-and-Drop-Layout-Editor, Multi-Hub-Support (bis zu 5 Hubs), Smoked-Glass-Display, EPG-Integration und vielem mehr.

---

### 📱 Harmony Card V2 — Mobile-First (neu)

**`harmony-card-v2.js`** — eigenständige, mobile-first Variante für Pixel / Smartphone, **parallel zu V1** (beide koexistieren, V1 bleibt unverändert).

| Feature | V1 | V2 |
|---|---|---|
| Zielgerät | Desktop + Mobile | Mobile-first (Pixel 8 Pro) |
| Touch-Targets | 32–38 px | Activity ≥48 px · D-Pad ≥60 px |
| Device Quick Sheet | — | Gerät direkt steuern aus jeder Activity |
| Visueller Editor | Drag-and-Drop | — (YAML-Config, selbes Schema) |
| Multi-Hub | bis 5 | 1 Hub |
| EPG / Display | Smoked-Glass | — |
| Haptik | — | navigator.vibrate(30) |

**Setup:** `harmony-card-v2.js` wird bei der HACS-Installation automatisch mit heruntergeladen (beide Karten liegen in `dist/`). Nur die Ressource muss einmalig manuell registriert werden:
```yaml
# In HA → Einstellungen → Dashboards → Ressourcen hinzufügen:
# /hacsfiles/ALs-Homeassistant-Harmony-Companion-Card/harmony-card-v2.js  (JavaScript Modul)
```
```yaml
# In der Lovelace-View:
type: custom:harmony-card-v2
entity: remote.harmony_hub
config_file: /local/harmony.conf   # selbe Conf wie V1
buttons:
  global:
    vol_up:    "command:::LG Fernseher:::VolumeUp"
    vol_down:  "command:::LG Fernseher:::VolumeDown"
    mute:      "command:::LG Fernseher:::Mute"
    dir_up:    "command:::LG Fernseher:::DirectionUp"
    dir_down:  "command:::LG Fernseher:::DirectionDown"
    dir_left:  "command:::LG Fernseher:::DirectionLeft"
    dir_right: "command:::LG Fernseher:::DirectionRight"
    ok:        "command:::LG Fernseher:::OK"
    back:      "command:::LG Fernseher:::Back"
    source:    "command:::LG Fernseher:::InputHdmi1"
  Fernsehen:
    ch_up:   "command:::LG Fernseher:::ChannelUp"
    ch_down: "command:::LG Fernseher:::ChannelDown"
  CODI:
    play:  "command:::Apple TV 4K:::Play"
    pause: "command:::Apple TV 4K:::Pause"
```

**Device Quick Sheet:** Tippe auf das Geräte-Symbol rechts in der Activity-Leiste → wähle ein Gerät → dessen konfigurierte Befehle erscheinen als Sheet. Ideal für TV-Source-Wechsel während einer anderen Activity aktiv ist.

---

### ☕ Support

Wenn dir diese Card gefällt und du die Weiterentwicklung unterstützen möchtest:

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-PayPal-0070ba?logo=paypal&style=for-the-badge)](https://paypal.me/al1505)

Direkt-Link: **[paypal.me/al1505](https://paypal.me/al1505)** ❤️

---

### ✨ Features

- 🎮 **Vollständige Aktivitätssteuerung** über Harmony Hub (Activities, Devices, Commands)
- 📺 **TV-EPG-Integration** mit aktuellem Sender, Sendungstitel, Restzeit und Begin-/End-Anzeige
- 🖼️ **Live-Hintergrundbild** vom Receiver (OpenWebIF Grab-Bild)
- 🎨 **Visueller Drag-and-Drop-Layout-Editor** — alles ohne YAML-Editing positionierbar
- 📐 **Konfigurierbares Display-Offset** (Breite/Höhe per Slider/Eingabe)
- 🔌 **Multi-Hub-Support** — bis zu **5 Harmony Hubs** in einer einzigen Card-Instanz
- 👆 **Hub-Wechsel per Swipe-Geste** auf dem Display oder per Dropdown
- 🟢 **Live-Online-Status** pro Hub (grün/rot Punkt)
- 🌫️ **Smoked-Glass-Display** mit konfigurierbarer Farbe (Default `#2A2A3C`)
- 📦 **Multi-Instance Panels & Linien** mit Farbe, Transparenz, Rotation, Eckradius
- 🔤 **Per-Element Schriftart, -größe, -farbe** für alle Text-Elemente
- ⏱️ **Sofortiger EPG-Refresh** nach Kanalwechsel (kein Polling-Wait)
- 🎨 **Per-Hub konfigurierbare Farbe** (Rahmen + Hub-Bar Identity)

---

### 📸 Screenshots

<details open>
<summary><b>🎬 1. TV-Modus mit Live-EPG (ORF SPORT+ HD)</b></summary>

![TV-Modus](screenshots/03-tv-mode1.png)

Card im aktiven TV-Modus: Live-Grab-Bild vom Receiver, Channel-Logo, Sender + Titel mit Restzeit (`+52m`) und Beg-End-Anzeige (`11:00 - 13:00`). Numpad, Farbtasten, D-Pad und Lautstärke/Kanal-Wippe sind eingeblendet.
</details>

<details>
<summary><b>🌓 2. Idle / PowerOff (Smoked-Glass-Display)</b></summary>

![Idle](screenshots/01-idle.png)

Im PowerOff-Zustand zeigt das Display den konfigurierbaren Smoked-Glass-Look (Default `#2A2A3C`). Panels, Linien, Logo und Menü werden komplett ausgeblendet — übrig bleiben nur Power-Button und Aktivitätsname.
</details>

<details>
<summary><b>🔌 3. Multi-Hub-Bar mit Dropdown</b></summary>

![Multi-Hub](screenshots/02-multihub.png)

Multi-Hub-Auswahl oben in der Card: aktueller Hub mit grünem Online-Punkt, Pfeile links/rechts, Klick aufs Caret öffnet die Liste aller konfigurierten Hubs (hier "Hub Office" + "Hub Schlafzimmer" — beide online). Alternativ via Swipe-Geste auf der Display-Zone.
</details>

<details>
<summary><b>🎨 4. Editor mit per-Hub-Rahmen (Hub-Farben)</b></summary>

![Editor Per-Hub](screenshots/04-editor-perhub.png)

Editor mit Hub-Konfiguration aufgeklappt: Hub-Tabs in jeweiliger Farbe, Per-Hub-Bundle (TV-Receiver / Activities / Tasten / Extra-Slots) eingerahmt in der Hub-Farbe. Live-Preview rechts.
</details>

<details>
<summary><b>🖼️ 5. Visueller Display-Layout-Editor (Drag-and-Drop)</b></summary>

![Layout-Editor](screenshots/05-editor-layout.png)

Vollständiger Drag-and-Drop-Layout-Editor: Display-Offset-Inputs, Smoked-Glass-Farbe, Element-Palette (Power, Menü, Panel, Linie, Logo XL/L/M/S, Activity, Sender, Titel, Zeit, Beg-End), Drag-and-Drop-Raster mit positionierten Elementen, Panel-Property-Editor (Farbe / Transparenz / Eckradius), Text-Element-Editor (Schriftgröße / Schriftart / Farbe), Übernehmen/Zurücksetzen.
</details>

<details>
<summary><b>⌨️ 6. Physische Tastenbelegung — pro Aktivität</b></summary>

![Physische Tastenbelegung](screenshots/06-editor-physical-buttons-tv.png)

Mapping zwischen den **physischen Buttons der Card** (DVR, Guide, Info, Farb-Tasten, Exit, Menü, OK-Pad, Volume/Channel, Numpad) und den **Befehlen, die der Harmony Hub sendet** — kontextabhängig je nach aktiver Aktivität.

**Konfigurierbar:**
- **Bearbeite Hub** — welcher Harmony Hub konfiguriert wird (Auswahl unter "Hub-Konfiguration")
- **Kontext (Aktivität)** — Dropdown mit drei Modi:
  - `Globale Standardbelegung` — Fallback wenn keine Aktivitäts-spezifische Belegung gesetzt ist
  - `Aktion: Fernsehen` — Mapping speziell für TV-Aktivität
  - `Aktion: Kodi` — Mapping speziell für Kodi (oder weitere Aktivitäten)
- **Auto-befüllen** — füllt leere Felder mit passenden Befehlen aus der Card-Definition; bestehende Einträge bleiben unangetastet
- **Media-Entity** *(optional)* — HA-Entity, deren Status im Display-Bereich angezeigt wird (z.B. der OpenWebIF-Player für TV-Stream/EPG)
- **Pro physische Taste ein Dropdown** — wählt den Hub-Befehl aus der `.conf`-Datei (Format: `Befehl (Gerät)`, z.B. `Red (Vu+ DVR)` oder `Volume Up (Sony AVR)`)

**Beispiel TV-Aktivität:**

| Card-Taste | Befehl |
|---|---|
| Rot / Grün / Gelb / Blau | `Red`/`Green`/`Yellow`/`Blue` (Vu+ DVR) — EPG-Navigation, Untertitel |
| DVR | `Record` (Vu+ DVR) |
| Guide | `EPG` (Vu+ DVR) |
| Info | `Info` (Vu+ DVR) |
| Exit / Menü | `Exit` / `Menu` (Vu+ DVR) |

**Pro-Aktivität-Override:** dieselbe rote Taste schickt bei `Fernsehen` z.B. `Red` an den Vu+, bei `Kodi` aber `Subtitles` an Kodi. Globale Standardbelegung gilt nur, wenn die aktive Aktivität kein eigenes Mapping definiert.
</details>

> 💡 **Eigene Screenshots beisteuern:** PR welcome — Bilder im Ordner `screenshots/` ablegen.

---

### 🚀 Installation

#### Via HACS (empfohlen)

1. Auf den **HACS-Badge** oben klicken — oder manuell:
   - HACS → **Custom Repositories**
   - URL: `https://github.com/al1505/ALs-Homeassistant-Harmony-Companion-Card`
   - Kategorie: **Plugin**
2. Card installieren → HA neu starten
3. Lovelace Dashboard → **Karte hinzufügen** → **ALs Homeassistant Harmony Companion Card**

#### Manuell

1. `harmony-companion-card.js` aus dem [Latest Release](https://github.com/al1505/ALs-Homeassistant-Harmony-Companion-Card/releases/latest) herunterladen
2. Datei nach `/config/www/community/harmony-companion-card/harmony-companion-card.js` kopieren
3. In Lovelace als Resource registrieren:
   ```yaml
   url: /local/community/harmony-companion-card/harmony-companion-card.js
   type: module
   ```
4. Card im Dashboard hinzufügen

---

### ⚙️ Konfiguration

#### Minimal (Single-Hub Legacy)

```yaml
type: custom:harmony-companion-card
entity: remote.harmony_living
config_file: /local/harmony_living.conf
```

#### Multi-Hub (v5+)

```yaml
type: custom:harmony-companion-card
# Globale Einstellungen (alle Hubs)
display_offset_w: 50
display_offset_h: 21
display_bg_color: "#2A2A3C"
tv_layout:    { ... }   # via Editor erstellt
media_layout: { ... }

# Pro-Hub-Konfiguration
hubs:
  - name: Wohnzimmer
    entity: remote.harmony_living
    config_file: /local/harmony_living.conf
    color: "#03a9f4"
    enigma2_entity: sensor.living_epg
    enigma2_activities: [Fernsehen]
    activity_media:
      Fernsehen: media_player.vu_living
    buttons:
      global: { vol_up: 'command:::DEVICE_ID:::VolumeUp', ... }
      Fernsehen: { ... }
    dynamic_slots:
      act_1: { text: TV, icon: mdi:television, action: 'activity:::Fernsehen' }

  - name: Schlafzimmer
    entity: remote.harmony_bedroom
    config_file: /local/harmony_bedroom.conf
    color: "#27ae60"
    # ... eigene Settings
```

> 💡 **Empfehlung:** Komplette Konfiguration über den **visuellen Editor** statt YAML — zugänglich via Dashboard → Karte bearbeiten → Konfiguration.

---

### 🔗 Dependencies

| Komponente | Pflicht | Zweck |
|------------|---------|-------|
| Home Assistant | ✅ ab 2024.1.0 | Basis |
| Logitech Harmony Hub | ✅ | Steuerung der Geräte |
| HA Harmony Integration | ✅ | Hub-Anbindung an HA (`remote.*` Entitäten) |
| `.conf`-Datei pro Hub | ✅ | Geräte-Befehlsliste (export aus Harmony-App) |
| [ALs Homeassistant Enigma2 EPG](https://github.com/al1505/als-enigma2-epg) | optional | EPG-Daten (Kanal, Titel, Restzeit) für Enigma2-Receiver |
| OpenWebIF | optional | Grab-Bild + Picon-URL (über Enigma2-EPG) |

---

### 📜 Versionshistorie

#### v5.x — Multi-Hub & Smoked-Glass-Era

| Version | Highlights |
|---------|-----------|
| **v5.3.2** | 🐛 Smoked-Glass-Bugfix (LCD_BG-Override entfernt), Power-Button mit solidem grauem Verlauf |
| **v5.3.1** | Hub-Banner in Hub-Farbe, konfigurierbare Display-BG, Power-Button-Optik, Dropdown-Stability-Fix |
| **v5.3.0** | Smoked-Glass-Display, Idle versteckt Panels/Linien/Logo/Menü, Editor-Reorder, Hub-Farben |
| **v5.2.0** | **Per-Hub-Konfiguration**: TV-Receiver, Activities, Slots, Buttons jetzt PRO Hub. Display-Layout bleibt global |
| **v5.1.0** | **Multi-Hub-Support**: bis zu 5 Hubs, Hub-Bar oben mit Dropdown + Online-Status, Swipe-Geste, Editor mit Hub-Tabs |
| **v5.0.0** | Start v5-Entwicklungslinie (Basis v4.9.1) |

#### v4.x — Visual-Editor-Era

| Version | Highlights |
|---------|-----------|
| **v4.9.1** | EPG-Refresh nach Kanalwechsel (verzögerter `homeassistant.update_entity`-Trigger) |
| **v4.9.0** | **Text-Element-Editor** (Schriftgröße/-art/-farbe pro Element), stärkeres Selection-Highlight, Frozen-Object-Fix |
| **v4.8.x** | **Linien-Element** mit Rotation, Slider-Drag-Fix, Transparenz-Slider invertiert |
| **v4.7.0** | **Mehrere Panels** (`panel_1`, `panel_2`, ...) mit nachträglicher Bearbeitung |
| **v4.6.x** | **Panel-Element** (Hintergrund-Box mit Farbe/Alpha/Eckradius) |
| **v4.5.x** | Konfigurierbare Display-Offsets, Burger-Menü-Element |
| **v4.4.x** | Element-Größen-Updates, +20px Display-Offset, "Übernehmen"-Button (Auto-Save raus) |
| **v4.3.x** | Logo M, neue Default-Größen, Bottom/Right-Anchoring entfernt — keine Sprünge mehr |
| **v4.2.0** | Zeit-Format `+109m`, neues "Beg-End"-Element |
| **v4.1.0** | **Resize-Funktion** für Editor-Elemente (Ecken-Handle) |
| **v4.0.x** | **Visueller Drag-and-Drop Layout-Editor** ersetzt statische `[data-layout]`-CSS |

#### v3.x — TV-Display-Era

| Version | Highlights |
|---------|-----------|
| **v3.21.x** | Display-Höhe `126px !important`, Kodi-Media-Mode mit Titel/Zeit unten-links |
| **v3.20.x** | Bottom-Row-Clearance, Uhr-Suffix, Transition-Fix |
| **v3.19.x** | URL-Feld + Camera entfernt, Layout-Refactoring |
| **v3.10–18** | TV-Display, EPG-Integration (3 Layouts), Picon-URL, Channel-Color-Extraction, Restzeit-Anzeige |

> 📋 Vollständige Release-Notes: [GitHub Releases](https://github.com/al1505/ALs-Homeassistant-Harmony-Companion-Card/releases)

---

### 🏗️ Architektur

- **Shadow-DOM-Isolation** für Card, **Light-DOM** für Editor (HA-Selectors funktionieren nur im Light-DOM)
- **Modulare 7-Säulen-Struktur**: SETUP, FRONTEND, LOGIC, INTEGRATION, HELPERS, REFRESH, DATA
- **Backward-Compatibility**: Single-Hub-Configs ohne `hubs[]` werden weiterhin als Hub 1 erkannt
- **Immutable Updates**: Property-Editoren nutzen Spread-Operator → keine Frozen-Object-Errors mehr
- **Center-anchored Coordinates**: keine Sprünge beim Verschieben über Display-Mittellinie
- **Multi-Instance Pattern** (`panel_N`, `line_N`): dynamische DOM-Erstellung in `_applyDisplayLayout`

Mehr Details: siehe [`HA-ARCHITECTURE.md`](../HA-ARCHITECTURE.md) (strikte Mandate), [`HA-COOKBOOK.md`](../HA-COOKBOOK.md) (Setup-Rezepte) und [`HA-RETROSPECTIVE.md`](../HA-RETROSPECTIVE.md) (Lessons Learned) im Workspace.

---

### 🛠️ Entwicklung

```bash
# Repo klonen
git clone https://github.com/al1505/ALs-Homeassistant-Harmony-Companion-Card.git
cd ALs-Homeassistant-Harmony-Companion-Card

# Datei direkt nach HA kopieren (Symlink für Live-Reload empfohlen)
cp dist/harmony-companion-card.js /config/www/community/harmony-companion-card/

# Browser Hard-Refresh (Ctrl+Shift+R) — HA cached die JS-Datei
```

**Versions-Tag = Release**: jeder Tag wird als GitHub Release publiziert. HACS installiert beide Karten aus dem `dist/`-Verzeichnis des Release-Stands.

---

### 📄 Lizenz

MIT License — siehe [LICENSE](LICENSE)

---

### 🙏 Danke

Wenn dir die Card im Alltag hilft → freue ich mich über einen kleinen Kaffee:

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-PayPal-0070ba?logo=paypal&style=for-the-badge)](https://paypal.me/al1505)

**[paypal.me/al1505](https://paypal.me/al1505)** ☕

---

*Entwickelt mit ❤️ von [al1505](https://github.com/al1505)*

---

## English

> **Lovelace custom card for Home Assistant — digital twin of the Logitech Harmony Companion remote control**
> With a visual drag-and-drop layout editor, multi-hub support (up to 5 hubs), smoked-glass display, EPG integration and much more.

---

### 📱 Harmony Card V2 — Mobile-First (new)

**`harmony-card-v2.js`** — standalone, mobile-first variant for Pixel / smartphone, **runs alongside V1** (both coexist, V1 remains unchanged).

| Feature | V1 | V2 |
|---|---|---|
| Target device | Desktop + Mobile | Mobile-first (Pixel 8 Pro) |
| Touch targets | 32–38 px | Activity ≥48 px · D-Pad ≥60 px |
| Device Quick Sheet | — | Control a device directly from any activity |
| Visual editor | Drag-and-drop | — (YAML config, same schema) |
| Multi-hub | up to 5 | 1 hub |
| EPG / Display | Smoked glass | — |
| Haptics | — | navigator.vibrate(30) |

**Setup:** `harmony-card-v2.js` is automatically downloaded together with the HACS installation (both cards live in `dist/`). Only the resource needs to be registered manually, once:
```yaml
# In HA → Settings → Dashboards → Add Resources:
# /hacsfiles/ALs-Homeassistant-Harmony-Companion-Card/harmony-card-v2.js  (JavaScript Module)
```
```yaml
# In the Lovelace view:
type: custom:harmony-card-v2
entity: remote.harmony_hub
config_file: /local/harmony.conf   # same conf as V1
buttons:
  global:
    vol_up:    "command:::LG Fernseher:::VolumeUp"
    vol_down:  "command:::LG Fernseher:::VolumeDown"
    mute:      "command:::LG Fernseher:::Mute"
    dir_up:    "command:::LG Fernseher:::DirectionUp"
    dir_down:  "command:::LG Fernseher:::DirectionDown"
    dir_left:  "command:::LG Fernseher:::DirectionLeft"
    dir_right: "command:::LG Fernseher:::DirectionRight"
    ok:        "command:::LG Fernseher:::OK"
    back:      "command:::LG Fernseher:::Back"
    source:    "command:::LG Fernseher:::InputHdmi1"
  Fernsehen:
    ch_up:   "command:::LG Fernseher:::ChannelUp"
    ch_down: "command:::LG Fernseher:::ChannelDown"
  CODI:
    play:  "command:::Apple TV 4K:::Play"
    pause: "command:::Apple TV 4K:::Pause"
```

**Device Quick Sheet:** Tap the device icon on the right of the activity bar → select a device → its configured commands appear as a sheet. Ideal for switching the TV source while a different activity is active.

---

### ☕ Support

If you like this card and want to support its ongoing development:

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-PayPal-0070ba?logo=paypal&style=for-the-badge)](https://paypal.me/al1505)

Direct link: **[paypal.me/al1505](https://paypal.me/al1505)** ❤️

---

### ✨ Features

- 🎮 **Full activity control** via Harmony Hub (Activities, Devices, Commands)
- 📺 **TV EPG integration** with current channel, program title, remaining time and start/end display
- 🖼️ **Live background image** from the receiver (OpenWebIF grab image)
- 🎨 **Visual drag-and-drop layout editor** — position everything without YAML editing
- 📐 **Configurable display offset** (width/height via slider/input)
- 🔌 **Multi-hub support** — up to **5 Harmony Hubs** in a single card instance
- 👆 **Hub switching via swipe gesture** on the display or via dropdown
- 🟢 **Live online status** per hub (green/red dot)
- 🌫️ **Smoked-glass display** with configurable color (default `#2A2A3C`)
- 📦 **Multi-instance panels & lines** with color, transparency, rotation, corner radius
- 🔤 **Per-element font, size, color** for all text elements
- ⏱️ **Instant EPG refresh** after channel change (no polling wait)
- 🎨 **Per-hub configurable color** (border + hub bar identity)

---

### 📸 Screenshots

<details open>
<summary><b>🎬 1. TV mode with live EPG (ORF SPORT+ HD)</b></summary>

![TV mode](screenshots/03-tv-mode1.png)

Card in active TV mode: live grab image from the receiver, channel logo, channel + title with remaining time (`+52m`) and start-end display (`11:00 - 13:00`). Numpad, color buttons, D-pad and volume/channel rocker are shown.
</details>

<details>
<summary><b>🌓 2. Idle / power off (smoked-glass display)</b></summary>

![Idle](screenshots/01-idle.png)

In the power-off state, the display shows the configurable smoked-glass look (default `#2A2A3C`). Panels, lines, logo and menu are completely hidden — only the power button and activity name remain.
</details>

<details>
<summary><b>🔌 3. Multi-hub bar with dropdown</b></summary>

![Multi-hub](screenshots/02-multihub.png)

Multi-hub selector at the top of the card: current hub with a green online dot, left/right arrows, clicking the caret opens the list of all configured hubs (here "Hub Office" + "Hub Bedroom" — both online). Alternatively via swipe gesture on the display zone.
</details>

<details>
<summary><b>🎨 4. Editor with per-hub borders (hub colors)</b></summary>

![Editor per-hub](screenshots/04-editor-perhub.png)

Editor with the hub configuration expanded: hub tabs in their respective color, per-hub bundle (TV receiver / activities / buttons / extra slots) framed in the hub color. Live preview on the right.
</details>

<details>
<summary><b>🖼️ 5. Visual display layout editor (drag-and-drop)</b></summary>

![Layout editor](screenshots/05-editor-layout.png)

Full drag-and-drop layout editor: display offset inputs, smoked-glass color, element palette (Power, Menu, Panel, Line, Logo XL/L/M/S, Activity, Channel, Title, Time, Start-End), drag-and-drop grid with positioned elements, panel property editor (color / transparency / corner radius), text element editor (font size / font / color), Apply/Reset.
</details>

<details>
<summary><b>⌨️ 6. Physical button mapping — per activity</b></summary>

![Physical button mapping](screenshots/06-editor-physical-buttons-tv.png)

Mapping between the **physical buttons of the card** (DVR, Guide, Info, color buttons, Exit, Menu, OK pad, Volume/Channel, Numpad) and the **commands sent by the Harmony Hub** — context-dependent based on the active activity.

**Configurable:**
- **Edit hub** — which Harmony Hub is being configured (selection under "Hub Configuration")
- **Context (Activity)** — dropdown with three modes:
  - `Global default mapping` — fallback when no activity-specific mapping is set
  - `Action: Fernsehen` (TV) — mapping specific to the TV activity
  - `Action: Kodi` — mapping specific to Kodi (or other activities)
- **Auto-fill** — fills empty fields with matching commands from the card definition; existing entries remain untouched
- **Media entity** *(optional)* — HA entity whose state is shown in the display area (e.g. the OpenWebIF player for TV stream/EPG)
- **One dropdown per physical button** — selects the hub command from the `.conf` file (format: `Command (Device)`, e.g. `Red (Vu+ DVR)` or `Volume Up (Sony AVR)`)

**Example TV activity:**

| Card button | Command |
|---|---|
| Red / Green / Yellow / Blue | `Red`/`Green`/`Yellow`/`Blue` (Vu+ DVR) — EPG navigation, subtitles |
| DVR | `Record` (Vu+ DVR) |
| Guide | `EPG` (Vu+ DVR) |
| Info | `Info` (Vu+ DVR) |
| Exit / Menu | `Exit` / `Menu` (Vu+ DVR) |

**Per-activity override:** the same red button sends e.g. `Red` to the Vu+ during `Fernsehen` (TV), but `Subtitles` to Kodi during `Kodi`. The global default mapping only applies when the active activity has no mapping of its own.
</details>

> 💡 **Contribute your own screenshots:** PRs welcome — drop images into the `screenshots/` folder.

---

### 🚀 Installation

#### Via HACS (recommended)

1. Click the **HACS badge** above — or manually:
   - HACS → **Custom Repositories**
   - URL: `https://github.com/al1505/ALs-Homeassistant-Harmony-Companion-Card`
   - Category: **Plugin**
2. Install the card → restart HA
3. Lovelace dashboard → **Add Card** → **ALs Homeassistant Harmony Companion Card**

#### Manual

1. Download `harmony-companion-card.js` from the [Latest Release](https://github.com/al1505/ALs-Homeassistant-Harmony-Companion-Card/releases/latest)
2. Copy the file to `/config/www/community/harmony-companion-card/harmony-companion-card.js`
3. Register it as a resource in Lovelace:
   ```yaml
   url: /local/community/harmony-companion-card/harmony-companion-card.js
   type: module
   ```
4. Add the card to the dashboard

---

### ⚙️ Configuration

#### Minimal (single-hub legacy)

```yaml
type: custom:harmony-companion-card
entity: remote.harmony_living
config_file: /local/harmony_living.conf
```

#### Multi-hub (v5+)

```yaml
type: custom:harmony-companion-card
# Global settings (all hubs)
display_offset_w: 50
display_offset_h: 21
display_bg_color: "#2A2A3C"
tv_layout:    { ... }   # created via the editor
media_layout: { ... }

# Per-hub configuration
hubs:
  - name: Wohnzimmer
    entity: remote.harmony_living
    config_file: /local/harmony_living.conf
    color: "#03a9f4"
    enigma2_entity: sensor.living_epg
    enigma2_activities: [Fernsehen]
    activity_media:
      Fernsehen: media_player.vu_living
    buttons:
      global: { vol_up: 'command:::DEVICE_ID:::VolumeUp', ... }
      Fernsehen: { ... }
    dynamic_slots:
      act_1: { text: TV, icon: mdi:television, action: 'activity:::Fernsehen' }

  - name: Schlafzimmer
    entity: remote.harmony_bedroom
    config_file: /local/harmony_bedroom.conf
    color: "#27ae60"
    # ... own settings
```

> 💡 **Recommendation:** Configure everything via the **visual editor** instead of YAML — accessible via Dashboard → Edit Card → Configuration.

---

### 🔗 Dependencies

| Component | Required | Purpose |
|------------|---------|---------|
| Home Assistant | ✅ 2024.1.0 or later | Base platform |
| Logitech Harmony Hub | ✅ | Controls the devices |
| HA Harmony Integration | ✅ | Connects the hub to HA (`remote.*` entities) |
| `.conf` file per hub | ✅ | Device command list (exported from the Harmony app) |
| [ALs Homeassistant Enigma2 EPG](https://github.com/al1505/als-enigma2-epg) | optional | EPG data (channel, title, remaining time) for Enigma2 receivers |
| OpenWebIF | optional | Grab image + picon URL (via Enigma2 EPG) |

---

### 📜 Version History

#### v5.x — Multi-Hub & Smoked-Glass Era

| Version | Highlights |
|---------|-----------|
| **v5.3.2** | 🐛 Smoked-glass bugfix (removed LCD_BG override), power button with solid gray gradient |
| **v5.3.1** | Hub banner in hub color, configurable display background, power button styling, dropdown stability fix |
| **v5.3.0** | Smoked-glass display, idle hides panels/lines/logo/menu, editor reorder, hub colors |
| **v5.2.0** | **Per-hub configuration**: TV receiver, activities, slots, buttons now PER hub. Display layout stays global |
| **v5.1.0** | **Multi-hub support**: up to 5 hubs, hub bar at the top with dropdown + online status, swipe gesture, editor with hub tabs |
| **v5.0.0** | Start of the v5 development line (based on v4.9.1) |

#### v4.x — Visual Editor Era

| Version | Highlights |
|---------|-----------|
| **v4.9.1** | EPG refresh after channel change (delayed `homeassistant.update_entity` trigger) |
| **v4.9.0** | **Text element editor** (font size/family/color per element), stronger selection highlight, frozen-object fix |
| **v4.8.x** | **Line element** with rotation, slider drag fix, transparency slider inverted |
| **v4.7.0** | **Multiple panels** (`panel_1`, `panel_2`, ...) with subsequent editing |
| **v4.6.x** | **Panel element** (background box with color/alpha/corner radius) |
| **v4.5.x** | Configurable display offsets, burger menu element |
| **v4.4.x** | Element size updates, +20px display offset, "Apply" button (auto-save removed) |
| **v4.3.x** | Logo M, new default sizes, bottom/right anchoring removed — no more jumps |
| **v4.2.0** | Time format `+109m`, new "start-end" element |
| **v4.1.0** | **Resize function** for editor elements (corner handle) |
| **v4.0.x** | **Visual drag-and-drop layout editor** replaces static `[data-layout]` CSS |

#### v3.x — TV Display Era

| Version | Highlights |
|---------|-----------|
| **v3.21.x** | Display height `126px !important`, Kodi media mode with title/time bottom-left |
| **v3.20.x** | Bottom row clearance, clock suffix, transition fix |
| **v3.19.x** | URL field + camera removed, layout refactoring |
| **v3.10–18** | TV display, EPG integration (3 layouts), picon URL, channel color extraction, remaining-time display |

> 📋 Full release notes: [GitHub Releases](https://github.com/al1505/ALs-Homeassistant-Harmony-Companion-Card/releases)

---

### 🏗️ Architecture

- **Shadow DOM isolation** for the card, **Light DOM** for the editor (HA selectors only work in the Light DOM)
- **Modular 7-pillar structure**: SETUP, FRONTEND, LOGIC, INTEGRATION, HELPERS, REFRESH, DATA
- **Backward compatibility**: single-hub configs without `hubs[]` are still recognized as Hub 1
- **Immutable updates**: property editors use the spread operator → no more frozen-object errors
- **Center-anchored coordinates**: no jumps when moving across the display center line
- **Multi-instance pattern** (`panel_N`, `line_N`): dynamic DOM creation in `_applyDisplayLayout`

More details: see [`HA-ARCHITECTURE.md`](../HA-ARCHITECTURE.md) (strict mandates), [`HA-COOKBOOK.md`](../HA-COOKBOOK.md) (setup recipes) and [`HA-RETROSPECTIVE.md`](../HA-RETROSPECTIVE.md) (lessons learned) in the workspace.

---

### 🛠️ Development

```bash
# Clone the repo
git clone https://github.com/al1505/ALs-Homeassistant-Harmony-Companion-Card.git
cd ALs-Homeassistant-Harmony-Companion-Card

# Copy the file directly into HA (symlink recommended for live reload)
cp dist/harmony-companion-card.js /config/www/community/harmony-companion-card/

# Browser hard refresh (Ctrl+Shift+R) — HA caches the JS file
```

**Version tag = release**: every tag is published as a GitHub release. HACS installs both cards from the `dist/` directory of the release state.

---

### 📄 License

MIT License — see [LICENSE](LICENSE)

---

### 🙏 Thanks

If this card helps you in everyday use → I'd appreciate a small coffee:

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-PayPal-0070ba?logo=paypal&style=for-the-badge)](https://paypal.me/al1505)

**[paypal.me/al1505](https://paypal.me/al1505)** ☕

---

*Developed with ❤️ by [al1505](https://github.com/al1505)*
