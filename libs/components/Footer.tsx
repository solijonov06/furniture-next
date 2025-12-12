import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');
	const { isDark } = useTheme();

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src={isDark ? "/img/logo/logoWhite.svg" : "/img/logo/logoText.svg"} alt="" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<div className={'contact-item'}>
								<span className={'label'}>Phone:</span>
								<a href="tel:+821048672909">+82 10 4867 2909</a>
							</div>
							<div className={'contact-item'}>
								<span className={'label'}>Email:</span>
								<a href="mailto:team@nestar.com">team@nestar.com</a>
							</div>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<InstagramIcon />
								<TwitterIcon />
								<LinkedInIcon />
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© Nestar - All rights reserved. {moment().year()}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					{/* Logo & Contact Column */}
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src={isDark ? "/img/logo/logoWhite.svg" : "/img/logo/logoText.svg"} alt="Nestar" className={'logo'} />
							
							{/* Location Block */}
							<div className={'location-block'}>
								<p className={'location-title'}>SEOUL</p>
								<a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className={'location-address'}>
									Level 6, 200 Gangnam Street<br />
									Seoul, South Korea, 06000
								</a>
							</div>

							{/* Contact Info */}
							<div className={'contact-item'}>
								<span className={'label'}>Phone:</span>
								<a href="tel:+821048672909">+82 10 4867 2909</a>
							</div>
							<div className={'contact-item'}>
								<span className={'label'}>Email:</span>
								<a href="mailto:team@nestar.com">team@nestar.com</a>
							</div>

							{/* Social Media */}
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<InstagramIcon />
								<TwitterIcon />
								<TelegramIcon />
								<LinkedInIcon />
							</div>
						</Box>
					</Stack>

					{/* Links Section */}
					<Stack className={'right'}>
						{/* Property Types Column */}
						<div className={'link-column'}>
							<strong>{t('Property Types')}</strong>
							<Link href={'/property?type=APARTMENT'}>
								<span>Apartment</span>
							</Link>
							<Link href={'/property?type=HOUSE'}>
								<span>House</span>
							</Link>
							<Link href={'/property?type=VILLA'}>
								<span>Villa</span>
							</Link>
							<Link href={'/property?type=COMMERCIAL'}>
								<span>Commercial</span>
							</Link>
							<Link href={'/property?type=LAND'}>
								<span>Land</span>
							</Link>
						</div>

						{/* Services Column */}
						<div className={'link-column'}>
							<strong>{t('Services')}</strong>
							<Link href={'/property'}>
								<span>Buy Property</span>
							</Link>
							<Link href={'/property?status=RENT'}>
								<span>Rent Property</span>
							</Link>
							<Link href={'/agent'}>
								<span>Find Agent</span>
							</Link>
							<Link href={'/community'}>
								<span>Community</span>
							</Link>
							<Link href={'/cs'}>
								<span>Customer Support</span>
							</Link>
						</div>

						{/* Newsletter Column */}
						<div className={'newsletter-column'}>
							<strong>KEEP ME INFORMED.</strong>
							<div className={'newsletter-form'}>
								<input type="email" placeholder="Your Email Address" />
								<button>Subscribe</button>
							</div>
						</div>
					</Stack>
				</Stack>

				<Stack className={'second'}>
					<span>© Nestar - All rights reserved. {moment().year()}</span>
					<span>Privacy · Terms · Sitemap</span>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
