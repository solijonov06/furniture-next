import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import PopularProperties from '../libs/components/homepage/PopularProperties';
import TopAgents from '../libs/components/homepage/TopAgents';
import Events from '../libs/components/homepage/Events';
import TrendProperties from '../libs/components/homepage/TrendProperties';
import TopProperties from '../libs/components/homepage/TopProperties';
import Statistics from '../libs/components/homepage/Statistics';
import VideoShowcase from '../libs/components/homepage/VideoShowcase';
import { Stack } from '@mui/material';
import Advertisement from '../libs/components/homepage/Advertisement';
import CallToAction from '../libs/components/homepage/CallToAction';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
}); 

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<TrendProperties />
				<PopularProperties />
				<Statistics />
				<TopProperties />
				<TopAgents />
				<CallToAction />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<TrendProperties />
				<PopularProperties />
				<VideoShowcase />
				<Statistics />
				<TopProperties />
				<TopAgents />
				<Events />
				<CommunityBoards />
				<CallToAction />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
