// Location types
export interface Location {
    id: string;
    name: string;
    address: string;
    distance?: number;
    coordinates?: {
        lat: number;
        lng: number;
    };
    phoneNumber?: string;
}

// Agent types
export interface Agent {
    id: string;
    name: string;
    address: string;
    distance: number;
    distanceUnit: string;
    rating?: number;
    isAvailable: boolean;
}

// Package types
export interface Package {
    id: string;
    name: string;
    description?: string;
    timeRange: string;
    originalPrice: number;
    discountedPrice: number;
    imageUrl: string;
}

// User types
export interface User {
    id: string;
    name: string;
    avatarUrl: string;
    status: string;
}

// Date selection types
export interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

// Search types
export interface SearchFilters {
    query: string;
    location?: Location;
    dateRange?: DateRange;
}

// Voucher types
export interface Voucher {
    id: string;
    title: string;
    description: string;
    discountPercentage: number;
    imageUrl: string;
    validUntil: Date;
}