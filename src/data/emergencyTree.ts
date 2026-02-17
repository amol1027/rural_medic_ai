export type EmergencyCategory = {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: string[];
  warnings: string[];
  whenToSeekHelp: string[];
};

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
  }
];
