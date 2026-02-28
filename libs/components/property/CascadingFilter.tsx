import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Collapse,
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
	const { searchFilter, initialInput } = props;
	const router = useRouter();
	
	const [activeStep, setActiveStep] = useState<number>(STEPS.LOCATION);
	const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

	const locations = Object.values(PropertyLocation);
	const types = Object.values(PropertyType);
	const categories = Object.values(PropertyCategory);

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
		if ((searchFilter?.search?.squaresRange?.start ?? 0) > 0 || (searchFilter?.search?.squaresRange?.end ?? 500) < 500) {
			completed.add(STEPS.VOLUME);
		}
		if ((searchFilter?.search?.pricesRange?.start ?? 0) > 0 || (searchFilter?.search?.pricesRange?.end ?? 2000000) < 2000000) {
			completed.add(STEPS.PRICE);
		}
		
		setCompletedSteps(completed);
	}, [searchFilter]);

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

	const handleLocationSelect = useCallback(async (location: PropertyLocation) => {
		const currentList = searchFilter?.search?.locationList || [];
		let newList: PropertyLocation[];
		
		if (currentList.includes(location)) {
			newList = currentList.filter((l: PropertyLocation) => l !== location);
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

	const handleTypeSelect = useCallback(async (type: PropertyType) => {
		const currentList = searchFilter?.search?.typeList || [];
		let newList: PropertyType[];
		
		if (currentList.includes(type)) {
			newList = currentList.filter((t: PropertyType) => t !== type);
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

	const handleCategorySelect = useCallback(async (category: PropertyCategory) => {
		const currentList = searchFilter?.search?.categoryList || [];
		let newList: PropertyCategory[];
		
		if (currentList.includes(category)) {
			newList = currentList.filter((c: PropertyCategory) => c !== category);
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
			<div
				className={`step-header ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${!isAccessible ? 'disabled' : ''}`}
				onClick={() => isAccessible && setActiveStep(step)}
				style={{
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
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
					<div
						style={{
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
					</div>
					<div>
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
					</div>
				</div>
				<ExpandMoreIcon
					sx={{
						transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
						transition: 'transform 0.3s ease',
						color: isActive ? '#fff' : 'var(--color-text-muted)',
					}}
				/>
			</div>
		);
	};

	const stepContentStyle: React.CSSProperties = {
		backgroundColor: 'var(--color-card-bg)',
		padding: '20px',
		borderRadius: '0 0 12px 12px',
		marginBottom: '12px',
		border: '2px solid var(--color-primary)',
		borderTop: 'none',
	};

	const chipGridStyle: React.CSSProperties = {
		display: 'flex',
		flexWrap: 'wrap',
		gap: '10px',
	};

	const boxGridStyle: React.CSSProperties = {
		display: 'grid',
		gridTemplateColumns: 'repeat(2, 1fr)',
		gap: '10px',
	};

	return (
		<Stack className="cascading-filter" sx={{ width: '100%' }}>
			{/* Reset Button */}
			<div
				onClick={handleReset}
				className="reset-button"
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '8px',
					padding: '12px',
					backgroundColor: 'var(--color-bg-secondary)',
					borderRadius: '10px',
					cursor: 'pointer',
					marginBottom: '20px',
				}}
			>
				<RestartAltIcon sx={{ color: 'var(--color-text-muted)' }} />
				<Typography sx={{ color: 'var(--color-text)', fontWeight: 500 }}>
					Reset All Filters
				</Typography>
			</div>

			{/* Step 1: Location */}
			{renderStepHeader(STEPS.LOCATION, 'Select City', <LocationOnOutlinedIcon />, searchFilter?.search?.locationList?.length)}
			<Collapse in={activeStep === STEPS.LOCATION}>
				<div style={stepContentStyle}>
					<div style={chipGridStyle}>
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
										'&:hover': { backgroundColor: isSelected ? '#B8923D' : 'var(--color-bg-tertiary)' },
									}}
								/>
							);
						})}
					</div>
				</div>
			</Collapse>

			{/* Step 2: Product Type */}
			{renderStepHeader(STEPS.TYPE, 'Product Type', <ViewInArOutlinedIcon />, searchFilter?.search?.typeList?.length)}
			<Collapse in={activeStep === STEPS.TYPE}>
				<div style={stepContentStyle}>
					<div style={chipGridStyle}>
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
										'&:hover': { backgroundColor: isSelected ? '#B8923D' : 'var(--color-bg-tertiary)' },
									}}
								/>
							);
						})}
					</div>
				</div>
			</Collapse>

			{/* Step 3: Category */}
			{renderStepHeader(STEPS.CATEGORY, 'Category', <CategoryOutlinedIcon />, searchFilter?.search?.categoryList?.length)}
			<Collapse in={activeStep === STEPS.CATEGORY}>
				<div style={stepContentStyle}>
					<div style={boxGridStyle}>
						{categories.map((category) => {
							const isSelected = searchFilter?.search?.categoryList?.includes(category);
							return (
								<div
									key={category}
									onClick={() => handleCategorySelect(category)}
									style={{
										padding: '14px 16px',
										backgroundColor: isSelected ? '#D4A853' : 'var(--color-bg-secondary)',
										color: isSelected ? '#fff' : 'var(--color-text)',
										borderRadius: '10px',
										cursor: 'pointer',
										textAlign: 'center',
										fontWeight: 500,
										fontSize: '13px',
										transition: 'all 0.2s ease',
									}}
								>
									{category.replace('_', ' ')}
								</div>
							);
						})}
					</div>
				</div>
			</Collapse>

			{/* Step 4: Volume/Size */}
			{renderStepHeader(STEPS.VOLUME, 'Size Range', <ViewInArOutlinedIcon />)}
			<Collapse in={activeStep === STEPS.VOLUME}>
				<div style={stepContentStyle}>
					<div style={boxGridStyle}>
						{[
							{ label: 'Small (0-50 m³)', min: 0, max: 50 },
							{ label: 'Medium (50-150 m³)', min: 50, max: 150 },
							{ label: 'Large (150-300 m³)', min: 150, max: 300 },
							{ label: 'X-Large (300+ m³)', min: 300, max: 500 },
						].map((range) => {
							const isSelected = searchFilter?.search?.squaresRange?.start === range.min && searchFilter?.search?.squaresRange?.end === range.max;
							return (
								<div
									key={range.label}
									onClick={() => handleVolumeSelect(range.min, range.max)}
									style={{
										padding: '14px 16px',
										backgroundColor: isSelected ? '#D4A853' : 'var(--color-bg-secondary)',
										color: isSelected ? '#fff' : 'var(--color-text)',
										borderRadius: '10px',
										cursor: 'pointer',
										textAlign: 'center',
										fontWeight: 500,
										fontSize: '13px',
										transition: 'all 0.2s ease',
									}}
								>
									{range.label}
								</div>
							);
						})}
					</div>
				</div>
			</Collapse>

			{/* Step 5: Price */}
			{renderStepHeader(STEPS.PRICE, 'Price Range', <AttachMoneyIcon />)}
			<Collapse in={activeStep === STEPS.PRICE}>
				<div style={stepContentStyle}>
					<div style={boxGridStyle}>
						{[
							{ label: 'Under $500', min: 0, max: 500 },
							{ label: '$500 - $1,000', min: 500, max: 1000 },
							{ label: '$1,000 - $5,000', min: 1000, max: 5000 },
							{ label: '$5,000 - $10,000', min: 5000, max: 10000 },
							{ label: '$10,000 - $50,000', min: 10000, max: 50000 },
							{ label: '$50,000+', min: 50000, max: 2000000 },
						].map((range) => {
							const isSelected = searchFilter?.search?.pricesRange?.start === range.min && searchFilter?.search?.pricesRange?.end === range.max;
							return (
								<div
									key={range.label}
									onClick={() => handlePriceSelect(range.min, range.max)}
									style={{
										padding: '14px 16px',
										backgroundColor: isSelected ? '#D4A853' : 'var(--color-bg-secondary)',
										color: isSelected ? '#fff' : 'var(--color-text)',
										borderRadius: '10px',
										cursor: 'pointer',
										textAlign: 'center',
										fontWeight: 500,
										fontSize: '13px',
										transition: 'all 0.2s ease',
									}}
								>
									{range.label}
								</div>
							);
						})}
					</div>
				</div>
			</Collapse>
		</Stack>
	);
};

export default CascadingFilter;
