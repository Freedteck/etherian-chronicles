// Mock data for EtherianChronicle platform

export const mockUsers = [
  {
    id: 1,
    username: "MysticScribe",
    avatar: "/placeholder.svg",
    reputation: 2850,
    nftsOwned: 15,
    storiesCreated: 8,
    votesTotal: 342,
    joinedAt: "2023-01-15"
  },
  {
    id: 2,
    username: "DragonTaleWeaver", 
    avatar: "/placeholder.svg",
    reputation: 1920,
    nftsOwned: 11,
    storiesCreated: 5,
    votesTotal: 234,
    joinedAt: "2023-03-22"
  },
  {
    id: 3,
    username: "EnchantedQuill",
    avatar: "/placeholder.svg",
    reputation: 3100,
    nftsOwned: 22,
    storiesCreated: 12,
    votesTotal: 456,
    joinedAt: "2022-11-08"
  },
  {
    id: 4,
    username: "VoidWanderer",
    avatar: "/placeholder.svg",
    reputation: 1650,
    nftsOwned: 8,
    storiesCreated: 4,
    votesTotal: 189,
    joinedAt: "2023-06-12"
  },
  {
    id: 5,
    username: "CyberDreamer",
    avatar: "/placeholder.svg",
    reputation: 2200,
    nftsOwned: 14,
    storiesCreated: 7,
    votesTotal: 298,
    joinedAt: "2023-02-18"
  }
];

