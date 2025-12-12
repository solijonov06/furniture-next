import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme } from '../context/ThemeContext';

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [scrolled, setScrolled] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { mode, toggleTheme, isDark } = useTheme();

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 50);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			borderRadius: 12,
			marginTop: theme.spacing(1),
			minWidth: 160,
			color: '#181a20',
			boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.1)',
			'& .MuiMenu-list': {
				padding: '8px',
			},
			'& .MuiMenuItem-root': {
				borderRadius: 8,
				padding: '10px 16px',
				'& .MuiSvgIcon-root': {
					fontSize: 18,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:hover': {
					backgroundColor: '#f6f6f6',
				},
			},
		},
	}));

	if (device == 'mobile') {
		return (
			<Stack className={'top-mobile'}>
				<Stack className={'mobile-navbar'}>
					<Link href={'/'}>
						<img src={isDark ? "/img/logo/logoWhite.svg" : "/img/logo/logoText.svg"} alt="Nestar" className="logo" />
					</Link>
					<div className="mobile-actions">
						<button className={'theme-toggle'} onClick={toggleTheme}>
							{isDark ? <LightModeIcon /> : <DarkModeIcon />}
						</button>
						<button className={'menu-toggle'} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
							{mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
						</button>
					</div>
				</Stack>
				
				<Stack className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
					<Link href={'/'} onClick={() => setMobileMenuOpen(false)}>
						<div className="menu-item">{t('Home')}</div>
					</Link>
					<Link href={'/property'} onClick={() => setMobileMenuOpen(false)}>
						<div className="menu-item">{t('Properties')}</div>
					</Link>
					<Link href={'/agent'} onClick={() => setMobileMenuOpen(false)}>
						<div className="menu-item">{t('Agents')}</div>
					</Link>
					<Link href={'/community?articleCategory=FREE'} onClick={() => setMobileMenuOpen(false)}>
						<div className="menu-item">{t('Community')}</div>
					</Link>
					<Link href={'/cs'} onClick={() => setMobileMenuOpen(false)}>
						<div className="menu-item">{t('CS')}</div>
					</Link>
					{user?._id && (
						<Link href={'/mypage'} onClick={() => setMobileMenuOpen(false)}>
							<div className="menu-item">{t('My Page')}</div>
						</Link>
					)}
					<Link href={'/account/join'} onClick={() => setMobileMenuOpen(false)}>
						<div className="menu-item contact-btn">{t('Contact')}</div>
					</Link>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				<Stack className={`navbar-main ${scrolled ? 'scrolled' : ''}`}>
					<Stack className={'container'}>
						{/* Logo */}
						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'}>
								<img src={isDark ? "/img/logo/logoWhite.svg" : "/img/logo/logoText.svg"} alt="Nestar" />
							</Link>
						</Box>

						{/* Center Navigation */}
						<Box component={'div'} className={'nav-center'}>
							<Link href={'/'}>
								<div className={`nav-item ${router.pathname === '/' ? 'active' : ''}`}>
									{t('Home')}
								</div>
							</Link>
							<Link href={'/property'}>
								<div className={`nav-item ${router.pathname.includes('/property') ? 'active' : ''}`}>
									{t('Properties')}
								</div>
							</Link>
							<Link href={'/agent'}>
								<div className={`nav-item ${router.pathname.includes('/agent') ? 'active' : ''}`}>
									{t('Agents')}
								</div>
							</Link>
							<Link href={'/community?articleCategory=FREE'}>
								<div className={`nav-item ${router.pathname.includes('/community') ? 'active' : ''}`}>
									{t('Community')}
								</div>
							</Link>
							{user?._id && (
								<Link href={'/mypage'}>
									<div className={`nav-item ${router.pathname.includes('/mypage') ? 'active' : ''}`}>
										{t('My Page')}
									</div>
								</Link>
							)}
							<Link href={'/cs'}>
								<div className={`nav-item ${router.pathname.includes('/cs') ? 'active' : ''}`}>
									{t('CS')}
								</div>
							</Link>
						</Box>

						{/* Right Side Actions */}
						<Box component={'div'} className={'nav-right'}>
							{/* Dark Mode Toggle */}
							<button className={'theme-toggle'} onClick={toggleTheme} title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
								{isDark ? <LightModeIcon /> : <DarkModeIcon />}
							</button>

							{/* Language Selector */}
							<div className={'lang-selector'}>
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={12} weight="bold" />}
								>
									<Box component={'div'} className={'flag'}>
										{lang !== null ? (
											<img src={`/img/flag/lang${lang}.png`} alt={'flag'} />
										) : (
											<img src={`/img/flag/langen.png`} alt={'flag'} />
										)}
									</Box>
								</Button>

								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										<img className="img-flag" src={'/img/flag/langen.png'} id="en" alt={'usaFlag'} />
										{t('English')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="kr">
										<img className="img-flag" src={'/img/flag/langkr.png'} id="kr" alt={'koreanFlag'} />
										{t('Korean')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ru">
										<img className="img-flag" src={'/img/flag/langru.png'} id="ru" alt={'russiaFlag'} />
										{t('Russian')}
									</MenuItem>
								</StyledMenu>
							</div>

							{/* User Section */}
							{user?._id ? (
								<div className={'user-section'}>
									<NotificationsOutlinedIcon className={'notification-icon'} />
									<div className={'user-avatar'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
										<img
											src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
											alt=""
										/>
									</div>

									<Menu
										id="user-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => setLogoutAnchor(null)}
										sx={{ mt: '5px' }}
									>
										<MenuItem onClick={() => logOut()}>
											<Logout fontSize="small" style={{ color: '#0047FF', marginRight: '10px' }} />
											{t('Logout')}
										</MenuItem>
									</Menu>
								</div>
							) : (
								<Link href={'/account/join'}>
									<button className={'contact-btn'}>
										{t('Contact')}
									</button>
								</Link>
							)}
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withRouter(Top);
