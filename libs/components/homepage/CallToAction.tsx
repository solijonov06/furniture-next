import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const CallToAction = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');

	if (device === 'mobile') {
		return (
			<Stack className={'cta-section'}>
				<Stack className={'container'}>
					<h2 className={'cta-title'}>
						{t('OUR MISSION IS TO HELP YOU FIND YOUR DREAM HOME.')}
					</h2>
					<Link href={'/property'}>
						<button className={'cta-button'}>
							{t('Get Started')}
						</button>
					</Link>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'cta-section'}>
				<Stack className={'container'}>
					<Box className={'cta-content'}>
						<h2 className={'cta-title'}>
							OUR MISSION IS TO HELP YOU FIND YOUR DREAM HOME.
						</h2>
						<Link href={'/property'}>
							<button className={'cta-button'}>
								{t('Get Started')}
							</button>
						</Link>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default CallToAction;


