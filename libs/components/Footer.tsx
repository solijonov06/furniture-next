import React from 'react';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Footer = () => {
	const device = useDeviceDetect();
	const router = useRouter();

	const footerLinks = {
		shop: [
			{ label: 'Living Room', link: '/property?input={"page":1,"limit":9,"search":{"categoryList":["LIVING_ROOM"]}}' },
			{ label: 'Bedroom', link: '/property?input={"page":1,"limit":9,"search":{"categoryList":["BEDROOM"]}}' },
			{ label: 'Kitchen', link: '/property?input={"page":1,"limit":9,"search":{"categoryList":["KITCHEN"]}}' },
			{ label: 'Office', link: '/property?input={"page":1,"limit":9,"search":{"categoryList":["OFFICE"]}}' },
			{ label: 'Outdoor', link: '/property?input={"page":1,"limit":9,"search":{"categoryList":["OUTDOOR"]}}' },
		],
		company: [
			{ label: 'About Us', link: '/about' },
			{ label: 'Our Agents', link: '/agent' },
			{ label: 'Community', link: '/community?articleCategory=FREE' },
			{ label: 'Contact Us', link: '/cs' },
		],
		support: [
			{ label: 'Help Center', link: '/cs' },
			{ label: 'FAQs', link: '/cs?tab=faq' },
			{ label: 'Shipping Info', link: '/cs' },
			{ label: 'Returns', link: '/cs' },
		],
	};

	const features = [
		{ icon: <LocalShippingOutlinedIcon />, title: 'Free Delivery', desc: 'On orders over $500' },
		{ icon: <VerifiedUserOutlinedIcon />, title: '2-Year Warranty', desc: 'Quality guaranteed' },
		{ icon: <SupportAgentOutlinedIcon />, title: '24/7 Support', desc: 'Expert assistance' },
		{ icon: <AutorenewOutlinedIcon />, title: 'Easy Returns', desc: '30-day return policy' },
	];

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'footer-main'}>
					<Box className={'footer-brand'}>
						<img src="/img/logo/logoWhite.svg" alt="Logo" className={'footer-logo'} />
						<p className={'footer-tagline'}>
							Crafting comfort, designing dreams. Premium furniture for modern living.
						</p>
					</Box>
					<Box className={'footer-social'}>
						<FacebookOutlinedIcon />
						<InstagramIcon />
						<TwitterIcon />
						<PinterestIcon />
					</Box>
				</Stack>
				<Stack className={'footer-bottom'}>
					<span>© {moment().year()} FurniCraft. All rights reserved.</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				{/* Features Bar */}
				<Box className={'footer-features'}>
					{features.map((feature, index) => (
						<Box className={'feature-item'} key={index}>
							<Box className={'feature-icon'}>{feature.icon}</Box>
							<Box className={'feature-text'}>
								<strong>{feature.title}</strong>
								<span>{feature.desc}</span>
							</Box>
						</Box>
					))}
				</Box>

				{/* Main Footer */}
				<Stack className={'footer-main'}>
					<Box className={'footer-grid'}>
						{/* Brand Column */}
						<Box className={'footer-brand'}>
							<img src="/img/logo/logoWhite.svg" alt="Logo" className={'footer-logo'} />
							<p className={'footer-tagline'}>
								Crafting comfort, designing dreams. We bring premium furniture pieces 
								that transform your space into a sanctuary of style and elegance.
							</p>
							<Box className={'footer-contact'}>
								<Box className={'contact-item'}>
									<span className={'label'}>Call Us</span>
									<a href="tel:+1234567890" className={'value'}>+1 (234) 567-890</a>
								</Box>
								<Box className={'contact-item'}>
									<span className={'label'}>Email</span>
									<a href="mailto:hello@furnicraft.com" className={'value'}>hello@furnicraft.com</a>
								</Box>
							</Box>
						</Box>

						{/* Shop Links */}
						<Box className={'footer-links'}>
							<h4>Shop by Room</h4>
							<ul>
								{footerLinks.shop.map((link, index) => (
									<li key={index}>
										<Link href={link.link}>{link.label}</Link>
									</li>
								))}
							</ul>
						</Box>

						{/* Company Links */}
						<Box className={'footer-links'}>
							<h4>Company</h4>
							<ul>
								{footerLinks.company.map((link, index) => (
									<li key={index}>
										<Link href={link.link}>{link.label}</Link>
									</li>
								))}
							</ul>
						</Box>

						{/* Support Links */}
						<Box className={'footer-links'}>
							<h4>Support</h4>
							<ul>
								{footerLinks.support.map((link, index) => (
									<li key={index}>
										<Link href={link.link}>{link.label}</Link>
									</li>
								))}
							</ul>
						</Box>

						{/* Newsletter */}
						<Box className={'footer-newsletter'}>
							<h4>Stay Updated</h4>
							<p>Subscribe for exclusive offers, design tips, and new arrivals.</p>
							<Box className={'newsletter-form'}>
								<input type="email" placeholder="Enter your email" />
								<button type="submit">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
										<path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</button>
							</Box>
							<Box className={'footer-social'}>
								<a href="#" aria-label="Facebook"><FacebookOutlinedIcon /></a>
								<a href="#" aria-label="Instagram"><InstagramIcon /></a>
								<a href="#" aria-label="Twitter"><TwitterIcon /></a>
								<a href="#" aria-label="Pinterest"><PinterestIcon /></a>
								<a href="#" aria-label="YouTube"><YouTubeIcon /></a>
								<a href="#" aria-label="Telegram"><TelegramIcon /></a>
							</Box>
						</Box>
					</Box>
				</Stack>

				{/* Footer Bottom */}
				<Stack className={'footer-bottom'}>
					<Box className={'footer-bottom-content'}>
						<span className={'copyright'}>
							© {moment().year()} FurniCraft. All rights reserved.
						</span>
						<Box className={'footer-bottom-links'}>
							<Link href="/cs">Privacy Policy</Link>
							<span className={'divider'}>|</span>
							<Link href="/cs">Terms of Service</Link>
							<span className={'divider'}>|</span>
							<Link href="/cs">Cookie Settings</Link>
						</Box>
						<Box className={'payment-methods'}>
							<img src="/img/icons/visa.svg" alt="Visa" />
							<img src="/img/icons/mastercard.svg" alt="Mastercard" />
							<img src="/img/icons/paypal.svg" alt="PayPal" />
							<img src="/img/icons/amex.svg" alt="Amex" />
						</Box>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
