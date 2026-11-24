export type LanguageCode = "english" | "tagalog" | "bisaya";

export interface SurveyQuestion {
  id: "q1" | "q2" | "q3" | "q4" | "q5" | "q6";
  number: number;
  type: "rating" | "boolean";
  shortLabel: string;
  csvHeader: string;
  icon: string;
  text: Record<LanguageCode, string>;
}

export interface RatingOption {
  value: 1 | 2 | 3 | 4 | 5;
  emoji: string;
  label: Record<LanguageCode, string>;
  colorClass: string;
  activeRingClass: string;
  bgTintClass: string;
}

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeLabel: string;
  subtitle: string;
  badge: string;
  greeting: string;
  gradientClass: string;
  borderClass: string;
  accentTextClass: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: "english",
    name: "English",
    nativeLabel: "English",
    subtitle: "Tap to answer in English",
    badge: "EN",
    greeting: "Hello! Ready to share your experience?",
    gradientClass: "from-[#1D4ED8] to-[#0EA5E9]",
    borderClass: "border-sky-300 hover:border-sky-500",
    accentTextClass: "text-sky-700",
  },
  {
    code: "tagalog",
    name: "Tagalog",
    nativeLabel: "Tagalog",
    subtitle: "Pindutin upang sumagot sa Tagalog",
    badge: "TL",
    greeting: "Kumusta! Handa ka na bang magbahagi?",
    gradientClass: "from-[#F59E0B] to-[#EA580C]",
    borderClass: "border-amber-300 hover:border-amber-500",
    accentTextClass: "text-amber-700",
  },
  {
    code: "bisaya",
    name: "Bisaya",
    nativeLabel: "Bisaya",
    subtitle: "Pindota aron motubag sa Bisaya",
    badge: "CEB",
    greeting: "Maayong adlaw! Andam na ka motubag?",
    gradientClass: "from-[#DC2626] to-[#F97316]",
    borderClass: "border-orange-300 hover:border-orange-500",
    accentTextClass: "text-orange-700",
  },
];

// Questions directly sourced from Survey-TQ_Interests-V2.0.xlsx ("Genral Experience" sheet)
export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: "q1",
    number: 1,
    type: "rating",
    shortLabel: "Overall Experience",
    csvHeader: "Q1: Overall Experience (1-5)",
    icon: "🚀",
    text: {
      english:
        "Did you enjoy the overall experience of participating in Robowheels: Innovation for Every-Juan?",
      tagalog:
        "Nagustuhan mo ba ang kabuuang karanasan sa Robowheels: Innovation for Every-Juan?",
      bisaya:
        "Nalipay ba ka sa imong kinatibuk-ang kasinatian sa Robowheels: Innovation for Every-Juan?",
    },
  },
  {
    id: "q2",
    number: 2,
    type: "rating",
    shortLabel: "Mind-Games Fun",
    csvHeader: "Q2: Mind-Games Fun (1-5)",
    icon: "🧩",
    text: {
      english: "Did you find the mind-games fun and engaging?",
      tagalog: "Natuwa ka ba at naging interesado sa mga mind-games?",
      bisaya: "Nalingaw ba ka ug na-engganyo sa mga dula (mind-games)?",
    },
  },
  {
    id: "q3",
    number: 3,
    type: "rating",
    shortLabel: "Robot & Trainer Comfort",
    csvHeader: "Q3: Comfort with Robots & Trainers (1-5)",
    icon: "🤖",
    text: {
      english:
        "Did you feel comfortable interacting with the robots and laboratory trainers?",
      tagalog:
        "Naging komportable ka ba sa pakikipag-ugnayan sa mga robot at laboratory trainers?",
      bisaya:
        "Komportable ba ka sa pag-interact sa mga robot ug laboratory trainers?",
    },
  },
  {
    id: "q4",
    number: 4,
    type: "rating",
    shortLabel: "Learned Something New",
    csvHeader: "Q4: Learned Something New (1-5)",
    icon: "💡",
    text: {
      english: "Did you learn something new about robotics during the activity?",
      tagalog:
        "May natutunan ka bang bago tungkol sa robotics mula sa karanasang ito?",
      bisaya:
        "Aduna ba kay bag-ong nakat-onan bahin sa robotics gikan sa maong kasinatian?",
    },
  },
  {
    id: "q5",
    number: 5,
    type: "rating",
    shortLabel: "Interest to Learn More",
    csvHeader: "Q5: Want to Learn More (1-5)",
    icon: "🌟",
    text: {
      english:
        "After this experience, do you want to learn more about robotics?",
      tagalog:
        "Matapos ang aktibidad, nais mo pa bang matuto nang higit pa tungkol sa robotics?",
      bisaya:
        "Human sa aktibidad, gusto pa ba ka makat-on ug dugang bahin sa robotics?",
    },
  },
  {
    id: "q6",
    number: 6,
    type: "boolean",
    shortLabel: "Prior Robot Experience",
    csvHeader: "Q6: Ever Interacted with a Robot Before",
    icon: "🤝",
    text: {
      english: "Have you ever experienced interacting with a robot?",
      tagalog: "Nakaranas ka na bang makipag-interact sa robot?",
      bisaya: "Naka-experience na ba ka og pakig-interact sa robot?",
    },
  },
];

