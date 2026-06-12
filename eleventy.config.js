// NAXA — configuration Eleventy (site statique multilingue FR/EN/AR, pré-rendu)
const SITE = { baseUrl: "https://naxa-site.netlify.app", defaultLang: "fr" };

module.exports = function (eleventyConfig) {
  // --- Assets statiques copiés tels quels vers _site ---
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("robots.txt");
  // Fichier de vérification Google Search Console (doit rester accessible à la racine)
  eleventyConfig.addPassthroughCopy("googlec2262dfd6bc5ede0.html");

  // --- Chemin localisé d'une page : fr → "/slug/", autres langues → "/lang/slug/" ---
  const locPath = (lang, slug) => {
    const base = lang === SITE.defaultLang ? "/" : `/${lang}/`;
    return slug ? `${base}${slug}/` : base;
  };
  eleventyConfig.addFilter("locPath", locPath);
  eleventyConfig.addFilter("absUrl", (path) => SITE.baseUrl + path);

  // --- Helpers JSON-LD (Schema.org) ---
  eleventyConfig.addFilter("faqSchema", (items) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (items || []).map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  }));
  eleventyConfig.addFilter("breadcrumbSchema", (trail) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: (trail || []).map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: SITE.baseUrl + t.path,
    })),
  }));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "html"],
  };
};
