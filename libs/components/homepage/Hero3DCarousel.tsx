import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRouter } from 'next/router';

/**
 * HERO 3D CAROUSEL - 9 Images (3 per slide)
 * 
 * Place your images in: /public/img/hero/
 * Required files:
 *   - hero-1sofa.webp
 *   - hero-2table.webp
 *   - hero-3tablelamp.webp
 *   - hero-4fan.webp
 *   - hero-5washingmachine.webp
 *   - hero-6.webp
 *   - hero-7.webp
 *   - hero-8armchair.webp
 *   - hero-9bed.webp
 */

interface SlideGroup {
	id: number;
	title: string;
	subtitle: string;
	images: string[];
	cta: string;
	link: string;
}

// 3 slides, each with 3 images
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
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	// Auto-play - runs continuously every 3.5 seconds
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slideGroups.length);
		}, 3500);
		return () => clearInterval(timer);
	}, []);

	// Mouse parallax effect
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!containerRef.current) return;
			const { clientX, clientY } = e;
			const { innerWidth, innerHeight } = window;
			setMousePos({
				x: (clientX - innerWidth / 2) / innerWidth,
				y: (clientY - innerHeight / 2) / innerHeight,
			});
		};
		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
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
		<Box
			ref={containerRef}
			className="hero-3d-carousel"
			sx={{
				position: 'relative',
				width: '100%',
				height: '100vh',
				minHeight: '700px',
				overflow: 'hidden',
				background: 'linear-gradient(135deg, #0D1B2A 0%, #1E3A5F 50%, #0D1B2A 100%)',
				perspective: '1500px',
				transformStyle: 'preserve-3d',
			}}
		>
			{/* Beautiful Background Image Layer */}
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundImage: 'url(/img/hero/hero-1sofa.webp)',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					opacity: 0.15,
					filter: 'blur(2px)',
					transform: 'scale(1.1)',
				}}
			/>

			{/* Elegant Geometric Pattern Overlay */}
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.4,
					background: `
						radial-gradient(circle at 20% 80%, rgba(212, 168, 83, 0.1) 0%, transparent 50%),
						radial-gradient(circle at 80% 20%, rgba(212, 168, 83, 0.08) 0%, transparent 40%),
						radial-gradient(circle at 40% 40%, rgba(30, 58, 95, 0.2) 0%, transparent 60%)
					`,
					pointerEvents: 'none',
				}}
			/>

			{/* Animated Background Grid */}
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundImage: `
						linear-gradient(rgba(212, 168, 83, 0.04) 1px, transparent 1px),
						linear-gradient(90deg, rgba(212, 168, 83, 0.04) 1px, transparent 1px)
					`,
					backgroundSize: '80px 80px',
					animation: 'gridMove 30s linear infinite',
					'@keyframes gridMove': {
						'0%': { transform: 'translate(0, 0)' },
						'100%': { transform: 'translate(80px, 80px)' },
					},
				}}
			/>

			{/* Floating Light Orbs */}
			<Box
				sx={{
					position: 'absolute',
					top: '10%',
					left: '10%',
					width: '400px',
					height: '400px',
					background: 'radial-gradient(circle, rgba(212, 168, 83, 0.15) 0%, transparent 70%)',
					borderRadius: '50%',
					filter: 'blur(60px)',
					animation: 'floatOrb1 15s ease-in-out infinite',
					pointerEvents: 'none',
					'@keyframes floatOrb1': {
						'0%, 100%': { transform: 'translate(0, 0) scale(1)' },
						'50%': { transform: 'translate(50px, 30px) scale(1.1)' },
					},
				}}
			/>
			<Box
				sx={{
					position: 'absolute',
					bottom: '20%',
					right: '15%',
					width: '300px',
					height: '300px',
					background: 'radial-gradient(circle, rgba(30, 58, 95, 0.2) 0%, transparent 70%)',
					borderRadius: '50%',
					filter: 'blur(50px)',
					animation: 'floatOrb2 12s ease-in-out infinite',
					pointerEvents: 'none',
					'@keyframes floatOrb2': {
						'0%, 100%': { transform: 'translate(0, 0) scale(1)' },
						'50%': { transform: 'translate(-40px, -20px) scale(0.9)' },
					},
				}}
			/>

			{/* Floating Particles */}
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					pointerEvents: 'none',
					zIndex: 1,
				}}
			>
				{[...Array(15)].map((_, i) => (
					<Box
						key={i}
						sx={{
							position: 'absolute',
							width: `${3 + Math.random() * 4}px`,
							height: `${3 + Math.random() * 4}px`,
							backgroundColor: 'rgba(212, 168, 83, 0.4)',
							borderRadius: '50%',
							left: `${10 + (i * 6)}%`,
							top: `${20 + (i * 5) % 60}%`,
							animation: `particle${i % 3} ${8 + i * 0.5}s ease-in-out infinite`,
							animationDelay: `${i * 0.3}s`,
							'@keyframes particle0': {
								'0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: 0.4 },
								'50%': { transform: 'translate(30px, -40px) scale(1.2)', opacity: 0.8 },
							},
							'@keyframes particle1': {
								'0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: 0.3 },
								'50%': { transform: 'translate(-25px, 35px) scale(0.8)', opacity: 0.6 },
							},
							'@keyframes particle2': {
								'0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: 0.5 },
								'50%': { transform: 'translate(20px, 25px) scale(1.1)', opacity: 0.9 },
							},
						}}
					/>
				))}
			</Box>

			{/* Slide Groups */}
			{slideGroups.map((group, groupIndex) => (
				<Box
					key={group.id}
					className={`slide-group ${groupIndex === currentSlide ? 'active' : ''}`}
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						opacity: groupIndex === currentSlide ? 1 : 0,
						visibility: groupIndex === currentSlide ? 'visible' : 'hidden',
						transition: 'opacity 1s ease, visibility 1s ease',
						zIndex: groupIndex === currentSlide ? 10 : 1,
					}}
				>
					{/* 3 Images Container */}
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: `translate(-50%, -50%) rotateY(${mousePos.x * 5}deg) rotateX(${-mousePos.y * 5}deg)`,
							display: 'flex',
							gap: { xs: '15px', md: '30px' },
							transformStyle: 'preserve-3d',
							transition: 'transform 0.3s ease-out',
							zIndex: 5,
						}}
					>
						{group.images.map((image, imgIndex) => (
							<Box
								key={imgIndex}
								className={`hero-image-card ${groupIndex === currentSlide ? 'animate' : ''}`}
								sx={{
									width: { xs: '100px', sm: '180px', md: '280px', lg: '320px' },
									height: { xs: '140px', sm: '250px', md: '380px', lg: '440px' },
									borderRadius: '20px',
									overflow: 'hidden',
									boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(212, 168, 83, 0.2)',
									transform: groupIndex === currentSlide
										? `translateZ(${50 - imgIndex * 20}px) rotateY(${(imgIndex - 1) * -8}deg)`
										: 'translateZ(-100px) scale(0.8)',
									opacity: groupIndex === currentSlide ? 1 : 0,
									transition: `all 1s cubic-bezier(0.4, 0, 0.2, 1) ${imgIndex * 0.15}s`,
									position: 'relative',
									'&::before': {
										content: '""',
										position: 'absolute',
										top: 0,
										left: 0,
										right: 0,
										bottom: 0,
										background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6) 100%)',
										zIndex: 2,
									},
									'&::after': {
										content: '""',
										position: 'absolute',
										top: '-50%',
										left: '-50%',
										width: '200%',
										height: '200%',
										background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
										transform: 'rotate(45deg)',
										animation: groupIndex === currentSlide ? 'shimmer 3s ease-in-out infinite' : 'none',
										animationDelay: `${imgIndex * 0.5}s`,
										zIndex: 3,
									},
									'@keyframes shimmer': {
										'0%': { transform: 'rotate(45deg) translateX(-100%)' },
										'100%': { transform: 'rotate(45deg) translateX(100%)' },
									},
									'&:hover': {
										transform: groupIndex === currentSlide
											? `translateZ(${70 - imgIndex * 20}px) rotateY(${(imgIndex - 1) * -8}deg) scale(1.05)`
											: 'translateZ(-100px) scale(0.8)',
										boxShadow: '0 35px 100px rgba(0, 0, 0, 0.6), 0 0 60px rgba(212, 168, 83, 0.4)',
									},
								}}
							>
								<img
									src={image}
									alt={`${group.title} ${imgIndex + 1}`}
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										transition: 'transform 0.5s ease',
									}}
									onMouseEnter={(e) => {
										(e.target as HTMLImageElement).style.transform = 'scale(1.1)';
									}}
									onMouseLeave={(e) => {
										(e.target as HTMLImageElement).style.transform = 'scale(1)';
									}}
								/>
								{/* No more number badges on images */}
							</Box>
						))}
					</Box>

					{/* Content Overlay */}
					<Box
						sx={{
							position: 'absolute',
							bottom: { xs: '100px', md: '120px' },
							left: '50%',
							transform: 'translateX(-50%)',
							textAlign: 'center',
							zIndex: 15,
							opacity: groupIndex === currentSlide ? 1 : 0,
							transition: 'opacity 0.8s ease 0.3s',
						}}
					>
						<Typography
							sx={{
								fontSize: { xs: '12px', md: '14px' },
								fontWeight: 600,
								letterSpacing: '4px',
								textTransform: 'uppercase',
								color: '#D4A853',
								mb: 2,
								animation: groupIndex === currentSlide ? 'fadeInUp 0.8s ease 0.4s both' : 'none',
								'@keyframes fadeInUp': {
									from: { opacity: 0, transform: 'translateY(30px)' },
									to: { opacity: 1, transform: 'translateY(0)' },
								},
							}}
						>
							Premium Collection
						</Typography>
						<Typography
							variant="h1"
							sx={{
								fontSize: { xs: '28px', sm: '40px', md: '56px', lg: '64px' },
								fontWeight: 700,
								color: '#fff',
								mb: 2,
								textShadow: '0 4px 30px rgba(0,0,0,0.5)',
								fontFamily: "'Oswald', sans-serif",
								letterSpacing: '-1px',
								animation: groupIndex === currentSlide ? 'fadeInUp 0.8s ease 0.5s both' : 'none',
							}}
						>
							{group.title}
						</Typography>
						<Typography
							sx={{
								fontSize: { xs: '14px', md: '18px' },
								color: 'rgba(255,255,255,0.8)',
								mb: 4,
								maxWidth: '600px',
								mx: 'auto',
								animation: groupIndex === currentSlide ? 'fadeInUp 0.8s ease 0.6s both' : 'none',
							}}
						>
							{group.subtitle}
						</Typography>
						<Box
							component="button"
							onClick={() => handleCtaClick(group.link)}
							sx={{
								px: { xs: 4, md: 6 },
								py: { xs: 1.5, md: 2 },
								fontSize: { xs: '14px', md: '16px' },
								fontWeight: 600,
								color: '#0D1B2A',
								background: 'linear-gradient(135deg, #D4A853, #E4B863)',
								border: 'none',
								borderRadius: '50px',
								cursor: 'pointer',
								transition: 'all 0.4s ease',
								boxShadow: '0 10px 40px rgba(212, 168, 83, 0.4)',
								display: 'inline-flex',
								alignItems: 'center',
								gap: '10px',
								animation: groupIndex === currentSlide ? 'fadeInUp 0.8s ease 0.7s both' : 'none',
								'&:hover': {
									transform: 'translateY(-3px) scale(1.02)',
									boxShadow: '0 15px 50px rgba(212, 168, 83, 0.6)',
									background: 'linear-gradient(135deg, #E4B863, #F4C873)',
								},
							}}
						>
							{group.cta}
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path
									d="M4 10h12M12 4l6 6-6 6"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</Box>
					</Box>
				</Box>
			))}

			{/* Vignette Overlay */}
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					background: 'radial-gradient(circle at center, transparent 30%, rgba(13, 27, 42, 0.8) 100%)',
					pointerEvents: 'none',
					zIndex: 12,
				}}
			/>

			{/* Navigation Arrows */}
			<IconButton
				onClick={goToPrev}
				sx={{
					position: 'absolute',
					left: { xs: '15px', md: '40px' },
					top: '50%',
					transform: 'translateY(-50%)',
					width: { xs: '50px', md: '60px' },
					height: { xs: '50px', md: '60px' },
					backgroundColor: 'rgba(255,255,255,0.1)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(212, 168, 83, 0.3)',
					color: '#fff',
					zIndex: 20,
					transition: 'all 0.3s ease',
					'&:hover': {
						backgroundColor: 'rgba(212, 168, 83, 0.3)',
						borderColor: '#D4A853',
						transform: 'translateY(-50%) scale(1.1)',
					},
				}}
			>
				<ArrowBackIosNewIcon sx={{ fontSize: { xs: '20px', md: '24px' } }} />
			</IconButton>

			<IconButton
				onClick={goToNext}
				sx={{
					position: 'absolute',
					right: { xs: '15px', md: '40px' },
					top: '50%',
					transform: 'translateY(-50%)',
					width: { xs: '50px', md: '60px' },
					height: { xs: '50px', md: '60px' },
					backgroundColor: 'rgba(255,255,255,0.1)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(212, 168, 83, 0.3)',
					color: '#fff',
					zIndex: 20,
					transition: 'all 0.3s ease',
					'&:hover': {
						backgroundColor: 'rgba(212, 168, 83, 0.3)',
						borderColor: '#D4A853',
						transform: 'translateY(-50%) scale(1.1)',
					},
				}}
			>
				<ArrowForwardIosIcon sx={{ fontSize: { xs: '20px', md: '24px' } }} />
			</IconButton>

			{/* Pagination Dots Only - No numbers, no scroll text */}
			<Box
				sx={{
					position: 'absolute',
					bottom: '40px',
					left: '50%',
					transform: 'translateX(-50%)',
					display: 'flex',
					gap: '15px',
					zIndex: 20,
				}}
			>
				{slideGroups.map((_, index) => (
					<Box
						key={index}
						onClick={() => goToSlide(index)}
						sx={{
							width: index === currentSlide ? '40px' : '12px',
							height: '12px',
							borderRadius: '6px',
							backgroundColor: index === currentSlide ? '#D4A853' : 'rgba(255,255,255,0.3)',
							cursor: 'pointer',
							transition: 'all 0.4s ease',
							'&:hover': {
								backgroundColor: index === currentSlide ? '#E4B863' : 'rgba(255,255,255,0.5)',
							},
						}}
					/>
				))}
			</Box>
		</Box>
	);
};

export default Hero3DCarousel;