export const RATING_OPTIONS: RatingOption[] = [
  {
    value: 1,
    emoji: "😡",
    label: {
      english: "Not at all",
      tagalog: "Hindi talaga",
      bisaya: "Dili gyud",
    },
    colorClass: "text-rose-600",
    activeRingClass: "ring-rose-400 border-rose-500 bg-rose-50",
    bgTintClass: "hover:bg-rose-50/80 hover:border-rose-300",
  },
  {
    value: 2,
    emoji: "😕",
    label: {
      english: "Not really",
      tagalog: "Hindi gaanong",
      bisaya: "Dili kaayo",
    },
    colorClass: "text-orange-600",
    activeRingClass: "ring-orange-400 border-orange-500 bg-orange-50",
    bgTintClass: "hover:bg-orange-50/80 hover:border-orange-300",
  },
  {
    value: 3,
    emoji: "😐",
    label: {
      english: "Okay",
      tagalog: "Ayos lang",
      bisaya: "Okay lang",
    },
    colorClass: "text-amber-600",
    activeRingClass: "ring-amber-400 border-amber-500 bg-amber-50",
    bgTintClass: "hover:bg-amber-50/80 hover:border-amber-300",
  },
  {
    value: 4,
    emoji: "🙂",
    label: {
      english: "Yes, fun!",
      tagalog: "Oo, masaya!",
      bisaya: "Oo, lingaw!",
    },
    colorClass: "text-sky-600",
    activeRingClass: "ring-sky-400 border-sky-500 bg-sky-50",
    bgTintClass: "hover:bg-sky-50/80 hover:border-sky-300",
  },
  {
    value: 5,
    emoji: "🤩",
    label: {
      english: "Loved it!",
      tagalog: "Sobrang gusto!",
      bisaya: "Ganahan kaayo!",
    },
    colorClass: "text-emerald-600",
    activeRingClass: "ring-emerald-400 border-emerald-500 bg-emerald-50",
    bgTintClass: "hover:bg-emerald-50/80 hover:border-emerald-300",
  },
];

export const BOOLEAN_OPTIONS = {
  yes: {
    value: true,
    emoji: "👍",
    label: {
      english: "Yes",
      tagalog: "Oo",
      bisaya: "Oo",
    },
    sublabel: {
      english: "I have before",
      tagalog: "Nakaranas na ako",
      bisaya: "Naka-experience na ko",
    },
  },
  no: {
    value: false,
    emoji: "👎",
    label: {
      english: "No",
      tagalog: "Hindi",
      bisaya: "Dili",
    },
    sublabel: {
      english: "This is my first time!",
      tagalog: "Ngayon pa lang!",
      bisaya: "Karon pa ko kasuway!",
    },
  },
};

export interface LocalizedStrings {
  chooseLanguageTitle: string;
  chooseLanguageSubtitle: string;
  nameTitle: string;
  nameSubtitle: string;
  namePlaceholder: string;
  continueBtn: string;
  skipNameBtn: string;
  backBtn: string;
  questionProgress: (current: number, total: number) => string;
  tapEmojiHint: string;
  tapYesNoHint: string;
  savingText: string;
  thankYouTitle: string;
  thankYouWithName: (name: string) => string;
  thankYouSubtitle: string;
  resetBtn: string;
  anonymousLabel: string;
  submitError: string;
}

