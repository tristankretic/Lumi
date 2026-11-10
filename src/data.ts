export const categories = [
  "Otroštvo",
  "Družina",
  "Ljubezen in odnosi",
  "Življenjske izkušnje",
  "Modrost",
];
export const questions = [
  "Kakšen je tvoj najlepši spomin iz otroštva?",
  "Kdo je najbolj vplival nate, ko si bil otrok?",
  "Kako se spominjaš svojega prvega šolskega dne?",
  "Katere družinske tradicije so ti najpomembnejše?",
  "Kaj so te naučili tvoji starši?",
  "Kateri družinski trenutek ti največ pomeni?",
  "Kako si spoznal svojo prvo ljubezen?",
  "Kdo je bil tvoj najboljši prijatelj?",
  "Kateri odnos je najbolj vplival na tvoje življenje?",
  "Na kateri dosežek si najbolj ponosen?",
  "Katera odločitev je spremenila tvoje življenje?",
  "Kateri izziv ti je dal največ življenjskih izkušenj?",
  "Kakšen nasvet bi dal mlajšemu sebi?",
  "Kaj bi želel povedati prihodnjim generacijam?",
  "Kaj je najpomembnejša stvar, ki si se je naučil?",
];
export type Media = { uri: string; type: "audio" | "image" | "video" };
export type Memory = {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  precision: "day" | "year";
  created: string;
  media: Media[];
  favorite: boolean;
  question?: number;
  sample?: boolean;
};
export const samples: Memory[] = [
  {
    id: "sample1",
    title: "Poletje z družino",
    content:
      "Vsako poletje smo se vračali v isto majhno hišo ob morju. Najbolj se spomnim večerov na terasi, ko smo skupaj poslušali škržate. Nismo potrebovali veliko, samo čas drug za drugega.",
    category: "Družina",
    date: "2018-07-20",
    precision: "day",
    created: "2026-11-01",
    media: [],
    favorite: true,
    sample: true,
  },
  {
    id: "sample2",
    title: "Moj prvi šolski dan",
    content:
      "Torba je bila skoraj večja od mene. Pred vrati razreda me je bilo strah, potem pa me je nekdo povabil, naj sedem poleg njega. Tako se je začelo dolgo prijateljstvo.",
    category: "Otroštvo",
    date: "2010",
    precision: "year",
    created: "2026-10-29",
    media: [],
    favorite: false,
    sample: true,
  },
  {
    id: "sample3",
    title: "Nasvet prihodnjim generacijam",
    content:
      "Ne čakajte na popoln trenutek. Pokličite ljudi, ki jih imate radi. Vprašajte jih o njihovem življenju in jim zares prisluhnite.",
    category: "Modrost",
    date: "2024",
    precision: "year",
    created: "2026-10-25",
    media: [],
    favorite: false,
    sample: true,
  },
];
