import { cfEnv } from "./cf";

const AI_MODELS = [
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  "@cf/meta/llama-4-scout-17b-16e-instruct",
  "@cf/meta/llama-3.1-8b-instruct-fp8",
  "@cf/meta/llama-3-8b-instruct",
];

const AI_BRAND =
  'Ești copywriter SEO pentru cofetăria premium „Traditum By Victoria" din București (laborator de cofetărie artizanală: torturi, prăjituri, candy bar), care livrează în București și Ilfov. Scrii exclusiv în limba română corectă, cu diacritice, pe un ton cald, elegant și autentic, fără clișee și fără emoji. Textele tale sunt optimizate pentru motoarele de căutare: folosești natural cuvinte-cheie relevante (numele produsului/categoriei, „cofetărie București", „la comandă", „artizanal", tipuri de evenimente ca aniversări, nunți, botezuri, majorate, evenimente corporate), fără repetare forțată și fără keyword stuffing.';

function stripQuotes(s: string): string {
  return String(s || "").trim().replace(/^["'„”«»]+|["'„”«»]+$/g, "").trim();
}
function digits(s: string): string {
  return String(s || "").replace(/[^\d]/g, "");
}

async function runAI(user: string): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AI = cfEnv().AI as any;
  if (!AI) throw new Error("Workers AI nu este activat pe acest cont.");
  const payload = {
    messages: [
      { role: "system", content: AI_BRAND },
      { role: "user", content: user },
    ],
    max_tokens: 800,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let res: any, lastErr: unknown;
  for (const model of AI_MODELS) {
    try {
      res = await AI.run(model, payload);
      break;
    } catch (e) {
      lastErr = e;
    }
  }
  if (!res) throw new Error("Niciun model AI disponibil: " + String((lastErr as Error)?.message || lastErr));
  return String(res?.response || "").trim();
}

function parseFields(text: string, keys: string[]): Record<string, string> {
  const fields: Record<string, string> = {};
  const re = new RegExp("^\\s*(" + keys.join("|") + ")\\s*:\\s*(.*)$", "i");
  for (const line of text.split("\n")) {
    const m = line.match(re);
    if (m) fields[m[1].toLowerCase()] = stripQuotes(m[2]);
  }
  return fields;
}

export async function generateBanner(kind: string, hint: string) {
  const h = hint ? " Indiciu/temă: " + hint + "." : "";

  if (kind === "promo") {
    const text = await runAI(
      "Generează UN singur titlu scurt și atrăgător (maxim 8 cuvinte) pentru un banner promoțional al unei cofetării." +
        h + " Răspunde DOAR cu titlul, fără ghilimele, fără explicații.",
    );
    return { title: stripQuotes(text.split("\n")[0] || "") };
  }

  if (kind === "page") {
    const text = await runAI(
      "Scrie conținutul, optimizat SEO, pentru pagina unei categorii de produse dintr-o cofetărie." + h +
        " Descrierea trebuie să fie amplă (120-180 de cuvinte), împărțită în DOUĂ paragrafe, care să prezinte categoria, ocaziile potrivite, calitatea ingredientelor și posibilitatea de comandă personalizată, folosind natural cuvinte-cheie relevante." +
        " Răspunde EXACT în acest format, fiecare câmp pe o SINGURĂ linie (fără rânduri noi în interiorul unui câmp):\n" +
        "Titlu: <titlu scurt, 2-4 cuvinte>\n" +
        "Descriere: <120-180 de cuvinte, cald și apetisant, cele două paragrafe separate prin secvența ||>\n" +
        "PretMin: <doar număr, ex. 150>\n" +
        "PretMax: <doar număr, ex. 600>",
    );
    const f = parseFields(text, ["titlu", "descriere", "pretmin", "pretmax"]);
    const description = String(f.descriere || "").replace(/\s*\|\|\s*/g, "\n\n").trim();
    return { title: f.titlu || "", description, priceMin: digits(f.pretmin), priceMax: digits(f.pretmax) };
  }

  // implicit: descriere produs
  const nume = hint || "produs de cofetărie";
  const text = await runAI(
    "Scrie textul, optimizat SEO, pentru un produs de cofetărie care se numește „" + nume + '". Nu schimba și nu repeta numele.' +
      " Răspunde EXACT în acest format, fiecare câmp pe o SINGURĂ linie:\n" +
      "Descriere: <60-90 de cuvinte, apetisant, cu cuvinte-cheie naturale>\n" +
      "Categorie: <categorie, 1-2 cuvinte, ex. Torturi/Prăjituri/Mese dulci>\n" +
      "Pret: <preț orientativ, ex. 120 lei sau La comandă>",
  );
  const f = parseFields(text, ["descriere", "categorie", "pret"]);
  return { description: f.descriere || "", category: f.categorie || "", price: f.pret || "" };
}
