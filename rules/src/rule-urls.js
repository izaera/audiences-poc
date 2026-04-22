const base = 'http://localhost:8001';

export const ruleURLs = {
	// Site scope rules
	'home-site': `${base}/home-site-rules.json`,
	'shopping-site': `${base}/shopping-site-rules.json`,
	'legal-site': `${base}/legal-site-rules.json`,

	// (Site, Page) scope rules
	'home-site/home': `${base}/home-page-rules.json`,
	'shopping-site/products': `${base}/products-page-rules.json`,
	'legal-site/contact': `${base}/contact-page-rules.json`,
	'legal-site/about': `${base}/about-page-rules.json`,
};
