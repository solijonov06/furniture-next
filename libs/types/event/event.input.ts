import { EventStatus } from './event';
import { Direction } from '../common';

export interface EventsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: {
		eventStatus?: EventStatus;
		text?: string;
	};
}


