/* =====================================================================
 *  flags.js: neutral plain-colour swatches for the Kyiv axis documentary.
 *
 *  Step 3.2 (neutralisation): no national flags. Each side flies a flat solid
 *  swatch. The hoist shadow is kept as a legibility cue on the 3D pole.
 * ===================================================================== */
const W = 230, H = 150;
const RU_RED = "#c0392b", UA_BLUE = "#2471a3";

const flags = {
  ru: (c) => { c.fillStyle = RU_RED;  c.fillRect(0, 0, W, H); },
  ua: (c) => { c.fillStyle = UA_BLUE; c.fillRect(0, 0, W, H); },
};

const flagTexCache = {};
export function flagTexture(unit) {
  if (flagTexCache[unit.id]) return flagTexCache[unit.id];
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const c = cv.getContext("2d");
  const draw = flags[unit.flag];
  if (!draw) console.warn(`unknown flag "${unit.flag}" for ${unit.id}`);
  (draw || flags.ru)(c);
  const sh = c.createLinearGradient(0, 0, W * 0.18, 0);
  sh.addColorStop(0, "rgba(0,0,0,0.28)"); sh.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = sh; c.fillRect(0, 0, W * 0.18, H);
  c.strokeStyle = "rgba(0,0,0,0.42)"; c.lineWidth = 3; c.strokeRect(1.5, 1.5, W - 3, H - 3);
  const tex = new THREE.CanvasTexture(cv); tex.anisotropy = 4; tex.needsUpdate = true;
  flagTexCache[unit.id] = tex; return tex;
}
