import { PropertyLocation, PropertyStatus, PropertyType, PropertyMaterial, PropertyCategory, FurnitureCondition } from '../../enums/property.enum';
import { Direction } from '../../enums/common.enum';

export interface PropertyInput {
	propertyType: PropertyType;
	propertyLocation: PropertyLocation;
	propertyAddress: string;
	propertyTitle: string;
	propertyPrice: number;
	propertyVolume: number;
	propertyImages: string[];
	propertyDesc?: string;
	propertyMaterial?: PropertyMaterial;
	propertyCategory?: PropertyCategory;
	furnitureCondition?: FurnitureCondition;
	deliveryAvailable?: boolean;
	memberId?: string;
}

interface PISearch {
	memberId?: string;
	locationList?: PropertyLocation[];
	typeList?: PropertyType[];
	categoryList?: PropertyCategory[];
	materialList?: PropertyMaterial[];
	conditionList?: FurnitureCondition[];
	pricesRange?: Range;
	squaresRange?: Range;
	text?: string;
}

export interface PropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	propertyStatus?: PropertyStatus;
}

export interface AgentPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	propertyStatus?: PropertyStatus;
	propertyLocationList?: PropertyLocation[];
}

export interface AllPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}
