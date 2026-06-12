// Configuration globale du site (disponible dans les templates via `site.*`)
module.exports = {
  name: "NAXA",
  baseUrl: "https://naxa-site.netlify.app",
  phone: "+212 666 709 498",
  phoneRaw: "0666709498",
  whatsapp: "https://wa.me/212666709498",
  email: "contact@naxa.ma",
  defaultLang: "fr",
  // Langues générées. FR = défaut (racine), EN sous /en/, AR sous /ar/ (RTL).
  langs: ["fr", "en", "ar"],
  ogLocale: { fr: "fr_FR", en: "en_US", ar: "ar_MA" },
  inLanguage: { fr: "fr-MA", en: "en", ar: "ar-MA" },
  // Pages du site : clé interne, slug d'URL ("" = accueil), clé i18n de nav
  pages: [
    { key: "home", slug: "", nav: "home" },
    { key: "services", slug: "services", nav: "services" },
    { key: "solutions", slug: "solutions", nav: "solutions" },
    { key: "about", slug: "a-propos", nav: "about" },
    { key: "contact", slug: "contact", nav: "contact" },
  ],
};
