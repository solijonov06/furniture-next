import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Stack, Button, InputAdornment} from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Checkbox,
	IconButton,
	Tooltip,
	Avatar,
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditIcon from '@mui/icons-material/Edit';

// Event type
interface EventData {
	_id: string;
	eventTitle: string;
	eventCity: string;
	eventDescription: string;
	eventImage: string;
	eventLink?: string;
	eventStatus: string;
	createdAt: string;
}

// Default sample events
const defaultEvents: EventData[] = [
	{
		_id: 'default-1',
		eventTitle: 'Design Week 2025',
		eventCity: 'New York',
		eventDescription: 'Discover the latest furniture trends!',
		eventImage: '/img/hero/hero-1sofa.webp',
		eventStatus: 'ACTIVE',
		createdAt: '2024-12-25',
	},
	{
		_id: 'default-2',
		eventTitle: 'Furniture Expo',
		eventCity: 'Los Angeles',
		eventDescription: 'Explore premium furniture collections!',
		eventImage: '/img/hero/hero-8armchair.webp',
		eventStatus: 'ACTIVE',
		createdAt: '2024-12-20',
	},
	{
		_id: 'default-3',
		eventTitle: 'Home & Living Fair',
		eventCity: 'Chicago',
		eventDescription: 'Your one-stop destination for home decor!',
		eventImage: '/img/hero/hero-9bed.webp',
		eventStatus: 'HOLD',
		createdAt: '2024-12-15',
	},
];

// Helper functions for localStorage
const EVENTS_STORAGE_KEY = 'furniture_admin_events';

const getStoredEvents = (): EventData[] => {
	if (typeof window === 'undefined') return defaultEvents;
	const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
	if (!stored) {
		// Initialize with default events
		localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(defaultEvents));
		return defaultEvents;
	}
	return JSON.parse(stored);
};

const deleteEvent = (eventId: string): EventData[] => {
	const events = getStoredEvents();
	const updated = events.filter((e) => e._id !== eventId);
	localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updated));
	return updated;
};

const AdminEvents: NextPage = () => {
	const router = useRouter();
	const [events, setEvents] = useState<EventData[]>([]);
	const [searchInput, setSearchInput] = useState('');
	const [activeTab, setActiveTab] = useState('all');

	// Load events from localStorage on mount
	useEffect(() => {
		setEvents(getStoredEvents());
	}, []);

	// Listen for storage changes (when new event is created)
	useEffect(() => {
		const handleStorageChange = () => {
			setEvents(getStoredEvents());
		};

		window.addEventListener('storage', handleStorageChange);
		
		// Also check on focus (same tab updates)
		const handleFocus = () => {
			setEvents(getStoredEvents());
		};
		window.addEventListener('focus', handleFocus);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			window.removeEventListener('focus', handleFocus);
		};
	}, []);

	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
	};

	const handleDelete = (eventId: string) => {
		if (confirm('Are you sure you want to delete this event?')) {
			const updated = deleteEvent(eventId);
			setEvents(updated);
		}
	};

	const filteredEvents = events.filter((event) => {
		// Filter by tab
		if (activeTab === 'active' && event.eventStatus !== 'ACTIVE') return false;
		if (activeTab === 'hold' && event.eventStatus !== 'HOLD') return false;
		
		// Filter by search
		if (searchInput) {
			const search = searchInput.toLowerCase();
			return (
				event.eventTitle.toLowerCase().includes(search) ||
				event.eventCity.toLowerCase().includes(search)
			);
		}
		return true;
	});

	return (
		<Stack component={'div'} className={'content'}>
			<Stack component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>Events Management</Typography>
				<Button
					className="btn_add"
					variant={'contained'}
					size={'medium'}
					onClick={() => router.push('/_admin/cs/event_create')}
				>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					ADD EVENT
				</Button>
			</Stack>
			<Stack component={'div'} className={'table-wrap'}>
				<Stack component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={activeTab}>
						<Stack component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={() => handleTabChange('all')}
									value="all"
									className={activeTab === 'all' ? 'li on' : 'li'}
								>
									All ({events.length})
								</ListItem>
								<ListItem
									onClick={() => handleTabChange('active')}
									value="active"
									className={activeTab === 'active' ? 'li on' : 'li'}
								>
									Active ({events.filter((e) => e.eventStatus === 'ACTIVE').length})
								</ListItem>
								<ListItem
									onClick={() => handleTabChange('hold')}
									value="hold"
									className={activeTab === 'hold' ? 'li on' : 'li'}
								>
									Hold ({events.filter((e) => e.eventStatus === 'HOLD').length})
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={'title'}>
									<MenuItem value={'title'}>Title</MenuItem>
									<MenuItem value={'city'}>City</MenuItem>
								</Select>

								<OutlinedInput
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder="Search events..."
									endAdornment={
										<>
											{searchInput && <CancelRoundedIcon onClick={() => setSearchInput('')} sx={{ cursor: 'pointer' }} />}
											<InputAdornment position="end">
												<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Stack>

						{/* Events Table */}
						<TableContainer>
							<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
								<TableHead>
									<TableRow>
										<TableCell padding="checkbox">
											<Checkbox color="primary" />
										</TableCell>
										<TableCell>IMAGE</TableCell>
										<TableCell>TITLE</TableCell>
										<TableCell>CITY</TableCell>
										<TableCell>STATUS</TableCell>
										<TableCell>DATE</TableCell>
										<TableCell align="right">ACTION</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{filteredEvents.length === 0 ? (
										<TableRow>
											<TableCell colSpan={7} align="center" sx={{ py: 4 }}>
												<Typography color="text.secondary">No events found</Typography>
											</TableCell>
										</TableRow>
									) : (
										filteredEvents.map((event) => (
											<TableRow hover key={event._id}>
												<TableCell padding="checkbox">
													<Checkbox color="primary" />
												</TableCell>
												<TableCell>
													<Avatar
														variant="rounded"
														src={event.eventImage}
														sx={{ width: 60, height: 60 }}
													/>
												</TableCell>
												<TableCell>{event.eventTitle}</TableCell>
												<TableCell>{event.eventCity}</TableCell>
												<TableCell>
													<Stack
														sx={{
															px: 2,
															py: 0.5,
															borderRadius: 1,
															display: 'inline-block',
															backgroundColor:
																event.eventStatus === 'ACTIVE' ? '#e8f5e9' : '#fff3e0',
															color: event.eventStatus === 'ACTIVE' ? '#2e7d32' : '#f57c00',
															fontWeight: 600,
															fontSize: '12px',
														}}
													>
														{event.eventStatus}
													</Stack>
												</TableCell>
												<TableCell>{event.createdAt}</TableCell>
												<TableCell align="right">
													<Tooltip title="Delete">
														<IconButton onClick={() => handleDelete(event._id)}>
															<DeleteRoundedIcon />
														</IconButton>
													</Tooltip>
													<Tooltip title="Edit">
														<IconButton
															onClick={() =>
																router.push(`/_admin/cs/event_create?id=${event._id}`)
															}
														>
															<EditIcon />
														</IconButton>
													</Tooltip>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</TableContainer>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40]}
							component="div"
							count={filteredEvents.length}
							rowsPerPage={10}
							page={0}
							onPageChange={() => {}}
							onRowsPerPageChange={() => {}}
						/>
					</TabContext>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withAdminLayout(AdminEvents);
