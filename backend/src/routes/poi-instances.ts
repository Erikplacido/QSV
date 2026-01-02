import { Router, Response } from 'express';
import PoiInstance from '../models/PoiInstance';
import InspectionPhase, { PhaseStatus } from '../models/InspectionPhase';
import Inspection from '../models/Inspection';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Create POI instance
router.post('/', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { inspectionId, poiId, riskLevel, deadline } = req.body;

    if (!inspectionId || !poiId) {
      throw new AppError('inspectionId and poiId are required', 400);
    }

    // Verify inspection belongs to user
    const inspection = await Inspection.findOne({
      where: { id: inspectionId, userId: req.userId },
    });

    if (!inspection) {
      throw new AppError('Inspection not found', 404);
    }

    const poiInstance = await PoiInstance.create({
      inspectionId,
      poiId,
      currentPhase: 0,
      riskLevel: riskLevel || 'medium',
      deadline: deadline || 30,
    });

    res.status(201).json({ id: poiInstance.id });
  } catch (error) {
    next(error);
  }
});

// Update POI instance
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const poiInstance = await PoiInstance.findByPk(req.params.id, {
      include: [
        {
          model: Inspection,
          as: 'inspection',
        },
      ],
    });

    if (!poiInstance) {
      throw new AppError('POI instance not found', 404);
    }

    // Verify inspection belongs to user
    if ((poiInstance as any).inspection.userId !== req.userId) {
      throw new AppError('Unauthorized', 403);
    }

    const {
      currentPhase,
      riskLevel,
      deadline,
      phases,
    } = req.body;

    // Update POI instance
    await poiInstance.update({
      currentPhase: currentPhase !== undefined ? currentPhase : poiInstance.currentPhase,
      riskLevel,
      deadline,
    });

    // Update phases if provided
    if (phases && Array.isArray(phases)) {
      for (let i = 0; i < phases.length; i++) {
        const phaseData = phases[i];
        if (!phaseData) continue;

        const existingPhase = await InspectionPhase.findOne({
          where: {
            poiInstanceId: poiInstance.id,
            phaseNumber: i,
          },
        });

        if (existingPhase) {
          await existingPhase.update({
            photoUrl: phaseData.dataUrl || existingPhase.photoUrl,
            timestamp: phaseData.timestamp ? new Date(phaseData.timestamp) : existingPhase.timestamp,
            latitude: phaseData.location?.lat ? parseFloat(phaseData.location.lat.toString()) : existingPhase.latitude,
            longitude: phaseData.location?.lng ? parseFloat(phaseData.location.lng.toString()) : existingPhase.longitude,
            status: phaseData.status || existingPhase.status,
            comment: phaseData.comment || existingPhase.comment,
            selectedRecommendationIds: phaseData.selectedRecommendationIds || existingPhase.selectedRecommendationIds,
          });
        } else if (phaseData.dataUrl) {
          await InspectionPhase.create({
            poiInstanceId: poiInstance.id,
            phaseNumber: i,
            photoUrl: phaseData.dataUrl,
            timestamp: phaseData.timestamp ? new Date(phaseData.timestamp) : new Date(),
            latitude: phaseData.location?.lat ? parseFloat(phaseData.location.lat.toString()) : undefined,
            longitude: phaseData.location?.lng ? parseFloat(phaseData.location.lng.toString()) : undefined,
            status: phaseData.status || 'pending',
            comment: phaseData.comment || '',
            selectedRecommendationIds: phaseData.selectedRecommendationIds || [],
          });
        }
      }
    }

    res.json({ message: 'POI instance updated successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

