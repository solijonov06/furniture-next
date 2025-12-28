import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { Direction } from '../common';

export interface NotificationsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: NTSearch;
}

interface NTSearch {
	notificationType?: NotificationType;
	notificationStatus?: NotificationStatus;
	notificationGroup?: NotificationGroup;
}


