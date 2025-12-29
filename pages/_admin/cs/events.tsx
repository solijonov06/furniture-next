import React, { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Button, InputAdornment, Stack } from '@mui/material';
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

// Sample events data - replace with Apollo query when backend is ready
const sampleEvents = [
	{
		_id: '1',
		eventTitle: 'Design Week 2025',
		eventCity: 'New York',
		eventDescription: 'Discover the latest furniture trends!',
		eventImage: '/img/hero/hero-1sofa.webp',
		eventStatus: 'ACTIVE',
		createdAt: '2024-12-25',
	},
	{
		_id: '2',
		eventTitle: 'Furniture Expo',
		eventCity: 'Los Angeles',
		eventDescription: 'Explore premium furniture collections!',
		eventImage: '/img/hero/hero-8armchair.webp',
		eventStatus: 'ACTIVE',
		createdAt: '2024-12-20',
	},
	{
		_id: '3',
		eventTitle: 'Home & Living Fair',
		eventCity: 'Chicago',
		eventDescription: 'Your one-stop destination for home decor!',
		eventImage: '/img/hero/hero-9bed.webp',
		eventStatus: 'HOLD',
		createdAt: '2024-12-15',
	},
];

const AdminEvents: NextPage = () => {
	const router = useRouter();
	const [events] = useState(sampleEvents);
	const [searchInput, setSearchInput] = useState('');
	const [activeTab, setActiveTab] = useState('all');

	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
	};

	const filteredEvents = events.filter((event) => {
		if (activeTab === 'active') return event.eventStatus === 'ACTIVE';
		if (activeTab === 'hold') return event.eventStatus === 'HOLD';
		return true;
	});

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
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
			</Box>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={activeTab}>
						<Box component={'div'}>
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
											{searchInput && <CancelRoundedIcon onClick={() => setSearchInput('')} />}
											<InputAdornment position="end">
												<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>

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
									{filteredEvents.map((event) => (
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
												<Box
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
												</Box>
											</TableCell>
											<TableCell>{event.createdAt}</TableCell>
											<TableCell align="right">
												<Tooltip title="Delete">
													<IconButton>
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
									))}
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
				</Box>
			</Box>
		</Box>
	);
};

export default withAdminLayout(AdminEvents);

