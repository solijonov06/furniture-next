import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Notice from '../../libs/components/cs/Notice';
import Faq from '../../libs/components/cs/Faq';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CS: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();

	/** HANDLERS **/
	const changeTabHandler = (tab: string) => {
		router.push(
			{
				pathname: '/cs',
				query: { tab: tab },
			},
			undefined,
			{ scroll: false },
		);
	};
	const tab = router.query.tab ?? 'notice';

	if (device === 'mobile') {
		return <h1>CS PAGE MOBILE</h1>;
	} else {
		return (
			<Stack className={'cs-page'}>
				<Stack className={'container'}>
					<div className={'cs-main-info'}>
						<div className={'info'}>
							<span>Cs center</span>
							<p>I will answer your questions</p>
						</div>
						<div className={'btns'}>
							<div
								className={tab == 'notice' ? 'active' : ''}
								onClick={() => {
									changeTabHandler('notice');
								}}
							>
								Notice
							</div>
							<div
								className={tab == 'faq' ? 'active' : ''}
								onClick={() => {
									changeTabHandler('faq');
								}}
							>
								FAQ
							</div>
						</div>
					</div>

					<div className={'cs-content'}>
						{tab === 'notice' && <Notice />}

						{tab === 'faq' && <Faq />}
					</div>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(CS);