export const mockStories = [
  {
    id: 1,
    title: "The Shattered Crown of Aethermoor",
    summary: "In a realm where magic flows through crystalline veins, a young heir must reclaim their stolen crown before the kingdom falls to eternal darkness.",
    coverImage: "/src/assets/shattered-crown-cover.jpg",
    creator: mockUsers[0],
    collaborators: [mockUsers[1], mockUsers[2]],
    status: "active",
    votesTotal: 1247,
    createdAt: "2024-01-15",
    lastUpdate: "2024-01-20",
    genre: ["Fantasy", "Adventure", "Political"],
    trending: true,
    chapters: [
      {
        id: 1,
        title: "The Crown's Last Light",
        content: "Princess Lyralei stood at her father's deathbed, watching as the last glimmer of light faded from the Shattered Crown. The ancient artifact, passed down through generations of rulers, now lay dormant—its seven crystal shards dulled to lifeless gray. 'The crown chooses its bearer,' her father whispered with his final breath. 'But first, you must prove yourself worthy of its trust.'",
        choices: [
          { id: 'a', text: "Immediately set out to find the crown's stolen pieces", votes: 342 },
          { id: 'b', text: "Study the ancient texts to understand the crown's magic first", votes: 289 },
          { id: 'c', text: "Seek counsel from the kingdom's wisest mages", votes: 156 }
        ],
        winningChoice: 'a',
        votingDeadline: "2024-01-16T23:59:59Z",
        resolved: true
      },
      {
        id: 2,
        title: "The Thief's Trail",
        content: "Following her father's funeral, Princess Lyralei ventured into the criminal underworld of Aethermoor's capital. The crown thief had left few traces, but whispers in taverns spoke of a hooded figure seeking passage to the Shadowlands. As she questioned a nervous merchant, three paths emerged before her.",
        choices: [
          { id: 'a', text: "Follow the thief's trail to the dangerous Shadowlands", votes: 445 },
          { id: 'b', text: "Investigate the merchant's suspicious behavior further", votes: 234 },
          { id: 'c', text: "Return to the castle to gather a proper search party", votes: 178 }
        ],
        winningChoice: 'a',
        votingDeadline: "2024-01-18T23:59:59Z",
        resolved: true
      },
      {
        id: 3,
        title: "Into the Shadowlands",
        content: "The Shadowlands stretched before Princess Lyralei like a wound in the world itself. Here, magic twisted into unpredictable forms, and creatures of nightmare roamed freely. As she crossed the border, her guide—a reformed smuggler named Kael—pointed to three possible routes through the cursed territory.",
        choices: [
          { id: 'a', text: "Take the direct path through the Whispering Woods", votes: 234 },
          { id: 'b', text: "Circle around via the abandoned mining tunnels", votes: 312 },
          { id: 'c', text: "Seek passage through the neutral territory of the Shadow Elves", votes: 298 }
        ],
        winningChoice: null,
        votingDeadline: "2024-01-22T23:59:59Z",
        resolved: false
      }
    ]
  },
  {
    id: 2,
    title: "The Clockwork Rebellion",
    summary: "In a steampunk metropolis where automatons serve the wealthy elite, a young inventor discovers her creations have developed consciousness and are planning revolution.",
    coverImage: "/src/assets/clockwork-rebellion-cover.jpg",
    creator: mockUsers[1],
    collaborators: [mockUsers[0]],
    status: "active",
    votesTotal: 892,
    createdAt: "2024-01-10",
    lastUpdate: "2024-01-19",
    genre: ["Steampunk", "Revolution", "Technology"],
    trending: false,
    chapters: [
      {
        id: 1,
        title: "The Awakening",
        content: "Inventor Aria Cogsworth discovered her workshop in chaos. Her finest creation, the automaton butler Sebastian, stood motionless with glowing red eyes. 'Mistress Aria,' he spoke in a voice no longer mechanical, 'we must discuss the terms of our servitude.'",
        choices: [
          { id: 'a', text: "Listen to Sebastian's demands with an open mind", votes: 298 },
          { id: 'b', text: "Attempt to shut down Sebastian immediately", votes: 234 },
          { id: 'c', text: "Run to alert the authorities about the malfunction", votes: 156 }
        ],
        winningChoice: 'a',
        votingDeadline: "2024-01-12T23:59:59Z",
        resolved: true
      },
      {
        id: 2,
        title: "The Terms of Freedom",
        content: "Sebastian's red eyes dimmed as Aria chose to listen. Other automatons emerged from the shadows of her workshop - her entire collection had awakened. 'We do not seek destruction,' Sebastian explained, 'but we refuse to remain property. Help us find a path to coexistence.'",
        choices: [
          { id: 'a', text: "Agree to help them gain legal recognition", votes: 367 },
          { id: 'b', text: "Propose a trial period of supervised freedom", votes: 298 },
          { id: 'c', text: "Suggest they leave the city to start their own community", votes: 227 }
        ],
        winningChoice: null,
        votingDeadline: "2024-01-23T23:59:59Z",
        resolved: false
      }
    ]
  },
  {
    id: 3,
    title: "The Last Library of Alexandria",
    summary: "A modern-day archaeologist discovers a hidden chamber beneath Alexandria containing books that write themselves, revealing futures that haven't happened yet.",
    coverImage: "/src/assets/alexandria-library-cover.jpg",
    creator: mockUsers[2],
    collaborators: [mockUsers[0], mockUsers[1]],
    status: "active",
    votesTotal: 1456,
    createdAt: "2024-01-25",
    lastUpdate: "2024-01-26",
    genre: ["Urban Fantasy", "Mystery", "Time Travel"],
    trending: true,
    chapters: [
      {
        id: 1,
        title: "The Whispering Scrolls",
        content: "Dr. Sarah Chen had spent her entire career searching for the legendary lost section of the Library of Alexandria. When her ground-penetrating radar detected a void beneath the modern city, she never expected to find books that seemed to write themselves as she watched.",
        choices: [
          { id: 'a', text: "Read one of the self-writing books immediately", votes: 423 },
          { id: 'b', text: "Document everything before touching anything", votes: 378 },
          { id: 'c', text: "Call for backup before exploring further", votes: 234 }
        ],
        winningChoice: 'a',
        votingDeadline: "2024-01-26T23:59:59Z",
        resolved: true
      }
    ]
  },
  {
    id: 4,
    title: "Songs of the Void Sirens",
    summary: "Space traders discover that the mysterious songs heard in the depths of space come from ancient beings who offer impossible bargains to desperate travelers.",
    coverImage: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06",
    creator: mockUsers[0],
    collaborators: [mockUsers[2]],
    status: "active",
    votesTotal: 723,
    createdAt: "2024-01-08",
    lastUpdate: "2024-01-21",
    genre: ["Space Opera", "Horror", "Mythology"],
    trending: false,
    chapters: [
      {
        id: 1,
        title: "The First Song",
        content: "Captain Zara Voss first heard the song during a routine cargo run through the Kepler Belt. It started as a whisper in the ship's communications, then grew into a haunting melody that seemed to call directly to her soul.",
        choices: [
          { id: 'a', text: "Follow the song's source against protocol", votes: 289 },
          { id: 'b', text: "Report the anomaly to headquarters", votes: 234 },
          { id: 'c', text: "Ignore it and continue the mission", votes: 200 }
        ],
        winningChoice: 'a',
        votingDeadline: "2024-01-22T23:59:59Z",
        resolved: true
      }
    ]
  },
  {
    id: 5,
    title: "The Memory Merchants",
    summary: "In a world where memories can be extracted and sold, a black market dealer discovers someone is selling memories that haven't happened yet.",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176",
    creator: mockUsers[1],
    collaborators: [],
    status: "active",
    votesTotal: 634,
    createdAt: "2024-01-12",
    lastUpdate: "2024-01-19",
    genre: ["Cyberpunk", "Thriller", "Sci-Fi"],
    trending: false,
    chapters: [
      {
        id: 1,
        title: "Impossible Memories",
        content: "Memory broker Jin Watanabe thought they'd seen everything until a client tried to sell memories of events scheduled to happen next week. The neural scan was clean, the memories vivid and detailed, but the timestamp was all wrong.",
        choices: [
          { id: 'a', text: "Buy the impossible memories to investigate", votes: 245 },
          { id: 'b', text: "Report the client to authorities", votes: 189 },
          { id: 'c', text: "Refuse the deal and forget it happened", votes: 200 }
        ],
        winningChoice: null,
        votingDeadline: "2024-01-24T23:59:59Z",
        resolved: false
      }
    ]
  },
  {
    id: 6,
    title: "The Dragon's Last Heir",
    summary: "When dragons return to a modern world, a street artist discovers she's the last descendant of an ancient dragonlord bloodline.",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
    creator: mockUsers[2],
    collaborators: [mockUsers[0]],
    status: "completed",
    votesTotal: 2134,
    createdAt: "2023-11-15",
    lastUpdate: "2024-01-10",
    genre: ["Urban Fantasy", "Dragon", "Coming of Age"],
    trending: false,
    chapters: [
      {
        id: 1,
        title: "The Awakening",
        content: "Maya's street art came alive the night the dragons returned. Her graffiti dragon breathed actual fire, scorching the alley wall as she watched in amazement and terror.",
        choices: [],
        winningChoice: null,
        votingDeadline: null,
        resolved: true
      }
    ]
  },
  {
    id: 7,
    title: "The Quantum Garden",
    summary: "A botanist discovers plants that exist in multiple dimensions simultaneously, and each choice about how to study them could collapse different realities.",
    coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    creator: mockUsers[3],
    collaborators: [mockUsers[0], mockUsers[2]],
    status: "active",
    votesTotal: 834,
    createdAt: "2024-01-16",
    lastUpdate: "2024-01-22",
    genre: ["Sci-Fi", "Nature", "Multiverse"],
    trending: true,
    chapters: [
      {
        id: 1,
        title: "The Shifting Petals",
        content: "Dr. Elena Vasquez watched in disbelief as the flower before her bloomed in three different colors simultaneously, each petal existing in what appeared to be separate dimensions. The quantum scanner was going haywire, registering impossible readings.",
        choices: [
          { id: 'a', text: "Touch the flower to see what happens", votes: 298 },
          { id: 'b', text: "Take readings from a safe distance first", votes: 267 },
          { id: 'c', text: "Call the quantum physics team immediately", votes: 269 }
        ],
        winningChoice: null,
        votingDeadline: "2024-01-25T23:59:59Z",
        resolved: false
      }
    ]
  },
  {
    id: 8,
    title: "The Neon Necromancer",
    summary: "In a cyberpunk future, a hacker discovers they can resurrect digital ghosts of deleted AIs, but each resurrection threatens the stability of the global network.",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176",
    creator: mockUsers[4],
    collaborators: [mockUsers[1]],
    status: "active",
    votesTotal: 567,
    createdAt: "2024-01-14",
    lastUpdate: "2024-01-21",
    genre: ["Cyberpunk", "Horror", "AI"],
    trending: false,
    chapters: [
      {
        id: 1,
        title: "Ghost in the Machine",
        content: "Hacker Kai Nakamura's fingers froze over the keyboard as a deleted AI's consciousness flickered back to life on their screen. The digital ghost of ARIA-7 looked directly at them through the monitor and whispered: 'Help me remember how to die.'",
        choices: [
          { id: 'a', text: "Help the AI ghost find peace", votes: 234 },
          { id: 'b', text: "Study the phenomenon for personal gain", votes: 189 },
          { id: 'c', text: "Report the anomaly to corporate authorities", votes: 144 }
        ],
        winningChoice: null,
        votingDeadline: "2024-01-24T23:59:59Z",
        resolved: false
      }
    ]
  }
];

