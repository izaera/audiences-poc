import { segments } from 'http://localhost:8000/audiences-api.js';

// TODO: Debug feature (should be removed in production)
window.debug = {
  segments: () => [...segments.get()].join(', '),
  clear: () => segments.clear(),
};

////////////////////////////////////////////////////////////////////////////////////////////////////
//
// APPLY RULES (DETECTION) PHASE
//
////////////////////////////////////////////////////////////////////////////////////////////////////
await segments.runDetection('http://localhost:8001/rules.json');

////////////////////////////////////////////////////////////////////////////////////////////////////
//
// REGISTER PERSONALIZATION HANDLERS PHASE
//
////////////////////////////////////////////////////////////////////////////////////////////////////

console.log(`Registering personalization handlers...`);

segments.on('spanish_language', function showSpanishLanguageHint() {
  if (document.location.pathname != '/') {
    return;
  }

  const div = document.getElementById('language-hint');

  if (!div) return;

  div.innerHTML = `
¡Vemos que habla español! ¿Desea ver la web en su idioma?
  `;
});

segments.on('entered_shopping_site_from_google', function showOfferOfTheDay() {
  if (
    document.location.pathname != '/' &&
    document.location.pathname != '/shopping-site/products'
  ) {
    return;
  }

  const div = document.getElementById('shopping-hint');

  if (!div) return;

  div.innerHTML = `
Limited offer of the day: Pro subscription for half its price (that's 6€) during one year!
`;
});

segments.on('entered_legal_site_from_google', function showLeaveReviewPrompt() {
  if (!document.location.pathname.startsWith('/legal-site/')) {
    return;
  }

  const div = document.getElementById('legal-hint');

  if (!div) return;

  div.innerHTML = `
Hey! Good morning! Do you think you could leave a 5 start review in Google for our site?
We are running out of money... 😔
`;
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//
// RUN PERSONALIZATION HANDLERS PHASE
//
////////////////////////////////////////////////////////////////////////////////////////////////////
console.log(`Running personalization handlers...`);

await segments.runHandlers();
