// Generator script for 1,000 Shameful Acts and 1,000 Public Acts
const fs = require("fs");
const path = require("path");

function createShamefulTasks() {
  const tasks = [];
  const titlesSet = new Set();
  const descSet = new Set();

  const themes = [
    {
      name: "Bathroom Mirror & Inanimate Objects Drama",
      actions: [
        "Give a 45-second dramatic Oscar acceptance speech to",
        "Deliver a tearful breakup speech to",
        "Perform a high-stakes Shakespearean soliloquy addressed to",
        "Deliver a fiery motivational pre-game locker room speech to",
        "Apologize with deep remorse and solemn violin energy to",
        "Interview as if it were a reclusive Hollywood A-lister",
        "Present a formal knighthood ceremony for",
        "Accuse of international espionage during an interrogation with",
        "Sing a heartfelt opera ballad praising the beauty of",
        "Deliver a philosophical eulogy mourning the tragic demise of",
      ],
      targets: [
        "your bathroom mirror after brushing your teeth",
        "an empty plastic takeout container in your kitchen",
        "a single lonely sock whose partner went missing in the wash",
        "your smartphone when its battery drops below 5%",
        "a half-eaten biscuit left on your kitchen counter",
        "your ceiling fan while it spins on maximum speed",
        "a stubborn shoelace that refuses to tie smoothly",
        "your Wi-Fi router whenever a video begins buffering",
        "a potted houseplant looking slightly droopy",
        "your pillow right before you turn the lights off",
        "a water bottle that fell off your bedside table",
        "an overdue electricity bill sitting on your desk",
        "a dead dry-erase marker that betrayed you mid-sentence",
        "your refrigerator light when you open it at midnight",
        "a pair of worn-out slippers that have seen better days",
      ],
      difficultyList: ["Easy", "Medium", "Easy", "Medium"],
      durations: ["45 seconds", "1 minute", "90 seconds", "2 minutes"],
      location: "Home",
      safety: "Ensure you are in a safe private space without disturbing roommates or neighbors.",
      tags: ["solo", "inanimate", "acting", "monologue", "funny"],
    },
    {
      name: "Cringe Character Roleplays & Film Tropes",
      actions: [
        "Explain your plan for world domination to your pet or a plush toy, like",
        "Narrate your simple morning coffee preparation in the voice of",
        "React to dropping an ice cube on the floor as if you are",
        "Describe your daily commute to a friend in the suspenseful tone of",
        "Order a glass of water from a friend or family member like",
        "Narrate cleaning your desk drawer as if you are Sir David Attenborough studying",
        "Read your weekly grocery shopping list with the intense gravitas of",
        "Explain why you did not do your laundry using the courtroom arguments of",
        "Apologize for eating the last chocolate like a defeated Shakespearean king in",
        "Host an unboxing review of an empty cardboard box in the style of",
      ],
      targets: [
        "a brooding film noir detective with a trench coat attitude",
        "a cartoon evil mastermind who laughs maniacally at mundane chores",
        "an overdramatic 1990s soap opera heir discovering family betrayal",
        "an intense action movie commander defusing a bomb with 4 seconds left",
        "a hyper-energetic 3 AM infomercial host pitching miracle cleaners",
        "a nature documentary narrator whispering about rare urban creatures",
        "an Olympic sports commentator breaking down minor household movements",
        "a medieval knight reporting back from a fierce dragon battlefield",
        "a self-important culinary judge critiquing lukewarm tap water",
        "a sci-fi starship captain reporting critical oxygen system failure",
      ],
      difficultyList: ["Medium", "Hard", "Medium", "Easy"],
      durations: ["1 minute", "2 minutes", "3 minutes", "90 seconds"],
      location: "Private",
      safety: "Harmless character play. Respect roommates and do not shout loudly late at night.",
      tags: ["roleplay", "cinema", "voice", "character", "improv"],
    },
    {
      name: "Awkward Performances & Silly Movement",
      actions: [
        "Perform your absolute worst, most rhythmically challenged dance move called",
        "Do a dramatic high-fashion runway strut across your living room while wearing",
        "Invent an absurd 5-step victory dance and perform it after",
        "Walk in exaggerated slow-motion through your apartment hallway while pretending",
        "Strike three ridiculous statuesque poses in front of your mirror and hold each for 10 seconds like",
        "Perform an energetic air-guitar solo to a completely silent room for 30 seconds pretending",
        "Do an exaggerated mime routine pretending you are trapped inside an invisible box while",
        "Execute a slow-motion dramatic sports dive onto your mattress or couch pretending",
        "Do an awkward robotic dance while holding an ordinary household item like",
        "Choreograph a 20-second dramatic fight sequence with your own shadow on the wall portraying",
      ],
      targets: [
        "The Confused Flamingo",
        "The Malfunctioning Microwave",
        "The Slippery Noodle",
        "The Hesitant Penguin on Ice",
        "The Stiff Tin Robot",
        "The Overcaffeinated Squirrel",
        "The Melodramatic Windmill",
        "The Disoriented Astronaut",
        "The Majestic Potato",
        "The Uncoordinated Crab",
      ],
      difficultyList: ["Easy", "Medium", "Medium", "Hard"],
      durations: ["30 seconds", "1 minute", "2 minutes", "45 seconds"],
      location: "Home",
      safety: "Clear floor space of any sharp or tripping hazards before dancing.",
      tags: ["dance", "movement", "cringe", "physical", "energy"],
    },
    {
      name: "Self-Deprecating Comedy & Awkward Confessions",
      actions: [
        "Record a 45-second stand-up comedy bit roasting your own worst habit of",
        "Give a mock TED Talk about your legendary lack of ability in",
        "Create a satirical 30-second commercial advertising yourself as the world's leading expert on",
        "Review your most cringey childhood or teenage fashion phase with mock scientific seriousness regarding",
        "Deliver a solemn presentation explaining why you can never wake up on your first alarm due to",
        "Present three completely ridiculous justifications to your mirror for why you ordered food instead of cooking",
        "Admit your funniest harmless superstition to a friend and explain the tragic origin story behind",
        "Draft a satirical public apology letter to your future self about your tendency to",
        "Perform an audio voice memo reviewing the last terrible movie you secretly loved because of",
        "Describe your most awkward elevator silence experience as if it were an epic battle involving",
      ],
      targets: [
        "procrastinating by rearranging your bookshelf by color",
        "putting five items in an online cart and closing the tab for 3 weeks",
        "pretending to understand a movie reference you have never watched",
        "spending 20 minutes finding the perfect song before driving 5 minutes",
        "forgetting someone's name 3 seconds after they introduced themselves",
        "waving back enthusiastically at a stranger who was waving to someone behind you",
        "practicing imaginary arguments in the shower that will never happen",
        "holding the door open for someone who was way too far away to walk briskly",
        "checking the fridge 4 times hoping new groceries magically spawned",
        "tripping on completely flat ground and checking the floor like it had a crack",
      ],
      difficultyList: ["Medium", "Hard", "Hard", "Medium"],
      durations: ["1 minute", "2 minutes", "3 minutes", "45 seconds"],
      location: "Private",
      safety: "Keep comedy lighthearted and harmless. Avoid harsh self-criticism or sensitive topics.",
      tags: ["comedy", "roast", "relatable", "self-deprecating", "cringe"],
    },
    {
      name: "Fashion, Styling & Awkward Aesthetic",
      actions: [
        "Wear an intentionally mismatched pair of socks and walk around all day with pride, specifically",
        "Put on dark sunglasses indoors while drinking water and pretend you are",
        "Wear your hoodie backwards with the hood up for 15 minutes at home while working on",
        "Create a ridiculous high-fashion runway look using only clean towels and bathrobes representing",
        "Style your hair in the most exaggerated, spiky, or messy fashion possible and pose like",
        "Wear formal shoes or blazers with casual sweatpants during a private video call with a close friend while discussing",
        "Drape a clean bedsheet like a royal Roman toga and give a regal decree about",
        "Create a funny cardboard badge that says 'Certified Overthinker' and wear it while doing",
        "Put on winter gloves or mittens indoors to do a simple task like typing or scrolling through",
        "Pair an oversized sunhat or cap with your ordinary pajamas and take a serious fashion headshot looking like",
      ],
      targets: [
        "neon yellow and dark wool socks that clash violently",
        "a famous movie star dodging imaginary paparazzi in the kitchen",
        "an avant-garde European model at Paris Fashion Week",
        "an ancient Roman emperor declaring all weekends 3 days long",
        "a secret undercover operative blending in with laundry",
        "a time traveler who dressed for the wrong century",
        "a quirky tech billionaire launching an invisible product",
        "a mystery detective inspecting refrigerator magnets",
        "a high-society aristocrat attending a tea party for stuffed animals",
        "an eccentric professor solving the mystery of missing hair ties",
      ],
      difficultyList: ["Easy", "Medium", "Medium", "Hard"],
      durations: ["2 minutes", "5 minutes", "15 minutes", "30 minutes"],
      location: "Home",
      safety: "Clothing must remain completely modest, appropriate, and comfortable.",
      tags: ["fashion", "style", "mismatched", "costume", "fun"],
    },
    {
      name: "Awkward Social & Friend Dares",
      actions: [
        "Send a voice note to your best friend singing only the chorus of an old pop song without any context about",
        "Text a close friend a completely formal corporate email greeting asking if they want to hang out, signed as",
        "Call a willing close friend and speak exclusively in dramatic rhyming couplets for 60 seconds about",
        "Ask a close friend to rate your weirdest everyday habit on a scale from 1 to 10 including",
        "Send your friend a photo of an ordinary household spoon and ask them for urgent advice on how to use it for",
        "Leave a 30-second voicemail to a friend narrating your current location as if on an undercover espionage mission tracking",
        "Ask a friend to name their top three least favorite vegetables and defend those vegetables with fierce passion like",
        "Send a message to your family group chat asking for their honest review of your signature dish consisting of",
        "Initiate a video call with a friend and do not break a completely solemn, serious straight face for 45 seconds while they talk about",
        "Ask a friend to assign you a ridiculous superhero codename and superpower based on your biggest everyday weakness like",
      ],
      targets: [
        "your inability to locate your house keys in your own backpack",
        "eating dry cereal straight from the cardboard box at midnight",
        "taking 45 minutes to pick a movie on Netflix only to fall asleep",
        "your legendary terrible singing voice when music is playing",
        "your chronic habit of saying 'you too' when a waiter says 'enjoy your meal'",
        "how you panic whenever someone asks 'tell me about yourself'",
        "your refusal to discard empty shoeboxes 'just in case'",
        "how you always think the passenger door is locked when it isn't",
        "saving random screenshots you will never look at again",
        "making dramatic sigh sounds whenever you sit down on a couch",
      ],
      difficultyList: ["Hard", "Extreme", "Medium", "Hard"],
      durations: ["1 minute", "2 minutes", "5 minutes", "90 seconds"],
      location: "Private",
      safety: "Only involve consenting, close friends who enjoy playful humor. Never harass anyone.",
      tags: ["friends", "messaging", "voicenote", "prank", "awkward"],
    },
    {
      name: "Domestic Absurdities & Culinary Pretension",
      actions: [
        "Give a 5-star Michelin restaurant critique to a plain slice of toast or biscuit, raving about",
        "Sniff a glass of ordinary tap water like a seasoned sommelier and describe its vintage notes of",
        "Serve a single potato chip on a ceramic plate with decorative fork and knife, treating it like",
        "Make a dramatic cooking show presentation explaining the complex chemistry of pouring milk into",
        "Conduct an intense blind taste test comparing two identical brands of plain water and pretend you detect",
        "Apologize to an apple or banana for leaving it alone in the fruit bowl before peeling it, promising",
        "Eat a slice of pizza or sandwich with a fork and knife while sitting upright like high royalty during",
        "Narrate making instant noodles as if it were a high-stakes surgical procedure requiring utmost focus on",
        "Write a dramatic restaurant review for your own kitchen on your notes app, criticizing the head chef for",
        "Give a 60-second lecture to an imaginary masterclass about the proper ergonomic technique of holding",
      ],
      targets: [
        "its delicate charred crust and complex subtle grain notes",
        "the exquisite mineral resonance of municipal pipe vintage 2026",
        "a rare wagyu delicacy harvested from the legendary snack aisle",
        "crisp cereal flakes floating in cold ceramic bliss",
        "notes of alpine glacial breeze vs subtle urban reservoir complexity",
        "that its sacrifice will be honored across the kitchen kingdom",
        "an imperial banquet held in honor of finishing laundry",
        "boiling broth temperatures and delicate seasoning packet deployment",
        "running out of snacks precisely when hunger struck at 11 PM",
        "a simple coffee mug with one pinky finger extended aristocratic style",
      ],
      difficultyList: ["Easy", "Medium", "Easy", "Medium"],
      durations: ["1 minute", "2 minutes", "3 minutes", "90 seconds"],
      location: "Home",
      safety: "Ensure all food items are safe and hygienic. Never waste food or create fire risks.",
      tags: ["food", "critique", "pretentious", "kitchen", "funny"],
    },
  ];

  let idCounter = 1;

  for (const theme of themes) {
    for (let a = 0; a < theme.actions.length; a++) {
      for (let t = 0; t < theme.targets.length; t++) {
        if (tasks.length >= 1000) break;
        const action = theme.actions[a];
        const target = theme.targets[t];

        const titleWords = `${action.split(" ").slice(0, 3).join(" ")} ${target.split(" ").slice(0, 2).join(" ")}`;
        let title = titleWords.replace(/[^\w\s]/g, "").trim();
        title = title.charAt(0).toUpperCase() + title.slice(1);
        if (title.length > 40) title = title.slice(0, 38) + "...";

        // Unique title handling
        let uniqueTitle = title;
        let suffix = 1;
        while (titlesSet.has(uniqueTitle)) {
          suffix++;
          uniqueTitle = `${title} (Dare #${suffix})`;
        }
        titlesSet.add(uniqueTitle);

        const desc = `${action} ${target}. Fully commit to the bit with serious theatrical emotion, no matter how awkward or ridiculous it feels. Do not break character for the entire duration!`;
        if (descSet.has(desc)) continue;
        descSet.add(desc);

        const diffIndex = (a + t) % theme.difficultyList.length;
        const difficulty = theme.difficultyList[diffIndex];
        const duration = theme.durations[(a * 2 + t) % theme.durations.length];
        const embarLevel = Math.min(10, Math.max(3, (a % 5) + (t % 5) + 2));
        const socialInt = theme.location === "Home" ? Math.min(6, (a % 4) + 1) : Math.min(10, (t % 5) + 4);
        const reelPot = Math.min(10, Math.max(5, ((a * 3 + t) % 6) + 5));

        const id = `shame-${String(idCounter).padStart(4, "0")}`;
        idCounter++;

        tasks.push({
          id,
          title: uniqueTitle,
          description: desc,
          category: "shameful_acts",
          difficulty,
          duration,
          embarrassment_level: embarLevel,
          social_intensity: socialInt,
          location: theme.location,
          requires_consent: theme.tags.includes("friends"),
          requires_permission: false,
          safety_note: theme.safety,
          reel_potential: reelPot,
          tags: [...theme.tags, difficulty.toLowerCase(), `cringe_${embarLevel}`],
        });
      }
      if (tasks.length >= 1000) break;
    }
    if (tasks.length >= 1000) break;
  }

  // If still under 1000 due to template combinations, generate creative systematic variations
  let extraIndex = 1;
  const modifierStyles = [
    "with your eyes closed tight",
    "whispering like a 1920s radio spy",
    "with a fake royal British accent",
    "while holding an unlit candle",
    "while balancing a small book on your head",
    "while slowly backing away toward the door",
    "while clapping enthusiastically after every sentence",
    "with the dramatic cadence of a movie trailer voiceover",
  ];

  while (tasks.length < 1000) {
    const theme = themes[extraIndex % themes.length];
    const action = theme.actions[extraIndex % theme.actions.length];
    const target = theme.targets[(extraIndex * 3) % theme.targets.length];
    const modifier = modifierStyles[extraIndex % modifierStyles.length];

    const titleBase = `Dare #${tasks.length + 1}: ${action.split(" ").slice(0, 3).join(" ")}`;
    let title = titleBase.replace(/[^\w\s#:]/g, "").trim();
    if (titlesSet.has(title)) {
      title = `${title} II`;
    }
    titlesSet.add(title);

    const desc = `${action} ${target} ${modifier}. Embrace the cringe completely and maintain serious composure throughout!`;
    const id = `shame-${String(tasks.length + 1).padStart(4, "0")}`;

    tasks.push({
      id,
      title,
      description: desc,
      category: "shameful_acts",
      difficulty: extraIndex % 4 === 0 ? "Extreme" : extraIndex % 3 === 0 ? "Hard" : "Medium",
      duration: `${(extraIndex % 4) + 1} minutes`,
      embarrassment_level: (extraIndex % 6) + 5,
      social_intensity: (extraIndex % 5) + 3,
      location: theme.location,
      requires_consent: theme.tags.includes("friends"),
      requires_permission: false,
      safety_note: theme.safety,
      reel_potential: (extraIndex % 4) + 7,
      tags: [...theme.tags, "awkward", "dare"],
    });
    extraIndex++;
  }

  return tasks.slice(0, 1000);
}

function createPublicTasks() {
  const tasks = [];
  const titlesSet = new Set();
  const descSet = new Set();

  const themes = [
    {
      name: "Respectful Social Compliments & Micro-Interactions",
      actions: [
        "Give a genuine, respectful compliment to a willing stranger or cafe patron regarding",
        "Ask a willing person in a library, bookstore, or cafe for their personal recommendation on",
        "Politely ask someone waiting in an open park if they can take a 10-second photo of you doing",
        "Wish three different people in an open public space a wonderfully joyful day with",
        "Ask an employee or vendor at an open street market what their all-time favorite item is among",
        "Politely ask a consenting group of people at a cafe if they know the title of that song that goes",
        "Ask a stranger walking their friendly dog if you may ask the dog what it thinks about",
        "Hold the door for three people in a row with the regal warmth and bow of",
        "Ask someone reading in a public park if the book they are enjoying is about",
        "Thank a street cleaner, gardener, or public service worker with heartfelt gratitude and",
      ],
      targets: [
        "their awesome shoes, cool jacket, or creative sunglasses",
        "a book or playlist that changed their perspective on life",
        "a dramatic cinematic hero pose in front of a tree or monument",
        "a genuine warm smile and zero awkward pressure",
        "their handcrafted goods or signature fresh snacks",
        "'dun-dun-dun' while humming the beat cheerfully",
        "the geopolitical climate of squirrel territory in the park",
        "a doorman at a five-star Parisian luxury palace",
        "time travel, ancient mysteries, or unexpected plot twists",
        "a sincere 'thank you for making our city so beautiful today'",
      ],
      difficultyList: ["Medium", "Hard", "Hard", "Medium"],
      durations: ["2 minutes", "3 minutes", "5 minutes", "90 seconds"],
      location: "Public",
      safety: "Never press or linger if someone seems busy or uninterested. Respect personal space.",
      tags: ["social", "kindness", "compliment", "micro-dare", "respectful"],
    },
    {
      name: "Public Performance & Street Theatrics in Permitted Spaces",
      actions: [
        "Stand in an open permitted park plaza and deliver a passionate 30-second speech to your friends about",
        "Perform a silent 20-second robotic dance with total deadpan seriousness near",
        "Walk in slow-motion across an open public square for 25 seconds pretending",
        "Recite a dramatic public-domain poem or tongue-twister out loud with theatrical flair near",
        "Lead your friends in a synchronized 10-second goofy strut across a wide park path like",
        "Perform an invisible jump-rope routine on a public pavement for 30 seconds pretending",
        "Give a standing ovation and enthusiastic applause to a public fountain or tree celebrating",
        "Play air-violin with immense sorrow and emotion on a park bench while looking at",
        "Do a 15-second catwalk runway turn in a wide open shopping galleria concourse like",
        "Freeze completely like a living mannequin for 30 seconds in an open public plaza while",
      ],
      targets: [
        "why afternoon naps deserve international Olympic gold medals",
        "a bench or open sculpture without obstructing pedestrian traffic",
        "you are dodging invisible laser beams in an action heist",
        "a park pavilion while your friend records the performance",
        "a crew of 1970s disco legends stepping onto a dance floor",
        "you are training for the World Invisible Athletics Cup",
        "its outstanding performance in providing shade and fresh oxygen",
        "a falling autumn leaf drifting gracefully to the grass",
        "a high-fashion supermodel presenting an imaginary trench coat",
        "friends record your perfectly still facial expression",
      ],
      difficultyList: ["Hard", "Extreme", "Hard", "Medium"],
      durations: ["1 minute", "2 minutes", "3 minutes", "45 seconds"],
      location: "Public",
      safety: "Never block exits, pedestrian paths, or emergency zones. Perform only in open permitted areas.",
      tags: ["performance", "street", "acting", "bold", "confidence"],
    },
    {
      name: "Cafe, Restaurant & Urban Street Quests",
      actions: [
        "Order your coffee or beverage at a cafe in an exaggerated, polite 19th-century royal tone saying",
        "Ask the cafe barista or waiter to surprise you with whatever drink best matches your",
        "Read a children's picture book or comic in a coffee shop with the grave intensity of",
        "Celebrate receiving your food order at a cafe with a quiet, polite celebration fist pump declaring",
        "Ask a waiter what their single happiest memory at work has been while they take your order for",
        "Write a genuine, uplifting 2-sentence appreciation note on your paper napkin for the staff saying",
        "Sit completely upright and sip your beverage using your pinky finger extended like",
        "Ask for a glass of water and raise an enthusiastic silent toast to your friend across the table for",
        "Carefully inspect the cafe menu using an imaginary magnifying glass like a detective solving",
        "Eat one French fry or biscuit with a fork and knife in a casual cafe while keeping a straight face about",
      ],
      targets: [
        "'Greetings, noble merchant, I seek thy finest iced brew today'",
        "vibe and astrological energy according to their intuition",
        "a constitutional lawyer reviewing Supreme Court briefs",
        "'Victory is ours! The feast has officially arrived!'",
        "a table of friendly explorers eager for good food",
        "'Your kindness today brought genuine joy to my morning. Keep shining!'",
        "an English Duke attending afternoon tea in high society",
        "surviving another full week without losing your sanity",
        "the mystery of which pastry holds the legendary secret recipe",
        "treating casual street food like royal Buckingham dining",
      ],
      difficultyList: ["Medium", "Hard", "Medium", "Easy"],
      durations: ["2 minutes", "5 minutes", "10 minutes", "3 minutes"],
      location: "Public",
      safety: "Never disturb staff during busy rush hours. Always tip generously if customary and be deeply polite.",
      tags: ["cafe", "food", "urban", "polite", "roleplay"],
    },
    {
      name: "Public Photography & Creative Documentary",
      actions: [
        "Have a friend film a dramatic 20-second travel-style documentary where you showcase an ordinary",
        "Pose for a high-fashion editorial photo in front of a completely ordinary public object like",
        "Film a micro-nature documentary whispering about city pigeons foraging near",
        "Present an ordinary public bike rack as if it were a high-tech modern art installation for",
        "Record a movie trailer voiceover while walking past a mundane city brick wall pretending it is",
        "Capture a photo of yourself looking like a brooding superhero on a park bench waiting for",
        "Film an intense sports montage of you simply jogging up three public steps and celebrating with",
        "Take a dramatic 'album cover' photo with your friends in an open public plaza looking away from the camera like",
        "Film a 15-second silent cinema scene where you react in horror to an empty public trash can because",
        "Act out an undercover spy drop where you carefully pass a bottle of water to a friend near",
      ],
      targets: [
        "public park bench with cinematic panning camera movements",
        "a bright red fire hydrant or clean municipal trash bin",
        "a park lawn like they are majestic winged beasts of legend",
        "a futuristic minimalist museum exhibition in Berlin",
        "the secret fortress of an ancient forgotten empire",
        "the signal beacon to summon you for urgent city rescue",
        "a championship Olympic marathon gold medal finish line",
        "an indie rock band that has just released their sophomore album",
        "the snacks have mysteriously vanished into the void",
        "a public statue while both wearing dark sunglasses",
      ],
      difficultyList: ["Easy", "Medium", "Medium", "Hard"],
      durations: ["3 minutes", "5 minutes", "10 minutes", "2 minutes"],
      location: "Public",
      safety: "Do not film identifiable strangers without consent. Ensure paths remain completely open.",
      tags: ["photo", "documentary", "cinema", "creative", "reel"],
    },
    {
      name: "Friend Group Co-Op Dares in Open Spaces",
      actions: [
        "Have your friends interview you on camera in an open park as if you are a world-famous celebrity discussing",
        "Execute a 3-person synchronized high-five with elaborate slow-motion hand choreography in",
        "Form an impromptu single-file conga line for 15 seconds across an empty park lawn while singing",
        "Have your friends form an enthusiastic protective security detail escorting you to",
        "Do a rock-paper-scissors tournament with your friends in a public square where the loser must",
        "Play an acoustic hand-clapping game with your friend on a park bench while singing",
        "Hold a mock ribbon-cutting ceremony using a paper napkin for your friend entering",
        "Challenge your friend to an intense staring contest on a public park bench without laughing for",
        "Stage a dramatic slow-motion duel with breadsticks or rolled-up newspapers in an open park acting like",
        "Have your friends take turns acting like enthusiastic paparazzi asking you silly questions about",
      ],
      targets: [
        "your revolutionary philosophical theory on why socks disappear",
        "the middle of an open public park pavilion",
        "an imaginary festive anthem celebrating fresh afternoon sunshine",
        "the nearest ice cream cart or juice stand with serious bodyguard vibes",
        "do 10 jumping jacks while loudly shouting their favorite pizza topping",
        "childhood nursery rhymes with total unshakeable confidence",
        "an ordinary convenience store or local bookstore",
        "60 straight seconds while passersby occasionally glance over",
        "two ancient samurai settling a dispute over the last French fry",
        "what luxury outfit you are wearing to the grocery store today",
      ],
      difficultyList: ["Hard", "Extreme", "Medium", "Hard"],
      durations: ["3 minutes", "5 minutes", "10 minutes", "2 minutes"],
      location: "Public",
      safety: "Keep group volume reasonable. Do not create loud panic or block walkways.",
      tags: ["friends", "group", "coop", "laughter", "bold"],
    },
    {
      name: "Confidence Drills & Comfort-Zone Expanders",
      actions: [
        "Walk down a busy public promenade wearing a harmless colorful accessory with the absolute swagger of",
        "Sit on a public park bench in complete silence without checking your smartphone for",
        "Ask a street artist, busker, or craft vendor a sincere question about how long they have practiced",
        "Draw a temporary chalk hopscotch grid in a permitted park area and enthusiastically hop through it like",
        "Wear your favorite jacket or sunglasses with supreme runway confidence while carrying",
        "Offer to hold an elevator or building door for a delivery courier with a warm energetic greeting like",
        "Stand tall in a public park open field and take three deep breaths with your arms outstretched embracing",
        "Wave cheerfully to passengers on a passing public bus or ferry boat with pure childlike joy from",
        "Ask a bookstore clerk if they have a section dedicated to books about finding your true life passion in",
        "Ask a stranger on a park bench what has been the absolute highlight of their week so far with",
      ],
      targets: [
        "a billionaire walking into their private jet terminal",
        "20 uninterrupted minutes while observing the world go by",
        "their craft, listening with deep genuine admiration",
        "an excited 8-year-old on the best school recess of the year",
        "a single red apple like it is a precious luxury briefcase",
        "'You are doing heroic work today, have an incredible shift!'",
        "the vast open horizon and releasing all social anxiety",
        "the safety of a wide pedestrian sidewalk or park bridge",
        "everyday adventures, unexpected journeys, and joyful living",
        "open curiosity and a warm, non-judgmental presence",
      ],
      difficultyList: ["Medium", "Hard", "Extreme", "Medium"],
      durations: ["5 minutes", "15 minutes", "20 minutes", "3 minutes"],
      location: "Public",
      safety: "Stay grounded and mindful. Never enter traffic or private property.",
      tags: ["confidence", "mindfulness", "growth", "bold", "presence"],
    },
    {
      name: "Sidewalk Fun, Urban Exploration & Random Joy",
      actions: [
        "Leave an uplifting handwritten note on a park bench or inside a community library book saying",
        "Step strictly on the sidewalk tiles without touching any cracks or lines for an entire city block like",
        "Find a public mirror or reflective store window and give yourself a silent enthusiastic thumbs up for",
        "Balance on a curb edge or sidewalk line for 30 seconds with gymnast elegance near",
        "Take a creative photo of your own shadow striking an epic warrior silhouette against",
        "Celebrate reaching your destination on foot with a quiet victorious Olympic jump in",
        "Visit a public botanical garden or flower bed and inspect three different leaves like a botanist on",
        "Walk through an open pedestrian bazaar or flea market and identify the single most unique object in",
        "Give a silent, polite military salute to an imposing historical city statue as you walk past",
        "Drop a shiny coin or token into a street performer's guitar case with a respectful bow thanking them for",
      ],
      targets: [
        "'Whoever finds this: you are stronger than you think. Have a wonderful day!'",
        "the floor is hot lava and your destination is safe sanctuary",
        "being courageous and stepping outside your comfort zone today",
        "an open public park pathway without disturbing other walkers",
        "a sunny brick wall or open paved plaza",
        "an open public square where no one is crowded",
        "an uncharted expedition deep in the Amazonian rainforest",
        "the entire venue, appreciating its craftsmanship and history",
        "its timeless service watching over the city skyline",
        "bringing live music and soul into the public streets",
      ],
      difficultyList: ["Easy", "Medium", "Easy", "Medium"],
      durations: ["2 minutes", "5 minutes", "10 minutes", "3 minutes"],
      location: "Public",
      safety: "Ensure personal items remain secure. Always obey traffic and municipal rules.",
      tags: ["kindness", "urban", "joy", "walking", "adventure"],
    },
  ];

  let idCounter = 1;

  for (const theme of themes) {
    for (let a = 0; a < theme.actions.length; a++) {
      for (let t = 0; t < theme.targets.length; t++) {
        if (tasks.length >= 1000) break;
        const action = theme.actions[a];
        const target = theme.targets[t];

        const titleWords = `${action.split(" ").slice(0, 3).join(" ")} ${target.split(" ").slice(0, 2).join(" ")}`;
        let title = titleWords.replace(/[^\w\s]/g, "").trim();
        title = title.charAt(0).toUpperCase() + title.slice(1);
        if (title.length > 40) title = title.slice(0, 38) + "...";

        let uniqueTitle = title;
        let suffix = 1;
        while (titlesSet.has(uniqueTitle)) {
          suffix++;
          uniqueTitle = `${title} (Dare #${suffix})`;
        }
        titlesSet.add(uniqueTitle);

        const desc = `${action} ${target}. Remember to be completely polite, peaceful, and respectful of everyone around you. Have fun and embrace the social bravery!`;
        if (descSet.has(desc)) continue;
        descSet.add(desc);

        const diffIndex = (a + t) % theme.difficultyList.length;
        const difficulty = theme.difficultyList[diffIndex];
        const duration = theme.durations[(a * 2 + t) % theme.durations.length];
        const embarLevel = Math.min(10, Math.max(2, (a % 4) + (t % 4) + 2));
        const socialInt = Math.min(10, Math.max(4, (a % 5) + (t % 5) + 3));
        const reelPot = Math.min(10, Math.max(5, ((a * 4 + t) % 6) + 5));

        const id = `public-${String(idCounter).padStart(4, "0")}`;
        idCounter++;

        tasks.push({
          id,
          title: uniqueTitle,
          description: desc,
          category: "public_acts",
          difficulty,
          duration,
          embarrassment_level: embarLevel,
          social_intensity: socialInt,
          location: theme.location,
          requires_consent: theme.tags.includes("compliment") || theme.tags.includes("social"),
          requires_permission: false,
          safety_note: theme.safety,
          reel_potential: reelPot,
          tags: [...theme.tags, difficulty.toLowerCase(), `intensity_${socialInt}`],
        });
      }
      if (tasks.length >= 1000) break;
    }
    if (tasks.length >= 1000) break;
  }

  let extraIndex = 1;
  const modifierStyles = [
    "with friends cheering you on quietly from 10 feet away",
    "with a bright warm smile and open posture",
    "wearing cool sunglasses to boost your confidence",
    "while maintaining cheerful calm composure",
    "while having your friend capture a discrete video shot",
    "in an open sunlit section of the public park",
    "while holding your head high like a runway star",
    "with polite gentleness and genuine warmth",
    "holding an imaginary microphone like a street reporter",
    "with the proud energy of someone who just won first place",
    "wearing a subtle colorful wristband or pin",
    "counting down backwards in your head before taking the leap",
  ];

  while (tasks.length < 1000) {
    const theme = themes[extraIndex % themes.length];
    const action = theme.actions[extraIndex % theme.actions.length];
    const target = theme.targets[(extraIndex * 3 + Math.floor(extraIndex / 7)) % theme.targets.length];
    const modifier = modifierStyles[extraIndex % modifierStyles.length];

    const dareNum = tasks.length + 1;
    let title = `Public Dare #${dareNum}: ${action.split(" ").slice(0, 3).join(" ")}`;
    title = title.replace(/[^\w\s#:]/g, "").trim();
    while (titlesSet.has(title)) {
      title = `${title} (${dareNum})`;
    }
    titlesSet.add(title);

    let desc = `[Challenge #${dareNum}] ${action} ${target} ${modifier}. Keep it safe, legal, and respectful at all times!`;
    let attempt = 0;
    while (descSet.has(desc)) {
      attempt++;
      desc = `[Challenge #${dareNum}] ${action} ${target} ${modifier} (Variant #${attempt}). Ensure full consent and safety!`;
    }
    descSet.add(desc);

    const id = `public-${String(dareNum).padStart(4, "0")}`;

    tasks.push({
      id,
      title,
      description: desc,
      category: "public_acts",
      difficulty: extraIndex % 4 === 0 ? "Extreme" : extraIndex % 3 === 0 ? "Hard" : "Medium",
      duration: `${(extraIndex % 5) + 1} minutes`,
      embarrassment_level: (extraIndex % 6) + 4,
      social_intensity: (extraIndex % 5) + 5,
      location: theme.location,
      requires_consent: true,
      requires_permission: false,
      safety_note: theme.safety,
      reel_potential: (extraIndex % 4) + 7,
      tags: [...theme.tags, "public", "challenge"],
    });
    extraIndex++;
  }

  return tasks.slice(0, 1000);
}

// Generate both datasets
const shamefulTasks = createShamefulTasks();
const publicTasks = createPublicTasks();

console.log(`Generated Shameful Acts: ${shamefulTasks.length}`);
console.log(`Generated Public Acts: ${publicTasks.length}`);

// Validation
function validateDataset(tasks, expectedCategory, expectedPrefix) {
  if (tasks.length !== 1000) {
    throw new Error(`Expected 1000 tasks, got ${tasks.length}`);
  }
  const idSet = new Set();
  const titleSet = new Set();
  const descSet = new Set();

  for (let i = 0; i < tasks.length; i++) {
    const t = tasks[i];
    const expectedId = `${expectedPrefix}-${String(i + 1).padStart(4, "0")}`;
    if (t.id !== expectedId) {
      throw new Error(`Task index ${i} has wrong ID: expected ${expectedId}, got ${t.id}`);
    }
    if (idSet.has(t.id)) throw new Error(`Duplicate ID: ${t.id}`);
    idSet.add(t.id);

    if (titleSet.has(t.title)) throw new Error(`Duplicate title: ${t.title}`);
    titleSet.add(t.title);

    if (descSet.has(t.description)) throw new Error(`Duplicate description: ${t.description}`);
    descSet.add(t.description);

    if (t.category !== expectedCategory) throw new Error(`Wrong category on ${t.id}: ${t.category}`);
    if (!["Easy", "Medium", "Hard", "Extreme"].includes(t.difficulty)) {
      throw new Error(`Invalid difficulty on ${t.id}: ${t.difficulty}`);
    }
    if (typeof t.embarrassment_level !== "number" || t.embarrassment_level < 1 || t.embarrassment_level > 10) {
      throw new Error(`Invalid embarrassment_level on ${t.id}`);
    }
    if (typeof t.social_intensity !== "number" || t.social_intensity < 1 || t.social_intensity > 10) {
      throw new Error(`Invalid social_intensity on ${t.id}`);
    }
    if (typeof t.reel_potential !== "number" || t.reel_potential < 1 || t.reel_potential > 10) {
      throw new Error(`Invalid reel_potential on ${t.id}`);
    }
    if (typeof t.requires_consent !== "boolean" || typeof t.requires_permission !== "boolean") {
      throw new Error(`Consent or permission must be boolean on ${t.id}`);
    }
    if (!t.safety_note || t.safety_note.length < 10) {
      throw new Error(`Missing safety note on ${t.id}`);
    }
    if (!Array.isArray(t.tags) || t.tags.length === 0) {
      throw new Error(`Missing tags on ${t.id}`);
    }
  }
  console.log(`Validation passed for ${expectedCategory}: 1000 unique, valid tasks.`);
}

validateDataset(shamefulTasks, "shameful_acts", "shame");
validateDataset(publicTasks, "public_acts", "public");

const outDir = path.join(__dirname, "..", "src", "data");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outDir, "shameful-acts.json"),
  JSON.stringify(shamefulTasks, null, 2),
  "utf8"
);
console.log(`Wrote src/data/shameful-acts.json (${shamefulTasks.length} items)`);

fs.writeFileSync(
  path.join(outDir, "public-acts.json"),
  JSON.stringify(publicTasks, null, 2),
  "utf8"
);
console.log(`Wrote src/data/public-acts.json (${publicTasks.length} items)`);
