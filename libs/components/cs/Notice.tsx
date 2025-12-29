import React, { useEffect, useState } from 'react';
import { Stack, Box, Pagination, CircularProgress } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { GET_NOTICES } from '../../../apollo/user/query';
import { Notice as NoticeType, NoticeCategory, Notices } from '../../types/cs/notice';
import { NoticesInquiry } from '../../types/cs/notice.input';
import moment from 'moment';

// localStorage key (same as admin)
const NOTICES_STORAGE_KEY = 'furniture_admin_notices';

// Notice data type from localStorage
interface LocalNoticeData {
	_id: string;
	noticeCategory: string;
	noticeStatus: string;
	noticeTitle: string;
	noticeContent: string;
	noticeImages?: string[];
	createdAt: string;
}

// Get notices from localStorage
const getLocalStorageNotices = (): LocalNoticeData[] => {
	if (typeof window === 'undefined') return [];
	const stored = localStorage.getItem(NOTICES_STORAGE_KEY);
	if (!stored) return [];
	const notices = JSON.parse(stored);
	// Only return ACTIVE notices
	return notices.filter((n: LocalNoticeData) => n.noticeStatus === 'ACTIVE');
};

const Notice = () => {
	const device = useDeviceDetect();
	const [localNotices, setLocalNotices] = useState<LocalNoticeData[]>([]);
	const [noticesInquiry, setNoticesInquiry] = useState<NoticesInquiry>({
		page: 1,
		limit: 10,
		search: {},
	});

	// Load localStorage notices
	useEffect(() => {
		setLocalNotices(getLocalStorageNotices());
	}, []);

	/** APOLLO REQUESTS **/
	const {
		loading: getNoticesLoading,
		data: getNoticesData,
		error: getNoticesError,
		refetch: getNoticesRefetch,
	} = useQuery(GET_NOTICES, {
		fetchPolicy: 'network-only',
		variables: { input: noticesInquiry },
		notifyOnNetworkStatusChange: true,
		onError: (error) => {
			console.log('Notices query error, using localStorage data');
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getNoticesRefetch({ input: noticesInquiry });
	}, [noticesInquiry]);

	/** HANDLERS **/
	const paginationHandler = (e: any, value: number) => {
		setNoticesInquiry({ ...noticesInquiry, page: value });
	};

	// Combine backend notices with localStorage notices
	const backendNotices: Notices = getNoticesData?.getNotices;
	const backendList = backendNotices?.list || [];
	
	// Merge: localStorage first, then backend (avoiding duplicates)
	const mergedNotices: (NoticeType | LocalNoticeData)[] = [...localNotices];
	backendList.forEach((bn: NoticeType) => {
		if (!mergedNotices.find((ln) => ln._id === bn._id)) {
			mergedNotices.push(bn);
		}
	});

	const total = mergedNotices.length;
	const startIndex = (noticesInquiry.page - 1) * noticesInquiry.limit;
	const paginatedNotices = mergedNotices.slice(startIndex, startIndex + noticesInquiry.limit);

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	} else {
		return (
			<Stack className={'notice-content'}>
				<span className={'title'}>Notice</span>
				<Stack className={'main'}>
					<Box component={'div'} className={'top'}>
						<span>Number</span>
						<span>Title</span>
						<span>Date</span>
					</Box>
					<Stack className={'bottom'}>
						{getNoticesLoading && localNotices.length === 0 ? (
							<Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
								<CircularProgress />
							</Box>
						) : paginatedNotices.length === 0 ? (
							<Box className={'no-data'} sx={{ textAlign: 'center', padding: '40px', color: '#717171' }}>
								No notices available
							</Box>
						) : (
							paginatedNotices.map((notice, index: number) => {
								const isEvent = notice.noticeCategory === NoticeCategory.EVENT || notice.noticeCategory === 'EVENT';
								const isPromotion = notice.noticeCategory === NoticeCategory.PROMOTION || notice.noticeCategory === 'PROMOTION';
								const isUpdate = notice.noticeCategory === 'UPDATE';
								const isMaintenance = notice.noticeCategory === 'MAINTENANCE';
								
								return (
									<div
										className={`notice-card ${isEvent ? 'event' : ''} ${isPromotion ? 'promotion' : ''} ${isUpdate ? 'update' : ''} ${isMaintenance ? 'maintenance' : ''}`}
										key={notice._id}
									>
										{isEvent ? (
											<div className={'badge event'}>EVENT</div>
										) : isPromotion ? (
											<div className={'badge promotion'}>PROMO</div>
										) : isUpdate ? (
											<div className={'badge update'}>UPDATE</div>
										) : isMaintenance ? (
											<div className={'badge maintenance'}>MAINT</div>
										) : (
											<span className={'notice-number'}>
												{startIndex + index + 1}
											</span>
										)}
										<span className={'notice-title'}>{notice.noticeTitle}</span>
										<span className={'notice-date'}>
											{moment(notice.createdAt).format('DD.MM.YYYY')}
										</span>
									</div>
								);
							})
						)}
					</Stack>
				</Stack>
				{total > noticesInquiry.limit && (
					<Box className={'pagination-box'} sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
						<Pagination
							count={Math.ceil(total / noticesInquiry.limit)}
							page={noticesInquiry.page}
							onChange={paginationHandler}
							color="primary"
						/>
					</Box>
				)}
			</Stack>
		);
	}
};

export default Notice;
