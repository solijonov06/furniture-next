import React, { useEffect, useRef, useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack, Box } from '@mui/material';
import HeaderFilter from '../homepage/HeaderFilter';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);
		const heroRef = useRef<HTMLDivElement>(null);
		const [scrollY, setScrollY] = useState(0);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		// Parallax scroll effect
		useEffect(() => {
			const handleScroll = () => {
				if (heroRef.current) {
					const scrolled = window.scrollY;
					setScrollY(scrolled);
					// Apply parallax to background
					heroRef.current.style.backgroundPositionY = `${scrolled * 0.5}px`;
				}
			};

			window.addEventListener('scroll', handleScroll, { passive: true });
			return () => window.removeEventListener('scroll', handleScroll);
		}, []);

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Nestar</title>
						<meta name={'title'} content={`Nestar`} />
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
						<title>Nestar</title>
						<meta name={'title'} content={`Nestar`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						{/* Hero Section - Furniture Store Style */}
						<Stack 
							className={'header-main'} 
							ref={heroRef}
							style={{
								transform: `translateY(${scrollY * 0.1}px)`,
							}}
						>
							{/* Hero Content */}
							<Stack className={'container'}>
								<Box 
									className={'hero-content'}
									style={{
										opacity: Math.max(0, 1 - scrollY / 600),
										transform: `translateY(${scrollY * 0.15}px)`,
									}}
								>
									{/* Breadcrumb */}
									<Box className={'breadcrumb'}>
										<span>Homepage</span>
										<span className={'separator'}>›</span>
										<span>Products</span>
									</Box>

									{/* Main Title */}
									<h1 className={'hero-title'}>
										DISCOVER TIMELESS FURNITURE. CRAFTED FOR YOUR SPACE.
									</h1>

									{/* Subtitle */}
									<p className={'hero-subtitle'}>
										Explore our curated collection of premium furniture pieces. 
										From modern minimalist to classic elegance — find the perfect fit for your home.
									</p>
								</Box>

								{/* Search Filter */}
								<HeaderFilter />
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

export default withLayoutMain;
