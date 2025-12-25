import React, { SyntheticEvent, useEffect, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, CircularProgress, Pagination, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useQuery } from '@apollo/client';
import { GET_FAQS } from '../../../apollo/user/query';
import { Faq as FaqType, FaqCategory, Faqs } from '../../types/cs/faq';
import { FaqsInquiry } from '../../types/cs/faq.input';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const categoryLabels: Record<string, string> = {
	PROPERTY: 'Product',
	PAYMENT: 'Payment',
	BUYERS: 'For Buyers',
	AGENTS: 'For Agents',
	MEMBERSHIP: 'Membership',
	COMMUNITY: 'Community',
	OTHER: 'Other',
};

const Faq = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [category, setCategory] = useState<FaqCategory>(FaqCategory.PROPERTY);
	const [expanded, setExpanded] = useState<string | false>(false);
	const [faqsInquiry, setFaqsInquiry] = useState<FaqsInquiry>({
		page: 1,
		limit: 10,
		search: {
			faqCategory: FaqCategory.PROPERTY,
		},
	});

	/** APOLLO REQUESTS **/
	const {
		loading: getFaqsLoading,
		data: getFaqsData,
		error: getFaqsError,
		refetch: getFaqsRefetch,
	} = useQuery(GET_FAQS, {
		fetchPolicy: 'network-only',
		variables: { input: faqsInquiry },
		notifyOnNetworkStatusChange: true,
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getFaqsRefetch({ input: faqsInquiry });
	}, [faqsInquiry]);

	/** HANDLERS **/
	const changeCategoryHandler = (newCategory: FaqCategory) => {
		setCategory(newCategory);
		setExpanded(false);
		setFaqsInquiry({
			...faqsInquiry,
			page: 1,
			search: {
				...faqsInquiry.search,
				faqCategory: newCategory,
			},
		});
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const paginationHandler = (e: any, value: number) => {
		setFaqsInquiry({ ...faqsInquiry, page: value });
	};

	const faqs: Faqs = getFaqsData?.getFaqs;
	const total = faqs?.metaCounter?.[0]?.total ?? 0;

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	} else {
		return (
			<Stack className={'faq-content'}>
				<Box className={'categories'} component={'div'}>
					{Object.values(FaqCategory).map((cat) => (
						<div
							key={cat}
							className={category === cat ? 'active' : ''}
							onClick={() => changeCategoryHandler(cat)}
						>
							{categoryLabels[cat] || cat}
						</div>
					))}
				</Box>
				<Box className={'wrap'} component={'div'}>
					{getFaqsLoading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
							<CircularProgress />
						</Box>
					) : faqs?.list?.length === 0 ? (
						<Box sx={{ textAlign: 'center', padding: '40px', color: '#717171' }}>
							No FAQs available for this category
						</Box>
					) : (
						faqs?.list?.map((faq: FaqType) => (
							<Accordion expanded={expanded === faq._id} onChange={handleChange(faq._id)} key={faq._id}>
								<AccordionSummary id="panel1d-header" className="question" aria-controls="panel1d-content">
									<Typography className="badge" variant={'h4'}>
										Q
									</Typography>
									<Typography>{faq.faqQuestion}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Stack className={'answer flex-box'}>
										<Typography className="badge" variant={'h4'} color={'primary'}>
											A
										</Typography>
										<Typography>{faq.faqAnswer}</Typography>
									</Stack>
								</AccordionDetails>
							</Accordion>
						))
					)}
				</Box>
				{total > faqsInquiry.limit && (
					<Box className={'pagination-box'} sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
						<Pagination
							count={Math.ceil(total / faqsInquiry.limit)}
							page={faqsInquiry.page}
							onChange={paginationHandler}
							color="primary"
						/>
					</Box>
				)}
			</Stack>
		);
	}
};

export default Faq;
