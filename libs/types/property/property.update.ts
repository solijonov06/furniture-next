import { PropertyLocation, PropertyStatus, PropertyType, PropertyMaterial, PropertyCategory, FurnitureCondition } from '../../enums/property.enum';

export interface PropertyUpdate {
	_id: string;
	propertyType?: PropertyType;
	propertyStatus?: PropertyStatus;
	propertyLocation?: PropertyLocation;
	propertyAddress?: string;
	propertyTitle?: string;
	propertyPrice?: number;
	propertyVolume?: number;
	propertyImages?: string[];
	propertyDesc?: string;
	propertyMaterial?: PropertyMaterial;
	propertyCategory?: PropertyCategory;
	furnitureCondition?: FurnitureCondition;
	deliveryAvailable?: boolean;
	soldAt?: Date;
	deletedAt?: Date;
}
