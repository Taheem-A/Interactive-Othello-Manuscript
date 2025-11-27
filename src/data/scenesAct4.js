// src/data/scenesAct4.js

export const ACT4_SCENES = [
  {
    id: "act4_public_scene",
    act: "Act 4",
    title: "Public Confrontation",
    text: "In public, with others watching, your anger and doubt boil over. Desdemona pleads her innocence while Iago watches from the side.",
    unlockJournalsOnEnter: ["journal2"],
    choices: [
      {
        id: "question_harshly",
        text: "Question Desdemona harshly, but do not touch her.",
        effects: { trust: -4, jealousy: +6, dependence: +4 },
        nextScene: "act4_nonviolent_after",
        unlockFeed: ["silent_freeze"],
        unlockLogs: []
      },
      {
        id: "freeze_out",
        text: "Say little, but turn cold and distant.",
        effects: { trust: -6, jealousy: +5, dependence: +5 },
        nextScene: "act4_nonviolent_after",
        unlockFeed: ["silent_freeze"],
        unlockLogs: []
      },
      {
        id: "strike_her",
        text: "Strike Desdemona in anger.",
        minJealousy: 40,
        effects: { trust: -15, jealousy: +10, dependence: +6 },
        nextScene: "act4_slapped_aftermath",
        unlockFeed: ["othello_slaps"],
        unlockLogs: ["court_scandal"]
      }
    ]
  },
  // Non-violent branch
  {
    id: "act4_nonviolent_after",
    act: "Act 4",
    title: "After the Scene",
    text: "Desdemona withdraws, shaken, while Emilia follows to comfort her. You remain behind, feeling every eye on you.",
    choices: [
      {
        id: "overhear_half",
        text: "Follow later and overhear part of their conversation.",
        effects: { trust: -2, jealousy: +3, dependence: +3 },
        nextScene: "act4_nonviolent_overhear",
        unlockFeed: ["emilia_des_whisper"]
      },
      {
        id: "stay_with_iago",
        text: "Stay with Iago and ask what others must think of you now.",
        effects: { trust: -4, jealousy: +5, dependence: +6 },
        nextScene: "act4_nonviolent_overhear",
        unlockFeed: [],
        unlockLogs: []
      }
    ]
  },
  {
    id: "act4_nonviolent_overhear",
    act: "Act 4",
    title: "Echoes Behind the Door",
    text: "From the hall you hear Emilia urging Desdemona to stand up for herself. You cannot make out every word, only the pain in your wife's voice.",
    choices: [
      {
        id: "interpret_pain",
        text: "She sounds wounded, not deceitful.",
        effects: { trust: +4, jealousy: -3, dependence: -2 },
        nextScene: "act4_plan_night",
        unlockLogs: []
      },
      {
        id: "interpret_guilt",
        text: "Guilt often sounds like tears.",
        effects: { trust: -5, jealousy: +6, dependence: +4 },
        nextScene: "act4_plan_night",
        unlockLogs: []
      },
      {
        id: "blame_emilia_here",
        text: "Perhaps Emilia encourages her to play the innocent.",
        effects: { trust: -3, jealousy: +4, dependence: +4 },
        nextScene: "act4_plan_night",
        unlockLogs: []
      }
    ]
  },
  // Violent branch
  {
    id: "act4_slapped_aftermath",
    act: "Act 4",
    title: "The Shocked Court",
    text: "Lodovico and the others stare in disbelief after you strike Desdemona. She leaves in tears. Lodovico asks quietly if this is truly the general they once respected.",
    choices: [
      {
        id: "nothing_is_wrong",
        text: "Say that nothing is wrong and it is a private matter.",
        effects: { trust: -3, jealousy: +4, dependence: +3 },
        nextScene: "act4_slapped_reflect",
        unlockFeed: ["lodovico_shocked"],
        unlockLogs: []
      },
      {
        id: "she_dishonoured_me",
        text: "Tell Lodovico she has dishonoured you.",
        effects: { trust: -8, jealousy: +8, dependence: +5 },
        nextScene: "act4_slapped_reflect",
        unlockFeed: ["lodovico_shocked"],
        unlockLogs: []
      },
      {
        id: "rebuke_lodovico",
        text: "Tell Lodovico to mind his own business.",
        effects: { trust: -6, jealousy: +6, dependence: +6 },
        nextScene: "act4_slapped_reflect",
        unlockFeed: ["lodovico_shocked"],
        unlockLogs: []
      }
    ]
  },
  {
    id: "act4_slapped_reflect",
    act: "Act 4",
    title: "Desdemona in Tears",
    text: "Later, you see Desdemona from a distance, her shoulders shaking as Emilia wraps an arm around her. She does not know you are watching.",
    choices: [
      {
        id: "maybe_too_harsh",
        text: "Perhaps I have gone too far.",
        effects: { trust: +3, jealousy: -3, dependence: -2 },
        nextScene: "act4_plan_night",
        unlockLogs: []
      },
      {
        id: "crying_from_guilt",
        text: "She cries because she has been exposed.",
        effects: { trust: -5, jealousy: +6, dependence: +4 },
        nextScene: "act4_plan_night",
        unlockLogs: []
      }
    ]
  },
  // Converged: plan the night
  {
    id: "act4_plan_night",
    act: "Act 4",
    title: "Planning the Night",
    text: "Iago finds you again, his voice low and confident. He speaks of Desdemona’s supposed betrayal and suggests that justice must be done before dawn.",
    choices: [
      {
        id: "confront_again",
        text: "I will confront her once more. I must hear her.",
        effects: { trust: +4, jealousy: -4, dependence: -3 },
        nextScene: "act4_iago_quiet",
        unlockLogs: []
      },
      {
        id: "kill_after_talk",
        text: "I will kill her, but only after one last conversation.",
        effects: { trust: -4, jealousy: +7, dependence: +4 },
        nextScene: "act4_iago_quiet",
        unlockLogs: ["committed_to_murder"]
      },
      {
        id: "no_more_talk",
        text: "No more words. She dies tonight.",
        effects: { trust: -10, jealousy: +12, dependence: +6 },
        nextScene: "act4_iago_quiet",
        unlockLogs: ["committed_to_murder"]
      }
    ]
  },
  // Micro: moment with Iago
  {
    id: "act4_iago_quiet",
    act: "Act 4",
    title: "Iago’s Silence",
    text: "For once, Iago grows quiet. He watches you with a small, satisfied smile, saying that he trusts you to 'do what is necessary.' His confidence unsettles you.",
    choices: [
      {
        id: "trust_iago_completely",
        text: "His certainty reassures you—you must act.",
        effects: { trust: -3, jealousy: +5, dependence: +5 },
        nextScene: "act5_night",
        unlockLogs: []
      },
      {
        id: "distrust_his_smile",
        text: "His satisfaction makes you wonder what he gains from this.",
        effects: { trust: +2, jealousy: -2, dependence: -4 },
        nextScene: "act5_night",
        unlockLogs: []
      }
    ]
  }
];
