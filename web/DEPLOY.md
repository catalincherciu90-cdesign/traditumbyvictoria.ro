# Traditum By Victoria — versiunea Next.js (găzduită pe Cloudflare)

Această aplicație (`/web`) este noua versiune, modernă, a site-ului, construită cu
**Next.js 16 (App Router)** și publicată pe **Cloudflare Workers** prin
**@opennextjs/cloudflare**. Rulează pe aceeași infrastructură ca înainte
(Workers + KV + Workers AI), deci **datele existente se păstrează automat** —
folosește exact același KV namespace (`PRODUCTS`), deci tot conținutul, recenziile
și mesajele rămân pe loc.

Site-ul live actual (din rădăcina repo-ului, worker-ul `src/index.js`) rămâne
neatins până când faci tu cutover-ul. Poți testa noua versiune în paralel.

## Ce trebuie să faci în panoul Cloudflare (pași pe care doar tu îi poți face)

În proiectul Cloudflare Workers, la deploy-ul din acest repo:

1. **Directorul rădăcină al build-ului**: `web`
2. **Comanda de build**: `npx opennextjs-cloudflare build`
3. **Directorul de output / deploy**: worker-ul rezultat este `.open-next/worker.js`
   (deja setat în `web/wrangler.jsonc` prin `"main"`).
4. **Binding-uri** (trebuie să existe, cu aceleași nume):
   - KV namespace **`PRODUCTS`** → același namespace ca acum
     (id `a217be415b254215bd0343e80e138d24`).
   - **`AI`** → Workers AI.
   - **`ASSETS`** → binding-ul de assets (setat automat din `wrangler.jsonc`).
5. **Secret**: **`ADMIN_PASSWORD`** — aceeași parolă de admin ca acum
   (folosită pentru login și pentru semnarea sesiunii).
6. **Flag de compatibilitate**: `nodejs_compat` (deja în `wrangler.jsonc`).

După primul deploy reușit, verifică `/admin`, apoi poți muta domeniul principal
pe noul worker.

## Comenzi locale (în folderul `web/`)

```bash
npm install
npm run dev        # dezvoltare Next.js (fără binding-uri Cloudflare)
npm run build      # verifică build-ul Next.js
npm run cf:build   # build pentru Cloudflare (.open-next/worker.js)
npm run preview    # rulează local pe workerd + KV local (miniflare)
npm run deploy     # build + deploy pe Cloudflare (necesită autentificare wrangler)
```

Pentru testarea locală a adminului cu `npm run preview`, pune parola într-un fișier
`web/.dev.vars` (ignorat de git):

```
ADMIN_PASSWORD=parola_ta_de_test
```

## Structură

- `app/` — paginile publice (Acasă, Despre, Produse, Produse/[slug], Galerie,
  Recenzii, Contact, pagini legale) + panoul `/admin`.
- `app/api/` — API-ul (auth, config, AI, mesaje, recenzii, upload, imagini),
  portat din vechiul `src/index.js` ca Route Handlers.
- `app/lib/` — stratul de date (KV), autentificare HMAC, sanitizare, AI, JSON-LD.
- `wrangler.jsonc` / `open-next.config.ts` — configurația de deploy Cloudflare.
