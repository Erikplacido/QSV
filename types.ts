
export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface PoiRecommendation {
  id: string;
  text: string;
}

export interface PointOfInterest {
  id: string;
  title: string;
  recommendations: PoiRecommendation[];
}

// FIX: Added for compatibility with unused components
export interface Photo {
  id: string;
  name: string;
  dataUrl: string;
  comment: string;
  timestamp: number;
  location: GeoLocation | null;
}

export interface InspectionPhasePhoto {
    id: string;
    dataUrl: string | null; // Allow null for N/A
    timestamp: number;
    location: GeoLocation | null;
    selectedRecommendationIds: string[];
    comment: string;
    status: 'satisfactory' | 'not_satisfactory' | 'pending' | 'not_applicable';
}

export type InspectionPhase = InspectionPhasePhoto | null;

export type RiskLevel = 'critical' | 'medium' | 'low';

export interface PoiInstance {
  instanceId: string;
  poiId: string;
  phases: [InspectionPhase, InspectionPhase, InspectionPhase];
  currentPhase: number; // 0, 1, or 2
  // New fields for PDF Report
  riskLevel?: RiskLevel;
  deadline?: number; // in days
}

export enum InspectionType {
  INTERNAL = 'Interna',
  DELEGATED = 'Delegada',
}

export interface Inspection {
  id: string;
  establishmentName: string;
  address: string;
  type: InspectionType;
  date: number;
  poiInstances: PoiInstance[];
  photos?: Photo[]; // FIX: Added for compatibility with unused components
  // Extended Supermarket Data
  cnpj?: string;
  responsibleName?: string;
  contactPhone?: string;
  totalArea?: number;
  floors?: number;
  constructionYear?: number;
  operatingHours?: string;
}

// FIX: Added for compatibility with unused components
export interface Property {
    id: string;
    address: string;
    type: string;
    area: number;
    rooms: number;
    year: number;
    details?: string;
    inspections: Inspection[];
}
