import { FaqCategory, FaqStatus } from './faq';
import { Direction } from '../common';

export interface FaqInput {
	faqCategory: FaqCategory;
	faqQuestion: string;
	faqAnswer: string;
}

export interface FaqsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: FISearch;
}

interface FISearch {
	faqCategory?: FaqCategory;
	faqStatus?: FaqStatus;
	text?: string;
}






