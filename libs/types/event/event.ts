import { TotalCounter, Direction } from '../common';

export enum EventStatus {
	ACTIVE = 'ACTIVE',
	PAUSED = 'PAUSED',
	ENDED = 'ENDED',
	DELETE = 'DELETE',
}

export interface Event {
	_id: string;
	eventTitle: string;
	eventCity: string;
	eventDescription: string;
	eventImage: string;
	eventStartDate?: Date;
	eventEndDate?: Date;
	eventLocation?: string;
	eventLink?: string;
	eventStatus: EventStatus;
	createdAt: Date;
	updatedAt: Date;
}

export interface Events {
	list: Event[];
	metaCounter: TotalCounter[];
}

