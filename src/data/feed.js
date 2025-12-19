// src/data/feed.js

// Some items have simple `text`.
// Others have baseText + optional sympathetic/scandal variants that
// will be chosen based on stats + flags.

export const FEED_ITEMS = {
  cassio_desdemona_meet: {
    id: "cassio_desdemona_meet",
    author: "@VeniceGossip",
    act: "Act 3",
    text: "Cassio seen talking privately with Desdemona again 👀. Probably innocent... right?"
  },
  othello_cold: {
    id: "othello_cold",
    author: "@CourtObserver",
    act: "Act 3",
    text: "The General barely looked at Desdemona today. The air felt sharp in the hall."
  },
  iago_dm_vibes: {
    id: "iago_dm_vibes",
    author: "@RumourMill",
    act: "Act 3",
    text: "When someone keeps whispering in your ear, it's rarely for your own good. #HonestIago"
  },
  post_handkerchief: {
    id: "post_handkerchief",
    author: "@Emilia",
    act: "Act 3",
    text: "Strange how men cling to tiny tokens and ignore the women who give them."
  },
  emilia_des_whisper: {
    id: "emilia_des_whisper",
    author: "@LadyInWaiting",
    act: "Act 3",
    text: "Desdemona and Emilia have been whispering all afternoon. Worry? Secrets? Maybe both."
  },
  silent_freeze: {
    id: "silent_freeze",
    author: "@FriendOfDesdemona",
    act: "Act 4",
    text: "He didn't shout. He didn't touch her. But the way he went cold was worse than any blow."
  },
  othello_slaps: {
    id: "othello_slaps",
    author: "@CourtWitness",
    act: "Act 4",
    baseText:
      "Everyone saw it. Othello struck Desdemona in front of the envoys. Venice will be talking for weeks.",
    sympatheticVariant:
      "No one expected the great general to lose himself like that. Some blame her, most just feel sorry for them both.",
    scandalVariant:
      "The so-called noble general showed his true face today. That blow will echo further than any war he ever fought."
  },
  lodovico_shocked: {
    id: "lodovico_shocked",
    author: "@Lodovico",
    act: "Act 4",
    baseText:
      "Is this the same man we trusted with our armies? I hardly recognise the general I once respected.",
    sympatheticVariant:
      "I have known Othello as a man of honour. Whatever has broken him, I fear it has broken us all.",
    scandalVariant:
      "We sent a hero to Cyprus, and a tyrant answered in his place."
  },
  act5_rumours: {
    id: "act5_rumours",
    author: "@LateNightVenice",
    act: "Act 5",
    baseText:
      "Lights in the General's chambers long past midnight. Something is very wrong in Cyprus tonight.",
    sympatheticVariant:
      "There's a heaviness in the fortress tonight. Feels less like scandal and more like a storm of sorrow.",
    scandalVariant:
      "The gossip around the fortress is boiling — whatever happens in that chamber, no one will forget it."
  },
  willow_song: {
    id: "willow_song",
    author: "@Servant",
    act: "Act 5",
    baseText:
      "Heard the lady singing a sad old song about a lover by a willow tree. Chilling, somehow.",
    sympatheticVariant:
      "The song she sang sounded less like guilt and more like a goodbye. Hard to listen to.",
    scandalVariant:
      "Her song tonight was all about betrayal and sorrow. You'd think someone had wronged her — or she had wronged them."
  },
  ending_tragic: {
    id: "ending_tragic",
    author: "@VeniceGazette",
    act: "Epilogue",
    baseText:
      "Desdemona slain, Othello dead by his own hand, Iago imprisoned. The tragedy of Cyprus will echo for generations.",
    scandalVariant:
      "They will tell it as the tale of a jealous Moor and a dead wife, but those who were there know it was all built on lies."
  },
  ending_ambiguous: {
    id: "ending_ambiguous",
    author: "@VeniceOpinion",
    act: "Epilogue",
    text:
      "They live, but something between them is shattered. Some say the lies were never fully uncovered."
  },
  ending_restorative: {
    id: "ending_restorative",
    author: "@VeniceHerald",
    act: "Epilogue",
    baseText:
      "Iago exposed by Emilia. Desdemona vindicated. Othello survives, bearing a grief no court can judge.",
    sympatheticVariant:
      "Justice came late to Cyprus, but it came. The cost for Othello and Desdemona, however, cannot be measured."
  }
};
