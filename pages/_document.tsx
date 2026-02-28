import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/favicon.svg" />

				{/* SEO */}
				<meta name="keyword" content={'vesta living, furniture, home decor, home appliances, premium furniture'} />
				<meta
					name={'description'}
					content={
						'Premium furniture and home decor for modern living. Discover handcrafted excellence at Vesta Living - your destination for quality furniture.'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
