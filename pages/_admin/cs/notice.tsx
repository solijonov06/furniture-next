import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditIcon from '@mui/icons-material/Edit';

// Notice type
interface NoticeData {
	_id: string;
	noticeCategory: string;
	noticeStatus: string;
	noticeTitle: string;
	noticeContent: string;
	noticeImages?: string[];
	createdAt: string;
}

// Default sample notices
const defaultNotices: NoticeData[] = [
	{
		_id: 'default-1',
		noticeCategory: 'GENERAL',
		noticeStatus: 'ACTIVE',
		noticeTitle: 'Welcome to Our Furniture Store',
		noticeContent: 'Welcome to our new furniture website! Explore our wide range of products.',
		createdAt: '2024-12-25',
	},
	{
		_id: 'default-2',
		noticeCategory: 'EVENT',
		noticeStatus: 'ACTIVE',
		noticeTitle: 'New Year Sale - Up to 50% Off',
		noticeContent: 'Celebrate the new year with amazing discounts on all furniture items!',
		createdAt: '2024-12-20',
	},
];

// localStorage key
const NOTICES_STORAGE_KEY = 'furniture_admin_notices';

// Helper functions
const getStoredNotices = (): NoticeData[] => {
	if (typeof window === 'undefined') return defaultNotices;
	const stored = localStorage.getItem(NOTICES_STORAGE_KEY);
	if (!stored) {
		localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(defaultNotices));
		return defaultNotices;
	}
	return JSON.parse(stored);
};

const deleteNotice = (noticeId: string): NoticeData[] => {
	const notices = getStoredNotices();
	const updated = notices.filter((n) => n._id !== noticeId);
	localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(updated));
	return updated;
};

const AdminNotice: NextPage = () => {
	const router = useRouter();
	const [notices, setNotices] = useState<NoticeData[]>([]);
	const [searchInput, setSearchInput] = useState('');
	const [activeTab, setActiveTab] = useState('all');

	// Load notices from localStorage on mount
	useEffect(() => {
		setNotices(getStoredNotices());
	}, []);

	// Listen for changes
	useEffect(() => {
		const handleFocus = () => {
			setNotices(getStoredNotices());
		};
		window.addEventListener('focus', handleFocus);
		return () => window.removeEventListener('focus', handleFocus);
	}, []);

	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
	};

	const handleDelete = (noticeId: string) => {
		if (confirm('Are you sure you want to delete this notice?')) {
			const updated = deleteNotice(noticeId);
			setNotices(updated);
		}
	};

	const filteredNotices = notices.filter((notice) => {
		if (activeTab === 'active' && notice.noticeStatus !== 'ACTIVE') return false;
		if (activeTab === 'hold' && notice.noticeStatus !== 'HOLD') return false;
		
		if (searchInput) {
			const search = searchInput.toLowerCase();
			return (
				notice.noticeTitle.toLowerCase().includes(search) ||
				notice.noticeCategory.toLowerCase().includes(search)
			);
		}
		return true;
	});

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>Notice Management</Typography>
				<Button
					className="btn_add"
					variant={'contained'}
					size={'medium'}
					onClick={() => router.push('/_admin/cs/notice_create')}
				>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					ADD
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
									All ({notices.length})
								</ListItem>
								<ListItem
									onClick={() => handleTabChange('active')}
									value="active"
									className={activeTab === 'active' ? 'li on' : 'li'}
								>
									Active ({notices.filter((n) => n.noticeStatus === 'ACTIVE').length})
								</ListItem>
								<ListItem
									onClick={() => handleTabChange('hold')}
									value="hold"
									className={activeTab === 'hold' ? 'li on' : 'li'}
								>
									Hold ({notices.filter((n) => n.noticeStatus === 'HOLD').length})
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={'title'}>
									<MenuItem value={'title'}>Title</MenuItem>
									<MenuItem value={'category'}>Category</MenuItem>
								</Select>

								<OutlinedInput
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder="Search notices..."
									endAdornment={
										<>
											{searchInput && (
												<CancelRoundedIcon
													onClick={() => setSearchInput('')}
													sx={{ cursor: 'pointer' }}
												/>
											)}
											<InputAdornment position="end">
												<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>

						{/* Notices Table */}
						<TableContainer>
							<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
								<TableHead>
									<TableRow>
										<TableCell padding="checkbox">
											<Checkbox color="primary" />
										</TableCell>
										<TableCell>CATEGORY</TableCell>
										<TableCell>TITLE</TableCell>
										<TableCell>STATUS</TableCell>
										<TableCell>DATE</TableCell>
										<TableCell align="right">ACTION</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{filteredNotices.length === 0 ? (
										<TableRow>
											<TableCell colSpan={6} align="center" sx={{ py: 4 }}>
												<Typography color="text.secondary">No notices found</Typography>
											</TableCell>
										</TableRow>
									) : (
										filteredNotices.map((notice) => (
											<TableRow hover key={notice._id}>
												<TableCell padding="checkbox">
													<Checkbox color="primary" />
												</TableCell>
												<TableCell>
													<Box
														sx={{
															px: 2,
															py: 0.5,
															borderRadius: 1,
															display: 'inline-block',
															backgroundColor: '#e3f2fd',
															color: '#1565c0',
															fontWeight: 600,
															fontSize: '12px',
														}}
													>
														{notice.noticeCategory}
													</Box>
												</TableCell>
												<TableCell>
													<Typography
														sx={{
															maxWidth: 300,
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															whiteSpace: 'nowrap',
														}}
													>
														{notice.noticeTitle}
													</Typography>
												</TableCell>
												<TableCell>
													<Box
														sx={{
															px: 2,
															py: 0.5,
															borderRadius: 1,
															display: 'inline-block',
															backgroundColor:
																notice.noticeStatus === 'ACTIVE' ? '#e8f5e9' : '#fff3e0',
															color:
																notice.noticeStatus === 'ACTIVE' ? '#2e7d32' : '#f57c00',
															fontWeight: 600,
															fontSize: '12px',
														}}
													>
														{notice.noticeStatus}
													</Box>
												</TableCell>
												<TableCell>{notice.createdAt}</TableCell>
												<TableCell align="right">
													<Tooltip title="Delete">
														<IconButton onClick={() => handleDelete(notice._id)}>
															<DeleteRoundedIcon />
														</IconButton>
													</Tooltip>
													<Tooltip title="Edit">
														<IconButton
															onClick={() =>
																router.push(`/_admin/cs/notice_create?id=${notice._id}`)
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
							count={filteredNotices.length}
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

export default withAdminLayout(AdminNotice);
