// Locale utilisée par défaut
const defaultLocale = "en";

// Locale active
let locale;

// Contient les traductions actives
let translations = {};



// Quand le contenu de la page est chargé, on traduit la page avec la locale par défaut
document.addEventListener("DOMContentLoaded", () => {
  setLocale(defaultLocale);
  bindLocaleSwitcher(defaultLocale);
});

// Charge les traductions pour une locale donnée et traduit la page selon cette locale
async function setLocale(newLocale) {
  if (newLocale === locale) return;
  const newTranslations =
    await fetchTranslationsFor(newLocale);
  locale = newLocale;
  translations = newTranslations;
  translatePage();
}

// Récupère le JSON contenant les traductions pour la locale donnée
async function fetchTranslationsFor(newLocale) {
  const response = await fetch(`/texts/${newLocale}.json`);
  return await response.json();
}

// Remplace le texte de chaque élément ayant un attribut i18n-key par la traduction appropriée
function translatePage() {
  document
    .querySelectorAll("[i18n-key]")
    .forEach(translateElement);
  
  document.getElementById('add-node-title').placeholder=translations["add-node-title"];
  document.getElementById('add-node-author').placeholder=translations["add-node-author"];
  document.getElementById('add-node-text').placeholder=translations["add-node-text"];
}

// Remplace le texte d'un élément HTML donné par la traduction correspondant au i18n-key de l'élément
function translateElement(element) {
  const key = element.getAttribute("i18n-key");
  const translation = translations[key];
  element.innerHTML = translation;
}

// Quand l'utilisateur sélectionne une nouvelle locale, charge les traductions et met à jour la page 
function bindLocaleSwitcher(initialValue) {
    const switcher =
      document.querySelector("[i18n-switch]");
    switcher.value = initialValue;
    switcher.onchange = (e) => {
      setLocale(e.target.value);
    };
  }