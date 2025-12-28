import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import TopAgentCard from './TopAgentCard';
import { Member } from '../../types/member/member';
import { AgentsInquiry } from '../../types/member/member.input';
import { useQuery } from '@apollo/client';
import { GET_AGENTS } from '../../../apollo/user/query';

interface TopAgentsProps {
	initialInput: AgentsInquiry;
}

const TopAgents = (props: TopAgentsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [topAgents, setTopAgents] = useState<Member[]>([]);
	const [isPaused, setIsPaused] = useState(false);
	const sliderRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);

	/** APOLLO REQUESTS **/
	const {
		loading: getAgentsLoading,
		data: getAgentsData,
		error: getAgentsError,
		refetch: getAgentsRefetch,
	} = useQuery(GET_AGENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
	});

	useEffect(() => {
		if (getAgentsData?.getAgents?.list) {
			setTopAgents(getAgentsData.getAgents.list);
		}
	}, [getAgentsData]);

	// Touch/swipe handlers for mobile
	const handleTouchStart = (e: React.TouchEvent) => {
		setIsDragging(true);
		setStartX(e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0));
		setScrollLeft(sliderRef.current?.scrollLeft || 0);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!isDragging) return;
		const x = e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0);
		const walk = (x - startX) * 2;
		if (sliderRef.current) {
			sliderRef.current.scrollLeft = scrollLeft - walk;
		}
	};

	const handleTouchEnd = () => {
		setIsDragging(false);
	};

	// Mouse drag handlers for desktop
	const handleMouseDown = (e: React.MouseEvent) => {
		setIsDragging(true);
		setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
		setScrollLeft(sliderRef.current?.scrollLeft || 0);
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging) return;
		e.preventDefault();
		const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
		const walk = (x - startX) * 2;
		if (sliderRef.current) {
			sliderRef.current.scrollLeft = scrollLeft - walk;
		}
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	if (device === 'mobile') {
		return (
			<Stack className={'top-agents'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top Agents</span>
					</Stack>
					<Stack className={'wrapper'}>
						{topAgents.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								No Top Agents
							</Box>
						) : (
							<Box
								ref={sliderRef}
								className={'agents-slider-container'}
								onTouchStart={handleTouchStart}
								onTouchMove={handleTouchMove}
								onTouchEnd={handleTouchEnd}
								sx={{
									display: 'flex',
									overflowX: 'auto',
									scrollBehavior: 'smooth',
									'&::-webkit-scrollbar': { display: 'none' },
									scrollbarWidth: 'none',
									gap: '20px',
									padding: '20px 0',
								}}
							>
								{topAgents.map((agent: Member) => (
									<Box key={agent?._id} sx={{ flexShrink: 0 }}>
										<TopAgentCard agent={agent} />
									</Box>
								))}
							</Box>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		// Duplicate agents for seamless infinite scroll
		const duplicatedAgents = [...topAgents, ...topAgents, ...topAgents];

		return (
			<Stack className={'top-agents'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Top Agents</span>
							<p>Our Top Agents always ready to serve you</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'} onClick={() => router.push('/agent')} style={{ cursor: 'pointer' }}>
								<span>See All Agents</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'wrapper'}>
						{topAgents.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								No Top Agents
							</Box>
						) : (
							<Box
								className={'infinite-slider-wrapper'}
								onMouseEnter={() => setIsPaused(true)}
								onMouseLeave={() => setIsPaused(false)}
								sx={{
									width: '100%',
									overflow: 'hidden',
									position: 'relative',
									'&::before': {
										content: '""',
										position: 'absolute',
										left: 0,
										top: 0,
										bottom: 0,
										width: '100px',
										background: 'linear-gradient(to right, var(--color-bg-secondary), transparent)',
										zIndex: 2,
										pointerEvents: 'none',
									},
									'&::after': {
										content: '""',
										position: 'absolute',
										right: 0,
										top: 0,
										bottom: 0,
										width: '100px',
										background: 'linear-gradient(to left, var(--color-bg-secondary), transparent)',
										zIndex: 2,
										pointerEvents: 'none',
									},
								}}
							>
								<Box
									ref={sliderRef}
									className={'agents-slider'}
									onMouseDown={handleMouseDown}
									onMouseMove={handleMouseMove}
									onMouseUp={handleMouseUp}
									onMouseLeave={handleMouseUp}
									sx={{
										display: 'flex',
										gap: '30px',
										animation: `infiniteScroll 40s linear infinite`,
										animationPlayState: isPaused ? 'paused' : 'running',
										width: 'fit-content',
										cursor: isDragging ? 'grabbing' : 'grab',
										padding: '20px 0',
										'@keyframes infiniteScroll': {
											'0%': { transform: 'translateX(0)' },
											'100%': { transform: 'translateX(-33.333%)' },
										},
									}}
								>
									{duplicatedAgents.map((agent: Member, index: number) => (
										<Box
											key={`${agent?._id}-${index}`}
											sx={{
												flexShrink: 0,
												transition: 'transform 0.3s ease',
												'&:hover': {
													transform: 'translateY(-5px)',
												},
											}}
										>
											<TopAgentCard agent={agent} />
										</Box>
									))}
								</Box>
							</Box>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopAgents.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopAgents;
