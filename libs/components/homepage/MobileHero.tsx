import React, { useState } from 'react';
import { Stack, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChairOutlinedIcon from '@mui/icons-material/ChairOutlined';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';
import TableRestaurantOutlinedIcon from '@mui/icons-material/TableRestaurantOutlined';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import LightOutlinedIcon from '@mui/icons-material/LightOutlined';
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
			<div className={'hero-background'}>
				<div className={'gradient-overlay'} />
			</div>

			<Stack className={'hero-content'}>
				<div className={'hero-badge'}>
					<span>Premium Furniture</span>
				</div>
				
				<h1 className={'hero-title'}>
					Find Your Perfect
					<span className={'highlight'}> Furniture</span>
				</h1>
				
				<p className={'hero-subtitle'}>
					Discover curated collections from top designers
				</p>

				<div className={'search-container'}>
					<div className={'search-bar'}>
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
					</div>
				</div>

				<div className={'quick-categories'}>
					<span className={'categories-label'}>Browse by Category</span>
					<div className={'categories-scroll'}>
						{categories.map((cat, index) => (
							<div 
								key={index} 
								className={'category-chip'}
								onClick={() => handleCategoryClick(cat.type)}
							>
								{cat.icon}
								<span>{cat.label}</span>
							</div>
						))}
					</div>
				</div>

				<div className={'stats-strip'}>
					<div className={'stat'}>
						<strong>500+</strong>
						<span>Products</span>
					</div>
					<div className={'divider'} />
					<div className={'stat'}>
						<strong>50+</strong>
						<span>Designers</span>
					</div>
					<div className={'divider'} />
					<div className={'stat'}>
						<strong>10K+</strong>
						<span>Happy Customers</span>
					</div>
				</div>
			</Stack>
		</Stack>
	);
};

export default MobileHero;
