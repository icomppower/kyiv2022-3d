/* =====================================================================
 *  data.js: The Kyiv Axis, 24-25 February 2022
 *  ---------------------------------------------------------------------
 *  Forked from keithligh/cinematic-3d-battle-engine.
 *  Reference: icomppower/ukraine2022feb (scenes.js, OVERLAYS, SOURCES).
 *  Coordinates are real WGS84 lng/lat from the 2D source build.
 *  Evidence tags (VERIFIED / APPROX. / CONTESTED) match the sourced levels
 *  in the original; see notes.caveats for the evidence-tag key.
 *
 *  Tight box: minLng:29.85, maxLng:31.05, minLat:50.32, maxLat:50.82, Z:12.
 *  Outliers demoted to narration: Chornobyl (51.39N), Ivankiv (50.94N),
 *  Vasylkiv (50.24N), Boryspil (50.35N) — all outside the safe edge band.
 * ===================================================================== */
window.BATTLE_DATA = (function () {

  const RU = "ru", UA = "ua";

  const factions = {
    ru: { main:0xc0392b, glow:0xd9534f, dim:0x7a1f1f, css:"#c0392b",
          name_zh:"Russian forces", name_en:"Russian forces",
          role:"attacker", maxStrength:5000, defaultFlag:"ru" },
    ua: { main:0x2471a3, glow:0x3498db, dim:0x1a4f72, css:"#2471a3",
          name_zh:"Ukrainian forces", name_en:"Ukrainian forces",
          role:"defender", maxStrength:5000, defaultFlag:"ua" },
  };

  /* tight box: every unit coord sits >8% inside each edge
   * safe lng: [29.946, 30.954]  safe lat: [50.360, 50.780]             */
  const meta = {
    geo: { minLng:29.85, maxLng:31.05, minLat:50.32, maxLat:50.82, Z:12 },
    dayMin:1, dayMax:2.8, year:2022, month:2, lastDay:25,
    title:"The Kyiv Axis", subtitle:"24-25 February 2022",
    theme: {
      /* flat legible satellite; no sepia/grain (neutralisation step 3.1)  */
      grade: { filter:"none", vignette:0.12, grain:0, brightness:1.06 },
    },
    ui: { sceneLabel:false },
  };

  const intro = {
    title_zh:"The Kyiv Axis", title_en:"The Kyiv Axis",
    sub_zh:"24-25 February 2022: the airborne assault on Hostomel and the race for the capital.",
    sub_en:"24-25 February 2022: the airborne assault on Hostomel and the race for the capital.",
    cam: { lng:30.45, lat:50.57, dist:2400, az:0, el:46, orbit:0.5 },
  };

  const outro = {
    title_zh:"The Kyiv Axis", title_en:"The Kyiv Axis",
    narration_zh:"The bid to seize Kyiv in a single airmobile strike had failed. Fighting shifted to Bucha, Irpin, and the western approaches. Evidence tags on each caption mark the confidence level of each claim. Sources are listed in the Notes panel.",
    narration_en:"The bid to seize Kyiv in a single airmobile strike had failed. Fighting shifted to Bucha, Irpin, and the western approaches. Evidence tags on each caption mark the confidence level of each claim. Sources are listed in the Notes panel.",
    cam: { lng:30.37, lat:50.54, dist:2700, az:0, el:44, orbit:1.0, tween:3.4 },
  };

  /* flagLegend: plain swatch rows; civilian sites are geography.points
   * (grey labels), not faction units                                     */
  const flagLegend = [
    { flag:"ru", zh:"Russian forces",    en:"Russian forces",    faction:"ru" },
    { flag:"ua", zh:"Ukrainian forces",  en:"Ukrainian forces",  faction:"ua" },
  ];

  /* ---- geography --------------------------------------------------- */
  const geography = {
    points: [
      { name_en:"Antonov Airport (Hostomel)", name_zh:"Antonov Airport (Hostomel)",
        type:"fort",   lng:30.192, lat:50.603, h:0 },
      { name_en:"Hostomel",  name_zh:"Hostomel",  type:"town",   lng:30.262, lat:50.649, h:0 },
      { name_en:"Bucha",     name_zh:"Bucha",     type:"town",   lng:30.224, lat:50.544, h:0 },
      { name_en:"Irpin",     name_zh:"Irpin",     type:"town",   lng:30.247, lat:50.530, h:0 },
      { name_en:"Kyiv",      name_zh:"Kyiv",      type:"region", lng:30.524, lat:50.450, h:0 },
    ],
    lines: [
      /* Irpin flood barrier — draws in late to show engineers opening it */
      { name_en:"Irpin flood barrier", name_zh:"Irpin flood barrier",
        color:"#4a90d9",
        path:[[30.300,50.700],[30.300,50.610],[30.310,50.530],[30.330,50.460]],
        fade:{ holdUntil:2.05, collapseBy:2.30, span:0.30 } },
    ],
  };

  /* ---- units (all cf:false — no strength bars; neutralisation 3.3) -- *
   *  d=1 = 24 Feb 00:00; d=2 = 25 Feb 00:00; d=2.6 = night 25-26.
   *  Air unit tracks begin inside the safe-zone box edge (lat <= 50.78).
   * ------------------------------------------------------------------- */
  const units = [
    /* Ka-52 lead gunship: downed en route, short of the airfield        */
    { id:"ru_ka52", faction:RU, kind:"air", flag:"ru", cf:false,
      name_zh:"Ka-52 gunship", name_en:"Ka-52 gunship",
      track:[
        { d:1.40, lng:30.47, lat:50.76, s:200, st:"march"  },
        { d:1.43, lng:30.49, lat:50.65, s:200, st:"dead"   },
      ] },

    /* Mi-8 transports (survivors): fly south, land, egress northward    */
    { id:"ru_heli", faction:RU, kind:"air", flag:"ru", cf:false,
      name_zh:"Mi-8 transports", name_en:"Mi-8 transports",
      track:[
        { d:1.40, lng:30.47, lat:50.76, s:300, st:"march"   },
        { d:1.43, lng:30.49, lat:50.64, s:300, st:"march"   },
        { d:1.45, lng:30.32, lat:50.61, s:300, st:"march"   },
        { d:1.47, lng:30.19, lat:50.60, s:300, st:"landing" },
        { d:1.72, lng:30.32, lat:50.65, s:300, st:"march"   },
      ] },

    /* VDV airborne: activates at landing; holds at airfield             */
    { id:"ru_vdv", faction:RU, kind:"infantry", flag:"ru", cf:false,
      name_zh:"VDV 31st Gds / 45th Spetsnaz", name_en:"VDV 31st Gds / 45th Spetsnaz",
      track:[
        { d:1.46, lng:30.180, lat:50.610, s:400, st:"landing" },
        { d:1.65, lng:30.192, lat:50.603, s:400, st:"attack"  },
        { d:2.00, lng:30.192, lat:50.603, s:400, st:"hold"    },
        { d:2.20, lng:30.192, lat:50.603, s:400, st:"hold"    },
      ] },

    /* Russian ground column: enters box from north; advances to airfield */
    { id:"ru_ground", faction:RU, kind:"infantry", flag:"ru", cf:false,
      name_zh:"Russian ground column", name_en:"Russian ground column",
      track:[
        { d:1.65, lng:30.100, lat:50.770, s:500, st:"march" },
        { d:2.05, lng:30.150, lat:50.700, s:500, st:"march" },
        { d:2.20, lng:30.190, lat:50.620, s:500, st:"march" },
      ] },

    /* 4th Rapid Reaction Brigade (garrison): pre-positioned at airfield */
    { id:"ua_garrison", faction:UA, kind:"infantry", flag:"ua", cf:false,
      name_zh:"4th Rapid Reaction Brigade", name_en:"4th Rapid Reaction Brigade",
      track:[
        { d:1.00, lng:30.185, lat:50.608, s:400, st:"hold"   },
        { d:1.46, lng:30.185, lat:50.608, s:400, st:"attack" },
        { d:1.80, lng:30.185, lat:50.608, s:400, st:"hold"   },
      ] },

    /* 72nd Mechanized Brigade: counterattacks from south, halts short   */
    { id:"ua_72mech", faction:UA, kind:"infantry", flag:"ua", cf:false,
      name_zh:"72nd Mechanized Brigade", name_en:"72nd Mechanized Brigade",
      track:[
        { d:1.60, lng:30.270, lat:50.570, s:500, st:"march" },
        { d:1.65, lng:30.228, lat:50.588, s:500, st:"hold"  },
      ] },
  ];

  /* ---- arrows ------------------------------------------------------- */
  const arrows = [
    { f:RU, from:[30.47,50.77], to:[30.19,50.60],
      d:1.42, kind:"air",     label:"Helicopter assault" },
    { f:UA, from:[30.27,50.57], to:[30.23,50.59],
      d:1.63, kind:"attack",  label:"72nd Mech counterattack" },
    { f:RU, from:[30.10,50.77], to:[30.15,50.70],
      d:1.90, kind:"march",   label:"Ground column advance" },
    { f:RU, from:[30.15,50.70], to:[30.19,50.62],
      d:2.10, kind:"march",   label:"Column reaches Hostomel" },
  ];

  /* ---- hotspots (subdued intensity — neutralisation 3.4) ------------ */
  const hotspots = [
    /* Kalibr cruise-missile strikes, scene 0                            */
    { a:1.18, b:1.32, kind:"explosion", lng:30.192, lat:50.603, i:0.55 },
    { a:1.19, b:1.31, kind:"explosion", lng:30.208, lat:50.614, i:0.45 },
    /* Ka-52 downed en route (frac ~0.55 of route, inside box)          */
    { a:1.40, b:1.52, kind:"explosion", lng:30.490, lat:50.650, i:0.40 },
    /* VDV assault on airfield, scenes 2-4                               */
    { a:1.44, b:1.66, kind:"artillery", lng:30.205, lat:50.600, i:0.32 },
    { a:1.45, b:1.72, kind:"firefight", lng:30.192, lat:50.603, i:0.38 },
    /* Ground column ambush (Ivankiv area — in-box segment), scene 6    */
    { a:2.02, b:2.18, kind:"firefight", lng:30.100, lat:50.750, i:0.35 },
    /* Vasylkiv / south Kyiv, scene 8 — subdued, outside-box ref        */
    { a:2.45, b:2.60, kind:"firefight", lng:30.400, lat:50.420, i:0.28 },
  ];

  /* ---- weather ------------------------------------------------------ */
  const weather = [
    { d:1.21, night:0.65, fog:0.10, rain:0,    smoke:0,    zh:"Pre-dawn, clear",         en:"Pre-dawn, clear"         },
    { d:1.40, night:0,    fog:0.05, rain:0,    smoke:0.08, zh:"Morning, haze",            en:"Morning, haze"           },
    { d:1.65, night:0,    fog:0.05, rain:0,    smoke:0.15, zh:"Afternoon, smoke",         en:"Afternoon, smoke"        },
    { d:1.79, night:0.25, fog:0.08, rain:0,    smoke:0.12, zh:"Evening",                 en:"Evening"                 },
    { d:2.08, night:0,    fog:0.10, rain:0.05, smoke:0.10, zh:"25 Feb, overcast",         en:"25 Feb, overcast"        },
    { d:2.50, night:0.90, fog:0.15, rain:0,    smoke:0.12, zh:"Night, 25-26 Feb",         en:"Night, 25-26 Feb"        },
  ];

  /* ---- storyboard: 10 shots ----------------------------------------- *
   *  Evidence chip prefix on every narration_en via <span class="evtag ...">.
   *  narration_zh = narration_en (EN-only fork per brief).
   *  Camera dist guide (box 2000 units = 1.2° lng):
   *    ~2200 = wide establisher (~55% of box)
   *    ~1600 = mid corridor view
   *    ~900  = tight airfield shot
   * ------------------------------------------------------------------- */
  const storyboard = [
    /* 0 — Kalibr strikes, 24 Feb ~05:00 */
    { day:1.21, hold:9,
      cam:{ lng:30.45, lat:50.62, dist:2200, az:0,   el:48, orbit:0.8 },
      title_zh:"Before Dawn · Kalibr Strikes", title_en:"Before Dawn · Kalibr Strikes",
      dateLabel:"24 Feb · ~05:00",
      narration_en:'<span class="evtag verified">VERIFIED</span> Before dawn on 24 February 2022, Russia announced the "special military operation" at ~05:30. Between 06:00 and 07:00, Kalibr cruise missiles struck Antonov Airport and the nearby National Guard base. The war reached Hostomel on the first hour of the first day.',
      narration_zh:'<span class="evtag verified">VERIFIED</span> Before dawn on 24 February 2022, Russia announced the "special military operation" at ~05:30. Between 06:00 and 07:00, Kalibr cruise missiles struck Antonov Airport and the nearby National Guard base. The war reached Hostomel on the first hour of the first day.',
      side:"ru" },

    /* 1 — Helicopter formation en route, 24 Feb ~09:30 */
    { day:1.40, hold:9,
      cam:{ lng:30.36, lat:50.76, dist:1600, az:-28, el:52, orbit:0.8 },
      title_zh:"Helicopter Formation En Route", title_en:"Helicopter Formation En Route",
      dateLabel:"24 Feb · ~09:30",
      narration_en:'<span class="evtag verified">VERIFIED</span> A formation of 20-34 Russian helicopters, Ka-52 gunships and Mi-8 transports, departed from Belarus at ~09:30 and flew low up the Dnipro corridor. Ukrainian small-arms and MANPADS fire hit the formation en route; at least one Ka-52 was downed, with its crew ejecting. The survivors pressed on.',
      narration_zh:'<span class="evtag verified">VERIFIED</span> A formation of 20-34 Russian helicopters, Ka-52 gunships and Mi-8 transports, departed from Belarus at ~09:30 and flew low up the Dnipro corridor. Ukrainian small-arms and MANPADS fire hit the formation en route; at least one Ka-52 was downed, with its crew ejecting. The survivors pressed on.',
      focus:["ru_ka52","ru_heli"], side:"ru" },

    /* 2 — Assault on Hostomel, 24 Feb ~11:00 */
    { day:1.46, hold:9,
      cam:{ lng:30.192, lat:50.603, dist:900, az:22, el:55, orbit:0.8 },
      title_zh:"Assault on Hostomel", title_en:"Assault on Hostomel",
      dateLabel:"24 Feb · ~11:00",
      narration_en:'<span class="evtag verified">VERIFIED</span> Survivors arrived over Hostomel at ~11:00. Ka-52s rocketed the field perimeter to suppress the garrison, around 200-300 troops of Ukraine\'s 4th Rapid Reaction Brigade, in position there only since 23 February. Some 200-300 VDV paratroopers of the 31st Guards Air Assault and 45th Guards Spetsnaz assaulted from the transports, aiming to seize the runway.',
      narration_zh:'<span class="evtag verified">VERIFIED</span> Survivors arrived over Hostomel at ~11:00. Ka-52s rocketed the field perimeter to suppress the garrison, around 200-300 troops of Ukraine\'s 4th Rapid Reaction Brigade, in position there only since 23 February. Some 200-300 VDV paratroopers of the 31st Guards Air Assault and 45th Guards Spetsnaz assaulted from the transports, aiming to seize the runway.',
      focus:["ru_heli","ru_vdv","ua_garrison"], side:"both" },

    /* 3 — Ukrainian counterattack, 24 Feb ~15:30 */
    { day:1.65, hold:9,
      cam:{ lng:30.20, lat:50.605, dist:800, az:36, el:56, orbit:0.8 },
      title_zh:"Ukrainian Counterattack", title_en:"Ukrainian Counterattack",
      dateLabel:"24 Feb · ~15:30",
      narration_en:'<span class="evtag contested">CONTESTED</span> General Zaluzhny ordered the 72nd Mechanized Brigade to counterattack, supported by the 4th Rapid Reaction Brigade, the Georgian Legion, and Su-24/MiG-29 air support. Russian VDV had no armour on Day 1, depending entirely on helicopter air cover. Control of the field was contested through the afternoon.',
      narration_zh:'<span class="evtag contested">CONTESTED</span> General Zaluzhny ordered the 72nd Mechanized Brigade to counterattack, supported by the 4th Rapid Reaction Brigade, the Georgian Legion, and Su-24/MiG-29 air support. Russian VDV had no armour on Day 1, depending entirely on helicopter air cover. Control of the field was contested through the afternoon.',
      focus:["ru_vdv","ua_garrison","ua_72mech"], side:"both" },

    /* 4 — Airbridge fails, 24 Feb evening */
    { day:1.79, hold:9,
      cam:{ lng:30.20, lat:50.60, dist:950, az:10, el:50, orbit:0.8 },
      title_zh:"The Airbridge Fails", title_en:"The Airbridge Fails",
      dateLabel:"24 Feb · evening",
      narration_en:'<span class="evtag verified">VERIFIED</span> Eighteen Il-76 transport aircraft carrying reinforcements could not land on the cratered, contested runway and turned back. The planned airbridge failed on Day 1. Whatever the exact overnight control, the field could no longer receive the heavy lift the operation depended on.',
      narration_zh:'<span class="evtag verified">VERIFIED</span> Eighteen Il-76 transport aircraft carrying reinforcements could not land on the cratered, contested runway and turned back. The planned airbridge failed on Day 1. Whatever the exact overnight control, the field could no longer receive the heavy lift the operation depended on.',
      focus:["ua_garrison","ru_vdv"], side:"ru" },

    /* 5 — Chornobyl / northern ground axis, 24 Feb afternoon */
    { day:1.65, hold:9,
      cam:{ lng:30.05, lat:50.76, dist:1900, az:-10, el:46, orbit:0.8 },
      title_zh:"The Northern Axis", title_en:"The Northern Axis",
      dateLabel:"24 Feb · afternoon",
      narration_en:'<span class="evtag verified">VERIFIED</span> To the north, Russian ground forces crossed from Belarus through the Chornobyl exclusion zone and seized the nuclear plant, opening an overland route south toward Hostomel. Chornobyl itself lies 50 km north of this map frame. The head of the column enters the frame here, pushing toward Ivankiv and the Teteriv bridge.',
      narration_zh:'<span class="evtag verified">VERIFIED</span> To the north, Russian ground forces crossed from Belarus through the Chornobyl exclusion zone and seized the nuclear plant, opening an overland route south toward Hostomel. Chornobyl itself lies 50 km north of this map frame. The head of the column enters the frame here, pushing toward Ivankiv and the Teteriv bridge.',
      focus:["ru_ground"], side:"ru" },

    /* 6 — Ground column advance, 25 Feb */
    { day:2.08, hold:9,
      cam:{ lng:30.10, lat:50.73, dist:1600, az:6, el:48, orbit:0.8 },
      title_zh:"Ground Column Advances", title_en:"Ground Column Advances",
      dateLabel:"25 Feb",
      narration_en:'<span class="evtag approx">APPROX.</span> The armoured column pushed south through Ivankiv toward the Teteriv bridge. Ukrainian forces fought to delay it; some vehicles were ambushed before they reached Hostomel. Exact positions and the timing of individual engagements are approximate.',
      narration_zh:'<span class="evtag approx">APPROX.</span> The armoured column pushed south through Ivankiv toward the Teteriv bridge. Ukrainian forces fought to delay it; some vehicles were ambushed before they reached Hostomel. Exact positions and the timing of individual engagements are approximate.',
      focus:["ru_ground"], side:"ru" },

    /* 7 — Second airborne, airport taken, 25 Feb */
    { day:2.18, hold:9,
      cam:{ lng:30.20, lat:50.605, dist:900, az:-8, el:55, orbit:0.8 },
      title_zh:"Airport Taken · Airbridge Defeated", title_en:"Airport Taken · Airbridge Defeated",
      dateLabel:"25 Feb",
      narration_en:'<span class="evtag verified">VERIFIED</span> A second airborne assault reinforced the VDV, and Russian forces took Antonov Airport on 25 February. But with the runway wrecked the airbridge was already defeated: troops and materiel now had to come overland.',
      narration_zh:'<span class="evtag verified">VERIFIED</span> A second airborne assault reinforced the VDV, and Russian forces took Antonov Airport on 25 February. But with the runway wrecked the airbridge was already defeated: troops and materiel now had to come overland.',
      focus:["ru_vdv","ua_garrison"], side:"both" },

    /* 8 — Vasylkiv night, 25-26 Feb (outside box — camera on south Kyiv) */
    { day:2.50, hold:9,
      cam:{ lng:30.40, lat:50.45, dist:1500, az:16, el:46, orbit:0.8 },
      title_zh:"Night Over Kyiv", title_en:"Night Over Kyiv",
      dateLabel:"25-26 Feb · night",
      narration_en:'<span class="evtag contested">CONTESTED</span> South of Kyiv, the air base at Vasylkiv (30 km south of this frame) was put on alert and saw night fighting. Ukraine claimed to down a Russian Il-76 transport carrying paratroopers nearby, a claim that remains unconfirmed. Kyiv itself was under curfew.',
      narration_zh:'<span class="evtag contested">CONTESTED</span> South of Kyiv, the air base at Vasylkiv (30 km south of this frame) was put on alert and saw night fighting. Ukraine claimed to down a Russian Il-76 transport carrying paratroopers nearby, a claim that remains unconfirmed. Kyiv itself was under curfew.',
      side:"both" },

    /* 9 — Irpin flood / Kyiv braces, 25 Feb */
    { day:2.25, hold:11,
      cam:{ lng:30.35, lat:50.52, dist:1300, az:-12, el:48, orbit:0.9 },
      title_zh:"Irpin Flooded · The Advance Stalls", title_en:"Irpin Flooded · The Advance Stalls",
      dateLabel:"25 Feb",
      narration_en:'<span class="evtag verified">VERIFIED</span> Ukrainian engineers flooded the Irpin River to block the western approaches, and fighting shifted to Bucha and Irpin. Kyiv braced under curfew. The bid to seize the capital in a single airmobile stroke had failed; the advance ground on overland.',
      narration_zh:'<span class="evtag verified">VERIFIED</span> Ukrainian engineers flooded the Irpin River to block the western approaches, and fighting shifted to Bucha and Irpin. Kyiv braced under curfew. The bid to seize the capital in a single airmobile stroke had failed; the advance ground on overland.',
      side:"ua" },
  ];

  /* ---- notes (required; sources non-empty) -------------------------- */
  const notes = {
    summary:"The Kyiv Axis, 24-25 February 2022: the first 48 hours of the Russian invasion of Ukraine. Russia's airmobile assault on Hostomel/Antonov Airport — a helicopter formation, VDV airborne drop, and a ground column through the Chornobyl zone — aimed to seize Kyiv rapidly. Ukrainian resistance and a cratered runway defeated the airbridge on Day 1. Fighting shifted overland to Bucha and Irpin.",
    caveats:[
      "Evidence tags: VERIFIED = corroborated by multiple independent sources. APPROX. = broadly reported, exact positions or timings uncertain. CONTESTED = disputed, or a single-source or official claim.",
      "Tight map box covers the Hostomel/Bucha/Irpin/Kyiv core. Chornobyl NPP (51.39N), Ivankiv (50.94N), Vasylkiv air base (50.24N), and Boryspil airport (50.35N) fall outside the frame; they are covered in narration only.",
      "All unit positions and route coordinates are approximate, sourced from the 2D reference build (icomppower/ukraine2022feb). No tactical-level precision is claimed.",
      "Imagery is present-day satellite (Sentinel-2 cloudless 2016, EOX IT Services). Terrain and road layout reflect 2016-era geography.",
      "No national flags are displayed. Each side is represented by a plain colour swatch. This documentary makes no judgment on the legitimacy of either party's actions.",
      "Troop-strength readouts are suppressed throughout.",
    ],
    sources:"Institute for the Study of War (ISW): Russian Offensive Campaign Assessments, 24-25 February 2022. M. Zabrodskyi, J. Watling, O. Danylyuk & N. Reynolds, 'Preliminary Lessons in Conventional Warfighting from Russia\'s Invasion of Ukraine: February-July 2022,' RUSI, 2022. Center for a New American Security (CNAS): analysis of the battle for Hostomel/Antonov Airport. Contemporary reporting: Reuters, AP, BBC, 24-25 February 2022. Ukrainian Ministry of Defence and General Staff statements (attributed; contested where unconfirmed). Imagery: Sentinel-2 cloudless 2016 (c) EOX IT Services GmbH (CC BY 4.0). Terrain: AWS Terrain Tiles / Mapzen Terrarium DEM (SRTM/USGS).",
  };

  return { meta, factions, intro, outro, flagLegend, geography, units, arrows,
           hotspots, weather, storyboard, notes };
})();
