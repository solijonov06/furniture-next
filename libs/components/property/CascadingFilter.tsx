import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Box,
	Collapse,
	IconButton,
	Chip,
} from '@mui/material';
import { PropertyLocation, PropertyType, PropertyCategory } from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { propertyVolume } from '../../config';

interface CascadingFilterProps {
	searchFilter: PropertiesInquiry;
	setSearchFilter: any;
	initialInput: PropertiesInquiry;
}

// Step configuration
const STEPS = {
	LOCATION: 1,
	TYPE: 2,
	CATEGORY: 3,
	VOLUME: 4,
	PRICE: 5,
};

const CascadingFilter = (props: CascadingFilterProps) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const router = useRouter();
	
	// Track which step is currently active/expanded
	const [activeStep, setActiveStep] = useState<number>(STEPS.LOCATION);
	const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

	const locations = Object.values(PropertyLocation);
	const types = Object.values(PropertyType);
	const categories = Object.values(PropertyCategory);

	// Determine completed steps based on searchFilter
	useEffect(() => {
		const completed = new Set<number>();
		
		if (searchFilter?.search?.locationList?.length) {
			completed.add(STEPS.LOCATION);
		}
		if (searchFilter?.search?.typeList?.length) {
			completed.add(STEPS.TYPE);
		}
		if (searchFilter?.search?.categoryList?.length) {
			completed.add(STEPS.CATEGORY);
		}
		if (searchFilter?.search?.squaresRange?.start > 0 || searchFilter?.search?.squaresRange?.end < 500) {
			completed.add(STEPS.VOLUME);
		}
		if (searchFilter?.search?.pricesRange?.start > 0 || searchFilter?.search?.pricesRange?.end < 2000000) {
			completed.add(STEPS.PRICE);
		}
		
		setCompletedSteps(completed);
	}, [searchFilter]);

	// Auto-advance to next step
	const advanceToNextStep = (currentStep: number) => {
		if (currentStep < STEPS.PRICE) {
			setActiveStep(currentStep + 1);
		}
	};

	const updateFilter = useCallback(async (newFilter: PropertiesInquiry) => {
		await router.push(
			`/property?input=${JSON.stringify(newFilter)}`,
			`/property?input=${JSON.stringify(newFilter)}`,
			{ scroll: false }
		);
	}, [router]);

	// Location handler
	const handleLocationSelect = useCallback(async (location: string) => {
		const currentList = searchFilter?.search?.locationList || [];
		let newList: string[];
		
		if (currentList.includes(location)) {
			newList = currentList.filter((l: string) => l !== location);
		} else {
			newList = [...currentList, location];
		}
		
		const newFilter = {
			...searchFilter,
			search: {
				...searchFilter.search,
				locationList: newList.length > 0 ? newList : undefined,
			},
		};
		
		if (!newList.length) delete newFilter.search.locationList;
		
		await updateFilter(newFilter);
		
		if (newList.length > 0 && !completedSteps.has(STEPS.LOCATION)) {
			setTimeout(() => advanceToNextStep(STEPS.LOCATION), 300);
		}
	}, [searchFilter, completedSteps, updateFilter]);

	// Type handler
	const handleTypeSelect = useCallback(async (type: string) => {
		const currentList = searchFilter?.search?.typeList || [];
		let newList: string[];
		
		if (currentList.includes(type)) {
			newList = currentList.filter((t: string) => t !== type);
		} else {
			newList = [...currentList, type];
		}
		
		const newFilter = {
			...searchFilter,
			search: {
				...searchFilter.search,
				typeList: newList.length > 0 ? newList : undefined,
			},
		};
		
		if (!newList.length) delete newFilter.search.typeList;
		
		await updateFilter(newFilter);
		
		if (newList.length > 0 && !completedSteps.has(STEPS.TYPE)) {
			setTimeout(() => advanceToNextStep(STEPS.TYPE), 300);
		}
	}, [searchFilter, completedSteps, updateFilter]);

	// Category handler
	const handleCategorySelect = useCallback(async (category: string) => {
		const currentList = searchFilter?.search?.categoryList || [];
		let newList: string[];
		
		if (currentList.includes(category)) {
			newList = currentList.filter((c: string) => c !== category);
		} else {
			newList = [...currentList, category];
		}
		
		const newFilter = {
			...searchFilter,
			search: {
				...searchFilter.search,
				categoryList: newList.length > 0 ? newList : undefined,
			},
		};
		
		if (!newList.length) delete newFilter.search.categoryList;
		
		await updateFilter(newFilter);
		
		if (newList.length > 0 && !completedSteps.has(STEPS.CATEGORY)) {
			setTimeout(() => advanceToNextStep(STEPS.CATEGORY), 300);
		}
	}, [searchFilter, completedSteps, updateFilter]);

	// Volume handler
	const handleVolumeSelect = useCallback(async (min: number, max: number) => {
		const newFilter = {
			...searchFilter,
			search: {
				...searchFilter.search,
				squaresRange: { start: min, end: max },
			},
		};
		
		await updateFilter(newFilter);
		
		if (!completedSteps.has(STEPS.VOLUME)) {
			setTimeout(() => advanceToNextStep(STEPS.VOLUME), 300);
		}
	}, [searchFilter, completedSteps, updateFilter]);

	// Price handler
	const handlePriceSelect = useCallback(async (min: number, max: number) => {
		const newFilter = {
			...searchFilter,
			search: {
				...searchFilter.search,
				pricesRange: { start: min, end: max },
			},
		};
		
		await updateFilter(newFilter);
	}, [searchFilter, updateFilter]);

	// Reset handler
	const handleReset = async () => {
		setActiveStep(STEPS.LOCATION);
		await router.push(
			`/property?input=${JSON.stringify(initialInput)}`,
			`/property?input=${JSON.stringify(initialInput)}`,
			{ scroll: false }
		);
	};

	const renderStepHeader = (
		step: number, 
		title: string, 
		icon: React.ReactNode,
		selectedCount?: number
	) => {
		const isActive = activeStep === step;
		const isCompleted = completedSteps.has(step);
		const isAccessible = step <= Math.max(activeStep, ...Array.from(completedSteps)) + 1;
		
		return (
			<Box
				className={`step-header ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${!isAccessible ? 'disabled' : ''}`}
				onClick={() => isAccessible && setActiveStep(step)}
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '16px 20px',
					backgroundColor: isActive ? 'var(--color-primary)' : isCompleted ? 'rgba(212, 168, 83, 0.1)' : 'var(--color-card-bg)',
					borderRadius: isActive ? '12px 12px 0 0' : '12px',
					cursor: isAccessible ? 'pointer' : 'not-allowed',
					opacity: isAccessible ? 1 : 0.5,
					transition: 'all 0.3s ease',
					border: isCompleted ? '2px solid #D4A853' : '2px solid transparent',
					marginBottom: isActive ? 0 : '12px',
					'&:hover': isAccessible ? {
						backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
					} : {},
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
					<Box
						sx={{
							width: '40px',
							height: '40px',
							borderRadius: '10px',
							backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : isCompleted ? '#D4A853' : 'var(--color-bg-secondary)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: isActive ? '#fff' : isCompleted ? '#fff' : 'var(--color-text)',
							transition: 'all 0.3s ease',
						}}
					>
						{isCompleted && !isActive ? <CheckCircleIcon /> : icon}
					</Box>
					<Box>
						<Typography
							sx={{
								fontWeight: 600,
								fontSize: '15px',
								color: isActive ? '#fff' : 'var(--color-text)',
								transition: 'color 0.3s ease',
							}}
						>
							{title}
						</Typography>
						{selectedCount !== undefined && selectedCount > 0 && (
							<Typography
								sx={{
									fontSize: '12px',
									color: isActive ? 'rgba(255,255,255,0.7)' : '#D4A853',
								}}
							>
								{selectedCount} selected
							</Typography>
						)}
					</Box>
				</Box>
				<ExpandMoreIcon
					sx={{
						transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
						transition: 'transform 0.3s ease',
						color: isActive ? '#fff' : 'var(--color-text-muted)',
					}}
				/>
			</Box>
		);
	};

	return (
		<Stack className="cascading-filter" sx={{ width: '100%' }}>
			{/* Reset Button */}
			<Box
				onClick={handleReset}
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '8px',
					padding: '12px',
					backgroundColor: 'var(--color-bg-secondary)',
					borderRadius: '10px',
					cursor: 'pointer',
					marginBottom: '20px',
					transition: 'all 0.3s ease',
					'&:hover': {
						backgroundColor: 'var(--color-primary)',
						color: '#fff',
						'& svg': { color: '#fff' },
						'& p': { color: '#fff' },
					},
				}}
			>
				<RestartAltIcon sx={{ color: 'var(--color-text-muted)', transition: 'color 0.3s ease' }} />
				<Typography sx={{ color: 'var(--color-text)', fontWeight: 500, transition: 'color 0.3s ease' }}>
					Reset All Filters
				</Typography>
			</Box>

			{/* Step 1: Location */}
			{renderStepHeader(
				STEPS.LOCATION, 
				'Select City', 
				<LocationOnOutlinedIcon />,
				searchFilter?.search?.locationList?.length
			)}
			<Collapse in={activeStep === STEPS.LOCATION}>
				<Box
					sx={{
						backgroundColor: 'var(--color-card-bg)',
						padding: '20px',
						borderRadius: '0 0 12px 12px',
						marginBottom: '12px',
						border: '2px solid var(--color-primary)',
						borderTop: 'none',
					}}
				>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
						{locations.map((location) => {
							const isSelected = searchFilter?.search?.locationList?.includes(location);
							return (
								<Chip
									key={location}
									label={location}
									onClick={() => handleLocationSelect(location)}
									sx={{
										backgroundColor: isSelected ? '#D4A853' : 'var(--color-bg-secondary)',
										color: isSelected ? '#fff' : 'var(--color-text)',
										fontWeight: 500,
										padding: '8px 4px',
										'&:hover': {
											backgroundColor: isSelected ? '#B8923D' : 'var(--color-bg-tertiary)',
										},
									}}
								/>
							);
						})}
					</Box>
				</Box>
			</Collapse>

			{/* Step 2: Product Type */}
			{renderStepHeader(
				STEPS.TYPE, 
				'Product Type', 
				<ViewInArOutlinedIcon />,
				searchFilter?.search?.typeList?.length
			)}
			<Collapse in={activeStep === STEPS.TYPE}>
				<Box
					sx={{
						backgroundColor: 'var(--color-card-bg)',
						padding: '20px',
						borderRadius: '0 0 12px 12px',
						marginBottom: '12px',
						border: '2px solid var(--color-primary)',
						borderTop: 'none',
					}}
				>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
						{types.map((type) => {
							const isSelected = searchFilter?.search?.typeList?.includes(type);
							return (
								<Chip
									key={type}
									label={type}
									onClick={() => handleTypeSelect(type)}
									sx={{
										backgroundColor: isSelected ? '#D4A853' : 'var(--color-bg-secondary)',
										color: isSelected ? '#fff' : 'var(--color-text)',
										fontWeight: 500,
										padding: '8px 4px',
										'&:hover': {
											backgroundColor: isSelected ? '#B8923D' : 'var(--color-bg-tertiary)',
										},
									}}
								/>
							);
						})}
					</Box>
				</Box>
			</Collapse>

			{/* Step 3: Category */}
			{renderStepHeader(
				STEPS.CATEGORY, 
				'Category', 
				<CategoryOutlinedIcon />,
				searchFilter?.search?.categoryList?.length
			)}
			<Collapse in={activeStep === STEPS.CATEGORY}>
				<Box
					sx={{
						backgroundColor: 'var(--color-card-bg)',
						padding: '20px',
						borderRadius: '0 0 12px 12px',
						marginBottom: '12px',
						border: '2px solid var(--color-primary)',
						borderTop: 'none',
					}}
				>
					<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
						{categories.map((category) => {
							const isSelected = searchFilter?.search?.categoryList?.includes(category);
							return (
								<Box
									key={category}
									onClick={() => handleCategorySelect(category)}
									sx={{
										padding: '14px 16px',
										backgroundColor: isSelected ? '#D4A853' : 'var(--color-bg-secondary)',
										color: isSelected ? '#fff' : 'var(--color-text)',
										borderRadius: '10px',
										cursor: 'pointer',
										textAlign: 'center',
										fontWeight: 500,
										fontSize: '13px',
										transition: 'all 0.2s ease',
										'&:hover': {
											backgroundColor: isSelected ? '#B8923D' : 'var(--color-bg-tertiary)',
											transform: 'translateY(-2px)',
										},
									}}
								>
									{category.replace('_', ' ')}
								</Box>
							);
						})}
					</Box>
				</Box>
			</Collapse>

			{/* Step 4: Volume/Size */}
			{renderStepHeader(
				STEPS.VOLUME, 
				'Size Range', 
				<ViewInArOutlinedIcon />
			)}
			<Collapse in={activeStep === STEPS.VOLUME}>
				<Box
					sx={{
						backgroundColor: 'var(--color-card-bg)',
						padding: '20px',
						borderRadius: '0 0 12px 12px',
						marginBottom: '12px',
						border: '2px solid var(--color-primary)',
						borderTop: 'none',
					}}
				>
					<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
						{[
							{ label: 'Small (0-50 m³)', min: 0, max: 50 },
							{ label: 'Medium (50-150 m³)', min: 50, max: 150 },
							{ label: 'Large (150-300 m³)', min: 150, max: 300 },
							{ label: 'X-Large (300+ m³)', min: 300, max: 500 },
						].map((range) => {
							const isSelected = 
								searchFilter?.search?.squaresRange?.start === range.min && 
								searchFilter?.search?.squaresRange?.end === range.max;
							return (
								<Box
									key={range.label}
									onClick={() => handleVolumeSelect(range.min, range.max)}
									sx={{
										padding: '14px 16px',
										backgroundColor: isSelected ? '#D4A853' : 'var(--color-bg-secondary)',
										color: isSelected ? '#fff' : 'var(--color-text)',
										borderRadius: '10px',
										cursor: 'pointer',
										textAlign: 'center',
										fontWeight: 500,
										fontSize: '13px',
										transition: 'all 0.2s ease',
										'&:hover': {
											backgroundColor: isSelected ? '#B8923D' : 'var(--color-bg-tertiary)',
											transform: 'translateY(-2px)',
										},
									}}
								>
									{range.label}
								</Box>
							);
						})}
					</Box>
				</Box>
			</Collapse>

			{/* Step 5: Price */}
			{renderStepHeader(
				STEPS.PRICE, 
				'Price Range', 
				<AttachMoneyIcon />
			)}
			<Collapse in={activeStep === STEPS.PRICE}>
				<Box
					sx={{
						backgroundColor: 'var(--color-card-bg)',
						padding: '20px',
						borderRadius: '0 0 12px 12px',
						marginBottom: '12px',
						border: '2px solid var(--color-primary)',
						borderTop: 'none',
					}}
				>
					<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
						{[
							{ label: 'Under $500', min: 0, max: 500 },
							{ label: '$500 - $1,000', min: 500, max: 1000 },
							{ label: '$1,000 - $5,000', min: 1000, max: 5000 },
							{ label: '$5,000 - $10,000', min: 5000, max: 10000 },
							{ label: '$10,000 - $50,000', min: 10000, max: 50000 },
							{ label: '$50,000+', min: 50000, max: 2000000 },
						].map((range) => {
							const isSelected = 
								searchFilter?.search?.pricesRange?.start === range.min && 
								searchFilter?.search?.pricesRange?.end === range.max;
							return (
								<Box
									key={range.label}
									onClick={() => handlePriceSelect(range.min, range.max)}
									sx={{
										padding: '14px 16px',
										backgroundColor: isSelected ? '#D4A853' : 'var(--color-bg-secondary)',
										color: isSelected ? '#fff' : 'var(--color-text)',
										borderRadius: '10px',
										cursor: 'pointer',
										textAlign: 'center',
										fontWeight: 500,
										fontSize: '13px',
										transition: 'all 0.2s ease',
										'&:hover': {
											backgroundColor: isSelected ? '#B8923D' : 'var(--color-bg-tertiary)',
											transform: 'translateY(-2px)',
										},
									}}
								>
									{range.label}
								</Box>
							);
						})}
					</Box>
				</Box>
			</Collapse>
		</Stack>
	);
};

export default CascadingFilter;




