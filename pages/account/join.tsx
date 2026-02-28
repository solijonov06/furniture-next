import React, { useCallback, useState, useEffect } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Button, Checkbox, FormControlLabel, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'USER' });
	const [loginView, setLoginView] = useState<boolean>(true);
	
	// Animation states - once activated, stays on
	const [nickActivated, setNickActivated] = useState(false);
	const [passwordActivated, setPasswordActivated] = useState(false);
	const [phoneActivated, setPhoneActivated] = useState(false);
	
	// Continuous rotation values
	const [gearAngle, setGearAngle] = useState(0);
	const [sawAngle, setSawAngle] = useState(0);
	const [drillAngle, setDrillAngle] = useState(0);
	const [pendulumSwing, setPendulumSwing] = useState(0);
	const [conveyorOffset, setConveyorOffset] = useState(0);
	
	const [isAgreed, setIsAgreed] = useState(false);

	// Continuous gear animation when nick is activated
	useEffect(() => {
		if (!nickActivated) return;
		const interval = setInterval(() => {
			setGearAngle(prev => (prev + 3) % 360);
		}, 30);
		return () => clearInterval(interval);
	}, [nickActivated]);

	// Continuous saw animation when password is activated
	useEffect(() => {
		if (!passwordActivated) return;
		const interval = setInterval(() => {
			setSawAngle(prev => (prev + 10) % 360);
			setConveyorOffset(prev => (prev + 2) % 100);
		}, 30);
		return () => clearInterval(interval);
	}, [passwordActivated]);

	// Continuous drill & pendulum animation when phone is activated
	useEffect(() => {
		if (!phoneActivated) return;
		const interval = setInterval(() => {
			setDrillAngle(prev => (prev + 15) % 360);
			setPendulumSwing(Math.sin(Date.now() / 300) * 25);
		}, 30);
		return () => clearInterval(interval);
	}, [phoneActivated]);

	// Calculate completion percentage
	const completionPercent = (() => {
		let filled = 0;
		let total = loginView ? 2 : 3;
		if (input.nick) filled++;
		if (input.password) filled++;
		if (!loginView && input.phone) filled++;
		return (filled / total) * 100;
	})();

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
		// Reset animations when switching views
		setNickActivated(false);
		setPasswordActivated(false);
		setPhoneActivated(false);
	};

	const handleNickChange = (value: string) => {
		if (value.length > 0 && !nickActivated) {
			setNickActivated(true); // Activate and keep running
		}
		setInput(prev => ({ ...prev, nick: value }));
	};

	const handlePasswordChange = (value: string) => {
		if (value.length > 0 && !passwordActivated) {
			setPasswordActivated(true); // Activate and keep running
		}
		setInput(prev => ({ ...prev, password: value }));
	};

	const handlePhoneChange = (value: string) => {
		if (value.length > 0 && !phoneActivated) {
			setPhoneActivated(true); // Activate and keep running
		}
		setInput(prev => ({ ...prev, phone: value }));
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput(prev => ({ ...prev, [name]: value }));
	}, []);

	const doLogin = useCallback(async () => {
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const doSignUp = useCallback(async () => {
		try {
			await signUp(input.nick, input.password, input.phone, input.type);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	if (device === 'mobile') {
		return (
			<Stack className={'join-page creative'}>
				<Stack className={'container'}>
					<Stack className={'creative-form-mobile'}>
						<div className={'form-header'}>
							<h2>{loginView ? 'Welcome Back' : 'Join Us'}</h2>
							<p>Crafting your perfect home experience</p>
						</div>
						<div className={'form-inputs'}>
							<div className={'input-group'}>
								<label>Nickname</label>
								<input
									type="text"
									placeholder="Enter your nickname"
									onChange={(e) => handleNickChange(e.target.value)}
								/>
							</div>
							<div className={'input-group'}>
								<label>Password</label>
								<input
									type="password"
									placeholder="Enter your password"
									onChange={(e) => handlePasswordChange(e.target.value)}
								/>
							</div>
							{!loginView && (
								<div className={'input-group'}>
									<label>Phone</label>
									<input
										type="text"
										placeholder="Enter your phone"
										onChange={(e) => handlePhoneChange(e.target.value)}
									/>
								</div>
							)}
						</div>
						<Button
							className={'submit-btn'}
							onClick={loginView ? doLogin : doSignUp}
							disabled={input.nick === '' || input.password === ''}
						>
							{loginView ? 'LOGIN' : 'SIGNUP'}
						</Button>
						<p className={'switch-text'}>
							{loginView ? "Don't have an account? " : 'Already have an account? '}
							<span onClick={() => viewChangeHandler(!loginView)}>
								{loginView ? 'Sign Up' : 'Login'}
							</span>
						</p>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'join-page creative'}>
				<Stack className={'container'}>
					<Stack className={'creative-workshop'}>
						{/* Left Side - Mechanical System */}
						<div className={'workshop-animation'}>
							<svg className={'machine-svg'} viewBox="0 0 500 700" xmlns="http://www.w3.org/2000/svg">
								<defs>
									{/* Wood pattern */}
									<pattern id="woodPattern" patternUnits="userSpaceOnUse" width="60" height="60">
										<rect width="60" height="60" fill="#E8DED1"/>
										<path d="M0,10 Q15,8 30,10 T60,10" stroke="#D4C4B0" strokeWidth="1" fill="none"/>
										<path d="M0,30 Q15,28 30,30 T60,30" stroke="#D4C4B0" strokeWidth="1" fill="none"/>
										<path d="M0,50 Q15,48 30,50 T60,50" stroke="#D4C4B0" strokeWidth="1" fill="none"/>
									</pattern>
									{/* Belt pattern */}
									<pattern id="beltPattern" patternUnits="userSpaceOnUse" width="20" height="10">
										<rect width="20" height="10" fill="#5C4A35"/>
										<rect x="0" y="0" width="8" height="10" fill="#4A3D2D"/>
									</pattern>
								</defs>

								{/* Background */}
								<rect width="500" height="700" fill="url(#woodPattern)"/>

								{/* ============================================ */}
								{/* SECTION 1: NICKNAME - GEAR SYSTEM (Top) */}
								{/* ============================================ */}
								
								{/* Main Drive Gear */}
								<g className={`gear-system ${nickActivated ? 'active' : ''}`}>
									<g transform={`rotate(${gearAngle} 400 100)`}>
										<circle cx="400" cy="100" r="60" fill="none" stroke={nickActivated ? "#1E3A5F" : "#8B6F4E"} strokeWidth="8"/>
										<circle cx="400" cy="100" r="45" fill="none" stroke={nickActivated ? "#1E3A5F" : "#8B6F4E"} strokeWidth="4"/>
										<circle cx="400" cy="100" r="12" fill={nickActivated ? "#1E3A5F" : "#8B6F4E"}/>
										{[...Array(12)].map((_, i) => (
											<rect key={i} x="395" y="30" width="10" height="20" rx="2"
												fill={nickActivated ? "#1E3A5F" : "#8B6F4E"}
												transform={`rotate(${i * 30} 400 100)`}/>
										))}
									</g>

									{/* Medium Gear - Connected */}
									<g transform={`rotate(${-gearAngle * 1.5} 320 160)`}>
										<circle cx="320" cy="160" r="40" fill="none" stroke={nickActivated ? "#D4A853" : "#A08060"} strokeWidth="6"/>
										<circle cx="320" cy="160" r="25" fill="none" stroke={nickActivated ? "#D4A853" : "#A08060"} strokeWidth="3"/>
										<circle cx="320" cy="160" r="8" fill={nickActivated ? "#D4A853" : "#A08060"}/>
										{[...Array(10)].map((_, i) => (
											<rect key={i} x="316" y="115" width="8" height="15" rx="2"
												fill={nickActivated ? "#D4A853" : "#A08060"}
												transform={`rotate(${i * 36} 320 160)`}/>
										))}
									</g>

									{/* Small Gear - Connected */}
									<g transform={`rotate(${gearAngle * 2} 270 120)`}>
										<circle cx="270" cy="120" r="25" fill="none" stroke={nickActivated ? "#1E3A5F" : "#8B6F4E"} strokeWidth="4"/>
										<circle cx="270" cy="120" r="6" fill={nickActivated ? "#1E3A5F" : "#8B6F4E"}/>
										{[...Array(8)].map((_, i) => (
											<rect key={i} x="267" y="90" width="6" height="12" rx="1"
												fill={nickActivated ? "#1E3A5F" : "#8B6F4E"}
												transform={`rotate(${i * 45} 270 120)`}/>
										))}
									</g>

									{/* Axle connecting to belt */}
									<line x1="320" y1="160" x2="320" y2="220" stroke="#5C4A35" strokeWidth="8"/>
									<circle cx="320" cy="220" r="15" fill="#5C4A35" stroke="#8B6F4E" strokeWidth="3"/>
								</g>

								{/* Connection indicator for nickname */}
								<g className="connection-point nick-point">
									<circle cx="80" cy="100" r="8" fill={nickActivated ? "#4ade80" : "#ccc"}/>
									<line x1="88" y1="100" x2="200" y2="100" stroke={nickActivated ? "#4ade80" : "#ccc"} strokeWidth="3" strokeDasharray={nickActivated ? "0" : "8,4"}/>
									<path d="M200,100 Q240,100 270,120" stroke={nickActivated ? "#4ade80" : "#ccc"} strokeWidth="3" fill="none" strokeDasharray={nickActivated ? "0" : "8,4"}/>
								</g>

								{/* ============================================ */}
								{/* SECTION 2: PASSWORD - SAW & CONVEYOR (Middle) */}
								{/* ============================================ */}

								{/* Conveyor Belt System */}
								<g className={`conveyor-system ${passwordActivated ? 'active' : ''}`}>
									{/* Belt Wheels */}
									<circle cx="100" cy="350" r="30" fill="#5C4A35" stroke={passwordActivated ? "#D4A853" : "#3D3D3D"} strokeWidth="4"/>
									<circle cx="400" cy="350" r="30" fill="#5C4A35" stroke={passwordActivated ? "#D4A853" : "#3D3D3D"} strokeWidth="4"/>
									
									{/* Belt */}
									<rect x="100" y="325" width="300" height="50" fill="url(#beltPattern)" 
										style={{transform: `translateX(${passwordActivated ? -conveyorOffset : 0}px)`}}/>
									
									{/* Belt Lines */}
									<line x1="100" y1="325" x2="400" y2="325" stroke={passwordActivated ? "#D4A853" : "#4A4A4A"} strokeWidth="4"/>
									<line x1="100" y1="375" x2="400" y2="375" stroke={passwordActivated ? "#D4A853" : "#4A4A4A"} strokeWidth="4"/>

									{/* Wood pieces on conveyor */}
									<rect x={150 + (passwordActivated ? (conveyorOffset * 2) % 200 : 0)} y="310" width="60" height="15" rx="2" fill="#C4A77D"/>
									<rect x={280 + (passwordActivated ? (conveyorOffset * 2) % 200 : 0)} y="310" width="60" height="15" rx="2" fill="#B89A6B"/>
								</g>

								{/* Circular Saw */}
								<g className={`saw-system ${passwordActivated ? 'active' : ''}`}>
									<g transform={`rotate(${sawAngle} 250 280)`}>
										<circle cx="250" cy="280" r="50" fill={passwordActivated ? "#D4A853" : "#4A4A4A"}/>
										<circle cx="250" cy="280" r="8" fill={passwordActivated ? "#4ade80" : "#666"}/>
										{[...Array(24)].map((_, i) => (
											<polygon key={i} points="250,225 254,240 246,240"
												fill={passwordActivated ? "#1a1a1a" : "#2a2a2a"}
												transform={`rotate(${i * 15} 250 280)`}/>
										))}
										<circle cx="250" cy="280" r="35" fill="none" stroke={passwordActivated ? "#3D7A64" : "#555"} strokeWidth="2" strokeDasharray="4,4"/>
									</g>
									
									{/* Saw Mount */}
									<rect x="230" y="320" width="40" height="60" fill="#5C4A35"/>
									<rect x="220" y="370" width="60" height="20" rx="3" fill="#4A4A4A"/>
								</g>

								{/* Connection indicator for password */}
								<g className="connection-point password-point">
									<circle cx="80" cy="280" r="8" fill={passwordActivated ? "#4ade80" : "#ccc"}/>
									<line x1="88" y1="280" x2="180" y2="280" stroke={passwordActivated ? "#4ade80" : "#ccc"} strokeWidth="3" strokeDasharray={passwordActivated ? "0" : "8,4"}/>
								</g>

								{/* Vertical shaft connecting gears to conveyor */}
								<line x1="320" y1="235" x2="320" y2="320" stroke="#5C4A35" strokeWidth="6"/>
								<circle cx="320" cy="350" r="12" fill="#5C4A35"/>

								{/* ============================================ */}
								{/* SECTION 3: PHONE - DRILL & CLAMP (Bottom) */}
								{/* ============================================ */}

								{!loginView && (
									<g className={`drill-system ${phoneActivated ? 'active' : ''}`}>
										{/* Work Table */}
										<rect x="60" y="520" width="380" height="25" rx="3" fill="#8B6F4E"/>
										<rect x="60" y="545" width="20" height="80" fill="#5C4A35"/>
										<rect x="420" y="545" width="20" height="80" fill="#5C4A35"/>

										{/* Clamp */}
										<rect x="140" y="480" width="15" height="45" fill="#4A4A4A"/>
										<rect x="125" y="470" width="45" height="15" rx="2" fill="#5A5A5A"/>
										<rect x="125" y="515" width="45" height="10" rx="2" fill="#5A5A5A"/>

										{/* Wood piece being worked */}
										<rect x="180" y="495" width="120" height="25" rx="2" fill="#C4A77D"/>
										<rect x="180" y="495" width="120" height="8" fill="#D4B78D" opacity="0.5"/>

										{/* Drill Press */}
										<rect x="320" y="420" width="30" height="100" fill="#4A4A4A"/>
										<rect x="310" y="410" width="50" height="20" rx="3" fill="#5A5A5A"/>
										
										{/* Drill Bit */}
										<g transform={`translate(335, 480)`}>
											<g style={{transform: `rotate(${drillAngle}deg)`, transformOrigin: '0 0'}}>
												<rect x="-8" y="0" width="16" height="40" fill={phoneActivated ? "#D4A853" : "#666"}/>
												<polygon points="0,40 -6,40 0,55 6,40" fill={phoneActivated ? "#1E3A5F" : "#555"}/>
												{[...Array(6)].map((_, i) => (
													<line key={i} x1="-6" y1={5 + i * 6} x2="6" y2={8 + i * 6} 
														stroke={phoneActivated ? "#8B6F4E" : "#444"} strokeWidth="2"/>
												))}
											</g>
										</g>

										{/* Pendulum/Balance Weight */}
										<g style={{transform: `rotate(${pendulumSwing}deg)`, transformOrigin: '450px 430px'}}>
											<line x1="450" y1="430" x2="450" y2="550" stroke={phoneActivated ? "#D4A853" : "#8B6F4E"} strokeWidth="4"/>
											<circle cx="450" cy="430" r="10" fill="#5C4A35"/>
											<circle cx="450" cy="550" r="25" fill={phoneActivated ? "#D4A853" : "#8B6F4E"}/>
											<circle cx="450" cy="550" r="15" fill={phoneActivated ? "#F5D76E" : "#A08060"}/>
										</g>

										{/* Connection indicator for phone */}
										<g className="connection-point phone-point">
											<circle cx="80" cy="490" r="8" fill={phoneActivated ? "#4ade80" : "#ccc"}/>
											<line x1="88" y1="490" x2="125" y2="490" stroke={phoneActivated ? "#4ade80" : "#ccc"} strokeWidth="3" strokeDasharray={phoneActivated ? "0" : "8,4"}/>
										</g>
									</g>
								)}

								{/* ============================================ */}
								{/* PROGRESS INDICATOR */}
								{/* ============================================ */}
								<g className="progress-section">
									{/* Progress bar background */}
									<rect x="40" y="620" width="420" height="30" rx="15" fill="#E0D5C7"/>
									{/* Progress bar fill */}
									<rect x="40" y="620" width={420 * completionPercent / 100} height="30" rx="15" 
										fill="url(#progressGradient)"/>
									<defs>
										<linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
											<stop offset="0%" stopColor="#1E3A5F"/>
											<stop offset="100%" stopColor="#D4A853"/>
										</linearGradient>
									</defs>
									{/* Progress text */}
									<text x="250" y="642" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">
										{Math.round(completionPercent)}% Complete
									</text>
								</g>

								{/* Corner Screws */}
								{[[30, 30], [470, 30], [30, 670], [470, 670]].map(([x, y], i) => (
									<g key={i}>
										<circle cx={x} cy={y} r="12" fill="#6A6A6A"/>
										<circle cx={x} cy={y} r="8" fill="#8A8A8A"/>
										<line x1={x-5} y1={y} x2={x+5} y2={y} stroke="#4A4A4A" strokeWidth="3"/>
									</g>
								))}

							</svg>

							{/* Labels */}
							<div className={'machine-labels'}>
								<div className={`label nick-label ${nickActivated ? 'active' : ''}`}>
									<span className="dot"></span>
									GEAR SYSTEM
								</div>
								<div className={`label password-label ${passwordActivated ? 'active' : ''}`}>
									<span className="dot"></span>
									SAW & CONVEYOR
								</div>
								{!loginView && (
									<div className={`label phone-label ${phoneActivated ? 'active' : ''}`}>
										<span className="dot"></span>
										DRILL PRESS
									</div>
								)}
							</div>
						</div>

						{/* Right Side - Form */}
						<div className={'form-section'}>
							<div className={'form-header'}>
								<div className={'logo-creative'}>
									<svg viewBox="0 0 50 50">
										<path d="M25,5 L45,15 L45,35 L25,45 L5,35 L5,15 Z" fill="#1E3A5F" opacity="0.2"/>
										<path d="M25,10 L40,18 L40,32 L25,40 L10,32 L10,18 Z" fill="#1E3A5F"/>
										<text x="25" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">F</text>
									</svg>
									<span>FurniturePro</span>
								</div>
								<h1>{loginView ? 'Welcome Back' : 'Create Account'}</h1>
								<p>Start typing to activate the workshop!</p>
							</div>

							<div className={'form-body'}>
								{/* NICKNAME INPUT */}
								<div className={`input-creative ${nickActivated ? 'activated' : ''}`}>
									<label>
										<span className={`status-dot ${nickActivated ? 'on' : ''}`}></span>
										Nickname
										<span className="machine-name">Gear System</span>
									</label>
									<input
										type="text"
										placeholder="Start typing to spin the gears..."
										onChange={(e) => handleNickChange(e.target.value)}
										onKeyDown={(e) => { if (e.key === 'Enter') loginView ? doLogin() : doSignUp(); }}
									/>
								</div>

								{/* PASSWORD INPUT */}
								<div className={`input-creative ${passwordActivated ? 'activated' : ''}`}>
									<label>
										<span className={`status-dot ${passwordActivated ? 'on' : ''}`}></span>
										Password
										<span className="machine-name">Saw & Conveyor</span>
									</label>
									<input
										type="password"
										placeholder="Start typing to run the saw..."
										onChange={(e) => handlePasswordChange(e.target.value)}
										onKeyDown={(e) => { if (e.key === 'Enter') loginView ? doLogin() : doSignUp(); }}
									/>
								</div>

								{/* PHONE INPUT */}
								{!loginView && (
									<div className={`input-creative ${phoneActivated ? 'activated' : ''}`}>
										<label>
											<span className={`status-dot ${phoneActivated ? 'on' : ''}`}></span>
											Phone
											<span className="machine-name">Drill Press</span>
										</label>
										<input
											type="text"
											placeholder="Start typing to power the drill..."
											onChange={(e) => handlePhoneChange(e.target.value)}
											onKeyDown={(e) => { if (e.key === 'Enter') doSignUp(); }}
										/>
									</div>
								)}

								{!loginView && (
									<div className={'type-selector'}>
										<span>Register as:</span>
										<div className={'type-options'}>
											<label className={input.type === 'USER' ? 'active' : ''}>
												<input type="radio" name="type" checked={input.type === 'USER'}
													onChange={() => handleInput('type', 'USER')}/>
												<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
													<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
													<circle cx="12" cy="7" r="4"/>
												</svg>
												User
											</label>
											<label className={input.type === 'AGENT' ? 'active' : ''}>
												<input type="radio" name="type" checked={input.type === 'AGENT'}
													onChange={() => handleInput('type', 'AGENT')}/>
												<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
													<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
													<polyline points="9 22 9 12 15 12 15 22"/>
												</svg>
												Agent
											</label>
										</div>
									</div>
								)}

								{loginView && (
									<div className={'remember-forgot'}>
										<FormControlLabel 
											control={<Checkbox size="small" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} />} 
											label="Remember me" 
										/>
										<a href="#">Forgot password?</a>
									</div>
								)}

								<Button
									className={'submit-creative'}
									onClick={loginView ? doLogin : doSignUp}
									disabled={input.nick === '' || input.password === '' || (!loginView && input.phone === '')}
								>
									<span>{loginView ? 'Login' : 'Sign Up'}</span>
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<line x1="5" y1="12" x2="19" y2="12"/>
										<polyline points="12 5 19 12 12 19"/>
									</svg>
								</Button>

								<div className={'divider'}>
									<span>or continue with</span>
								</div>

								<div className={'social-login'}>
									<button className={'social-btn google'}>
										<svg viewBox="0 0 24 24">
											<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
											<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
											<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
											<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
										</svg>
									</button>
									<button className={'social-btn apple'}>
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
										</svg>
									</button>
								</div>
							</div>

							<div className={'form-footer'}>
								<p>
									{loginView ? "Don't have an account?" : 'Already have an account?'}
									<span onClick={() => viewChangeHandler(!loginView)}>
										{loginView ? ' Sign Up' : ' Login'}
									</span>
								</p>
							</div>
						</div>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(Join);
