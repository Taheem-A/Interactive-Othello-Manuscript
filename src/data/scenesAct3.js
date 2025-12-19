// src/data/scenesAct3.js

// Act 3 scenes: suspicion begins, first branch, micro-scenes, handkerchief

export const ACT3_SCENES = [
  {
    id: "act3_start",
    act: "Act 3",
    title: "Cassio and Desdemona Meet",
    text:
      "Cassio meets with Desdemona to plead for his position. You see them together from a distance, her hand resting lightly on his arm as she listens.",
    choices: [
      {
        id: "start_continue",
        text: "Continue",
        effects: {},
        nextScene: "act3_iago_seed",
        unlockFeed: ["cassio_desdemona_meet"]
      }
    ]
  },
  {
    id: "act3_iago_seed",
    act: "Act 3",
    title: "Iago Plants the Seed",
    text:
      "Iago hesitates, then remarks that Cassio and Desdemona seem 'more familiar' than he would expect. His tone is careful, as if he regrets saying anything at all.",
    choices: [
      {
        id: "talk_desdemona",
        text: "I should speak to Desdemona directly.",
        effects: { trust: +5, jealousy: -5, dependence: -5 },
        nextScene: "act3_des_private",
        unlockFeed: [],
        unlockLogs: [],
        tags: ["trust"],
        setFlags: { everChoseOpenHonestyWithDesdemona: true }
      },
      {
        id: "follow_cassio",
        text: "I will watch Cassio more closely before I decide.",
        effects: { trust: -5, jealousy: +10, dependence: +5 },
        nextScene: "act3_follow_cassio_observe",
        unlockFeed: ["iago_dm_vibes"],
        unlockLogs: ["watching_cassio"],
        tags: ["jealous", "iago"],
        setFlags: { followedCassioPath: true }
      },
      {
        id: "brush_off",
        text: "Laugh it off and tell Iago you trust your wife.",
        effects: { trust: +5, jealousy: 0, dependence: -5 },
        nextScene: "act3_des_private",
        unlockFeed: [],
        unlockLogs: [],
        tags: ["trust", "iago"]
      }
    ]
  },
  // Branch A1: talk to Desdemona
  {
    id: "act3_des_private",
    act: "Act 3",
    title: "A Private Moment with Desdemona",
    textByMode: {
      Resisting:
        "You find Desdemona alone. She smiles when she sees you, reaching for your hand as if nothing in the world has changed.",
      Torn:
        "Desdemona's smile flickers when she sees your serious face, but she still reaches for your hand.",
      Consumed:
        "She reaches for your hand as usual, but you feel only the heat of suspicion where there used to be warmth."
    },
    choices: [
      {
        id: "be_open",
        text: "Ask her directly about Cassio, trying to stay calm.",
        effects: { trust: +5, jealousy: -5, dependence: -5 },
        nextScene: "act3_reflect",
        unlockJournals: ["journal1"],
        unlockFeed: [],
        tags: ["trust"],
        setFlags: { everChoseOpenHonestyWithDesdemona: true }
      },
      {
        id: "hint_only",
        text: "Hint at your doubts without naming Cassio.",
        effects: { trust: -2, jealousy: +3, dependence: +3 },
        nextScene: "act3_reflect",
        unlockJournals: [],
        unlockFeed: ["othello_cold"],
        tags: ["jealous"]
      },
      {
        id: "say_nothing_des",
        text: "Say nothing about your doubts and pretend everything is fine.",
        effects: { trust: -5, jealousy: +5, dependence: +5 },
        nextScene: "act3_reflect",
        unlockJournals: [],
        unlockFeed: ["othello_cold"],
        tags: ["jealous"]
      }
    ]
  },
  // Branch A2: follow Cassio
  {
    id: "act3_follow_cassio_observe",
    act: "Act 3",
    title: "Watching Cassio",
    text:
      "From the shadows, you watch Cassio meet Desdemona. You cannot hear every word, but you see her hand him a folded cloth and his grateful smile.",
    choices: [
      {
        id: "interpret_friendly",
        text: "It could be nothing more than friendship.",
        effects: { trust: 0, jealousy: +2, dependence: +2 },
        nextScene: "act3_follow_cassio_interpret",
        unlockFeed: ["cassio_desdemona_meet"],
        tags: ["jealous"]
      },
      {
        id: "interpret_intimate",
        text: "No wife should look at another man that way.",
        effects: { trust: -5, jealousy: +8, dependence: +5 },
        nextScene: "act3_follow_cassio_interpret",
        unlockFeed: ["cassio_desdemona_meet"],
        tags: ["jealous"]
      },
      {
        id: "blame_iago_thought",
        text: "Perhaps Iago has twisted how I see them.",
        effects: { trust: +3, jealousy: -2, dependence: -3 },
        nextScene: "act3_follow_cassio_interpret",
        unlockFeed: [],
        unlockLogs: [],
        tags: ["trust"],
        setFlags: {
          questionedIagoSeriously: true,
          everChoseToDoubtIago: true
        }
      }
    ]
  },
  {
    id: "act3_follow_cassio_interpret",
    act: "Act 3",
    title: "Iago's Message",
    text:
      "Later, Iago seeks you out with a concerned look. He asks carefully if you are 'well' after seeing Cassio and Desdemona together.",
    choices: [
      {
        id: "confide_in_iago",
        text: "Confide your doubts to Iago.",
        effects: { trust: -5, jealousy: +5, dependence: +8 },
        nextScene: "act3_reflect",
        unlockFeed: ["iago_dm_vibes"],
        unlockLogs: ["seed_taken"],
        tags: ["iago", "jealous"]
      },
      {
        id: "close_off_iago",
        text: "Say little and keep your thoughts to yourself.",
        effects: { trust: -2, jealousy: +2, dependence: 0 },
        nextScene: "act3_reflect",
        unlockFeed: [],
        unlockLogs: [],
        tags: ["jealous"]
      }
    ]
  },
  // Converged reflection
  {
    id: "act3_reflect",
    act: "Act 3",
    title: "Turning It Over",
    textByMode: {
      Resisting:
        "Alone, you replay Iago's words, but Desdemona's past loyalty still stands stubbornly in your memory.",
      Torn:
        "Alone, you replay Iago's words and Desdemona's smile until they blur together, each thought cutting the next.",
      Consumed:
        "Alone, you hear only Iago's warnings. Every good memory of Desdemona feels like a lie covering a deeper betrayal."
    },
    unlockJournalsOnEnter: ["journal1"],
    choices: [
      {
        id: "resolve_to_talk",
        text: "I should speak honestly with Desdemona again.",
        effects: { trust: +4, jealousy: -3, dependence: -3 },
        nextScene: "act3_emilia_des_whisper",
        unlockFeed: [],
        unlockLogs: [],
        tags: ["trust"],
        setFlags: { everChoseOpenHonestyWithDesdemona: true }
      },
      {
        id: "wait_for_more_proof",
        text: "I need clearer proof before accusing her.",
        effects: { trust: 0, jealousy: +4, dependence: +3 },
        nextScene: "act3_emilia_des_whisper",
        unlockFeed: [],
        unlockLogs: [],
        tags: ["jealous"]
      },
      {
        id: "assume_guilt_now",
        text: "No truly honest wife would give such cause for doubt.",
        effects: { trust: -8, jealousy: +8, dependence: +4 },
        nextScene: "act3_emilia_des_whisper",
        unlockFeed: ["othello_cold"],
        unlockLogs: [],
        tags: ["jealous"]
      }
    ]
  },
  // Micro-scene: Emilia & Desdemona whispering
  {
    id: "act3_emilia_des_whisper",
    act: "Act 3",
    title: "Emilia and Desdemona",
    text:
      "You pass by a doorway and glimpse Emilia and Desdemona speaking in low tones. Desdemona wipes her eyes as Emilia squeezes her hand.",
    unlockFeedOnEnter: ["emilia_des_whisper"],
    choices: [
      {
        id: "assume_she_is_upset",
        text: "She must be upset. Perhaps I've been too distant.",
        effects: { trust: +3, jealousy: -2, dependence: -1 },
        nextScene: "act3_handkerchief",
        unlockLogs: [],
        tags: ["trust"]
      },
      {
        id: "assume_secret",
        text: "She is clearly hiding something from me.",
        effects: { trust: -4, jealousy: +5, dependence: +3 },
        nextScene: "act3_handkerchief",
        unlockLogs: [],
        tags: ["jealous"]
      },
      {
        id: "blame_emilia",
        text: "Emilia must know more than she admits.",
        effects: { trust: -2, jealousy: +3, dependence: +3 },
        nextScene: "act3_handkerchief",
        unlockLogs: [],
        tags: ["jealous", "iago"]
      }
    ]
  },
  {
    id: "act3_handkerchief",
    act: "Act 3",
    title: "The Handkerchief",
    text:
      "In the confusion of the day, you drop the handkerchief your mother gave you, the one you first gave Desdemona as a token of love. Emilia finds it, and Iago quietly takes it from her.",
    unlockFeedOnEnter: ["post_handkerchief"],
    choices: [
      {
        id: "dismiss_token",
        text: "It is only a token. Love is more than a handkerchief.",
        effects: { trust: +2, jealousy: +2, dependence: 0 },
        nextScene: "act3_sleepless",
        unlockLogs: [],
        tags: ["trust"]
      },
      {
        id: "obsess_over_token",
        text: "If she loses this, perhaps she has lost more than cloth.",
        effects: { trust: -6, jealousy: +10, dependence: +5 },
        nextScene: "act3_sleepless",
        unlockLogs: ["kneels_to_revenge"],
        tags: ["jealous", "iago"]
      }
    ]
  },
  // Micro: sleepless night
  {
    id: "act3_sleepless",
    act: "Act 3",
    title: "Sleepless",
    textByMode: {
      Resisting:
        "Night comes, but sleep does not. You turn over questions, hoping truth will survive when the doubts burn out.",
      Torn:
        "Night comes, but sleep does not. Each time you close your eyes you see both her smile and the handkerchief passing away.",
      Consumed:
        "Night comes, and sleep flees from you as if it too were guilty. All you can see is Desdemona's imagined betrayal."
    },
    choices: [
      {
        id: "focus_on_iago_words",
        text: "Rehearse Iago's warnings in your mind.",
        effects: { trust: -3, jealousy: +5, dependence: +4 },
        nextScene: "act4_public_scene",
        unlockLogs: [],
        tags: ["jealous", "iago"]
      },
      {
        id: "focus_on_des_love",
        text: "Remember the love and loyalty Desdemona has shown.",
        effects: { trust: +4, jealousy: -3, dependence: -2 },
        nextScene: "act4_public_scene",
        unlockLogs: [],
        tags: ["trust"]
      },
      {
        id: "focus_on_cassio_laugh",
        text: "You hear Cassio's laugh again and again.",
        effects: { trust: -2, jealousy: +4, dependence: +3 },
        nextScene: "act4_public_scene",
        unlockLogs: [],
        tags: ["jealous"]
      }
    ]
  }
];
