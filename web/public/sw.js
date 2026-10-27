// Service worker minimal — necesar ca aplicația să fie „instalabilă" (PWA).
// Nu facem caching agresiv: lăsăm rețeaua să răspundă normal.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // handler prezent (cerut de criteriile de instalare), fără intervenție.
});
