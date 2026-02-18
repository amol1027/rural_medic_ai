export type EmergencyCategory = {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: string[];
  warnings: string[];
  whenToSeekHelp: string[];
};

export type EmergencyTranslation = {
  title: string;
  description: string;
  steps: string[];
  warnings: string[];
  whenToSeekHelp: string[];
};

export type EmergencyTranslationsMap = Record<string, Record<string, EmergencyTranslation>>;

export const emergencyCategories: EmergencyCategory[] = [
  {
    id: 'fever',
    title: 'High Fever',
    description: 'Body temperature above 100.4°F (38°C)',
    icon: '🌡️',
    steps: [
      'Take temperature reading to confirm fever',
      'Remove excess clothing and blankets',
      'Give plenty of fluids - water, ORS, or coconut water',
      'Apply cool compress on forehead and armpits',
      'Take paracetamol as per age/weight guidelines',
      'Rest in a cool, well-ventilated room',
      'Monitor temperature every 2-4 hours'
    ],
    warnings: [
      'Do NOT use cold water bath - can cause shivering',
      'Do NOT give aspirin to children',
      'Do NOT force feed solid food'
    ],
    whenToSeekHelp: [
      'Fever above 103°F (39.4°C)',
      'Fever lasting more than 3 days',
      'Difficulty breathing',
      'Severe headache or stiff neck',
      'Confusion or drowsiness',
      'Persistent vomiting',
      'Rash appears with fever',
      'Infant under 3 months with any fever'
    ]
  },
  {
    id: 'snakebite',
    title: 'Snake Bite',
    description: 'Bite from any snake (venomous or non-venomous)',
    icon: '🐍',
    steps: [
      'Move away from the snake to prevent another bite',
      'Keep the person calm and still',
      'Remove jewelry and tight clothing near the bite',
      'Position the bitten area below heart level',
      'Wash the bite gently with soap and water',
      'Cover with clean, dry bandage',
      'Immobilize the bitten limb with a splint',
      'Note the time of bite and snake appearance',
      'Rush to nearest hospital immediately'
    ],
    warnings: [
      'Do NOT apply tourniquet',
      'Do NOT try to catch or kill the snake',
      'Do NOT cut the wound or try to suck out venom',
      'Do NOT apply ice or hot compress',
      'Do NOT give alcohol or medications',
      'Do NOT raise the bitten area above heart'
    ],
    whenToSeekHelp: [
      'ALL snake bites require immediate medical attention',
      'Go to hospital immediately',
      'Call for ambulance if available',
      'Anti-venom may be needed within hours'
    ]
  },
  {
    id: 'dehydration',
    title: 'Dehydration',
    description: 'Loss of fluids due to heat, diarrhea, or vomiting',
    icon: '💧',
    steps: [
      'Move person to cool, shaded area',
      'Give small sips of clean water frequently',
      'Prepare ORS: Mix 6 teaspoons sugar + 1/2 teaspoon salt in 1 liter clean water',
      'Give ORS solution every 15-20 minutes',
      'If no ORS: coconut water or rice water',
      'Continue giving fluids even if vomiting',
      'Monitor urine output and color',
      'Rest and avoid physical activity'
    ],
    warnings: [
      'Do NOT give sugary drinks or soda',
      'Do NOT give plain water without electrolytes for severe cases',
      'Do NOT give medications without medical advice'
    ],
    whenToSeekHelp: [
      'No urination for 8+ hours',
      'Dark yellow or brown urine',
      'Extreme thirst',
      'Confusion or dizziness',
      'Rapid heartbeat',
      'Sunken eyes',
      'Dry mouth and tongue',
      'Severe diarrhea or vomiting',
      'Infant with sunken fontanelle (soft spot)',
      'Unable to keep fluids down'
    ]
  },
  {
    id: 'burns',
    title: 'Burns',
    description: 'Burn injuries from heat, chemicals, or electricity',
    icon: '🔥',
    steps: [
      'Remove person from heat source immediately',
      'For minor burns: Cool under running water for 10-20 minutes',
      'Remove jewelry and tight clothing (not stuck to skin)',
      'Cover burn with clean, dry cloth',
      'Do NOT apply anything except cool water initially',
      'For small burns: Apply burn ointment after cooling',
      'Elevate burned area if possible',
      'Give plenty of water to drink'
    ],
    warnings: [
      'Do NOT apply ice directly',
      'Do NOT use butter, oil, or toothpaste',
      'Do NOT break blisters',
      'Do NOT remove stuck clothing',
      'Do NOT apply cotton directly on burn'
    ],
    whenToSeekHelp: [
      'Burns larger than palm of hand',
      'Burns on face, hands, feet, or genitals',
      'Deep burns (white or charred skin)',
      'Electrical or chemical burns',
      'Difficulty breathing',
      'Signs of infection (increased pain, pus, swelling)',
      'Burns in children or elderly',
      'Blisters larger than 2 inches'
    ]
  },
  {
    id: 'choking',
    title: 'Choking',
    description: 'Airway blocked by food or foreign object',
    icon: '🫁',
    steps: [
      'Ask the person "Are you choking?" — if they can cough or speak, encourage them to keep coughing',
      'If they cannot breathe, speak, or cough, call for help immediately',
      'Stand behind the person and wrap your arms around their waist',
      'Make a fist with one hand and place it just above the navel',
      'Grasp your fist with the other hand and press hard into the abdomen with quick, upward thrusts (Heimlich maneuver)',
      'Repeat thrusts until the object is expelled or person becomes unconscious',
      'If person becomes unconscious, lower them to the ground and begin CPR',
      'For infants: Give 5 back blows between shoulder blades, then 5 chest thrusts'
    ],
    warnings: [
      'Do NOT perform abdominal thrusts on infants under 1 year',
      'Do NOT blindly sweep the mouth with fingers',
      'Do NOT slap the back of a conscious adult who is standing',
      'Do NOT give water to someone who is actively choking'
    ],
    whenToSeekHelp: [
      'Object not dislodged after multiple attempts',
      'Person becomes unconscious',
      'Difficulty breathing even after object removed',
      'Persistent coughing or throat pain after episode',
      'Child or infant choking — always seek medical review'
    ]
  },
  {
    id: 'bleeding',
    title: 'Severe Bleeding',
    description: 'Heavy bleeding from cuts, wounds, or injuries',
    icon: '🩸',
    steps: [
      'Wear gloves or use a clean barrier (plastic bag) if available',
      'Apply firm, direct pressure on the wound using a clean cloth',
      'If cloth soaks through, add more layers — do NOT remove the first one',
      'Keep the injured area elevated above the heart if possible',
      'Apply a pressure bandage tightly over the pad',
      'If bleeding from a limb and does not stop, apply pressure on the artery above the wound',
      'Keep the person lying down and warm to prevent shock',
      'Monitor breathing and pulse while waiting for help'
    ],
    warnings: [
      'Do NOT remove objects embedded in the wound',
      'Do NOT apply a tourniquet unless trained and bleeding is life-threatening',
      'Do NOT clean deep wounds — focus on stopping bleeding',
      'Do NOT give food or drink if surgery may be needed'
    ],
    whenToSeekHelp: [
      'Bleeding does not stop after 10 minutes of direct pressure',
      'Blood is spurting or flowing rapidly',
      'Deep wound or visible bone/muscle',
      'Wound caused by animal bite or dirty object',
      'Signs of shock: pale skin, rapid breathing, confusion',
      'Bleeding from head, neck, chest, or abdomen',
      'Loss of sensation or movement below the wound'
    ]
  },
  {
    id: 'fractures',
    title: 'Fractures & Broken Bones',
    description: 'Suspected broken or dislocated bones',
    icon: '🦴',
    steps: [
      'Keep the person still — do NOT move the injured area',
      'Immobilize the limb using a splint (sticks, rolled newspaper, cardboard)',
      'Pad the splint with cloth for comfort',
      'Tie the splint above and below the fracture — not directly on it',
      'Apply ice wrapped in cloth to reduce swelling (20 minutes on, 20 off)',
      'Elevate the injured limb if possible without causing pain',
      'Give paracetamol for pain if no allergy',
      'Support arm injuries with a sling made from a cloth or dupatta'
    ],
    warnings: [
      'Do NOT try to straighten or push the bone back',
      'Do NOT move the person if spinal injury is suspected',
      'Do NOT remove shoes/boots if ankle is injured — they provide support',
      'Do NOT apply heat to the fracture area',
      'Do NOT let the person eat or drink (surgery may be needed)'
    ],
    whenToSeekHelp: [
      'All suspected fractures need medical X-ray and treatment',
      'Bone is visible through the skin (open fracture)',
      'Limb looks deformed or at an odd angle',
      'Numbness or tingling below the injury',
      'Unable to move fingers or toes on injured limb',
      'Severe swelling or bruising',
      'Suspected spinal or neck injury',
      'Injury from major trauma (fall, vehicle accident)'
    ]
  },
  {
    id: 'heatstroke',
    title: 'Heat Stroke',
    description: 'Body overheating due to extreme heat exposure',
    icon: '☀️',
    steps: [
      'Move person to shade or cool area immediately',
      'Call for emergency help — heat stroke is life-threatening',
      'Remove excess clothing',
      'Cool the person rapidly: pour cool water over body, fan vigorously',
      'Apply cold wet cloths to neck, armpits, and groin',
      'If conscious, give small sips of cool water',
      'Place ice packs (wrapped in cloth) on neck, armpits, and groin',
      'Continue cooling until body temperature drops below 101°F (38.3°C)',
      'Monitor breathing and consciousness closely'
    ],
    warnings: [
      'Do NOT give large amounts of water at once',
      'Do NOT use ice-cold water submersion without monitoring',
      'Do NOT give fever medications (paracetamol) — they do not help heat stroke',
      'Do NOT leave the person unattended',
      'Do NOT give alcohol or caffeinated drinks'
    ],
    whenToSeekHelp: [
      'Body temperature above 104°F (40°C)',
      'Confusion, slurred speech, or unconsciousness',
      'Hot, red, dry skin (no sweating)',
      'Rapid pulse or breathing',
      'Seizures or convulsions',
      'Headache with nausea or vomiting',
      'All heat stroke cases — call emergency immediately'
    ]
  },
  {
    id: 'drowning',
    title: 'Drowning / Near-Drowning',
    description: 'Person rescued from water, submersion incident',
    icon: '🌊',
    steps: [
      'Remove the person from water — ensure your own safety first',
      'Call for help immediately',
      'Lay the person on their back on a firm surface',
      'Check for breathing — look, listen, and feel for 10 seconds',
      'If not breathing: tilt head back, lift chin, and give 2 rescue breaths',
      'If no pulse: begin CPR — 30 chest compressions then 2 breaths',
      'Continue CPR until the person breathes or help arrives',
      'If breathing: place in recovery position (on their side)',
      'Remove wet clothing and cover with dry blankets to keep warm',
      'Monitor breathing continuously — it may stop again'
    ],
    warnings: [
      'Do NOT attempt a water rescue unless trained — use rope, stick, or floatation device',
      'Do NOT try to drain water from lungs by pressing on stomach',
      'Do NOT give up CPR — cold water drowning victims can recover after extended CPR',
      'Do NOT assume the person is fine even if they seem to recover'
    ],
    whenToSeekHelp: [
      'ALL drowning/near-drowning cases require hospital evaluation',
      'Person was unconscious in water — even briefly',
      'Coughing, wheezing, or breathing difficulty after rescue',
      'Blue or grey skin color',
      'Confusion or lethargy after rescue',
      'Vomiting after swallowing water',
      'Child involved in any submersion incident'
    ]
  },
  {
    id: 'insect-sting',
    title: 'Insect & Scorpion Stings',
    description: 'Stings from bees, wasps, scorpions, or spiders',
    icon: '🦂',
    steps: [
      'Move away from the insect to avoid more stings',
      'For bee stings: scrape the stinger out with a flat edge (credit card) — do NOT squeeze',
      'Wash the area with soap and clean water',
      'Apply cold compress or ice wrapped in cloth for 10-15 minutes',
      'Apply paste of baking soda and water for bee stings',
      'Take antihistamine (cetirizine) if available for swelling and itching',
      'Take paracetamol for pain relief',
      'Keep the affected area elevated if possible',
      'Watch closely for signs of allergic reaction for at least 30 minutes'
    ],
    warnings: [
      'Do NOT squeeze the stinger — it releases more venom',
      'Do NOT apply mud, tobacco, or home remedies',
      'Do NOT scratch the sting area',
      'Do NOT ignore symptoms of allergic reaction'
    ],
    whenToSeekHelp: [
      'Difficulty breathing or swelling of face/throat',
      'Dizziness, rapid heartbeat, or feeling faint',
      'Swelling spreading far beyond the sting site',
      'Multiple stings (more than 10)',
      'Scorpion sting — always seek medical help',
      'Known allergy to insect stings',
      'Sting inside mouth or throat',
      'Symptoms worsen over hours',
      'Sting in a child under 5 years'
    ]
  },
  {
    id: 'electric-shock',
    title: 'Electric Shock',
    description: 'Injury from electrical current contact',
    icon: '⚡',
    steps: [
      'Do NOT touch the person until the power source is disconnected',
      'Turn off power at the main switch or circuit breaker',
      'If can\'t turn off power: use a dry non-conductive object (wooden stick, rubber) to separate person from source',
      'Call for emergency help immediately',
      'Check for breathing and pulse',
      'If not breathing: begin CPR immediately',
      'Look for entry and exit burn wounds',
      'Cover burns with sterile or clean dry dressing',
      'Treat for shock: lay person down, elevate legs, keep warm',
      'Do NOT move the person if spinal injury is suspected'
    ],
    warnings: [
      'Do NOT touch the person while they are still in contact with the electrical source',
      'Do NOT use wet or metal objects to separate person from source',
      'Do NOT move the person unnecessarily — electric shock can cause spinal injuries',
      'Do NOT apply water or ointment to electrical burns'
    ],
    whenToSeekHelp: [
      'ALL electric shock cases require medical evaluation',
      'Burns at entry or exit points',
      'Irregular heartbeat or chest pain',
      'Confusion, difficulty breathing',
      'Loss of consciousness — even momentarily',
      'Numbness or tingling',
      'Muscle pain or contractions',
      'High-voltage shock (power lines, industrial)'
    ]
  },
  {
    id: 'seizures',
    title: 'Seizures / Convulsions',
    description: 'Uncontrolled body shaking or fits',
    icon: '🧠',
    steps: [
      'Stay calm and note the time the seizure started',
      'Clear the area of hard or sharp objects',
      'Place something soft under the person\'s head (folded cloth, pillow)',
      'Gently roll the person onto their side (recovery position)',
      'Loosen tight clothing around neck and chest',
      'Stay with the person until the seizure ends',
      'After seizure stops: speak calmly, keep them on their side',
      'Allow them to rest — they may be confused or sleepy',
      'Time the seizure duration for medical staff'
    ],
    warnings: [
      'Do NOT hold the person down or restrain their movements',
      'Do NOT put anything in their mouth — they cannot swallow their tongue',
      'Do NOT give food, water, or medication during the seizure',
      'Do NOT try to stop the shaking',
      'Do NOT crowd the person — give them space'
    ],
    whenToSeekHelp: [
      'Seizure lasts more than 5 minutes',
      'Person does not regain consciousness after seizure',
      'Second seizure occurs shortly after the first',
      'First-time seizure — always seek evaluation',
      'Seizure during pregnancy',
      'Seizure with fever in a child',
      'Injury during the seizure',
      'Person has difficulty breathing after seizure',
      'Person has diabetes or heart disease'
    ]
  },
  {
    id: 'allergic-reaction',
    title: 'Severe Allergic Reaction',
    description: 'Anaphylaxis from food, medicine, or insect stings',
    icon: '🫨',
    steps: [
      'Call for emergency help immediately — anaphylaxis is life-threatening',
      'If the person has an epinephrine auto-injector (EpiPen), help them use it on outer thigh',
      'Have the person lie down with legs elevated (unless breathing is difficult)',
      'If breathing difficulty: let them sit upright',
      'Loosen tight clothing',
      'If they stop breathing: begin CPR',
      'Give a second dose of epinephrine after 5-15 minutes if symptoms don\'t improve',
      'Keep the person warm with a blanket',
      'Note what triggered the reaction and when it started'
    ],
    warnings: [
      'Do NOT leave the person alone',
      'Do NOT give oral medications if swallowing is difficult',
      'Do NOT have them sit up if feeling faint — keep them lying down',
      'Do NOT assume symptoms will go away on their own'
    ],
    whenToSeekHelp: [
      'ALL severe allergic reactions need emergency care',
      'Swelling of face, lips, tongue, or throat',
      'Difficulty breathing or wheezing',
      'Rapid or weak pulse',
      'Hives or widespread skin rash',
      'Nausea, vomiting, or abdominal pain',
      'Dizziness or loss of consciousness',
      'Even if symptoms improve after epinephrine — still go to hospital'
    ]
  },
  {
    id: 'chest-pain',
    title: 'Chest Pain / Heart Attack',
    description: 'Sudden chest pain, pressure, or tightness',
    icon: '❤️‍🩹',
    steps: [
      'Call for emergency help immediately',
      'Have the person sit down and rest in a comfortable position (semi-upright)',
      'Loosen any tight clothing',
      'If they have prescribed nitroglycerin, help them take it',
      'Give one aspirin (325mg) to chew slowly — if no allergy',
      'Keep the person calm and still',
      'Monitor breathing and consciousness',
      'If they become unconscious and stop breathing, begin CPR',
      'Be ready to use an AED (defibrillator) if available'
    ],
    warnings: [
      'Do NOT ignore chest pain — even if it seems mild',
      'Do NOT let the person walk or exert themselves',
      'Do NOT give aspirin if allergic or if bleeding disorder',
      'Do NOT delay calling for help',
      'Do NOT give food or excessive water'
    ],
    whenToSeekHelp: [
      'ALL chest pain should be evaluated by a doctor',
      'Crushing or squeezing pain in center of chest',
      'Pain spreading to arm, jaw, neck, or back',
      'Shortness of breath with or without chest pain',
      'Cold sweat, nausea, or lightheadedness',
      'Pain lasting more than a few minutes',
      'History of heart disease',
      'Pain with exertion that does not go away with rest'
    ]
  },
  {
    id: 'animal-bite',
    title: 'Dog & Animal Bites',
    description: 'Bites from dogs, cats, monkeys, or other animals',
    icon: '🐕',
    steps: [
      'Move away from the animal to prevent further bites',
      'Wash the wound thoroughly with soap and running water for 10-15 minutes',
      'Apply antiseptic solution (povidone-iodine or betadine) if available',
      'Cover with a clean, dry bandage',
      'Apply gentle pressure if bleeding heavily',
      'Note details: animal type, behavior, vaccination status if known',
      'Do NOT stitch or close the wound tightly — leave it slightly open',
      'Get anti-rabies vaccination as soon as possible (within 24 hours)',
      'Take tetanus shot if not vaccinated in last 5 years'
    ],
    warnings: [
      'Do NOT apply turmeric, chili powder, or traditional remedies on the wound',
      'Do NOT suck the wound or apply tourniquets',
      'Do NOT delay washing — immediate washing reduces rabies risk significantly',
      'Do NOT kill the animal — observe it for 10 days if possible',
      'Do NOT ignore even small scratches from stray animals'
    ],
    whenToSeekHelp: [
      'ALL animal bites require medical evaluation for rabies risk',
      'Deep puncture wounds or torn skin',
      'Bite on face, hands, or near joints',
      'Bite from a wild, stray, or unvaccinated animal',
      'Animal acting strangely (possible rabid behavior)',
      'Signs of infection: redness, swelling, pus, fever',
      'Bite from a bat — even without visible wound',
      'Bleeding that won\'t stop'
    ]
  },
  {
    id: 'poisoning',
    title: 'Poisoning',
    description: 'Ingestion of toxic substances, chemicals, or bad food',
    icon: '☠️',
    steps: [
      'Call for emergency help or poison control immediately',
      'Identify the poison: keep the container, label, or sample',
      'Note the time, amount, and substance ingested',
      'If the person is conscious and alert, do NOT induce vomiting unless directed by medical personnel',
      'If poison is on skin: remove contaminated clothing and rinse skin with water for 15-20 minutes',
      'If poison is in eyes: flush with clean water for 15-20 minutes',
      'If inhaled: move person to fresh air immediately',
      'If unconscious: place in recovery position and monitor breathing',
      'If not breathing: begin CPR (avoid mouth-to-mouth if poison is on lips — use barrier)'
    ],
    warnings: [
      'Do NOT induce vomiting — especially for corrosive or petroleum products',
      'Do NOT give anything by mouth if person is drowsy or unconscious',
      'Do NOT give milk or water unless instructed by poison control',
      'Do NOT wait for symptoms — seek help immediately',
      'Do NOT use home remedies to neutralize poison'
    ],
    whenToSeekHelp: [
      'ALL poisoning cases require immediate medical attention',
      'Burning or pain in mouth, throat, or stomach',
      'Nausea, vomiting, or diarrhea',
      'Difficulty breathing',
      'Confusion, drowsiness, or unconsciousness',
      'Seizures or convulsions',
      'Chemical burns around mouth or hands',
      'Unknown substance ingested',
      'Child ingested any medication or chemical'
    ]
  }
];

