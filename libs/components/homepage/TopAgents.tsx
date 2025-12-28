import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, FreeMode } from 'swiper';
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
							<Swiper
								className={'top-agents-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={29}
								modules={[Autoplay, FreeMode]}
								freeMode={true}
								autoplay={{
									delay: 0,
									disableOnInteraction: false,
									pauseOnMouseEnter: true,
								}}
								speed={4000}
								loop={true}
							>
								{topAgents.map((agent: Member) => {
									return (
										<SwiperSlide className={'top-agents-slide'} key={agent?._id}>
											<TopAgentCard agent={agent} key={agent?.memberNick} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
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
							<>
								<Box component={'div'} className={'switch-btn swiper-agents-prev'}>
									<ArrowBackIosNewIcon />
								</Box>
								<Box component={'div'} className={'card-wrapper'}>
									<Swiper
										className={'top-agents-swiper'}
										slidesPerView={5}
										spaceBetween={30}
										modules={[Autoplay, Navigation, Pagination, FreeMode]}
										navigation={{
											nextEl: '.swiper-agents-next',
											prevEl: '.swiper-agents-prev',
										}}
										freeMode={{
											enabled: true,
											momentum: true,
											momentumRatio: 0.5,
										}}
										autoplay={{
											delay: 0,
											disableOnInteraction: false,
											pauseOnMouseEnter: true,
											reverseDirection: false,
										}}
										speed={3000}
										loop={true}
										loopAdditionalSlides={5}
										allowTouchMove={true}
										grabCursor={true}
									>
										{topAgents.map((agent: Member) => {
											return (
												<SwiperSlide className={'top-agents-slide'} key={agent?._id}>
													<TopAgentCard agent={agent} key={agent?.memberNick} />
												</SwiperSlide>
											);
										})}
									</Swiper>
								</Box>
								<Box component={'div'} className={'switch-btn swiper-agents-next'}>
									<ArrowBackIosNewIcon />
								</Box>
							</>
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
