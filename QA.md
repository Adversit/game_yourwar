# Verification — 2026-10-02

## Passed

- JavaScript syntax checks for game, simulation and included supporting modules
- 11 deterministic simulation checks: unit catalog, budget/side/overlap/NaN rejection, exact-budget deployment, healer-only termination, numerical advantage, ranged combat, giant area damage, actual healing, reproducibility, six preset budgets, 160-unit sandbox termination/finite coordinates
- 160-unit stress simulation completed 91.3 simulated seconds to a result in approximately 1.6 seconds in Node on the build host (this is simulation throughput, not rendered browser FPS)
- Offline Blender lineup render inspected: all four fantasy models have intact limbs, visible texture detail, correct selected accessories and distinct silhouettes
- Four optimized KayKit GLBs parsed with Three.js GLTFLoader; embedded textures structurally load; cloned skin bones present; each retains 14 useful animations
- All eight roles in both teams assembled with the correct visible equipment, independent skeletons and five mapped animation actions
- Mathematical camera/frustum checks at 1440×900, 390×844 and 844×390: outer default army positions remain onscreen and above the deployment toolbar; portrait camera fit and low-height vertical offset adjusted
- HTML IDs, direct JavaScript DOM selectors, responsive CSS breakpoints and local audio/module references checked
- Licensed audio files decoded/transcoded with ffmpeg; battle music and menu music are real recordings, not a synthesized repeated alert tone

## Visual / browser limitations

The cloud browser explicitly rejected the local preview URL with `net::ERR_BLOCKED_BY_CLIENT`. No alternative browser route was used to circumvent that restriction. Consequently live browser gameplay, rendered FPS, touch/keyboard interactions, final responsive layout and audio playback remain unverified in-browser. Offline mesh/skeleton/animation validation and asset render inspection supplement the tests above; they do not replace end-to-end browser QA.

A supported browser WebMCP context was unavailable, so registration and live state read-back for the optional tools remain unverified. Unsupported browsers ignore these tools safely.

## Scope notes

This is an original lightweight formation simulator: full 3D rendered characters, deterministic ground-plane combat/collision physics, animated deaths and visual knockback. It does not claim full articulated ragdoll physics, network multiplayer, unit possession or TABS feature parity.

## Repository packaging verification

Large runtime assets are stored losslessly in versioned fragments and automatically restored by npm lifecycle hooks. The source-sync verification checks fragment and reconstructed SHA-256 hashes, the complete remote Git tree, fresh-checkout tests, static build checks, and the local HTTP server. These checks do not change the browser QA limitations above.
