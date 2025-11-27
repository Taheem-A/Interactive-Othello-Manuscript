// src/data/index.js

import { FEED_ITEMS } from "./feed.js";
import { LOG_ITEMS } from "./logs.js";
import { JOURNAL_ITEMS } from "./journals.js";
import { ACT3_SCENES } from "./scenesAct3.js";
import { ACT4_SCENES } from "./scenesAct4.js";
import { ACT5_SCENES } from "./scenesAct5.js";
import { ENDING_SCENES } from "./endings.js";

// combine all scenes into one list
export const SCENES = [
  ...ACT3_SCENES,
  ...ACT4_SCENES,
  ...ACT5_SCENES,
  ...ENDING_SCENES
];

export { FEED_ITEMS, LOG_ITEMS, JOURNAL_ITEMS };

// emotional mode calculation based on stats
export function computeMode({ trust, jealousy }) {
  // Resisting: low jealousy, reasonably high trust
  // Torn: mid jealousy or mid/low trust
  // Consumed: high jealousy + low trust
  if (jealousy >= 65 && trust <= 40) return "Consumed";
  if (jealousy >= 35 || trust <= 60) return "Torn";
  return "Resisting";
}
