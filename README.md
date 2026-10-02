# YourWar · 你的战争

A complete Chinese-language, original 3D formation battle simulator. Arrange a tiny fantasy army, hit play, and watch a chaotic melee unfold. Inspired by the formation/sandbox concept of battle simulators; no proprietary TABS assets or branding are used.

## Play

The game opens directly on the battlefield with a ready-to-play first formation.

- **战术挑战:** six scenarios, each with a fixed enemy force and a strict budget
- **自由沙盘:** place both teams with unlimited funds; up to 80 units per side
- Eight roles: swordsman, guardian, pikeman, ranger, berserker, bomber, healer, giant
- Meaningful counters: frontal shields reduce arrow damage; pikes deal bonus damage to giants; explosives break clustered formations; healers preserve wounded allies
- Animated, skinned KayKit models; visible projectiles, area effects, collision separation, knockback and animated/tumbling deaths
- Orbital camera, zoom, pause, 0.5× / 1× / 2× / 4× speed, reset to the original formation and victory results
- Licensed real music for deployment and combat; varied sampled impact sounds; independent volumes and mute

## Controls

| Action | Desktop | Touch |
|---|---|---|
| Deploy | Select unit, click own half | Select unit, tap own half |
| Remove | Right-click or select 移除 | Select 移除, then tap unit |
| Rotate | Drag, or Q/E | One-finger drag |
| Zoom | Wheel / + / − | Pinch / + / − |
| Start / pause | Space / on-screen controls | On-screen controls |
| Return to formation | R / 重新布阵 | 重新布阵 |
| Unit selection | 1–8 / roster | Roster (swipe horizontally) |

Music starts after the first interaction because browsers block unsolicited autoplay. Preferences are stored only in that browser. The simulation automatically pauses when the tab is hidden. A battle has a 180-second simulated-time limit; remaining total health breaks a timeout tie. Healer-only formations cannot start.

## Run locally

No bundler or runtime package installation is needed for the shipped game; all engine, models and audio assets are included in `dist`.

```sh
npm start
# http://localhost:8080
```

Any static HTTP server can serve `dist`. Opening index.html directly through file:// is not supported by module loading. WebGL is required.

## Tests

```sh
npm test
node tests/assets.test.mjs
npm run check
```

`tests/models.test.mjs` additionally performs offline GLTFLoader parsing, skeleton cloning, animation evaluation and all 16 team/unit equipment assemblies. To run it in a clean checkout, install Three.js 0.186.0 locally (`npm install --no-save three@0.186.0`). The game's runtime uses the committed local vendor files, not node_modules.

## Technical design

- `dist/battle.mjs`: deterministic, DOM-independent simulation with seeded randomness
- `dist/game.mjs`: Three.js rendering, asset loading, controls, audio, equipment and UI
- `dist/index.html`, `dist/style.css`: responsive full-screen game interface
- `dist/assets`: versioned local assets and complete attribution
- Optional browser WebMCP: `read_battle_state` and transactional `stage_battle_units`, feature-detected with no effect on unsupported browsers

The collision system is an original lightweight 2D ground-plane solver with visual 3D knockback and death animation, not a full articulated rigid-body physics engine. Camera and models are fully 3D. The 160-unit total cap is a performance safeguard, not a resource limit. Device performance may vary.

## Asset licensing

All included character models, music and sound effects are CC0; Three.js is MIT. Full origins, authors, modifications and license references are in [ATTRIBUTION.txt](dist/assets/ATTRIBUTION.txt). Model animations were trimmed to relevant clips to reduce download size. No external CDN is required for game content; Google Fonts is optional and system fallback fonts work without it.

Gameplay reference consulted: [official TABS press kit](https://landfall.se/tabs-press-kit/). YourWar is not affiliated with Landfall.

## Verification notes

See [QA.md](QA.md) for performed tests and known environment limits.

## Complete source asset packaging

The repository includes all runtime source, models, music and engine code. Seven larger assets are stored as exact-byte fragments under `assets/source/` for reliable source transfer. `assets/source/manifest.json` records every original file and fragment with its byte count and SHA-256 hash. This is lossless packaging; no asset is replaced with a stub or external download.

`npm start`, `npm test`, `npm run check`, and `npm run build` automatically restore and verify these files before running. No manual reconstruction or network access is required. If serving `dist` directly with a different static server, first run `npm run restore:assets`. A clean checkout needs Node.js 20.11+ (24 recommended); `npm start` also uses Python 3 for its static server. The original standalone website files are restored into `dist`, and repeated restores are idempotent.

`npm run build` restores the complete static distribution and runs JavaScript syntax checks; this project intentionally has no bundler. All asset attribution and license files are committed alongside the source.

## Hosted game

[Open YourWar](https://yourwar-battle-forge.dingikang.chatgpt.site) (the owner-private hosted Site requires the owner’s access).

This source snapshot matches Site commit `243a4e3af84917d66af3101b2323f287fca0ace5`; repository-only changes add lossless source packaging and verification instructions.
