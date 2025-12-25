import React, { useRef, useState } from 'react';
import { Stack, Box, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const VideoShowcase = () => {
	const device = useDeviceDetect();
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isPlaying, setIsPlaying] = useState(true);
	const [isMuted, setIsMuted] = useState(true);

	const togglePlay = () => {
		if (videoRef.current) {
			if (isPlaying) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const toggleMute = () => {
		if (videoRef.current) {
			videoRef.current.muted = !isMuted;
			setIsMuted(!isMuted);
		}
	};

	if (device === 'mobile') {
		return null;
	}

	return (
		<Stack className="video-showcase">
			<Stack className="container">
				{/* Section Header */}
				<Box className="video-header">
					<Box className="header-content">
						<span className="video-tag">Featured Collection</span>
						<h2 className="video-title">Experience Craftsmanship</h2>
						<p className="video-subtitle">
							Watch how our artisans bring timeless designs to life with premium materials
						</p>
					</Box>
				</Box>

				{/* Video Container */}
				<Box className="video-container">
					<video
						ref={videoRef}
						className="showcase-video"
						autoPlay
						loop
						muted
						playsInline
						poster="/img/video/video-poster.webp"
					>
						{/* VIDEO FILE PATH: Save your video as /public/img/video/furniture-showcase.mp4 */}
						<source src="/img/video/furniture-showcase.mp4" type="video/mp4" />
						Your browser does not support the video tag.
					</video>

					{/* Video Overlay */}
					<Box className="video-overlay">
						<Box className="overlay-content">
							<h3>Handcrafted with Passion</h3>
							<p>Every piece tells a story of dedication and expertise</p>
						</Box>
					</Box>

					{/* Video Controls */}
					<Box className="video-controls">
						<IconButton onClick={togglePlay} className="control-btn">
							{isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
						</IconButton>
						<IconButton onClick={toggleMute} className="control-btn">
							{isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
						</IconButton>
					</Box>

					{/* Decorative Elements */}
					<Box className="video-badge">
						<span>Premium</span>
						<strong>Collection 2025</strong>
					</Box>
				</Box>

				{/* Feature Cards */}
				<Box className="video-features">
					<Box className="feature-card">
						<span className="feature-number">01</span>
						<h4>Premium Materials</h4>
						<p>Sourced from sustainable forests worldwide</p>
					</Box>
					<Box className="feature-card">
						<span className="feature-number">02</span>
						<h4>Master Craftsmen</h4>
						<p>30+ years of combined expertise</p>
					</Box>
					<Box className="feature-card">
						<span className="feature-number">03</span>
						<h4>Timeless Design</h4>
						<p>Blending tradition with modern aesthetics</p>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

export default VideoShowcase;

