import { segments } from 'http://localhost:8000/audiences-api.js';

// TODO: Debug feature (should be removed in production)
window.debug = {
	segments: () => [...segments.get()].join(', '),
	clear: () => segments.clear(),
};

// We define the page as the first portion in the URL. This is
// completely at user's will. It is not required by the
// framework.
function getSite() {
	return document.location.pathname.split('/').filter(Boolean)[0] || 'home-site';
}
console.log(`Current site is '${getSite()}'`);

// We define the page as the second portion in the URL. This is
// completely at user's will. It is not required by the
// framework.
function getPage() {
	return document.location.pathname.split('/').filter(Boolean)[1] || 'home';
}
console.log(`Current page is '${getPage()}'`);

// We retrieve the URLs of the rules.json files from a remote
// server. This is completely at user's will. The framework
// doesn't impose any restriction on the origin of the URLs.
import { ruleURLs } from 'http://localhost:8001/rule-urls.js';

// We apply rules for site and (site, page). Again, the framework
// doesn't impose any restriction on what rules to apply.
for (let key of [`${getSite()}`, `${getSite()}/${getPage()}`]) {
	const url = ruleURLs[key];

	console.log(`Running detection rules '${url}'...`);
	await segments.runDetection(url);
}

// Now we register the personalizations.
