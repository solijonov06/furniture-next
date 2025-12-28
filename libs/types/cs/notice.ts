import { TotalCounter } from '../common';

export interface Notice {
	_id: string;
	noticeCategory: NoticeCategory;
	noticeStatus: NoticeStatus;
	noticeTitle: string;
	noticeContent: string;
	noticeViews: number;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
}

export enum NoticeCategory {
	EVENT = 'EVENT',
	NOTICE = 'NOTICE',
	PROMOTION = 'PROMOTION',
}

export enum NoticeStatus {
	HOLD = 'HOLD',
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}

export interface Notices {
	list: Notice[];
	metaCounter: TotalCounter[];
}


