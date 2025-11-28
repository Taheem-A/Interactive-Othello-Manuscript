// src/data/index.js

import { FEED_ITEMS } from "./feed.js";
import { LOG_ITEMS } from "./logs.js";
import { JOURNAL_ITEMS } from "./journals.js";
import { ACT3_SCENES } from "./scenesAct3.js";
import { ACT4_SCENES } from "./scenesAct4.js";
import { ACT5_SCENES } from "./scenesAct5.js";
import { ENDING_SCENES } from "./endings.js";

export const SCENES = [
  ...ACT3_SCENES,
  ...ACT4_SCENES,
  ...ACT5_SCENES,
  ...ENDING_SCENES
];

export { FEED_ITEMS, LOG_ITEMS, JOURNAL_ITEMS };

// Emotional mode calculation
export function computeMode({ trust, jealousy }) {
  if (jealousy >= 65 && trust <= 40) return "Consumed";
  if (jealousy >= 35 || trust <= 60) return "Torn";
  return "Resisting";
}
