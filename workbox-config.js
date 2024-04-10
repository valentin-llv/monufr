module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{html,css,js,png,ico,svg,woff2}'
	],
	swDest: 'dist/serviceWorker.js',
	swSrc: "src/serviceWorker/serviceWorker.js",
	injectionPoint: "injectionPoint",
};
