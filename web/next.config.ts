import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/despre", permanent: true },
      { source: "/service.html", destination: "/despre", permanent: true },
      { source: "/product.html", destination: "/produse", permanent: true },
      { source: "/torturi.html", destination: "/produse/torturi", permanent: true },
      { source: "/candybar.html", destination: "/produse/candybar", permanent: true },
      { source: "/galerie.html", destination: "/galerie", permanent: true },
      { source: "/recenzii.html", destination: "/recenzii", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/confidentialitate.html", destination: "/confidentialitate", permanent: true },
      { source: "/cookie.html", destination: "/cookie-uri", permanent: true },
      { source: "/termeni.html", destination: "/termeni", permanent: true },
      {
        source: "/categorie.html",
        has: [{ type: "query", key: "c", value: "(?<slug>.*)" }],
        destination: "/produse/:slug",
        permanent: true,
      },
      { source: "/categorie.html", destination: "/produse", permanent: true },
    ];
  },
};

export default nextConfig;
