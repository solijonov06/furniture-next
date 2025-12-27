import React, { useEffect, useState } from 'react';
import {
	Badge,
	Box,
	Button,
	CircularProgress,
	Divider,
	IconButton,
	Menu,
	MenuItem,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useQuery, useMutation } from '@apollo/client';
import { GET_NOTIFICATIONS, GET_UNREAD_NOTIFICATION_COUNT } from '../../../apollo/user/query';
import { UPDATE_NOTIFICATION, MARK_ALL_NOTIFICATIONS_AS_READ, DELETE_NOTIFICATION } from '../../../apollo/user/mutation';
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
		limit: 20,
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

	const {
		data: unreadCountData,
		refetch: refetchUnreadCount,
	} = useQuery(GET_UNREAD_NOTIFICATION_COUNT, {
		fetchPolicy: 'network-only',
		skip: !userId,
	});

	const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
	const [markAllAsRead] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ);
	const [deleteNotification] = useMutation(DELETE_NOTIFICATION);

	/** LIFECYCLES **/
	useEffect(() => {
		if (userId) {
			getNotificationsRefetch({ input: notificationsInquiry });
			refetchUnreadCount();
		}
	}, [userId]);

	// Refetch every 30 seconds for real-time updates
	useEffect(() => {
		if (!userId) return;
		const interval = setInterval(() => {
			refetchUnreadCount();
		}, 30000);
		return () => clearInterval(interval);
	}, [userId]);

	/** HANDLERS **/
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		// Refetch notifications when opening
		getNotificationsRefetch({ input: notificationsInquiry });
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
				refetchUnreadCount();
			} catch (err) {
				console.error('Error updating notification:', err);
			}
		}

		// Navigate based on notification type
		if (notification.propertyId) {
			router.push(`/property/detail?id=${notification.propertyId}`);
		} else if (notification.articleId) {
			router.push(`/community/detail?articleCategory=FREE&id=${notification.articleId}`);
		} else if (notification.authorData?._id) {
			router.push(`/member?memberId=${notification.authorData._id}`);
		}
		handleClose();
	};

	const handleMarkAllAsRead = async (e: React.MouseEvent) => {
		e.stopPropagation();
		try {
			await markAllAsRead();
			getNotificationsRefetch({ input: notificationsInquiry });
			refetchUnreadCount();
		} catch (err) {
			console.error('Error marking all as read:', err);
		}
	};

	const handleDeleteNotification = async (e: React.MouseEvent, notificationId: string) => {
		e.stopPropagation();
		try {
			await deleteNotification({
				variables: { input: notificationId },
			});
			getNotificationsRefetch({ input: notificationsInquiry });
			refetchUnreadCount();
		} catch (err) {
			console.error('Error deleting notification:', err);
		}
	};

	const notifications: Notifications = getNotificationsData?.getNotifications;
	const unreadCount = unreadCountData?.getUnreadNotificationCount || 0;

	const getNotificationIcon = (type: NotificationType) => {
		switch (type) {
			case NotificationType.LIKE:
				return <FavoriteIcon sx={{ fontSize: 16, color: '#e91e63' }} />;
			case NotificationType.COMMENT:
				return <ChatBubbleOutlineIcon sx={{ fontSize: 16, color: '#2196f3' }} />;
			case NotificationType.FOLLOW:
				return <PersonAddIcon sx={{ fontSize: 16, color: '#4caf50' }} />;
			default:
				return <NotificationsOutlinedIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />;
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
				<Badge 
					badgeContent={unreadCount} 
					color="error" 
					max={99}
					sx={{
						'& .MuiBadge-badge': {
							backgroundColor: '#D4A853',
							color: '#0D1B2A',
							fontWeight: 700,
						}
					}}
				>
					<NotificationsOutlinedIcon />
				</Badge>
			</IconButton>

			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				PaperProps={{
					sx: {
						width: 380,
						maxHeight: 500,
						mt: 1.5,
						borderRadius: '16px',
						boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
						overflow: 'hidden',
						border: '1px solid rgba(212, 168, 83, 0.1)',
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				{/* Header */}
				<Box sx={{ 
					px: 2.5, 
					py: 2, 
					background: 'linear-gradient(135deg, #1E3A5F 0%, #0D1B2A 100%)',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}>
					<Box>
						<Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '18px' }}>
							Notifications
						</Typography>
						{unreadCount > 0 && (
							<Typography sx={{ fontSize: '12px', color: '#D4A853' }}>
								{unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
							</Typography>
						)}
					</Box>
					{unreadCount > 0 && (
						<Tooltip title="Mark all as read">
							<IconButton 
								onClick={handleMarkAllAsRead}
								sx={{ 
									color: '#D4A853',
									'&:hover': { backgroundColor: 'rgba(212, 168, 83, 0.1)' }
								}}
							>
								<DoneAllIcon fontSize="small" />
							</IconButton>
						</Tooltip>
					)}
				</Box>

				<Divider />

				{/* Notification List */}
				<Box sx={{ maxHeight: 380, overflow: 'auto' }}>
					{getNotificationsLoading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
							<CircularProgress size={32} sx={{ color: '#D4A853' }} />
						</Box>
					) : !notifications?.list?.length ? (
						<Box sx={{ textAlign: 'center', py: 6, color: '#9e9e9e' }}>
							<NotificationsOutlinedIcon sx={{ fontSize: 56, mb: 1.5, opacity: 0.4 }} />
							<Typography variant="body1" fontWeight={500}>No notifications yet</Typography>
							<Typography variant="body2" sx={{ mt: 0.5, opacity: 0.7 }}>
								When you get notifications, they'll show up here
							</Typography>
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
											? 'rgba(212, 168, 83, 0.08)'
											: 'transparent',
									borderLeft: notification.notificationStatus === NotificationStatus.WAIT 
										? '3px solid #D4A853' 
										: '3px solid transparent',
									'&:hover': {
										backgroundColor: 'rgba(30, 58, 95, 0.08)',
									},
								}}
							>
								<Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ width: '100%' }}>
									{/* Author Image */}
									<Box
										sx={{
											width: 48,
											height: 48,
											borderRadius: '50%',
											overflow: 'hidden',
											flexShrink: 0,
											position: 'relative',
											border: '2px solid #f5f5f5',
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
												bottom: -3,
												right: -3,
												backgroundColor: '#fff',
												borderRadius: '50%',
												p: 0.4,
												boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
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
												color: 'var(--color-text)',
												lineHeight: 1.4,
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												display: '-webkit-box',
												WebkitLineClamp: 2,
												WebkitBoxOrient: 'vertical',
											}}
										>
											<strong style={{ color: '#1E3A5F' }}>
												{notification.authorData?.memberNick || 'Someone'}
											</strong>{' '}
											{notification.notificationTitle}
										</Typography>
										{notification.notificationDesc && (
											<Typography
												sx={{
													fontSize: '12px',
													color: 'var(--color-text-secondary)',
													mt: 0.5,
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
													fontStyle: 'italic',
												}}
											>
												"{notification.notificationDesc}"
											</Typography>
										)}
										<Typography sx={{ fontSize: '11px', color: '#D4A853', mt: 0.5, fontWeight: 500 }}>
											{getTimeAgo(notification.createdAt)}
										</Typography>
									</Box>

									{/* Delete Button */}
									<Tooltip title="Delete">
										<IconButton
											size="small"
											onClick={(e) => handleDeleteNotification(e, notification._id)}
											sx={{ 
												opacity: 0.5,
												'&:hover': { opacity: 1, color: '#e91e63' }
											}}
										>
											<DeleteOutlineIcon fontSize="small" />
										</IconButton>
									</Tooltip>
								</Stack>
							</MenuItem>
						))
					)}
				</Box>

				{/* Footer */}
				{notifications?.list?.length > 0 && (
					<>
						<Divider />
						<Box sx={{ p: 1.5, textAlign: 'center' }}>
							<Button
								size="small"
								sx={{ 
									color: '#1E3A5F',
									fontWeight: 600,
									'&:hover': { backgroundColor: 'rgba(30, 58, 95, 0.08)' }
								}}
								onClick={() => {
									router.push('/mypage?tab=notifications');
									handleClose();
								}}
							>
								View All Notifications
							</Button>
						</Box>
					</>
				)}
			</Menu>
		</>
	);
};

export default NotificationDropdown;
