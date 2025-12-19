// src/data/endings.js

export const ENDING_SCENES = [
  {
    id: "ending_tragic",
    act: "Ending",
    type: "ending",
    title: "Tragic Ending",
    text:
      "Blinded by jealousy and Iago's lies, you smother Desdemona. Only after her death do Emilia's words reveal the truth. In horror, you turn your violence upon yourself.",
    unlockFeedOnEnter: ["ending_tragic"],
    unlockLogsOnEnter: []
  },
  {
    id: "ending_ambiguous",
    act: "Ending",
    type: "ending",
    title: "Ambiguous Ending",
    text:
      "You cannot bring yourself to kill her, but you banish her from your life and name. The truth of Iago's schemes is only half-revealed. You both live, but something between you is broken beyond repair.",
    unlockFeedOnEnter: ["ending_ambiguous"],
    unlockLogsOnEnter: []
  },
  {
    id: "ending_restorative",
    act: "Ending",
    type: "ending",
    title: "Restorative Ending",
    text:
      "You reveal Iago's accusations to Desdemona and Emilia. Piece by piece, his lies collapse. Desdemona lives, cleared of guilt, while you are left to reckon with how close you came to destroying her.",
    unlockFeedOnEnter: ["ending_restorative"],
    unlockLogsOnEnter: ["exposed"]
  }
];
