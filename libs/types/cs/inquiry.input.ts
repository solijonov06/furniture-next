import { InquiryCategory, InquiryStatus } from './inquiry';

export interface InquiryInput {
	inquiryCategory: InquiryCategory;
	inquiryTitle: string;
	inquiryContent: string;
	inquiryEmail: string;
	inquiryPhone?: string;
}

export interface InquiriesInquiry {
	page: number;
	limit: number;
	search?: {
		inquiryCategory?: InquiryCategory;
		inquiryStatus?: InquiryStatus;
	};
}