// Translations for all emergency categories
export const emergencyTranslations: Record<string, Record<'hi' | 'mr', EmergencyTranslation>> = {
  'fever': {
    hi: {
      title: 'तेज बुखार',
      description: '100.4°F (38°C) से अधिक शरीर का तापमान',
      steps: [
        'बुखार की पुष्टि के लिए तापमान रीडिंग लें',
        'अतिरिक्त कपड़े और कंबल हटा दें',
        'भरपूर तरल पदार्थ दें - पानी, ORS, या नारियल पानी',
        'माथे और बगल पर ठंडा कंप्रेस लगाएं',
        'उम्र/वजन के अनुसार पेरासिटामोल दें',
        'ठंडे, अच्छे हवादार कमरे में आराम करें',
        'हर 2-4 घंटे में तापमान की निगरानी करें'
      ],
      warnings: [
        'ठंडे पानी से स्नान न करें - कंपकंपी हो सकती है',
        'बच्चों को एस्पिरिन न दें',
        'ठोस भोजन जबरदस्ती न खिलाएं'
      ],
      whenToSeekHelp: [
        '103°F (39.4°C) से अधिक बुखार',
        '3 दिनों से अधिक समय तक बुखार रहना',
        'सांस लेने में कठिनाई',
        'गंभीर सिरदर्द या गर्दन में अकड़न',
        'भ्रम या उनींदापन',
        'लगातार उल्टी',
        'बुखार के साथ दाने दिखाई देना',
        '3 महीने से कम उम्र के शिशु में कोई भी बुखार'
      ]
    },
    mr: {
      title: 'जास्त ताप',
      description: '100.4°F (38°C) पेक्षा जास्त शरीर तापमान',
      steps: [
        'तापाची पुष्टी करण्यासाठी तापमान रीडिंग घ्या',
        'जादा कपडे आणि ब्लँकेट काढून टाका',
        'भरपूर पाणी द्या - पाणी, ORS, किंवा नारळ पाणी',
        'कपाळ आणि बगलेत थंड कंप्रेस लावा',
        'वय/वजनानुसार पॅरासिटामॉल द्या',
        'थंड, चांगल्या हवेच्या खोलीत विश्रांती घ्या',
        'दर 2-4 तासांनी तापमान तपासा'
      ],
      warnings: [
        'थंड पाण्याने आंघोळ करू नका - थरथर कापण्याची शक्यता',
        'मुलांना ऍस्पिरिन देऊ नका',
        'जबरदस्तीने घन अन्न खायला लावू नका'
      ],
      whenToSeekHelp: [
        '103°F (39.4°C) पेक्षा जास्त ताप',
        '3 दिवसांपेक्षा जास्त काळ ताप राहणे',
        'श्वास घेण्यात अडचण',
        'तीव्र डोकेदुखी किंवा मानेत ताठरपणा',
        'गोंधळ किंवा तंद्री',
        'सततची उलट्या',
        'तापासोबत पुरळ दिसणे',
        '3 महिन्यांपेक्षा कमी वयाच्या बाळाला कोणताही ताप'
      ]
    }
  },
  'snakebite': {
    hi: {
      title: 'सांप का काटना',
      description: 'किसी भी सांप का काटना (विषैला या गैर-विषैला)',
      steps: [
        'दूसरा काटने से बचने के लिए सांप से दूर जाएं',
        'व्यक्ति को शांत और स्थिर रखें',
        'काटने के पास के गहने और तंग कपड़े हटा दें',
        'काटे हुए क्षेत्र को हृदय के स्तर से नीचे रखें',
        'काटने को साबुन और पानी से धीरे से धोएं',
        'साफ, सूखी पट्टी से ढकें',
        'काटे हुए अंग को स्प्लिंट से स्थिर करें',
        'काटने का समय और सांप की उपस्थिति नोट करें',
        'तुरंत निकटतम अस्पताल में जाएं'
      ],
      warnings: [
        'टूर्निकेट न लगाएं',
        'सांप को पकड़ने या मारने की कोशिश न करें',
        'घाव को न काटें या जहर चूसने की कोशिश न करें',
        'बर्फ या गर्म सेंक न लगाएं',
        'शराब या दवाएं न दें',
        'काटे हुए क्षेत्र को हृदय से ऊपर न उठाएं'
      ],
      whenToSeekHelp: [
        'सभी सांप के काटने पर तत्काल चिकित्सा सहायता की आवश्यकता होती है',
        'तुरंत अस्पताल जाएं',
        'यदि उपलब्ध हो तो एम्बुलेंस बुलाएं',
        'घंटों के भीतर एंटी-वेनम की आवश्यकता हो सकती है'
      ]
    },
    mr: {
      title: 'सापाचा चावा',
      description: 'कोणत्याही सापाचा चावा (विषारी किंवा विषारी नसलेला)',
      steps: [
        'दुसऱ्या चाव्यापासून बचाव करण्यासाठी सापापासून दूर जा',
        'व्यक्तीला शांत आणि स्थिर ठेवा',
        'चाव्याजवळचे दागिने आणि घट्ट कपडे काढून टाका',
        'चावलेले ठिकाण हृदयाच्या पातळीपेक्षा खाली ठेवा',
        'चावा साबण आणि पाण्याने हळूवारपणे धुवून घ्या',
        'स्वच्छ, कोरड्या पट्टीने झाकून घ्या',
        'चावलेला अवयव स्प्लिंटने स्थिर करा',
        'चाव्याची वेळ आणि सापाचे स्वरूप नोंदवा',
        'लगेच जवळच्या रुग्णालयात जा'
      ],
      warnings: [
        'टूर्निकेट लावू नका',
        'साप पकडण्याचा किंवा मारण्याचा प्रयत्न करू नका',
        'जखम कापू नका किंवा विष बाहेर काढण्याचा प्रयत्न करू नका',
        'बर्फ किंवा गरम कंप्रेस लावू नका',
        'दारू किंवा औषधे देऊ नका',
        'चावलेले ठिकाण हृदयापेक्षा वर उचलू नका'
      ],
      whenToSeekHelp: [
        'सर्व सापाच्या चाव्यांसाठी तात्काळ वैद्यकीय मदत आवश्यक आहे',
        'लगेच रुग्णालयात जा',
        'उपलब्ध असल्यास रुग्णवाहिका बोलवा',
        'काही तासांत अँटी-व्हेनमची आवश्यकता असू शकते'
      ]
    }
  },
  'dehydration': {
    hi: {
      title: 'निर्जलीकरण',
      description: 'गर्मी, दस्त, या उल्टी के कारण तरल पदार्थों की हानि',
      steps: [
        'व्यक्ति को ठंडी, छायादार जगह पर ले जाएं',
        'थोड़ा-थोड़ा करके साफ पानी पिलाएं',
        'ORS तैयार करें: 1 लीटर साफ पानी में 6 चम्मच चीनी + 1/2 चम्मच नमक मिलाएं',
        'हर 15-20 मिनट में ORS घोल दें',
        'अगर ORS नहीं है: नारियल पानी या चावल का पानी',
        'उल्टी होने पर भी तरल पदार्थ देते रहें',
        'पेशाब की मात्रा और रंग की निगरानी करें',
        'आराम करें और शारीरिक गतिविधि से बचें'
      ],
      warnings: [
        'मीठे पेय या सोडा न दें',
        'गंभीर मामलों के लिए इलेक्ट्रोलाइट्स के बिना सादा पानी न दें',
        'बहुत तेजी से तरल पदार्थ न दें'
      ],
      whenToSeekHelp: [
        'गंभीर निर्जलीकरण के लक्षण',
        '8 घंटे से अधिक समय तक पेशाब न आना',
        'बहुत गहरा या पीला पेशाब',
        'चक्कर आना या बेहोशी',
        'तेज़ दिल की धड़कन',
        'ठंडे हाथ-पैर',
        'तरल पदार्थ रोक नहीं पाना'
      ]
    },
    mr: {
      title: 'निर्जलीकरण',
      description: 'उष्णता, अतिसार किंवा उलट्यामुळे पाण्याचा तोटा',
      steps: [
        'व्यक्तीला थंड, सावलीच्या ठिकाणी हलवा',
        'थोड्या थोड्या प्रमाणात स्वच्छ पाणी द्या',
        'ORS तयार करा: 1 लिटर स्वच्छ पाण्यात 6 चमचे साखर + 1/2 चमचा मीठ मिसळा',
        'दर 15-20 मिनिटांनी ORS द्रावण द्या',
        'ORS नसल्यास: नारळ पाणी किंवा तांदूळ पाणी',
        'उलट्या झाल्या तरी द्रव देत राहा',
        'लघवीचे प्रमाण आणि रंग तपासा',
        'विश्रांती घ्या आणि शारीरिक हालचाली टाळा'
      ],
      warnings: [
        'गोड पेये किंवा सोडा देऊ नका',
        'गंभीर प्रकरणांसाठी इलेक्ट्रोलाइट्स शिवाय सादे पाणी देऊ नका',
        'खूप वेगाने द्रव देऊ नका'
      ],
      whenToSeekHelp: [
        'गंभीर निर्जलीकरणाची लक्षणे',
        '8 तासांपेक्षा जास्त वेळ लघवी न होणे',
        'खूप गडद किंवा पिवळी लघवी',
        'चक्कर येणे किंवा बेशुद्ध होणे',
        'जलद हृदयाचा ठोका',
        'थंड हात-पाय',
        'द्रव टिकवून ठेवण्यास असमर्थता'
      ]
    }
  },
  'burns': {
    hi: {
      title: 'जलन',
      description: 'गर्मी, रसायन, या बिजली से त्वचा की चोट',
      steps: [
        'जलने के स्रोत से व्यक्ति को हटा दें',
        'जले हुए क्षेत्र को ढीले कपड़े और गहने हटा दें',
        'जलन पर 10-20 मिनट के लिए ठंडे (गुनगुने नहीं) पानी से धोएं',
        'साफ, सूखे कपड़े से धीरे से थपथपाएं',
        'क्लिंग फिल्म या साफ गैर-चिपकने वाली ड्रेसिंग से ढकें',
        'दर्द के लिए पेरासिटामोल दें',
        'जले हुए क्षेत्र को ऊपर उठाएं यदि संभव हो',
        'संक्रमण के लक्षणों की निगरानी करें'
      ],
      warnings: [
        'बर्फ सीधे जलन पर न लगाएं',
        'छाले न फोड़ें',
        'कोई क्रीम, तेल, या टूथपेस्ट न लगाएं',
        'चिपकने वाली पट्टियां न लगाएं'
      ],
      whenToSeekHelp: [
        'सभी विद्युत या रासायनिक जलन',
        'बड़े क्षेत्र (हथेली से बड़ा)',
        'गहरे जलन (सफेद या काला)',
        'चेहरे, हाथ, पैर, या जननांग पर जलन',
        'संक्रमण के लक्षण (बुखार, मवाद)',
        'गंभीर दर्द या फूलना'
      ]
    },
    mr: {
      title: 'भाजणे',
      description: 'उष्णता, रसायन किंवा वीजेमुळे त्वचेची दुखापत',
      steps: [
        'भाजण्याच्या स्रोतापासून व्यक्तीला काढून टाका',
        'भाजलेल्या भागातून सैल कपडे आणि दागिने काढा',
        'भाजलेल्या भागावर 10-20 मिनिटे थंड (गरम नाही) पाणी टाका',
        'स्वच्छ, कोरड्या कपड्याने हळूवारपणे थोपटून सुकवा',
        'क्लिंग फिल्म किंवा स्वच्छ न चिकटणाऱ्या ड्रेसिंगने झाकून घ्या',
        'वेदनांसाठी पॅरासिटामॉल द्या',
        'शक्य असल्यास भाजलेला भाग वर उचला',
        'संसर्गाच्या लक्षणांवर लक्ष ठेवा'
      ],
      warnings: [
        'भाजलेल्या भागावर थेट बर्फ लावू नका',
        'फोड फोडू नका',
        'कोणतीही क्रीम, तेल किंवा टूथपेस्ट लावू नका',
        'चिकटणारी पट्टी लावू नका'
      ],
      whenToSeekHelp: [
        'सर्व विद्युत किंवा रासायनिक भाजणे',
        'मोठे क्षेत्र (तळहाताहून मोठे)',
        'खोल भाजणे (पांढरे किंवा काळे)',
        'चेहरा, हात, पाय किंवा गुप्तांगावर भाजणे',
        'संसर्गाची लक्षणे (ताप, पू)',
        'तीव्र वेदना किंवा सूज'
      ]
    }
  },
  'choking': {
    hi: {
      title: 'गला घुटना',
      description: 'वायुमार्ग में रुकावट',
      steps: [
        'व्यक्ति से पूछें "क्या आप घुट रहे हैं?"',
        'यदि खांसी हो रही है, तो उन्हें खांसी जारी रखने के लिए प्रोत्साहित करें',
        'यदि प्रभावी ढंग से खांसी नहीं कर सकते: 5 पीठ पर थपकियां दें',
        'कंधे के बीच ऊपर की ओर धक्का के साथ ऐड़ी का उपयोग करें',
        '5 उदर धक्के (हेमलिक मनुअव्हर)',
        'पीठ पर थपकियां और उदर धक्के बारी-बारी से दें',
        'यदि बेहोश हो जाते हैं: CPR शुरू करें',
        'यदि वस्तु दिखाई दे तो ही निकालें'
      ],
      warnings: [
        '1 वर्ष से कम उम्र के शिशुओं पर उदर धक्के न दें',
        'आंख से न दिखने वाली वस्तुओं के लिए अँधेरे में उंगली न डालें',
        'बेहोश व्यक्ति पर उदर धक्के न दें',
        'गर्भवती महिलाओं पर उदर धक्के न दें - छाती पर धक्के का उपयोग करें'
      ],
      whenToSeekHelp: [
        'रुकावट नहीं हटाई जा सकती',
        'कोई भी सांस लेने में कठिनाई बनी रहती है',
        'लगातार खांसी या घरघराहट',
        'निगलने में कठिनाई',
        'वस्तु फेफड़ों में चली गई हो सकती है'
      ]
    },
    mr: {
      title: 'गुदमरणे',
      description: 'श्वासमार्गात अडथळा',
      steps: [
        'व्यक्तीला विचारा "तुम्ही गुदमरत आहात का?"',
        'खोकला येत असल्यास, त्यांना खोकत राहण्यास प्रोत्साहित करा',
        'प्रभावीपणे खोकू शकत नसल्यास: 5 पाठीवर वार करा',
        'खांद्यांमधील वरच्या दिशेने टाचेचा वापर करा',
        '5 ओटीपोटावर धक्के (हेमलिक मनुअव्हर)',
        'पाठीवर वार आणि ओटीवर धक्के बदलत रहा',
        'बेशुद्ध झाल्यास: CPR सुरू करा',
        'वस्तू दिसत असेलच तरच काढा'
      ],
      warnings: [
        '1 वर्षांपेक्षा कमी वयाच्या बाळांवर ओटीवर धक्के देऊ नका',
        'न दिसणाऱ्या वस्तूंसाठी आंधळेपणाने बोट घालू नका',
        'बेशुद्ध व्यक्तीवर ओटीवर धक्के देऊ नका',
        'गर्भवती महिलांवर ओटीवर धक्के देऊ नका - छातीवर धक्के वापरा'
      ],
      whenToSeekHelp: [
        'अडथळा काढू शकत नाही',
        'श्वास घेण्यात अडचण कायम राहते',
        'सतत खोकला किंवा घरघर',
        'गिळण्यात अडचण',
        'वस्तू फुफ्फुसात गेली असू शकते'
      ]
    }
  },
  'bleeding': {
    hi: {
      title: 'रक्तस्राव',
      description: 'गंभीर बाहरी या आंतरिक रक्तस्राव',
      steps: [
        'व्यक्ति को लिटाएं और घाव को ऊपर उठाएं',
        'दस्ताने पहनें या साफ बैरियर का उपयोग करें',
        'घाव पर सीधे दबाव डालें',
        'साफ कपड़ा या पट्टी का उपयोग करें',
        'कम से कम 10 मिनट तक दबाव बनाए रखें',
        'यदि खून भीग जाए तो और पट्टियां जोड़ें',
        'एक बार रक्तस्राव बंद हो जाए तो पट्टी बांधें',
        'घाव की निगरानी करें और व्यक्ति को शांत रखें'
      ],
      warnings: [
        'दबाव हटाने के लिए बार-बार जांच न करें',
        'घाव में फंसी वस्तुओं को न निकालें',
        'टूर्निकेट केवल अंतिम उपाय के रूप में',
        'गंदे कपड़े सीधे घाव पर न लगाएं'
      ],
      whenToSeekHelp: [
        'रक्तस्राव 10 मिनट दबाव के बाद नहीं रुकता',
        'गहरा घाव या बड़ा कट',
        'धमनी रक्तस्राव (छींटे वाला लाल रक्त)',
        'घाव में वस्तु फंसी है',
        'अंग विच्छेदन',
        'चक्कर आना, पीलापन, या कमजोरी के लक्षण'
      ]
    },
    mr: {
      title: 'रक्तस्त्राव',
      description: 'गंभीर बाह्य किंवा अंतर्गत रक्तस्त्राव',
      steps: [
        'व्यक्तीला झोपवा आणि जखम वर उचला',
        'हातमोजे घाला किंवा स्वच्छ अडथळा वापरा',
        'जखमेवर थेट दाब द्या',
        'स्वच्छ कापड किंवा पट्टी वापरा',
        'किमान 10 मिनिटे दाब कायम ठेवा',
        'रक्त भिजल्यास अधिक पट्ट्या जोडा',
        'रक्तस्त्राव थांबल्यावर पट्टी बांधा',
        'जखमेवर लक्ष ठेवा आणि व्यक्तीला शांत ठेवा'
      ],
      warnings: [
        'दाब तपासण्यासाठी वारंवार काढू नका',
        'जखमेत अडकलेल्या वस्तू काढू नका',
        'टूर्निकेट फक्त शेवटचा पर्याय म्हणून',
        'घाणेरडे कापड थेट जखमेवर लावू नका'
      ],
      whenToSeekHelp: [
        '10 मिनिटे दाब दिल्यानंतरही रक्तस्त्राव थांबत नाही',
        'खोल जखम किंवा मोठे कट',
        'धमनी रक्तस्त्राव (उडणारे लाल रक्त)',
        'जखमेत वस्तू अडकली आहे',
        'अवयव तुकडे झाले',
        'चक्कर येणे, फिकेपणा किंवा अशक्तपणाची लक्षणे'
      ]
    }
  },
  'fractures': {
    hi: {
      title: 'फ्रैक्चर',
      description: 'टूटी हड्डियां या संदिग्ध फ्रैक्चर',
      steps: [
        'चोटिल क्षेत्र को हिलाएं नहीं',
        'रक्तस्राव को नियंत्रित करें यदि मौजूद हो',
        'सूजन को कम करने के लिए बर्फ लगाएं (सीधे नहीं)',
        'सहारे के लिए तकिए या कपड़े का उपयोग करें',
        'चोट के ऊपर और नीचे जोड़ों को स्थिर करें',
        'यदि प्रशिक्षित हैं तो स्प्लिंट लगाएं',
        'परिसंचरण की जांच करें (रंग, गर्माहट)',
        'दर्द के लिए पेरासिटामोल दें'
      ],
      warnings: [
        'हड्डी को वापस जगह पर लगाने की कोशिश न करें',
        'प्रोत्रुसिव हड्डियों को अंदर धकेलने की कोशिश न करें',
        'यदि रीढ़ की हड्डी में चोट का संदेह है तो व्यक्ति को न हिलाएं',
        'जोड़े बहुत कसकर न बांधें - परिसंचरण की जांच करें'
      ],
      whenToSeekHelp: [
        'सभी संदिग्ध फ्रैक्चर को चिकित्सा मूल्यांकन की आवश्यकता है',
        'विकृत अंग',
        'त्वचा के माध्यम से दिखाई देने वाली हड्डी (खुला फ्रैक्चर)',
        'सुन्नता या झुनझुनी',
        'हाथ या पैर पर कोई नाड़ी नहीं',
        'रीढ़, गर्दन, या सिर की चोट'
      ]
    },
    mr: {
      title: 'फ्रॅक्चर',
      description: 'तुटलेली हाडे किंवा संशयित फ्रॅक्चर',
      steps: [
        'दुखापत झालेला भाग हलवू नका',
        'रक्तस्त्राव असल्यास तो आटोक्यात आणा',
        'सूज कमी करण्यासाठी बर्फ लावा (थेट नाही)',
        'आधारासाठी उशी किंवा कापड वापरा',
        'दुखापतीच्या वर आणि खाली जोड स्थिर करा',
        'प्रशिक्षित असाल तर स्प्लिंट लावा',
        'रक्ताभिसरण तपासा (रंग, उबदारपणा)',
        'वेदनांसाठी पॅरासिटामॉल द्या'
      ],
      warnings: [
        'हाड परत जागी लावण्याचा प्रयत्न करू नका',
        'बाहेर पडलेली हाडे आत ढकलण्याचा प्रयत्न करू नका',
        'पाठीच्या कण्याला दुखापत झाल्याची शंका असल्यास व्यक्तीला हलवू नका',
        'खूप घट्ट बांधू नका - रक्ताभिसरण तपासा'
      ],
      whenToSeekHelp: [
        'सर्व संशयित फ्रॅक्चरसाठी वैद्यकीय मूल्यमापन आवश्यक',
        'विकृत अवयव',
        'त्वचेतून दिसणारी हाड (खुले फ्रॅक्चर)',
        'सुन्नपणा किंवा मुंग्या येणे',
        'हात किंवा पायावर नाडी नाही',
        'पाठीचा कणा, मान किंवा डोक्याला दुखापत'
      ]
    }
  },
  'heatstroke': {
    hi: {
      title: 'हीट स्ट्रोक',
      description: 'अत्यधिक गर्मी के संपर्क से खतरनाक अति तापन',
      steps: [
        'व्यक्ति को तुरंत ठंडी जगह पर ले जाएं',
        'अतिरिक्त कपड़े हटा दें',
        'ठंडे पानी से स्प्रे करें या स्पंज करें',
        'बगल, गर्दन, और कमर पर बर्फ पैक लगाएं',
        'यदि होश में है तो ठंडा पानी पिलाएं',
        'पंखा या हवा का उपयोग करें',
        'शरीर के तापमान की निगरानी करें',
        'जब तक मदद न आए तब तक ठंडा करते रहें'
      ],
      warnings: [
        'ठंडे पानी में डुबोएं नहीं - झटका लग सकता है',
        'यदि बेहोश है तो मुंह से कुछ न दें',
        'एस्पिरिन या पेरासिटामोल शरीर का तापमान नहीं कम करेगा'
      ],
      whenToSeekHelp: [
        'हीट स्ट्रोक एक चिकित्सा आपातकाल है - तुरंत 108 पर कॉल करें',
        'भ्रमित या आक्रामक व्यवहार',
        'दौरे',
        'बेहोशी',
        '104°F (40°C) से अधिक तापमान',
        'तेजी से या उथली श्वास'
      ]
    },
    mr: {
      title: 'उष्माघात',
      description: 'अति उष्णतेच्या संपर्कामुळे धोकादायक अतितापन',
      steps: [
        'व्यक्तीला लगेच थंड ठिकाणी हलवा',
        'जादा कपडे काढून टाका',
        'थंड पाण्याने फवारा किंवा स्पंज करा',
        'बगल, मान आणि मांडीवर बर्फाचे पॅक लावा',
        'शुद्धीवर असल्यास थंड पाणी पाजा',
        'पंखा किंवा हवा वापरा',
        'शरीराचे तापमान तपासत राहा',
        'मदत येईपर्यंत थंड करत राहा'
      ],
      warnings: [
        'थंड पाण्यात बुडवू नका - धक्का बसू शकतो',
        'बेशुद्ध असल्यास तोंडाने काहीही देऊ नका',
        'ऍस्पिरिन किंवा पॅरासिटामॉल शरीराचे तापमान कमी करणार नाही'
      ],
      whenToSeekHelp: [
        'उष्माघात ही वैद्यकीय आणीबाणी आहे - लगेच 108 वर कॉल करा',
        'गोंधळलेले किंवा आक्रमक वर्तन',
        'फिट',
        'बेशुद्धपणा',
        '104°F (40°C) पेक्षा जास्त तापमान',
        'जलद किंवा उथळ श्वास'
      ]
    }
  },
  'drowning': {
    hi: {
      title: 'डूबना',
      description: 'जल श्वसन या जलमग्नता',
      steps: [
        'यदि सुरक्षित हो तो व्यक्ति को पानी से बाहर निकालें',
        'आवश्यक होने पर आपातकालीन सेवाओं को कॉल करें',
        'व्यक्ति को सपाट सतह पर लिटाएं',
        'वायुमार्ग, श्वास, परिसंचरण की जांच करें',
        'यदि सांस नहीं ले रहे: CPR शुरू करें',
        '5 बचाव सांसें दें, फिर 30 छाती संकुचन करें',
        'जब तक सामान्य श्वास वापस नहीं आता या मदद नहीं आती',
        'यदि उल्टी होती है तो रिकवरी स्थिति में रखें'
      ],
      warnings: [
        'स्वयं खतरे में न पड़ें - केवल सुरक्षित बचाव करें',
        'पानी निकालने के लिए पेट पर दबाव न दें',
        'गर्दन या पीठ की चोट का अनुमान लगाएं - सावधानी से संभालें'
      ],
      whenToSeekHelp: [
        'सभी डूबने की घटनाओं को चिकित्सा मूल्यांकन की आवश्यकता है',
        'यहां तक कि अगर बाद में ठीक लगता है ("सेकेंडरी ड्राउनिंग")',
        'खांसी, श्वास लेने में कठिनाई',
        'असामान्य व्यवहार या उनींदापन',
        'छाती में दर्द'
      ]
    },
    mr: {
      title: 'बुडणे',
      description: 'पाण्याचा श्वास घेणे किंवा बुडणे',
      steps: [
        'सुरक्षित असल्यास व्यक्तीला पाण्यातून बाहेर काढा',
        'आवश्यक असल्यास आणीबाणी सेवांना कॉल करा',
        'व्यक्तीला सपाट पृष्ठभागावर झोपवा',
        'वायुमार्ग, श्वास, रक्ताभिसरण तपासा',
        'श्वास घेत नसल्यास: CPR सुरू करा',
        '5 बचाव श्वास द्या, नंतर 30 छाती संकुचन करा',
        'सामान्य श्वास परत येईपर्यंत किंवा मदत येईपर्यंत',
        'उलट्या झाल्यास पुनर्प्राप्ती स्थितीत ठेवा'
      ],
      warnings: [
        'स्वतःला धोक्यात घालू नका - फक्त सुरक्षित बचाव करा',
        'पाणी बाहेर काढण्यासाठी पोटावर दाब देऊ नका',
        'मान किंवा पाठीच्या दुखापतीचा अंदाज घ्या - काळजीपूर्वक हाताळा'
      ],
      whenToSeekHelp: [
        'सर्व बुडण्याच्या घटनांना वैद्यकीय मूल्यमापन आवश्यक',
        'नंतर बरे वाटत असले तरी ("सेकंडरी ड्राउनिंग")',
        'खोकला, श्वास घेण्यात अडचण',
        'असामान्य वर्तन किंवा तंद्री',
        'छातीत दुखणे'
      ]
    }
  },
  'insect-sting': {
    hi: {
      title: 'कीड़े का डंक',
      description: 'मधुमक्खी, बर्र, या अन्य कीड़ों के डंक',
      steps: [
        'क्षेत्र से दूर जाएं',
        'यदि दिखाई दे तो डंक को स्क्रैप करके हटा दें',
        'साबुन और पानी से धोएं',
        'दर्द और सूजन के लिए ठंडा कंप्रेस लगाएं',
        'एंटीहिस्टामाइन क्रीम लगाएं',
        'दर्द के लिए पेरासिटामोल दें',
        '15-20 मिनट के लिए प्रभावित क्षेत्र को ऊपर उठाएं',
        'गंभीर प्रतिक्रिया के लक्षणों की निगरानी करें'
      ],
      warnings: [
        'चिमटी से न निचोड़ें - अधिक जहर निकल सकता है',
        'अत्यधिक खुजली न करें',
        'कच्चे उपचार न लगाएं (मिट्टी, आदि)'
      ],
      whenToSeekHelp: [
        'सांस लेने में कठिनाई या घरघराहट',
        'चेहरे, गले की सूजन',
        'चक्कर आना या बेहोशी',
        'तेज़ दिल की धड़कन',
        'मतली या उल्टी',
        'पिछली गंभीर एलर्जी प्रतिक्रियाओं का इतिहास',
        'मुंह या गले में कई डंक'
      ]
    },
    mr: {
      title: 'कीटक डंख',
      description: 'मधमाश्या, गांडूळ किंवा इतर कीटकांचे डंख',
      steps: [
        'भागातून दूर जा',
        'दिसत असल्यास डंख स्क्रॅप करून काढा',
        'साबण आणि पाण्याने धुवा',
        'वेदना आणि सूजसाठी थंड कंप्रेस लावा',
        'अँटीहिस्टामाइन क्रीम लावा',
        'वेदनांसाठी पॅरासिटामॉल द्या',
        '15-20 मिनिटांसाठी प्रभावित भाग वर उचला',
        'गंभीर प्रतिक्रियेची लक्षणे तपासा'
      ],
      warnings: [
        'चिमट्याने पिळू नका - अधिक विष बाहेर पडू शकतो',
        'जास्त खाजवू नका',
        'कच्चे उपाय लावू नका (माती इ.)'
      ],
      whenToSeekHelp: [
        'श्वास घेण्यात अडचण किंवा घरघर',
        'चेहरा, घसा सुजणे',
        'चक्कर येणे किंवा बेशुद्ध होणे',
        'जलद हृदयाचा ठोका',
        'मळमळ किंवा उलट्या',
        'मागील गंभीर ऍलर्जी प्रतिक्रियांचा इतिहास',
        'तोंड किंवा घशात अनेक डंख'
      ]
    }
  },
  'electric-shock': {
    hi: {
      title: 'बिजली का झटका',
      description: 'विद्युत स्रोत से संपर्क',
      steps: [
        'बिजली के स्रोत को बंद करें यदि सुरक्षित हो',
        'लकड़ी या प्लास्टिक का उपयोग करके व्यक्ति को अलग करें',
        'स्वयं धातु या गीली वस्तुओं को न छुएं',
        'चेतना, श्वास, नाड़ी की जांच करें',
        'यदि आवश्यक हो तो CPR शुरू करें',
        'जले हुए क्षेत्रों को साफ कपड़े से ढकें',
        'यदि होश में है तो आरामदायक स्थिति में लिटाएं',
        'जब तक मदद न आए तब तक निगरानी करें'
      ],
      warnings: [
        'जब तक बिजली बंद न हो तब तक व्यक्ति को न छुएं',
        'उच्च वोल्टेज के पास न जाएं',
        'गीले क्षेत्रों या धातु के पास सावधान रहें'
      ],
      whenToSeekHelp: [
        'सभी विद्युत झटके को चिकित्सा मूल्यांकन की आवश्यकता है',
        'उच्च वोल्टेज (घरेलू से अधिक)',
        'कोई भी जलन',
        'हृदय की गति में परिवर्तन',
        'बेहोशी या भ्रम',
        'मांसपेशियों में दर्द या ऐंठन',
        'सिर या छाती से विद्युत का प्रवेश या निकास'
      ]
    },
    mr: {
      title: 'विजेचा धक्का',
      description: 'विद्युत स्रोताशी संपर्क',
      steps: [
        'सुरक्षित असल्यास विजेचा स्रोत बंद करा',
        'व्यक्तीला लाकूड किंवा प्लास्टिक वापरून वेगळे करा',
        'स्वतः धातू किंवा ओले वस्तू स्पर्श करू नका',
        'चेतना, श्वास, नाडी तपासा',
        'आवश्यक असल्यास CPR सुरू करा',
        'भाजलेले भाग स्वच्छ कापडाने झाकून घ्या',
        'शुद्धीवर असल्यास आरामदायक स्थितीत झोपवा',
        'मदत येईपर्यंत देखरेख ठेवा'
      ],
      warnings: [
        'वीज बंद होईपर्यंत व्यक्तीला स्पर्श करू नका',
        'उच्च व्होल्टेजजवळ जाऊ नका',
        'ओल्या भागात किंवा धातूजवळ सावध राहा'
      ],
      whenToSeekHelp: [
        'सर्व विद्युत धक्क्यांना वैद्यकीय मूल्यमापन आवश्यक',
        'उच्च व्होल्टेज (घरगुतीपेक्षा जास्त)',
        'कोणतेही भाजणे',
        'हृदयाच्या गतीत बदल',
        'बेशुद्धपणा किंवा गोंधळ',
        'स्नायूंमध्ये वेदना किंवा पेटके',
        'डोके किंवा छातीतून वीज प्रवेश किंवा बाहेर पडणे'
      ]
    }
  },
  'seizures': {
    hi: {
      title: 'दौरे',
      description: 'मिर्गी के दौरे या आक्षेप',
      steps: [
        'व्यक्ति के आसपास का क्षेत्र साफ करें',
        'समय नोट करें',
        'सिर के नीचे कुछ नरम रखें',
        'ढीले कपड़े, विशेष रूप से गर्दन के आसपास',
        'उन्हें बगल की ओर धीरे से करें',
        'शांत रहें और व्यक्ति के साथ रहें',
        'दौरे के बाद सांत्वना दें',
        'जब तक पूरी तरह से ठीक न हो जाएं तब तक निगरानी करें'
      ],
      warnings: [
        'उन्हें पकड़ने या रोकने की कोशिश न करें',
        'मुंह में कुछ न डालें',
        'भोजन या पेय न दें जब तक पूरी तरह से होश में न हों',
        'दौरे के दौरान स्थानांतरित न करें जब तक खतरे में न हो'
      ],
      whenToSeekHelp: [
        'पहला दौरा',
        '5 मिनट से अधिक समय तक दौरा',
        'बार-बार दौरे',
        'दौरे के दौरान चोट',
        'गर्भावस्था, मधुमेह, या हृदय रोग',
        'सामान्य रूप से ठीक नहीं होना',
        'पानी में दौरा'
      ]
    },
    mr: {
      title: 'झटके',
      description: 'अपस्मार झटके किंवा आक्षेप',
      steps: [
        'व्यक्तीभोवतीची जागा मोकळी करा',
        'वेळ लक्षात ठेवा',
        'डोक्याखाली काहीतरी मऊ ठेवा',
        'मोकळे कपडे, विशेषतः मानेभोवती',
        'त्यांना हळूवारपणे बाजूला करा',
        'शांत राहा आणि व्यक्तीबरोबर राहा',
        'झटक्यानंतर सांत्वन करा',
        'पूर्णपणे बरे होईपर्यंत देखरेख ठेवा'
      ],
      warnings: [
        'त्यांना धरून किंवा रोकण्याचा प्रयत्न करू नका',
        'तोंडात काहीही घालू नका',
        'पूर्णपणे शुद्धीवर येईपर्यंत अन्न किंवा पेय देऊ नका',
        'धोक्यात नसल्यास झटक्यादरम्यान हलवू नका'
      ],
      whenToSeekHelp: [
        'पहिला झटका',
        '5 मिनिटांपेक्षा जास्त काळ झटका',
        'वारंवार झटके',
        'झटक्यादरम्यान दुखापत',
        'गर्भधारणा, मधुमेह किंवा हृदयरोग',
        'सामान्यपणे बरे न होणे',
        'पाण्यात झटका'
      ]
    }
  },
  'allergic-reaction': {
    hi: {
      title: 'एलर्जी प्रतिक्रिया',
      description: 'हल्की से गंभीर एलर्जी प्रतिक्रियाएं',
      steps: [
        'एलर्जी के कारण की पहचान करें और हटा दें',
        'हल्के लक्षणों के लिए: एंटीहिस्टामाइन दें',
        'ठंडा कंप्रेस त्वचा पर चकत्ते के लिए लगाएं',
        'आरामदायक स्थिति दें',
        'लक्षणों की निगरानी करें',
        'यदि गंभीर (एनाफिलेक्सिस): एपिनेफ्रिन इंजेक्टर का उपयोग करें',
        'व्यक्ति को लिटाएं, पैर ऊपर उठाएं',
        'जब तक मदद न आए तब तक निगरानी करें'
      ],
      warnings: [
        'यदि सांस लेने में कठिनाई हो तो कोई मौखिक दवा न दें',
        'बीटे हुए यदि उल्टी या बेहोशी हो सकती है',
        'यदि लक्षण बिगड़ रहे हैं तो इंतजार न करें'
      ],
      whenToSeekHelp: [
        'सांस लेने में कठिनाई या घरघराहट',
        'चेहरे, होंठ, जीभ की सूजन',
        'गंभीर सूजन या व्यापक चकत्ते',
        'रक्तचाप में गिरावट, चक्कर आना',
        'तेज़ या कमजोर नाड़ी',
        'मतली, उल्टी, दस्त',
        'पिछली गंभीर एलर्जी प्रतिक्रियाएं',
        '15 मिनट में सुधार नहीं'
      ]
    },
    mr: {
      title: 'ऍलर्जिक प्रतिक्रिया',
      description: 'सौम्य ते गंभीर ऍलर्जी प्रतिक्रिया',
      steps: [
        'ऍलर्जीचे कारण ओळखा आणि काढून टाका',
        'सौम्य लक्षणांसाठी: अँटीहिस्टामाइन द्या',
        'त्वचेवरील पुरळासाठी थंड कंप्रेस लावा',
        'आरामदायक स्थिती द्या',
        'लक्षणांवर लक्ष ठेवा',
        'गंभीर असल्यास (अॅनाफिलॅक्सिस): एपिनेफ्रिन इंजेक्टर वापरा',
        'व्यक्तीला झोपवा, पाय वर उचला',
        'मदत येईपर्यंत देखرेख ठेवा'
      ],
      warnings: [
        'श्वास घेण्यात अडचण असल्यास तोंडी औषध देऊ नका',
        'उलट्या किंवा बेशुद्धपणा असल्यास बसवू नका',
        'लक्षणे वाढत असल्यास वाट पाहू नका'
      ],
      whenToSeekHelp: [
        'श्वास घेण्यात अडचण किंवा घरघर',
        'चेहरा, ओठ, जीभ सुजणे',
        'गंभीर सूज किंवा व्यापक पुरळ',
        'रक्तदाब कमी होणे, चक्कर येणे',
        'जलद किंवा कमकुवत नाडी',
        'मळमळ, उलट्या, अतिसार',
        'मागील गंभीर ऍलर्जी प्रतिक्रिया',
        '15 मिनिटांत सुधारणा नाही'
      ]
    }
  },
  'chest-pain': {
    hi: {
      title: 'छाती में दर्द',
      description: 'संभावित हृदय से संबंधित छाती में दर्द',
      steps: [
        'व्यक्ति को बैठने या आधा लेटने दें',
        'तंग कपड़े ढीले करें',
        'शांत रहें और व्यक्ति को सांत्वना दें',
        'यदि एस्पिरिन एलर्जी नहीं है: 300mg चबाने योग्य एस्पिरिन दें',
        'यदि उनके पास है तो GTN स्प्रे/टैबलेट',
        'लक्षणों की निगरानी करें',
        'जब तक मदद न आए तब तक साथ रहें',
        'यदि बेहोश हो जाते हैं तो CPR के लिए तैयार रहें'
      ],
      warnings: [
        'व्यक्ति को अकेला न छोड़ें',
        'उन्हें चलने या तनाव करने के लिए मजबूर न करें',
        'यदि सुधार नहीं हो रहा है तो इंतजार न करें'
      ],
      whenToSeekHelp: [
        'सभी छाती का दर्द तत्काल चिकित्सा आकलन की आवश्यकता है',
        'दबाव, निचोड़, या भारीपन की अनुभूति',
        'दर्द बांह, जबड़े, या पीठ में फैलता है',
        'सांस लेने में कठिनाई',
        'मतली या पसीना',
        'चक्कर आना या बेहोशी',
        'हृदय रोग का इतिहास'
      ]
    },
    mr: {
      title: 'छातीत दुखणे',
      description: 'संभाव्य हृदयाशी संबंधित छातीत दुखणे',
      steps: [
        'व्यक्तीला बसू किंवा अर्धा झोपू द्या',
        'घट्ट कपडे मोकळे करा',
        'शांत राहा आणि व्यक्तीला सांत्वन करा',
        'ऍस्पिरिन ऍलर्जी नसल्यास: 300mg चघळण्यायोग्य ऍस्पिरिन द्या',
        'त्यांच्याजवळ असल्यास GTN स्प्रे/टॅब्लेट',
        'लक्षणांवर लक्ष ठेवा',
        'मदत येईपर्यंत सोबत राहा',
        'बेशुद्ध झाल्यास CPR साठी तयार राहा'
      ],
      warnings: [
        'व्यक्तीला एकटे सोडू नका',
        'त्यांना चालायला किंवा ताण घेण्यास भाग पाडू नका',
        'सुधारणा होत नसेल तर वाट पाहू नका'
      ],
      whenToSeekHelp: [
        'सर्व छातीच्या दुखण्याला तात्काळ वैद्यकीय मूल्यमापन आवश्यक',
        'दाब, पिळण्याची किंवा भारीपणाची भावना',
        'दुखणे हात, जबडा किंवा पाठीत पसरते',
        'श्वास घेण्यात अडचण',
        'मळमळ किंवा घाम येणे',
        'चक्कर येणे किंवा बेशुद्ध होणे',
        'हृदयरोगाचा इतिहास'
      ]
    }
  },
  'animal-bite': {
    hi: {
      title: 'पशु का काटना',
      description: 'कुत्ता, बिल्ली, या अन्य पशुओं के काटने',
      steps: [
        'पशु से दूर जाएं',
        'घाव को बहते पानी से 5-10 मिनट धोएं',
        'साबुन से धीरे से साफ करें',
        'साफ कपड़े से थपथपाकर सुखाएं',
        'एंटीसेप्टिक लगाएं',
        'साफ पट्टी से ढकें',
        'घाव को ऊपर उठाएं यदि संभव हो',
        'जानवर के टीकाकरण की स्थिति नोट करें'
      ],
      warnings: [
        'घाव को सील न करें (सुपरग्लू, आदि)',
        'अज्ञात या जंगली जानवरों को न पकड़ें',
        'यदि रक्तस्राव गंभीर है तो सीधे दबाव लगाएं'
      ],
      whenToSeekHelp: [
        'सभी पशु काटने को चिकित्सा मूल्यांकन की आवश्यकता है',
        'रेबीज टीकाकरण पर विचार करें',
        'गहरे घाव या फटे हुए',
        'चेहरे, हाथ, या जननांग पर काटने',
        'अज्ञात या जंगली पशु',
        'संक्रमण के लक्षण (लाली, सूजन, मवाद)',
        'टेटनस टीकाकरण 5+ साल पुराना'
      ]
    },
    mr: {
      title: 'प्राण्याचा चावा',
      description: 'कुत्रा, मांजर किंवा इतर प्राण्यांचा चावा',
      steps: [
        'प्राण्यापासून दूर जा',
        'जखम वाहत्या पाण्याने 5-10 मिनिटे धुवा',
        'साबणाने हळूवारपणे स्वच्छ करा',
        'स्वच्छ कापडाने थोपटून सुकवा',
        'अँटीसेप्टिक लावा',
        'स्वच्छ पट्टीने झाकून घ्या',
        'शक्य असल्यास जखम वर उचला',
        'प्राण्याची लसीकरण स्थिती नोंदवा'
      ],
      warnings: [
        'जखम सील करू नका (सुपरग्लू इ.)',
        'अज्ञात किंवा वन्य प्राणी पकडू नका',
        'रक्तस्त्राव गंभीर असल्यास थेट दाब लावा'
      ],
      whenToSeekHelp: [
        'सर्व प्राण्यांच्या चाव्यांना वैद्यकीय मूल्यमापन आवश्यक',
        'रेबीज लसीकरणाचा विचार करा',
        'खोल जखम किंवा फाटलेली',
        'चेहरा, हात किंवा गुप्तांगावर चावा',
        'अज्ञात किंवा वन्य प्राणी',
        'संसर्गाची लक्षणे (लालसरपणा, सूज, पू)',
        'टिटॅनस लसीकरण 5+ वर्षे जुने'
      ]
    }
  },
  'poisoning': {
    hi: {
      title: 'विषाक्तता',
      description: 'विषाक्त पदार्थों का निगलन या संपर्क',
      steps: [
        'व्यक्ति को जहर के स्रोत से दूर ले जाएं',
        'यदि होश में है: मुंह धोएं',
        'पदार्थ और कंटेनर की पहचान करें',
        'पदार्थ का नमूना या कंटेनर रखें',
        'यदि त्वचा पर है: 20 मिनट के लिए धोएं',
        'यदि आँखों में है: 15 मिनट के लिए धोएं',
        'जहर नियंत्रण केंद्र को कॉल करें',
        'लक्षणों की निगरानी करें'
      ],
      warnings: [
        'उल्टी प्रेरित न करें जब तक सलाह न दी जाए',
        'जब तक निर्देशित न किया जाए तब तक दूध या पानी न दें',
        'घरेलू उपचार का उपयोग न करें',
        'रासायनिक जलने के लिए किसी भी चीज़ को तटस्थ करने का प्रयास न करें'
      ],
      whenToSeekHelp: [
        'सभी जहर के मामलों में तत्काल चिकित्सा सहायता',
        'सांस लेने में कठिनाई',
        'भ्रम, उनींदापन, या बेहोशी',
        'दौरे या आक्षेप',
        'मुंह या हाथों के आसपास रसायनों से जलन',
        'अज्ञात पदार्थ निगला',
        'बच्चे ने कोई भी दवा या रसायन निगला'
      ]
    },
    mr: {
      title: 'विषबाधा',
      description: 'विषारी पदार्थांचे गिळणे किंवा संपर्क',
      steps: [
        'व्यक्तीला विषाच्या स्रोतापासून दूर घेऊन जा',
        'शुद्धीवर असल्यास: तोंड धुवा',
        'पदार्थ आणि कंटेनर ओळखा',
        'पदार्थाचा नमुना किंवा कंटेनर ठेवा',
        'त्वचेवर असल्यास: 20 मिनिटे धुवा',
        'डोळ्यात असल्यास: 15 मिनिटे धुवा',
        'विष नियंत्रण केंद्राला कॉल करा',
        'लक्षणांवर लक्ष ठेवा'
      ],
      warnings: [
        'सल्ला दिल्याशिवाय उलट्या करायला लावू नका',
        'सूचना दिल्याशिवाय दूध किंवा पाणी देऊ नका',
        'घरगुती उपाय वापरू नका',
        'रासायनिक भाजण्यासाठी काहीही तटस्थ करण्याचा प्रयत्न करू नका'
      ],
      whenToSeekHelp: [
        'सर्व विषबाधा प्रकरणांमध्ये तात्काळ वैद्यकीय मदत',
        'श्वास घेण्यात अडचण',
        'गोंधळ, तंद्री किंवा बेशुद्धपणा',
        'फिट किंवा आक्षेप',
        'तोंड किंवा हातांभोवती रसायनांनी भाजणे',
        'अज्ञात पदार्थ गिळले',
        'मुलाने कोणतेही औषध किंवा रसायन गिळले'
      ]
    }
  }
};

// Helper function to get translated category
export function getTranslatedCategory(categoryId: string, language: 'en' | 'hi' | 'mr'): EmergencyTranslation | null {
  if (language === 'en') {
    // Return the original English category transformed to EmergencyTranslation format
    const category = emergencyCategories.find(c => c.id === categoryId);
    if (!category) return null;
    return {
      title: category.title,
      description: category.description,
      steps: category.steps,
      warnings: category.warnings,
      whenToSeekHelp: category.whenToSeekHelp
    };
  }
  
  return emergencyTranslations[categoryId]?.[language] || null;
}
