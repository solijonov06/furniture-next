import { NoticeCategory, NoticeStatus } from './notice';
import { Direction } from '../common';

export interface NoticeInput {
	noticeCategory: NoticeCategory;
	noticeTitle: string;
	noticeContent: string;
}

export interface NoticesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: NISearch;
}

interface NISearch {
	noticeCategory?: NoticeCategory;
	noticeStatus?: NoticeStatus;
	text?: string;
}



