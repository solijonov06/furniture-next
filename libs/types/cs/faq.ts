import { TotalCounter } from '../common';

export interface Faq {
	_id: string;
	faqCategory: FaqCategory;
	faqStatus: FaqStatus;
	faqQuestion: string;
	faqAnswer: string;
	faqViews: number;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
}

export enum FaqCategory {
	PROPERTY = 'PROPERTY',
	PAYMENT = 'PAYMENT',
	BUYERS = 'BUYERS',
	AGENTS = 'AGENTS',
	MEMBERSHIP = 'MEMBERSHIP',
	COMMUNITY = 'COMMUNITY',
	OTHER = 'OTHER',
}

export enum FaqStatus {
	HOLD = 'HOLD',
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}

export interface Faqs {
	list: Faq[];
	metaCounter: TotalCounter[];
}






