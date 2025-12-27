import React, { useState, useEffect, useCallback } from 'react';
import { Stack, Box, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRouter } from 'next/router';

interface HeroSlide {
	id: number;
	title: string;
	subtitle: string;
	image: string;
	cta: string;
	link: string;
}

/**
 * HERO CAROUSEL IMAGES
 * 
 * Place your hero background images in: /public/img/banner/
 * Required files:
 *   - hero-slide-1.webp (or .jpg/.png) - Living room furniture image
 *   - hero-slide-2.webp (or .jpg/.png) - Bedroom furniture image
 *   - hero-slide-3.webp (or .jpg/.png) - General furniture collection image
 * 
 * Recommended image size: 1920x1080px or larger for best quality
 * Use high-quality furniture photography with good lighting
 */
const slides: HeroSlide[] = [
	{
		id: 1,
		title: 'Handcrafted Excellence',
		subtitle: 'Discover timeless furniture pieces designed for modern living',
		image: '/img/banner/hero-slide-1.webp',
		cta: 'Shop Living Room',
		link: '/property?input={"page":1,"limit":9,"search":{"categoryList":["LIVING_ROOM"]}}',
	},
	{
		id: 2,
		title: 'Comfort Meets Style',
		subtitle: 'Premium materials, exceptional craftsmanship',
		image: '/img/banner/hero-slide-2.webp',
		cta: 'Explore Bedroom',
		link: '/property?input={"page":1,"limit":9,"search":{"categoryList":["BEDROOM"]}}',
	},
	{
		id: 3,
		title: 'Transform Your Space',
		subtitle: 'Curated collections for every room',
		image: '/img/banner/hero-slide-3.webp',
		cta: 'View All Products',
		link: '/property',
	},
];

const HeroCarousel = () => {
	const router = useRouter();
	const [current, setCurrent] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);

	// Auto-play functionality - slides every 3.5 seconds
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrent((prev) => (prev + 1) % slides.length);
		}, 3500);

		return () => clearInterval(timer);
	}, []);

	const goToNext = useCallback(() => {
		if (isTransitioning) return;
		setIsTransitioning(true);
		setCurrent((prev) => (prev + 1) % slides.length);
		setTimeout(() => setIsTransitioning(false), 800);
	}, [isTransitioning]);

	const goToPrev = useCallback(() => {
		if (isTransitioning) return;
		setIsTransitioning(true);
		setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
		setTimeout(() => setIsTransitioning(false), 800);
	}, [isTransitioning]);

	const goToSlide = (index: number) => {
		if (isTransitioning || index === current) return;
		setIsTransitioning(true);
		setCurrent(index);
		setTimeout(() => setIsTransitioning(false), 800);
	};

	const handleCtaClick = (link: string) => {
		router.push(link);
	};

	return (
		<Stack className="hero-carousel">
			{/* Slides Container */}
			<Box className="hero-slides-wrapper">
				{slides.map((slide, index) => (
					<Box
						key={slide.id}
						className={`hero-slide ${index === current ? 'active' : ''} ${
							index < current ? 'prev' : ''
						}`}
						style={{
							backgroundImage: `url(${slide.image})`,
						}}
					>
						{/* Overlay */}
						<Box className="hero-overlay" />

						{/* Content */}
						<Box className="hero-slide-content">
							<span className="hero-tag">Premium Furniture</span>
							<h1 className="hero-slide-title">{slide.title}</h1>
							<p className="hero-slide-subtitle">{slide.subtitle}</p>
							<button
								className="hero-cta-btn"
								onClick={() => handleCtaClick(slide.link)}
							>
								{slide.cta}
								<svg
									className="cta-arrow"
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
								>
									<path
										d="M4 10h12M12 4l6 6-6 6"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						</Box>
					</Box>
				))}
			</Box>

			{/* Navigation Arrows */}
			<IconButton
				className="hero-nav-btn hero-prev-btn"
				onClick={goToPrev}
			>
				<ArrowBackIosNewIcon />
			</IconButton>
			<IconButton
				className="hero-nav-btn hero-next-btn"
				onClick={goToNext}
			>
				<ArrowForwardIosIcon />
			</IconButton>

			{/* Pagination Dots */}
			<Box className="hero-pagination">
				{slides.map((_, index) => (
					<button
						key={index}
						className={`hero-dot ${index === current ? 'active' : ''}`}
						onClick={() => goToSlide(index)}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</Box>

			{/* Scroll Indicator */}
			<Box className="hero-scroll-indicator">
				<Box className="scroll-line" />
				<span>Scroll</span>
			</Box>
		</Stack>
	);
};

export default HeroCarousel;