export const UI_STRINGS: Record<LanguageCode, LocalizedStrings> = {
  english: {
    chooseLanguageTitle: "Choose Your Language",
    chooseLanguageSubtitle:
      "Select a language to start your quick RoboWheels × 2026 NSTW evaluation!",
    nameTitle: "What's your name?",
    nameSubtitle:
      "Enter your name or nickname — or skip if you prefer to stay anonymous.",
    namePlaceholder: "Type your name here...",
    continueBtn: "Start Evaluation",
    skipNameBtn: "Skip (Stay Anonymous)",
    backBtn: "Back",
    questionProgress: (current, total) => `Question ${current} of ${total}`,
    tapEmojiHint: "Tap the emoji that best matches your answer",
    tapYesNoHint: "Tap Yes or No to finish",
    savingText: "Saving your feedback...",
    thankYouTitle: "Thank You!",
    thankYouWithName: (name) => `Thank you, ${name}!`,
    thankYouSubtitle:
      "Your feedback helps us bring even more fun robotics & innovation to Every-Juan!",
    resetBtn: "New Evaluation",
    anonymousLabel: "Anonymous",
    submitError: "Could not save right now. Please try again.",
  },
  tagalog: {
    chooseLanguageTitle: "Pumili ng Wika",
    chooseLanguageSubtitle:
      "Piliin ang iyong wika upang simulan ang mabilis na RoboWheels × 2026 NSTW evaluation!",
    nameTitle: "Ano ang iyong pangalan?",
    nameSubtitle:
      "Ilagay ang iyong pangalan o palayaw — o laktawan kung nais manatiling anonymous.",
    namePlaceholder: "Isulat ang iyong pangalan dito...",
    continueBtn: "Simulan ang Evaluation",
    skipNameBtn: "Laktawan (Anonymous)",
    backBtn: "Bumalik",
    questionProgress: (current, total) => `Tanong ${current} sa ${total}`,
    tapEmojiHint: "Pindutin ang emoji na pinakabagay sa iyong sagot",
    tapYesNoHint: "Pindutin ang Oo o Hindi upang matapos",
    savingText: "Sinesave ang iyong sagot...",
    thankYouTitle: "Maraming Salamat!",
    thankYouWithName: (name) => `Maraming salamat, ${name}!`,
    thankYouSubtitle:
      "Ang iyong feedback ay makakatulong upang mas pagandahin pa ang RoboWheels para sa Every-Juan!",
    resetBtn: "Bagong Evaluation",
    anonymousLabel: "Anonymous",
    submitError: "Hindi na-save ngayon. Pakisubukan muli.",
  },
  bisaya: {
    chooseLanguageTitle: "Pilia ang Imong Pinulongan",
    chooseLanguageSubtitle:
      "Pilia ang pinulongan aron magsugod sa dali nga RoboWheels × 2026 NSTW evaluation!",
    nameTitle: "Unsa imong ngalan?",
    nameSubtitle:
      "Isulat ang imong ngalan o angga — o laktawi kung gusto ka magpabiling anonymous.",
    namePlaceholder: "Isulat imong ngalan diri...",
    continueBtn: "Sugdi ang Evaluation",
    skipNameBtn: "Laktawi (Anonymous)",
    backBtn: "Balik",
    questionProgress: (current, total) => `Pangutana ${current} sa ${total}`,
    tapEmojiHint: "Pindota ang emoji nga haom sa imong tubag",
    tapYesNoHint: "Pindota ang Oo o Dili aron mahuman",
    savingText: "Gi-save ang imong tubag...",
    thankYouTitle: "Daghang Salamat!",
    thankYouWithName: (name) => `Daghang salamat, ${name}!`,
    thankYouSubtitle:
      "Ang imong feedback makatabang aron mas nindot pa ang RoboWheels para sa Every-Juan!",
    resetBtn: "Bag-ong Evaluation",
    anonymousLabel: "Anonymous",
    submitError: "Wala ma-save karon. Palihug sulayi pag-usab.",
  },
};

export function getEmojiForScore(score: number): string {
  const match = RATING_OPTIONS.find((opt) => opt.value === score);
  return match ? match.emoji : "😐";
}

export function getLanguageLabel(lang: LanguageCode): string {
  const match = LANGUAGE_OPTIONS.find((opt) => opt.code === lang);
  return match ? match.name : lang;
}
