// NAXA — système i18n (FR / EN / AR) sans framework
// Persistance localStorage · RTL auto pour l'arabe · 1 dictionnaire central

const I18N_DICT = {
  fr: {
    // Header / Nav
    'nav.home': 'Accueil',
    'nav.services': 'Services',
    'nav.solutions': 'Solutions IA',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.cta': 'Démarrer un projet',
    'nav.menu': 'Menu',

    // Hero (index.html)
    'hero.tag': 'IA locale · Automatisation · Chatbots',
    'hero.title.html': 'Vos processus, <span class="text-grad">augmentés par l\'IA</span><br>sans jamais perdre vos données.',
    'hero.sub.html': 'NAXA conçoit et déploie des solutions d\'<strong>Intelligence Artificielle locale</strong>, d\'automatisation métier et de chatbots qui s\'intègrent à votre activité — souveraineté totale, ROI mesurable, et un accompagnement humain à chaque étape.',
    'hero.cta.audit': 'Audit gratuit ›',
    'hero.cta.solutions': 'Découvrir nos solutions',
    'hero.trust.1': 'Données 100% on-premise',
    'hero.trust.2': 'Modèles open-source',
    'hero.trust.3': 'Conformité RGPD / Loi 09-08',

    // Stats
    'stats.1': 'Projets déployés',
    'stats.2': 'Tâches répétitives automatisées',
    'stats.3': 'Disponibilité chatbot',
    'stats.4': 'Données souveraines',

    // Footer
    'footer.brand': 'Agence digitale spécialisée en IA locale, automatisation métier et chatbots intelligents. Basée au Maroc, au service d\'entreprises ambitieuses.',
    'footer.col.services': 'Services',
    'footer.col.entreprise': 'Entreprise',
    'footer.col.contact': 'Contact',
    'footer.copy': '© 2026 NAXA — Tous droits réservés.',
    'footer.tag': 'Conçu avec passion · IA locale · Souveraineté des données',

    // Common CTAs
    'cta.demander': 'Demander un devis ›',
    'cta.contacter': 'Contactez-nous',
    'cta.envoyer': 'Envoyer ma demande ›',

    // Langue switch
    'lang.label': 'Langue',
  },

  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.solutions': 'AI Solutions',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cta': 'Start a project',
    'nav.menu': 'Menu',

    'hero.tag': 'Local AI · Automation · Chatbots',
    'hero.title.html': 'Your processes, <span class="text-grad">powered by AI</span><br>without ever losing your data.',
    'hero.sub.html': 'NAXA designs and deploys <strong>on-premise AI</strong>, business automation, and chatbot solutions that integrate with your activity — full data sovereignty, measurable ROI, and human support at every step.',
    'hero.cta.audit': 'Free audit ›',
    'hero.cta.solutions': 'Discover our solutions',
    'hero.trust.1': '100% on-premise data',
    'hero.trust.2': 'Open-source models',
    'hero.trust.3': 'GDPR / Law 09-08 compliant',

    'stats.1': 'Projects delivered',
    'stats.2': 'Repetitive tasks automated',
    'stats.3': 'Chatbot availability',
    'stats.4': 'Sovereign data',

    'footer.brand': 'Digital agency specialized in local AI, business automation and intelligent chatbots. Based in Morocco, serving ambitious companies.',
    'footer.col.services': 'Services',
    'footer.col.entreprise': 'Company',
    'footer.col.contact': 'Contact',
    'footer.copy': '© 2026 NAXA — All rights reserved.',
    'footer.tag': 'Crafted with care · Local AI · Data sovereignty',

    'cta.demander': 'Request a quote ›',
    'cta.contacter': 'Contact us',
    'cta.envoyer': 'Send my request ›',

    'lang.label': 'Language',
  },

  ar: {
    'nav.home': 'الرئيسية',
    'nav.services': 'الخدمات',
    'nav.solutions': 'حلول الذكاء الاصطناعي',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'nav.cta': 'ابدأ مشروعك',
    'nav.menu': 'القائمة',

    'hero.tag': 'ذكاء اصطناعي محلي · أتمتة · روبوتات محادثة',
    'hero.title.html': 'عملياتك، <span class="text-grad">معززة بالذكاء الاصطناعي</span><br>دون فقدان بياناتك أبداً.',
    'hero.sub.html': 'تصمم NAXA وتنشر حلول <strong>الذكاء الاصطناعي المحلي</strong>، أتمتة الأعمال، وروبوتات المحادثة التي تتكامل مع نشاطك — سيادة كاملة على بياناتك، عائد استثمار قابل للقياس، ومرافقة بشرية في كل مرحلة.',
    'hero.cta.audit': 'تدقيق مجاني ›',
    'hero.cta.solutions': 'اكتشف حلولنا',
    'hero.trust.1': 'بيانات محلية 100٪',
    'hero.trust.2': 'نماذج مفتوحة المصدر',
    'hero.trust.3': 'متوافق مع GDPR / القانون 09-08',

    'stats.1': 'مشاريع منجزة',
    'stats.2': 'مهام متكررة مؤتمتة',
    'stats.3': 'توفر روبوت المحادثة',
    'stats.4': 'بيانات سيادية',

    'footer.brand': 'وكالة رقمية متخصصة في الذكاء الاصطناعي المحلي، أتمتة الأعمال، وروبوتات المحادثة الذكية. مقرها المغرب، في خدمة الشركات الطموحة.',
    'footer.col.services': 'الخدمات',
    'footer.col.entreprise': 'الشركة',
    'footer.col.contact': 'اتصل بنا',
    'footer.copy': '© 2026 NAXA — جميع الحقوق محفوظة.',
    'footer.tag': 'مصمم بشغف · ذكاء اصطناعي محلي · سيادة البيانات',

    'cta.demander': 'اطلب عرض سعر ›',
    'cta.contacter': 'تواصل معنا',
    'cta.envoyer': 'أرسل طلبي ›',

    'lang.label': 'اللغة',
  },
};

const I18N_STORAGE_KEY = 'naxa-lang';
const I18N_DEFAULT = 'fr';
const I18N_SUPPORTED = ['fr', 'en', 'ar'];

function getCurrentLang() {
  const saved = localStorage.getItem(I18N_STORAGE_KEY);
  if (saved && I18N_SUPPORTED.includes(saved)) return saved;
  return I18N_DEFAULT;
}

function applyLang(lang) {
  if (!I18N_SUPPORTED.includes(lang)) lang = I18N_DEFAULT;
  const dict = I18N_DICT[lang];
  const html = document.documentElement;

  html.lang = lang === 'ar' ? 'ar' : lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Applique les traductions sur tout [data-i18n]
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const val = dict[key];
    if (val == null) return;
    // .html → innerHTML, sinon textContent (sécurité par défaut)
    if (key.endsWith('.html')) el.innerHTML = val;
    else el.textContent = val;
  });

  // Applique aux attributs [data-i18n-attr="aria-label:nav.menu"]
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split('|').forEach((pair) => {
      const [attr, key] = pair.split(':');
      const val = dict[key];
      if (val != null) el.setAttribute(attr, val);
    });
  });

  // État des boutons de switch
  document.querySelectorAll('.lang-btn').forEach((b) => {
    const isActive = b.dataset.lang === lang;
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  localStorage.setItem(I18N_STORAGE_KEY, lang);
}

function initI18n() {
  // Bouton clic
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    e.preventDefault();
    applyLang(btn.dataset.lang);
  });
  // Application au chargement
  applyLang(getCurrentLang());
}

// Auto-init dès que le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n);
} else {
  initI18n();
}