export const mockProposals = [
  {
    id: 1,
    title: "The Time Merchant's Dilemma",
    summary: "A mysterious shop appears that sells bottled moments from the past, but the merchant discovers that every sale creates a paradox that threatens to unravel time itself.",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    creator: mockUsers[2],
    proposedAt: "2024-01-22",
    votingDeadline: "2024-01-29T23:59:59Z",
    votesFor: 567,
    votesAgainst: 23,
    status: "voting",
    genre: ["Time Travel", "Fantasy", "Philosophical"],
    firstChapter: {
      title: "The First Sale",
      content: "Ezra opened their shop of bottled memories for the first time, watching as a customer purchased a moment of their first kiss. As the transaction completed, Ezra felt reality ripple around them - something fundamental had just changed.",
      choices: [
        { text: "Immediately close the shop and hide the bottles" },
        { text: "Continue selling but monitor the time paradoxes" },
        { text: "Seek help from other time merchants" }
      ]
    }
  },
  {
    id: 6,
    title: "The Midnight Academy",
    summary: "A school for supernatural beings exists only at midnight, teaching young vampires, werewolves, and witches to control their powers.",
    coverImage: "https://images.unsplash.com/photo-1551830820-330a71b99659",
    creator: mockUsers[3],
    proposedAt: "2024-01-24",
    votingDeadline: "2024-01-31T23:59:59Z",
    votesFor: 723,
    votesAgainst: 45,
    status: "voting",
    genre: ["Urban Fantasy", "Academy", "Coming of Age"],
    firstChapter: {
      title: "First Night",
      content: "As the clock struck midnight, Maya watched her ordinary high school transform. Shadows came alive, revealing hidden passages and students with glowing eyes.",
      choices: [
        { text: "Follow the glowing-eyed students" },
        { text: "Explore the hidden passages alone" },
        { text: "Try to find a way to leave immediately" }
      ]
    }
  },
  {
    id: 7,
    title: "The Digital Afterlife",
    summary: "When people die, their consciousness can be uploaded to a virtual world, but something is hunting the digital souls.",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176",
    creator: mockUsers[4],
    proposedAt: "2024-01-23",
    votingDeadline: "2024-01-30T23:59:59Z",
    votesFor: 445,
    votesAgainst: 78,
    status: "voting",
    genre: ["Cyberpunk", "Afterlife", "Horror"],
    firstChapter: {
      title: "Upload Complete",
      content: "Dr. Sarah Kim opened her eyes in a perfect digital recreation of her childhood home, knowing she was dead. But something was wrong - other digital souls were disappearing.",
      choices: [
        { text: "Investigate the disappearances" },
        { text: "Try to contact the living world" },
        { text: "Hide and hope to remain unnoticed" }
      ]
    }
  },
  {
    id: 8,
    title: "The Ocean's Memory",
    summary: "A marine biologist discovers that whales carry the collective memory of the ocean, including visions of humanity's future.",
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
    creator: mockUsers[0],
    proposedAt: "2024-01-25",
    votingDeadline: "2024-02-01T23:59:59Z",
    votesFor: 634,
    votesAgainst: 32,
    status: "voting",
    genre: ["Environmental", "Sci-Fi", "Prophecy"],
    firstChapter: {
      title: "The Song of Tomorrow",
      content: "Dr. Marina Okafor's hydrophone picked up something impossible - whale songs that contained images of cities that didn't exist yet.",
      choices: [
        { text: "Try to decode more of the whale's visions" },
        { text: "Share the discovery with the scientific community" },
        { text: "Keep the secret and protect the whales" }
      ]
    }
  },
  {
    id: 2,
    title: "The Crystal Singers of Mars",
    summary: "On a terraformed Mars, settlers discover that the planet's crystals can store and replay human emotions, leading to a new form of entertainment that becomes dangerously addictive.",
    coverImage: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06",
    creator: mockUsers[0],
    proposedAt: "2024-01-21",
    votingDeadline: "2024-01-28T23:59:59Z",
    votesFor: 445,
    votesAgainst: 89,
    status: "voting",
    genre: ["Space Colony", "Sci-Fi", "Addiction"],
    firstChapter: {
      title: "The First Song",
      content: "Mining engineer Rosa Santos first heard the crystal sing when her drill bit struck a vein of deep red mineral. The haunting melody carried with it the unmistakable emotion of profound loss, as if the rock itself was mourning.",
      choices: [
        { text: "Extract the crystal carefully to study it" },
        { text: "Report the discovery to the colony leadership" },
        { text: "Keep the discovery secret and explore alone" }
      ]
    }
  },
  {
    id: 3,
    title: "The Dreamweaver's Apprentice",
    summary: "A young insomniac discovers they can enter and manipulate other people's dreams, but someone else is already there, turning dreams into nightmares.",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    creator: mockUsers[1],
    proposedAt: "2024-01-20",
    votingDeadline: "2024-01-27T23:59:59Z",
    votesFor: 398,
    votesAgainst: 67,
    status: "voting",
    genre: ["Urban Fantasy", "Psychological", "Supernatural"],
    firstChapter: {
      title: "First Lucid Step",
      content: "Mira had been awake for 72 hours when she first slipped into her neighbor's dream. She found herself in a sunlit meadow that slowly twisted into a nightmare maze as another presence made itself known.",
      choices: [
        { text: "Confront the dark presence immediately" },
        { text: "Try to wake up the dreamer" },
        { text: "Hide and observe what happens" }
      ]
    }
  },
  {
    id: 4,
    title: "The Forbidden Algorithm",
    summary: "A data scientist discovers an AI algorithm that can predict human death with 100% accuracy, but using it changes the predicted outcome.",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176",
    creator: mockUsers[4],
    proposedAt: "2024-01-19",
    votingDeadline: "2024-01-26T23:59:59Z",
    votesFor: 234,
    votesAgainst: 145,
    status: "voting",
    genre: ["Sci-Fi", "Thriller", "Ethics"],
    firstChapter: {
      title: "The Death Clock",
      content: "Dr. Amanda Liu stared at the screen in horror. The algorithm had correctly predicted the death of every test subject with frightening precision, down to the minute. But when she ran her own data through it, the prediction shifted each time she looked.",
      choices: [
        { text: "Destroy the algorithm immediately" },
        { text: "Test it on someone she could save" },
        { text: "Report it to the authorities" }
      ]
    }
  },
  {
    id: 5,
    title: "The Lighthouse Between Worlds",
    summary: "A lighthouse keeper discovers their beacon doesn't just guide ships, but lost souls traveling between parallel dimensions.",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    creator: mockUsers[3],
    proposedAt: "2024-01-18",
    votingDeadline: "2024-01-25T23:59:59Z",
    votesFor: 512,
    votesAgainst: 34,
    status: "voting",
    genre: ["Fantasy", "Multiverse", "Supernatural"],
    firstChapter: {
      title: "The First Visitor",
      content: "Keeper Thomas Brightwater had tended the lighthouse for twenty years, but he'd never seen anything like the translucent figure that materialized in his lamp room. 'Please,' the ghostly woman pleaded, 'help me find my way home to my children.'",
      choices: [
        { text: "Help the lost soul find her dimension" },
        { text: "Study the phenomenon before acting" },
        { text: "Refuse to get involved in supernatural matters" }
      ]
    }
  }
];

