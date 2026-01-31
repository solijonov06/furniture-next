import React, { useState } from 'react';
import { Stack, Box, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ChairOutlinedIcon from '@mui/icons-material/ChairOutlined';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';
import TableRestaurantOutlinedIcon from '@mui/icons-material/TableRestaurantOutlined';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import LightOutlinedIcon from '@mui/icons-material/LightOutlined';
import Link from 'next/link';
import { useRouter } from 'next/router';

const MobileHero = () => {
	const router = useRouter();
	const [searchText, setSearchText] = useState('');

	const categories = [
		{ icon: <ChairOutlinedIcon />, label: 'Chairs', type: 'CHAIR' },
		{ icon: <WeekendOutlinedIcon />, label: 'Sofas', type: 'SOFA' },
		{ icon: <TableRestaurantOutlinedIcon />, label: 'Tables', type: 'TABLE' },
		{ icon: <BedOutlinedIcon />, label: 'Beds', type: 'BED' },
		{ icon: <LightOutlinedIcon />, label: 'Lighting', type: 'LIGHTING' },
	];

	const handleSearch = () => {
		if (searchText.trim()) {
			router.push({
				pathname: '/property',
				query: { search: searchText },
			});
		}
	};

	const handleCategoryClick = (type: string) => {
		router.push({
			pathname: '/property',
			query: { propertyType: type },
		});
	};

	return (
		<Stack className={'mobile-hero'}>
			{/* Background with gradient overlay */}
			<Box className={'hero-background'}>
				<Box className={'gradient-overlay'} />
			</Box>

			{/* Hero Content */}
			<Stack className={'hero-content'}>
				<Box className={'hero-badge'}>
					<span>Premium Furniture</span>
				</Box>
				
				<h1 className={'hero-title'}>
					Find Your Perfect
					<span className={'highlight'}> Furniture</span>
				</h1>
				
				<p className={'hero-subtitle'}>
					Discover curated collections from top designers
				</p>

				{/* Search Bar */}
				<Box className={'search-container'}>
					<Box className={'search-bar'}>
						<SearchIcon className={'search-icon'} />
						<InputBase
							placeholder="Search furniture..."
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
							className={'search-input'}
						/>
						<IconButton className={'search-btn'} onClick={handleSearch}>
							<SearchIcon />
						</IconButton>
					</Box>
				</Box>

				{/* Quick Categories */}
				<Box className={'quick-categories'}>
					<span className={'categories-label'}>Browse by Category</span>
					<Box className={'categories-scroll'}>
						{categories.map((cat, index) => (
							<Box 
								key={index} 
								className={'category-chip'}
								onClick={() => handleCategoryClick(cat.type)}
							>
								{cat.icon}
								<span>{cat.label}</span>
							</Box>
						))}
					</Box>
				</Box>

				{/* Stats Strip */}
				<Box className={'stats-strip'}>
					<Box className={'stat'}>
						<strong>500+</strong>
						<span>Products</span>
					</Box>
					<Box className={'divider'} />
					<Box className={'stat'}>
						<strong>50+</strong>
						<span>Designers</span>
					</Box>
					<Box className={'divider'} />
					<Box className={'stat'}>
						<strong>10K+</strong>
						<span>Happy Customers</span>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

export default MobileHero;
