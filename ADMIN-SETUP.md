# Configurare panou de administrare produse

Site-ul are acum un panou de administrare la adresa **`/admin`** unde poți adăuga,
edita și șterge produse (cu poze), fără să modifici cod. Produsele și pozele se
salvează în Cloudflare KV.

Pentru ca această funcție să funcționeze în producție, trebuie făcute **3 setări**
în dashboard-ul Cloudflare (o singură dată).

## 1. Creează namespace-ul KV

1. Dashboard Cloudflare → **Workers & Pages** → **KV**
2. **Create a namespace** → nume: `traditum-products` → **Add**
3. Copiază **ID-ul** namespace-ului (un șir lung de caractere)

## 2. Pune ID-ul în `wrangler.jsonc`

În fișierul `wrangler.jsonc`, înlocuiește `INLOCUIESTE_CU_ID_KV` cu ID-ul copiat:

```jsonc
"kv_namespaces": [
  { "binding": "PRODUCTS", "id": "<aici-id-ul-real>" }
]
```

(Sau spune-mi ID-ul și îl pun eu.)

## 3. Setează parola de administrare (secret)

1. Deschide Worker-ul `traditumbyvictoria` → **Settings** → **Variables and secrets**
2. **Add** → tip **Secret**
3. Nume: `ADMIN_PASSWORD` → valoare: parola dorită → **Save**

> Parola de login a panoului `/admin` este exact această valoare. Sesiunile sunt
> semnate cu ea, deci dacă o schimbi, toți utilizatorii logați sunt deconectați.

## Gata

După aceste setări, la următorul deploy:
- **`/admin`** → pagina de administrare (login cu parola de mai sus)
- **`/produse`** (`product.html`) afișează automat produsele din KV

Dacă magazinul e gol la prima accesare, sunt create 3 produse demonstrative
(Torturi, Prăjituri, Mese dulci) pe care le poți edita sau șterge.
