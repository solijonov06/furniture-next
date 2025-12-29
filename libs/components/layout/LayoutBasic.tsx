import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack, Box } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				breadcrumb = ['Homepage'],
				headerClass = '';

			switch (router.pathname) {
				case '/property':
					title = 'FIND YOUR PERFECT FURNITURE';
					desc = 'Discover premium furnishings with exceptional quality';
					breadcrumb = [];
					headerClass = 'header-property';
					break;
				case '/agent':
					title = 'OUR EXPERT AGENTS';
					desc = 'Connect with trusted professionals';
					breadcrumb = ['Homepage', 'Agents'];
					headerClass = 'header-agent';
					break;
				case '/agent/detail':
					title = 'AGENT PROFILE';
					desc = 'Meet your property specialist';
					breadcrumb = ['Homepage', 'Agents', 'Profile'];
					headerClass = 'header-agent';
					break;
				case '/mypage':
					title = 'MY ACCOUNT';
					desc = 'Manage your profile and preferences';
					breadcrumb = ['Homepage', 'My Page'];
					headerClass = 'header-mypage';
					break;
				case '/community':
					title = 'COMMUNITY';
					desc = 'Join the conversation';
					breadcrumb = ['Homepage', 'Community'];
					headerClass = 'header-community';
					break;
				case '/community/detail':
					title = 'ARTICLE DETAIL';
					desc = 'Community insights';
					breadcrumb = ['Homepage', 'Community', 'Article'];
					headerClass = 'header-community';
					break;
				case '/cs':
					title = 'CUSTOMER SUPPORT';
					desc = 'We are here to help';
					breadcrumb = ['Homepage', 'Support'];
					headerClass = 'header-cs';
					break;
				case '/account/join':
					title = 'JOIN US';
					desc = 'Create your account';
					breadcrumb = ['Homepage', 'Account'];
					headerClass = 'header-auth';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'MEMBER PROFILE';
					desc = 'View member details';
					breadcrumb = ['Homepage', 'Member'];
					headerClass = 'header-member';
					break;
				case '/about':
					title = 'ABOUT US';
					desc = 'Our story and mission';
					breadcrumb = ['Homepage', 'About'];
					headerClass = 'header-about';
					break;
				default:
					break;
			}

			return { title, desc, breadcrumb, headerClass };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Vesta Living</title>
						<meta name={'title'} content={`Vesta Living`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Vesta Living</title>
						<meta name={'title'} content={`Vesta Living`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						{/* Header with Background Image */}
						<Stack className={`header-basic ${memoizedValues.headerClass} ${authHeader && 'auth'}`}>
							<Stack className={'container'}>
								{/* Text content with backdrop */}
								<Box className={'text-content'}>
									{/* Breadcrumb */}
									<Box className={'breadcrumb'}>
										{memoizedValues.breadcrumb.map((item, index) => (
											<React.Fragment key={index}>
												<span>{t(item)}</span>
												{index < memoizedValues.breadcrumb.length - 1 && (
													<span className={'separator'}>&gt;</span>
												)}
											</React.Fragment>
										))}
									</Box>
									
									{/* Title */}
									<strong>{t(memoizedValues.title)}</strong>
									
									{/* Description */}
									<span>{t(memoizedValues.desc)}</span>
								</Box>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
