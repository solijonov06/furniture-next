// Inquiry Types

export enum InquiryCategory {
	PRODUCT = 'PRODUCT',
	PAYMENT = 'PAYMENT',
	DELIVERY = 'DELIVERY',
	RETURN = 'RETURN',
	ACCOUNT = 'ACCOUNT',
	OTHER = 'OTHER',
}

export enum InquiryStatus {
	PENDING = 'PENDING',
	ANSWERED = 'ANSWERED',
	CLOSED = 'CLOSED',
}

export interface Inquiry {
	_id: string;
	inquiryCategory: InquiryCategory;
	inquiryTitle: string;
	inquiryContent: string;
	inquiryEmail: string;
	inquiryPhone?: string;
	inquiryStatus: InquiryStatus;
	inquiryAnswer?: string;
	memberId?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Inquiries {
	list: Inquiry[];
	metaCounter: {
		total: number;
	}[];
}