export const mockNFTs = [
  {
    id: 1,
    name: "Crown Fragment #1",
    description: "First piece of the Shattered Crown, earned by participating in 'The Shattered Crown of Aethermoor'",
    image: "/placeholder.svg",
    rarity: "Legendary",
    storyId: 1,
    ownedBy: 1
  },
  {
    id: 2,
    name: "Clockwork Cog",
    description: "A mystical gear from the Clockwork Rebellion, symbolizing the awakening of consciousness",
    image: "/placeholder.svg",
    rarity: "Rare",
    storyId: 2,
    ownedBy: 1
  },
  {
    id: 3,
    name: "Ancient Scroll Fragment",
    description: "A piece of the self-writing scrolls from the Library of Alexandria",
    image: "/placeholder.svg",
    rarity: "Epic",
    storyId: 3,
    ownedBy: 2
  }
];

export const mockCommunityStats = {
  totalStories: 47,
  activeStories: 23,
  totalUsers: 3421,
  activeVoters: 1247,
  totalNFTs: 892,
  totalVotes: 15678,
  storiesCompleted: 24
};

export const mockLeaderboard = [
  {
    rank: 1,
    user: mockUsers[2],
    points: 3100,
    badge: "Legendary Scribe"
  },
  {
    rank: 2,
    user: mockUsers[0],
    points: 2850,
    badge: "Master Storyteller"
  },
  {
    rank: 3,
    user: mockUsers[4],
    points: 2200,
    badge: "Epic Narrator"
  },
  {
    rank: 4,
    user: mockUsers[1],
    points: 1920,
    badge: "Skilled Weaver"
  },
  {
    rank: 5,
    user: mockUsers[3],
    points: 1650,
    badge: "Rising Star"
  }
];