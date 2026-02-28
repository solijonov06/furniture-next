import React, { useEffect, useRef, useState, useCallback } from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRouter } from 'next/router';

interface SlideGroup {
	id: number;
	title: string;
	subtitle: string;
	images: string[];
	cta: string;
	link: string;
}

const slideGroups: SlideGroup[] = [
	{
		id: 1,
		title: 'Living Room Elegance',
		subtitle: 'Sofas, tables & lighting that transform your space',
		images: [
			'/img/hero/hero-1sofa.webp',
			'/img/hero/hero-2table.webp',
			'/img/hero/hero-3tablelamp.webp',
		],
		cta: 'Shop Living Room',
		link: '/property?input={"page":1,"limit":9,"search":{"categoryList":["LIVING_ROOM"]}}',
	},
	{
		id: 2,
		title: 'Modern Comfort',
		subtitle: 'Fans, appliances & essentials for everyday living',
		images: [
			'/img/hero/hero-4fan.webp',
			'/img/hero/hero-5washingmachine.webp',
			'/img/hero/hero-6.webp',
		],
		cta: 'Explore Essentials',
		link: '/property?input={"page":1,"limit":9,"search":{"categoryList":["APPLIANCES"]}}',
	},
	{
		id: 3,
		title: 'Bedroom Sanctuary',
		subtitle: 'Premium beds & armchairs for ultimate relaxation',
		images: [
			'/img/hero/hero-7.webp',
			'/img/hero/hero-8armchair.webp',
			'/img/hero/hero-9bed.webp',
		],
		cta: 'View Bedroom',
		link: '/property?input={"page":1,"limit":9,"search":{"categoryList":["BEDROOM"]}}',
	},
];

const Hero3DCarousel = () => {
	const router = useRouter();
	const containerRef = useRef<HTMLDivElement>(null);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slideGroups.length);
		}, 3500);
		return () => clearInterval(timer);
	}, []);

	const goToNext = useCallback(() => {
		if (isAnimating) return;
		setIsAnimating(true);
		setCurrentSlide((prev) => (prev + 1) % slideGroups.length);
		setTimeout(() => setIsAnimating(false), 1200);
	}, [isAnimating]);

	const goToPrev = useCallback(() => {
		if (isAnimating) return;
		setIsAnimating(true);
		setCurrentSlide((prev) => (prev - 1 + slideGroups.length) % slideGroups.length);
		setTimeout(() => setIsAnimating(false), 1200);
	}, [isAnimating]);

	const goToSlide = (index: number) => {
		if (isAnimating || index === currentSlide) return;
		setIsAnimating(true);
		setCurrentSlide(index);
		setTimeout(() => setIsAnimating(false), 1200);
	};

	const handleCtaClick = (link: string) => {
		router.push(link);
	};

	return (
		<div ref={containerRef} className="hero-3d-carousel">
			{/* Background */}
			<div className="hero-bg-image" />
			<div className="hero-overlay" />
			<div className="hero-grid" />

			{/* Slide Groups */}
			{slideGroups.map((group, groupIndex) => (
				<div
					key={group.id}
					className={`slide-group ${groupIndex === currentSlide ? 'active' : ''}`}
				>
					{/* Images */}
					<div className="images-container">
						{group.images.map((image, imgIndex) => (
							<div
								key={imgIndex}
								className={`hero-image-card ${groupIndex === currentSlide ? 'animate' : ''}`}
								style={{ animationDelay: `${imgIndex * 0.15}s` }}
							>
								<img src={image} alt={`${group.title} ${imgIndex + 1}`} />
							</div>
						))}
					</div>

					{/* Content */}
					<div className={`hero-content ${groupIndex === currentSlide ? 'active' : ''}`}>
						<span className="hero-label">Premium Collection</span>
						<h1 className="hero-title">{group.title}</h1>
						<p className="hero-subtitle">{group.subtitle}</p>
						<button className="hero-cta" onClick={() => handleCtaClick(group.link)}>
							{group.cta}
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path d="M4 10h12M12 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</button>
					</div>
				</div>
			))}

			{/* Vignette */}
			<div className="hero-vignette" />

			{/* Navigation */}
			<IconButton className="hero-nav hero-nav-prev" onClick={goToPrev}>
				<ArrowBackIosNewIcon />
			</IconButton>
			<IconButton className="hero-nav hero-nav-next" onClick={goToNext}>
				<ArrowForwardIosIcon />
			</IconButton>

			{/* Dots */}
			<div className="hero-dots">
				{slideGroups.map((_, index) => (
					<div
						key={index}
						className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
						onClick={() => goToSlide(index)}
					/>
				))}
			</div>
		</div>
	);
};

export default Hero3DCarousel;
