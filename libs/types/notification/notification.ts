import { TotalCounter } from '../common';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { Member } from '../member/member';

export interface Notification {
	_id: string;
	notificationType: NotificationType;
	notificationStatus: NotificationStatus;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationDesc?: string;
	authorId: string;
	receiverId: string;
	propertyId?: string;
	articleId?: string;
	createdAt: Date;
	updatedAt: Date;
	// Populated fields
	authorData?: Member;
}

export interface Notifications {
	list: Notification[];
	metaCounter: TotalCounter[];
}


