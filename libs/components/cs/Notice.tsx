import React, { useEffect, useState } from 'react';
import { Stack, Box, Pagination, CircularProgress } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { GET_NOTICES } from '../../../apollo/user/query';
import { Notice as NoticeType, NoticeCategory, Notices } from '../../types/cs/notice';
import { NoticesInquiry } from '../../types/cs/notice.input';
import moment from 'moment';

const Notice = () => {
	const device = useDeviceDetect();
	const [noticesInquiry, setNoticesInquiry] = useState<NoticesInquiry>({
		page: 1,
		limit: 10,
		search: {},
	});

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
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getNoticesRefetch({ input: noticesInquiry });
	}, [noticesInquiry]);

	/** HANDLERS **/
	const paginationHandler = (e: any, value: number) => {
		setNoticesInquiry({ ...noticesInquiry, page: value });
	};

	const notices: Notices = getNoticesData?.getNotices;
	const total = notices?.metaCounter?.[0]?.total ?? 0;

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
						{getNoticesLoading ? (
							<Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
								<CircularProgress />
							</Box>
						) : notices?.list?.length === 0 ? (
							<Box className={'no-data'} sx={{ textAlign: 'center', padding: '40px', color: '#717171' }}>
								No notices available
							</Box>
						) : (
							notices?.list?.map((notice: NoticeType, index: number) => {
								const isEvent = notice.noticeCategory === NoticeCategory.EVENT;
								const isPromotion = notice.noticeCategory === NoticeCategory.PROMOTION;
								return (
									<div
										className={`notice-card ${isEvent ? 'event' : ''} ${isPromotion ? 'promotion' : ''}`}
										key={notice._id}
									>
										{isEvent ? (
											<div className={'badge event'}>EVENT</div>
										) : isPromotion ? (
											<div className={'badge promotion'}>PROMO</div>
										) : (
											<span className={'notice-number'}>
												{(noticesInquiry.page - 1) * noticesInquiry.limit + index + 1}
											</span>
										)}
										<span className={'notice-title'}>{notice.noticeTitle}</span>
										<span className={'notice-date'}>{moment(notice.createdAt).format('DD.MM.YYYY')}</span>
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
