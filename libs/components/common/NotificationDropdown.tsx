import React, { useEffect, useState } from 'react';
import {
	Badge,
	Box,
	CircularProgress,
	Divider,
	IconButton,
	Menu,
	MenuItem,
	Stack,
	Typography,
} from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useQuery, useMutation } from '@apollo/client';
import { GET_NOTIFICATIONS } from '../../../apollo/user/query';
import { UPDATE_NOTIFICATION } from '../../../apollo/user/mutation';
import { Notification, Notifications } from '../../types/notification/notification';
import { NotificationsInquiry } from '../../types/notification/notification.input';
import { NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { REACT_APP_API_URL } from '../../config';
import moment from 'moment';
import { useRouter } from 'next/router';

interface NotificationDropdownProps {
	userId?: string;
}

const NotificationDropdown = ({ userId }: NotificationDropdownProps) => {
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const [notificationsInquiry] = useState<NotificationsInquiry>({
		page: 1,
		limit: 10,
		search: {},
	});

	/** APOLLO REQUESTS **/
	const {
		loading: getNotificationsLoading,
		data: getNotificationsData,
		refetch: getNotificationsRefetch,
	} = useQuery(GET_NOTIFICATIONS, {
		fetchPolicy: 'network-only',
		variables: { input: notificationsInquiry },
		skip: !userId,
		notifyOnNetworkStatusChange: true,
	});

	const [updateNotification] = useMutation(UPDATE_NOTIFICATION);

	/** LIFECYCLES **/
	useEffect(() => {
		if (userId) {
			getNotificationsRefetch({ input: notificationsInquiry });
		}
	}, [userId]);

	/** HANDLERS **/
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleNotificationClick = async (notification: Notification) => {
		// Mark as read if not already
		if (notification.notificationStatus === NotificationStatus.WAIT) {
			try {
				await updateNotification({
					variables: { input: notification._id },
				});
				getNotificationsRefetch({ input: notificationsInquiry });
			} catch (err) {
				console.error('Error updating notification:', err);
			}
		}

		// Navigate based on notification type
		if (notification.propertyId) {
			router.push(`/property/detail?id=${notification.propertyId}`);
		} else if (notification.articleId) {
			router.push(`/community/detail?articleCategory=FREE&id=${notification.articleId}`);
		}
		handleClose();
	};

	const notifications: Notifications = getNotificationsData?.getNotifications;
	const unreadCount = notifications?.list?.filter(
		(n: Notification) => n.notificationStatus === NotificationStatus.WAIT
	).length || 0;

	const getNotificationIcon = (type: NotificationType) => {
		switch (type) {
			case NotificationType.LIKE:
				return <FavoriteIcon sx={{ fontSize: 18, color: '#e91e63' }} />;
			case NotificationType.COMMENT:
				return <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: '#2196f3' }} />;
			default:
				return <NotificationsOutlinedIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />;
		}
	};

	const getTimeAgo = (date: Date) => {
		return moment(date).fromNow();
	};

	return (
		<>
			<IconButton
				onClick={handleClick}
				sx={{
					color: '#fff',
					'&:hover': {
						backgroundColor: 'rgba(255, 255, 255, 0.1)',
					},
				}}
			>
				<Badge badgeContent={unreadCount} color="error" max={99}>
					<NotificationsOutlinedIcon />
				</Badge>
			</IconButton>

			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				PaperProps={{
					sx: {
						width: 360,
						maxHeight: 450,
						mt: 1.5,
						borderRadius: '12px',
						boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
						overflow: 'hidden',
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				{/* Header */}
				<Box sx={{ px: 2, py: 1.5, backgroundColor: '#1E3A5F' }}>
					<Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '16px' }}>
						Notifications
					</Typography>
					{unreadCount > 0 && (
						<Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
							{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
						</Typography>
					)}
				</Box>

				<Divider />

				{/* Notification List */}
				<Box sx={{ maxHeight: 350, overflow: 'auto' }}>
					{getNotificationsLoading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
							<CircularProgress size={30} />
						</Box>
					) : !notifications?.list?.length ? (
						<Box sx={{ textAlign: 'center', py: 4, color: '#9e9e9e' }}>
							<NotificationsOutlinedIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
							<Typography variant="body2">No notifications yet</Typography>
						</Box>
					) : (
						notifications.list.map((notification: Notification) => (
							<MenuItem
								key={notification._id}
								onClick={() => handleNotificationClick(notification)}
								sx={{
									py: 1.5,
									px: 2,
									backgroundColor:
										notification.notificationStatus === NotificationStatus.WAIT
											? 'rgba(30, 58, 95, 0.05)'
											: 'transparent',
									'&:hover': {
										backgroundColor: 'rgba(30, 58, 95, 0.1)',
									},
								}}
							>
								<Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ width: '100%' }}>
									{/* Author Image */}
									<Box
										sx={{
											width: 44,
											height: 44,
											borderRadius: '50%',
											overflow: 'hidden',
											flexShrink: 0,
											position: 'relative',
										}}
									>
										<img
											src={
												notification.authorData?.memberImage
													? `${REACT_APP_API_URL}/${notification.authorData.memberImage}`
													: '/img/profile/defaultUser.svg'
											}
											alt=""
											style={{ width: '100%', height: '100%', objectFit: 'cover' }}
										/>
										{/* Notification Type Icon */}
										<Box
											sx={{
												position: 'absolute',
												bottom: -2,
												right: -2,
												backgroundColor: '#fff',
												borderRadius: '50%',
												p: 0.3,
												boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
											}}
										>
											{getNotificationIcon(notification.notificationType)}
										</Box>
									</Box>

									{/* Content */}
									<Box sx={{ flex: 1, minWidth: 0 }}>
										<Typography
											sx={{
												fontSize: '14px',
												fontWeight: notification.notificationStatus === NotificationStatus.WAIT ? 600 : 400,
												color: '#181a20',
												lineHeight: 1.4,
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												display: '-webkit-box',
												WebkitLineClamp: 2,
												WebkitBoxOrient: 'vertical',
											}}
										>
											<strong>{notification.authorData?.memberNick || 'Someone'}</strong>{' '}
											{notification.notificationTitle}
										</Typography>
										{notification.notificationDesc && (
											<Typography
												sx={{
													fontSize: '12px',
													color: '#717171',
													mt: 0.5,
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
												}}
											>
												"{notification.notificationDesc}"
											</Typography>
										)}
										<Typography sx={{ fontSize: '11px', color: '#9e9e9e', mt: 0.5 }}>
											{getTimeAgo(notification.createdAt)}
										</Typography>
									</Box>

									{/* Unread Indicator */}
									{notification.notificationStatus === NotificationStatus.WAIT && (
										<Box
											sx={{
												width: 8,
												height: 8,
												borderRadius: '50%',
												backgroundColor: '#D4A853',
												flexShrink: 0,
												mt: 1,
											}}
										/>
									)}
								</Stack>
							</MenuItem>
						))
					)}
				</Box>
			</Menu>
		</>
	);
};

export default NotificationDropdown;

