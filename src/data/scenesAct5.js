// src/data/scenesAct5.js

export const ACT5_SCENES = [
  {
    id: "act5_night",
    act: "Act 5",
    title: "Night in Cyprus",
    text: "Night falls over Cyprus. The sea’s restless roar seeps through the stone walls as candles flicker in the corridors.",
    choices: [
      {
        id: "walk_to_chamber",
        text: "Walk toward Desdemona’s chamber.",
        effects: {},
        nextScene: "act5_willow_micro",
        unlockFeed: ["act5_rumours"],
        unlockLogs: []
      }
    ],
    unlockJournalsOnEnter: ["journal3"]
  },
  // Micro: willow song
  {
    id: "act5_willow_micro",
    act: "Act 5",
    title: "The Willow Song",
    text: "From behind the door you hear Desdemona’s soft voice singing a mournful song about a lover and a willow tree. Each note seems to press against your chest.",
    unlockFeedOnEnter: ["willow_song"],
    choices: [
      {
        id: "interpret_sorrow",
        text: "She sounds sorrowful and innocent.",
        effects: { trust: +4, jealousy: -4, dependence: -3 },
        nextScene: "act5_at_door",
        unlockLogs: []
      },
      {
        id: "interpret_resignation",
        text: "It sounds like the song of someone who has accepted their fate.",
        effects: { trust: -2, jealousy: +3, dependence: +2 },
        nextScene: "act5_at_door",
        unlockLogs: []
      },
      {
        id: "block_out_song",
        text: "Force yourself not to listen.",
        effects: { trust: -3, jealousy: +4, dependence: +3 },
        nextScene: "act5_at_door",
        unlockLogs: []
      }
    ]
  },
  {
    id: "act5_at_door",
    act: "Act 5",
    title: "At Her Door",
    text: "You stand outside her door with a candle in hand. The flame trembles, or perhaps it is your grip.",
    choices: [
      {
        id: "steel_heart",
        text: "Remind yourself of Iago’s 'proof' and harden your resolve.",
        effects: { trust: -6, jealousy: +8, dependence: +6 },
        nextScene: "act5_bedroom",
        unlockLogs: ["door_doubt"]
      },
      {
        id: "question_iago",
        text: "Allow yourself one last doubt—could Iago have lied?",
        effects: { trust: +5, jealousy: -6, dependence: -8 },
        nextScene: "act5_bedroom",
        unlockLogs: ["door_doubt"]
      }
    ]
  },
  {
    id: "act5_bedroom",
    act: "Act 5",
    title: "The Bedroom Confrontation",
    text: "Desdemona wakes to find you standing over her. The room holds its breath as you decide what kind of man you will be.",
    isFinalDecision: true,
    choices: [
      {
        id: "accuse_refuse_listen",
        text: "Accuse her and refuse to listen.",
        effects: { trust: -20, jealousy: +20, dependence: +5 },
        nextScene: "ending_tragic",
        modeRequired: "Consumed"
      },
      {
        id: "accuse_but_listen",
        text: "Accuse her, but allow her to speak.",
        effects: { trust: -5, jealousy: +5, dependence: 0 },
        nextScene: "ending_ambiguous",
        modeRequired: "Torn"
      },
      {
        id: "reveal_iago",
        text: "Tell her exactly what Iago has claimed and watch her reaction.",
        effects: { trust: +10, jealousy: -10, dependence: -10 },
        nextScene: "ending_restorative",
        modeRequired: "Resisting"
      }
    ]
  }
];
