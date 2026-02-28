import React, { useRef, useState } from 'react';
import { Stack, IconButton } from '@mui/material';
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
		<Stack className="video-showcase-full">
			{/* Video Container - Full Width */}
			<div className="video-wrapper">
				<video
					ref={videoRef}
					className="showcase-video"
					autoPlay
					loop
					muted
					playsInline
				>
					<source src="/img/video/furniture-showcase.mp4" type="video/mp4" />
					Your browser does not support the video tag.
				</video>

				{/* Minimal Video Controls */}
				<div className="video-controls">
					<IconButton onClick={togglePlay} className="control-btn">
						{isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
					</IconButton>
					<IconButton onClick={toggleMute} className="control-btn">
						{isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
					</IconButton>
				</div>
			</div>
		</Stack>
	);
};

export default VideoShowcase;
