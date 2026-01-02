import { Router, Response } from 'express';
import Inspection, { InspectionType } from '../models/Inspection';
import PoiInstance from '../models/PoiInstance';
import InspectionPhase from '../models/InspectionPhase';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
// POI data - in production, this should come from database or config
// For now, we'll use a simplified approach
const POINTS_OF_INTEREST_DATA = [
  { id: '1', title: 'Extintor' },
  { id: '2', title: 'Hidrante' },
  // Add more as needed - in production, load from database
];

const router = Router();

// Get all inspections for current user
router.get('/', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const inspections = await Inspection.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: PoiInstance,
          as: 'poiInstances',
          include: [
            {
              model: InspectionPhase,
              as: 'phases',
            },
          ],
        },
      ],
      order: [['date', 'DESC']],
    });

    // Transform to match frontend format
    const transformed = inspections.map((inspection: any) => ({
      id: inspection.id,
      establishmentName: inspection.establishmentName,
      address: inspection.address,
      type: inspection.type,
      date: new Date(inspection.date).getTime(),
      cnpj: inspection.cnpj,
      responsibleName: inspection.responsibleName,
      contactPhone: inspection.contactPhone,
      totalArea: inspection.totalArea ? parseFloat(inspection.totalArea.toString()) : undefined,
      floors: inspection.floors,
      constructionYear: inspection.constructionYear,
      operatingHours: inspection.operatingHours,
      poiInstances: (inspection.poiInstances || []).map((pi: any) => ({
        instanceId: pi.id,
        poiId: pi.poiId,
        currentPhase: pi.currentPhase,
        riskLevel: pi.riskLevel,
        deadline: pi.deadline,
        phases: [
          pi.phases?.find((p: any) => p.phaseNumber === 0) || null,
          pi.phases?.find((p: any) => p.phaseNumber === 1) || null,
          pi.phases?.find((p: any) => p.phaseNumber === 2) || null,
        ].map((phase: any) => phase ? {
          id: phase.id,
          dataUrl: phase.photoUrl,
          timestamp: new Date(phase.timestamp).getTime(),
          location: phase.latitude && phase.longitude ? {
            lat: parseFloat(phase.latitude.toString()),
            lng: parseFloat(phase.longitude.toString()),
          } : null,
          selectedRecommendationIds: phase.selectedRecommendationIds || [],
          comment: phase.comment || '',
          status: phase.status,
        } : null),
      })),
    }));

    res.json(transformed);
  } catch (error) {
    next(error);
  }
});

// Get single inspection
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const inspection = await Inspection.findOne({
      where: { id: req.params.id, userId: req.userId },
      include: [
        {
          model: PoiInstance,
          as: 'poiInstances',
          include: [
            {
              model: InspectionPhase,
              as: 'phases',
            },
          ],
        },
      ],
    });

    if (!inspection) {
      throw new AppError('Inspection not found', 404);
    }

    // Transform to match frontend format
    const transformed = {
      id: (inspection as any).id,
      establishmentName: (inspection as any).establishmentName,
      address: (inspection as any).address,
      type: (inspection as any).type,
      date: new Date((inspection as any).date).getTime(),
      cnpj: (inspection as any).cnpj,
      responsibleName: (inspection as any).responsibleName,
      contactPhone: (inspection as any).contactPhone,
      totalArea: (inspection as any).totalArea ? parseFloat((inspection as any).totalArea.toString()) : undefined,
      floors: (inspection as any).floors,
      constructionYear: (inspection as any).constructionYear,
      operatingHours: (inspection as any).operatingHours,
      poiInstances: ((inspection as any).poiInstances || []).map((pi: any) => ({
        instanceId: pi.id,
        poiId: pi.poiId,
        currentPhase: pi.currentPhase,
        riskLevel: pi.riskLevel,
        deadline: pi.deadline,
        phases: [
          pi.phases?.find((p: any) => p.phaseNumber === 0) || null,
          pi.phases?.find((p: any) => p.phaseNumber === 1) || null,
          pi.phases?.find((p: any) => p.phaseNumber === 2) || null,
        ].map((phase: any) => phase ? {
          id: phase.id,
          dataUrl: phase.photoUrl,
          timestamp: new Date(phase.timestamp).getTime(),
          location: phase.latitude && phase.longitude ? {
            lat: parseFloat(phase.latitude.toString()),
            lng: parseFloat(phase.longitude.toString()),
          } : null,
          selectedRecommendationIds: phase.selectedRecommendationIds || [],
          comment: phase.comment || '',
          status: phase.status,
        } : null),
      })),
    };

    res.json(transformed);
  } catch (error) {
    next(error);
  }
});

// Create inspection
router.post('/', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const {
      establishmentName,
      address,
      type,
      cnpj,
      responsibleName,
      contactPhone,
      totalArea,
      floors,
      constructionYear,
      operatingHours,
    } = req.body;

    if (!establishmentName || !address || !type) {
      throw new AppError('establishmentName, address, and type are required', 400);
    }

    const inspection = await Inspection.create({
      establishmentName,
      address,
      type: type as InspectionType,
      date: new Date(),
      cnpj,
      responsibleName,
      contactPhone,
      totalArea: totalArea ? parseFloat(totalArea) : undefined,
      floors: floors ? parseInt(floors) : undefined,
      constructionYear: constructionYear ? parseInt(constructionYear) : undefined,
      operatingHours,
      userId: req.userId!,
    });

    // If delegated type, create POI instances for all POIs
    if (type === InspectionType.DELEGATED) {
      const instances = await Promise.all(
        POINTS_OF_INTEREST_DATA.map(poi =>
          PoiInstance.create({
            inspectionId: inspection.id,
            poiId: poi.id,
            currentPhase: 0,
            riskLevel: 'medium',
            deadline: 30,
          })
        )
      );
    }

    res.status(201).json({ id: inspection.id });
  } catch (error) {
    next(error);
  }
});

// Update inspection
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const inspection = await Inspection.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!inspection) {
      throw new AppError('Inspection not found', 404);
    }

    const {
      establishmentName,
      address,
      cnpj,
      responsibleName,
      contactPhone,
      totalArea,
      floors,
      constructionYear,
      operatingHours,
    } = req.body;

    await inspection.update({
      establishmentName,
      address,
      cnpj,
      responsibleName,
      contactPhone,
      totalArea: totalArea ? parseFloat(totalArea) : undefined,
      floors: floors ? parseInt(floors) : undefined,
      constructionYear: constructionYear ? parseInt(constructionYear) : undefined,
      operatingHours,
    });

    res.json({ message: 'Inspection updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete inspection
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const inspection = await Inspection.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!inspection) {
      throw new AppError('Inspection not found', 404);
    }

    await inspection.destroy();
    res.json({ message: 'Inspection deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

