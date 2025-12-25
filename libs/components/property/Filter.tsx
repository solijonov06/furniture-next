import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
	Box,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PropertyLocation, PropertyType, PropertyCategory, PropertyMaterial } from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { propertyVolume } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';
import ChairOutlinedIcon from '@mui/icons-material/ChairOutlined';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import KitchenOutlinedIcon from '@mui/icons-material/KitchenOutlined';
import DeskOutlinedIcon from '@mui/icons-material/DeskOutlined';
import YardOutlinedIcon from '@mui/icons-material/YardOutlined';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: PropertiesInquiry;
	setSearchFilter: any;
	initialInput: PropertiesInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [propertyLocation, setPropertyLocation] = useState<PropertyLocation[]>(Object.values(PropertyLocation));
	const [propertyType, setPropertyType] = useState<PropertyType[]>(Object.values(PropertyType));
	const [propertyCategory, setPropertyCategory] = useState<PropertyCategory[]>(Object.values(PropertyCategory));
	const [propertyMaterial, setPropertyMaterial] = useState<PropertyMaterial[]>(Object.values(PropertyMaterial));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);

	/** LIFECYCLES **/
	useEffect(() => {
	

		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);
			router.push(`/property?input=${JSON.stringify({
			...searchFilter,
			search: {
				...searchFilter.search,
			},
		})}`, `/property?input=${JSON.stringify({
			...searchFilter,
			search: {
				...searchFilter.search,
			},
		})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router.push(`/property?input=${JSON.stringify({
			...searchFilter,
			search: {
				...searchFilter.search,
			},
		})}`, `/property?input=${JSON.stringify({
			...searchFilter,
			search: {
				...searchFilter.search,
			},
		})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.categoryList?.length == 0) {
			delete searchFilter.search.categoryList;
			router.push(`/property?input=${JSON.stringify({
			...searchFilter,
			search: {
				...searchFilter.search,
			},
		})}`, `/property?input=${JSON.stringify({
			...searchFilter,
			search: {
				...searchFilter.search,
			},
		})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.materialList?.length == 0) {
			delete searchFilter.search.materialList;
			router.push(`/property?input=${JSON.stringify({
			...searchFilter,
			search: {
				...searchFilter.search,
			},
		})}`, `/property?input=${JSON.stringify({
			...searchFilter,
			search: {
				...searchFilter.search,
			},
		})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.locationList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/
	const propertyLocationSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('propertyLocationSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, propertyLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('propertyTypeSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, propertyTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyCategorySelectHandler = useCallback(
		async (category: string) => {
			try {
				if (category !== 'ANY') {
					if (searchFilter?.search?.categoryList?.includes(category as PropertyCategory)) {
						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									categoryList: searchFilter?.search?.categoryList?.filter((item: string) => item !== category),
								},
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									categoryList: searchFilter?.search?.categoryList?.filter((item: string) => item !== category),
								},
							})}`,
							{ scroll: false },
						);
					} else {
						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, categoryList: [...(searchFilter?.search?.categoryList || []), category] },
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, categoryList: [...(searchFilter?.search?.categoryList || []), category] },
							})}`,
							{ scroll: false },
						);
					}
				} else {
					delete searchFilter?.search.categoryList;
					setSearchFilter({ ...searchFilter });
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('propertyCategorySelectHandler:', category);
			} catch (err: any) {
				console.log('ERROR, propertyCategorySelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyMaterialSelectHandler = useCallback(
		async (material: string) => {
			try {
				if (material !== 'ANY') {
					if (searchFilter?.search?.materialList?.includes(material as PropertyMaterial)) {
						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									materialList: searchFilter?.search?.materialList?.filter((item: string) => item !== material),
								},
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									materialList: searchFilter?.search?.materialList?.filter((item: string) => item !== material),
								},
							})}`,
							{ scroll: false },
						);
					} else {
						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, materialList: [...(searchFilter?.search?.materialList || []), material] },
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, materialList: [...(searchFilter?.search?.materialList || []), material] },
							})}`,
							{ scroll: false },
						);
					}
				} else {
					delete searchFilter?.search.materialList;
					setSearchFilter({ ...searchFilter });
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('propertyMaterialSelectHandler:', material);
			} catch (err: any) {
				console.log('ERROR, propertyMaterialSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyVolumeHandler = useCallback(
		async (e: any, type: string) => {
			const value = e.target.value;

			if (type == 'start') {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							squaresRange: { ...searchFilter.search.squaresRange, start: value },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							squaresRange: { ...searchFilter.search.squaresRange, start: value },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							squaresRange: { ...searchFilter.search.squaresRange, end: value },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							squaresRange: { ...searchFilter.search.squaresRange, end: value },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const propertyPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/property?input=${JSON.stringify(initialInput)}`,
				`/property?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	// Category icons mapping
	const categoryIcons: { [key: string]: JSX.Element } = {
		BEDROOM: <BedOutlinedIcon />,
		LIVING_ROOM: <WeekendOutlinedIcon />,
		KITCHEN: <KitchenOutlinedIcon />,
		OFFICE: <DeskOutlinedIcon />,
		OUTDOOR: <YardOutlinedIcon />,
	};

	if (device === 'mobile') {
		return <div>PROPERTIES FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				{/* Decorative Furniture Banner */}
				<Box className={'filter-banner'}>
					<Box className={'banner-content'}>
						<ChairOutlinedIcon className={'banner-icon'} />
						<Typography className={'banner-title'}>Discover Quality</Typography>
						<Typography className={'banner-subtitle'}>Premium furniture for every space</Typography>
					</Box>
				</Box>

				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Furniture</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What are you looking for?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						Location
					</p>
					<Stack
						className={`property-location`}
						style={{ height: showMore ? '253px' : '115px' }}
						onMouseEnter={() => setShowMore(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.locationList) {
								setShowMore(false);
							}
						}}
					>
						{propertyLocation.map((location: string) => {
							return (
								<Stack className={'input-box'} key={location}>
									<Checkbox
										id={location}
										className="property-checkbox"
										color="default"
										size="small"
										value={location}
										checked={(searchFilter?.search?.locationList || []).includes(location as PropertyLocation)}
										onChange={propertyLocationSelectHandler}
									/>
									<label htmlFor={location} style={{ cursor: 'pointer' }}>
										<Typography className="property-type">{location}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Product Type</Typography>
					{propertyType.map((type: string) => (
						<Stack className={'input-box'} key={type}>
							<Checkbox
								id={type}
								className="property-checkbox"
								color="default"
								size="small"
								value={type}
								onChange={propertyTypeSelectHandler}
								checked={(searchFilter?.search?.typeList || []).includes(type as PropertyType)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="property_type">{type}</Typography>
							</label>
						</Stack>
					))}
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Category</Typography>
					<Stack className="category-grid">
						{propertyCategory.map((category: string) => (
							<Box 
								key={category}
								className={`category-card ${searchFilter?.search?.categoryList?.includes(category as PropertyCategory) ? 'active' : ''}`}
								onClick={() => propertyCategorySelectHandler(category)}
							>
								<Box className="category-icon">
									{categoryIcons[category] || <ChairOutlinedIcon />}
								</Box>
								<Typography className="category-label">
									{category.replace('_', ' ')}
								</Typography>
							</Box>
						))}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Material</Typography>
					<Stack className="material-chips">
						{propertyMaterial.map((material: string) => (
							<Box 
								key={material}
								className={`material-chip ${searchFilter?.search?.materialList?.includes(material as PropertyMaterial) ? 'active' : ''}`}
								onClick={() => propertyMaterialSelectHandler(material)}
							>
								<span className="material-swatch" data-material={material.toLowerCase()} />
								<Typography>{material}</Typography>
							</Box>
						))}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Size (m³)</Typography>
					<Stack className="square-year-input">
						<FormControl>
							<InputLabel id="demo-simple-select-label">Min</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={searchFilter?.search?.squaresRange?.start ?? 0}
								label="Min"
								onChange={(e: any) => propertyVolumeHandler(e, 'start')}
								MenuProps={MenuProps}
							>
								{propertyVolume.map((square: number) => (
									<MenuItem
										value={square}
										disabled={(searchFilter?.search?.squaresRange?.end || 0) < square}
										key={square}
									>
										{square}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<div className="central-divider"></div>
						<FormControl>
							<InputLabel id="demo-simple-select-label">Max</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={searchFilter?.search?.squaresRange?.end ?? 500}
								label="Max"
								onChange={(e: any) => propertyVolumeHandler(e, 'end')}
								MenuProps={MenuProps}
							>
								{propertyVolume.map((square: number) => (
									<MenuItem
										value={square}
										disabled={(searchFilter?.search?.squaresRange?.start || 0) > square}
										key={square}
									>
										{square}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'}>
					<Typography className={'title'}>Price Range</Typography>
					<Stack className="square-year-input">
						<input
							type="number"
							placeholder="$ min"
							min={0}
							value={searchFilter?.search?.pricesRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									propertyPriceHandler(e.target.value, 'start');
								}
							}}
						/>
						<div className="central-divider"></div>
						<input
							type="number"
							placeholder="$ max"
							value={searchFilter?.search?.pricesRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									propertyPriceHandler(e.target.value, 'end');
								}
							}}
						/>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
