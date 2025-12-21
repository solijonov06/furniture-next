// Suppress Apollo Client deprecation warnings
// This file should be imported at the very top of _app.tsx

const originalError = console.error;
console.error = (...args: any[]) => {
	const msg = String(args[0] || '');
	if (
		msg.includes('go.apollo.dev') ||
		msg.includes('An error occurred!') ||
		msg.includes('canonizeResults') ||
		msg.includes('onCompleted') ||
		msg.includes('cache.diff')
	) {
		return;
	}
	originalError.apply(console, args);
};

export {};





