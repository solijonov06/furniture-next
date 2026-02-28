import React, { useState, useEffect } from 'react';
import { Stack, Box, CircularProgress } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { GET_EVENTS } from '../../../apollo/user/query';
import { Event, EventStatus } from '../../types/event/event';
import { EventsInquiry } from '../../types/event/event.input';
import { Direction } from '../../types/common';
import { useRouter } from 'next/router';

// localStorage key (same as admin)
const EVENTS_STORAGE_KEY = 'furniture_admin_events';

// Get events from localStorage
const getLocalStorageEvents = (): Event[] => {
	if (typeof window === 'undefined') return [];
	const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
	if (!stored) return [];
	const events = JSON.parse(stored);
	// Only return ACTIVE events
	return events.filter((e: any) => e.eventStatus === 'ACTIVE');
};

// Fallback data if no events from backend or localStorage
const fallbackEvents = [
	{
		_id: '1',
		eventTitle: 'Design Week 2025',
		eventCity: 'New York',
		eventDescription: 'Discover the latest furniture trends and meet top designers at the annual Design Week!',
		eventImage: '/img/hero/hero-1sofa.webp',
		eventStatus: EventStatus.ACTIVE,
	},
	{
		_id: '2',
		eventTitle: 'Furniture Expo',
		eventCity: 'Los Angeles',
		eventDescription: 'Explore premium furniture collections from leading brands around the world!',
		eventImage: '/img/hero/hero-8armchair.webp',
		eventStatus: EventStatus.ACTIVE,
	},
	{
		_id: '3',
		eventTitle: 'Home & Living Fair',
		eventCity: 'Chicago',
		eventDescription: 'Your one-stop destination for home decor inspiration and exclusive deals!',
		eventImage: '/img/hero/hero-9bed.webp',
		eventStatus: EventStatus.ACTIVE,
	},
	{
		_id: '4',
		eventTitle: 'Artisan Craft Show',
		eventCity: 'Houston',
		eventDescription: 'Meet the craftsmen behind handmade furniture and home accessories!',
		eventImage: '/img/hero/hero-2table.webp',
		eventStatus: EventStatus.ACTIVE,
	},
];

const EventCard = ({ event }: { event: Event }) => {
	const device = useDeviceDetect();
	const router = useRouter();

	const handleClick = () => {
		if (event.eventLink) {
			window.open(event.eventLink, '_blank');
		}
	};

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	}

	return (
		<Stack
			className="event-card"
			onClick={handleClick}
			style={{
				backgroundImage: `url(${event?.eventImage})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				cursor: event.eventLink ? 'pointer' : 'default',
			}}
		>
			<Box component={'div'} className={'info'}>
				<strong>{event?.eventCity}</strong>
				<span>{event?.eventTitle}</span>
			</Box>
			<Box component={'div'} className={'more'}>
				<span>{event?.eventDescription}</span>
			</Box>
		</Stack>
	);
};

const Events = () => {
	const device = useDeviceDetect();
	const [events, setEvents] = useState<Event[]>([]);
	
	// Events inquiry
	const eventsInquiry: EventsInquiry = {
		page: 1,
		limit: 4,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {
			eventStatus: EventStatus.ACTIVE,
		},
	};

	// Apollo query for events
	const {
		loading,
		data: eventsData,
		error,
	} = useQuery(GET_EVENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: eventsInquiry },
		notifyOnNetworkStatusChange: true,
		onError: (error) => {
			console.log('Events query error:', error);
			// Use fallback data on error
			setEvents(fallbackEvents as Event[]);
		},
	});

	useEffect(() => {
		// First, check localStorage for admin-created events
		const localEvents = getLocalStorageEvents();
		
		if (eventsData?.getEvents?.list?.length > 0) {
			// Backend data available - combine with localStorage
			const backendEvents = eventsData.getEvents.list;
			// Merge: localStorage events first, then backend events (avoiding duplicates)
			const mergedEvents = [...localEvents];
			backendEvents.forEach((be: Event) => {
				if (!mergedEvents.find((le) => le._id === be._id)) {
					mergedEvents.push(be);
				}
			});
			setEvents(mergedEvents.slice(0, 4)); // Limit to 4 events
		} else if (!loading) {
			// No backend data - use localStorage or fallback
			if (localEvents.length > 0) {
				setEvents(localEvents.slice(0, 4));
			} else {
				setEvents(fallbackEvents as Event[]);
			}
		}
	}, [eventsData, loading]);

	if (device === 'mobile') {
		return <div>EVENTS</div>;
	}

	return (
		<Stack className={'events'}>
			<Stack className={'container'}>
				<Stack className={'info-box'}>
					<Box component={'div'} className={'left'}>
						<span className={'white'}>Events</span>
						<p className={'white'}>Events waiting your attention!</p>
					</Box>
				</Stack>
				<Stack className={'card-wrapper'}>
					{loading ? (
						<div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '80px 0' }}>
							<CircularProgress sx={{ color: '#D4A853' }} />
						</div>
					) : (
						events.map((event: Event) => (
							<EventCard event={event} key={event?._id} />
						))
					)}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Events;
