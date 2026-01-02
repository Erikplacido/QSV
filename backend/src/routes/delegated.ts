import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import DelegatedAccessToken from '../models/DelegatedAccessToken';
import Inspection from '../models/Inspection';
import PoiInstance from '../models/PoiInstance';
import InspectionPhase, { PhaseStatus } from '../models/InspectionPhase';
import { AppError } from '../middleware/errorHandler';
// POI data - in production, this should come from database or config
const POINTS_OF_INTEREST_DATA = [
  { id: '1', title: 'Extintor' },
  { id: '2', title: 'Hidrante' },
  // Add more as needed - in production, load from database
];

const router = Router();

// Get inspection data for delegated access (public, no auth required)
router.get('/:token', async (req: Request, res: Response, next) => {
  try {
    const { token } = req.params;

    const accessToken = await DelegatedAccessToken.findOne({
      where: { token },
      include: [
        {
          model: Inspection,
          as: 'inspection',
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
        },
      ],
    });

    if (!accessToken) {
      throw new AppError('Invalid access token', 404);
    }

    if (new Date(accessToken.expiresAt) < new Date()) {
      throw new AppError('Access token has expired', 401);
    }

    const inspection = (accessToken as any).inspection;

    if (!inspection) {
      throw new AppError('Inspection not found', 404);
    }

    // Transform to match frontend format
    const transformed = {
      id: inspection.id,
      establishmentName: inspection.establishmentName,
      address: inspection.address,
      type: inspection.type,
      date: new Date(inspection.date).getTime(),
      poiTypes: POINTS_OF_INTEREST_DATA,
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
    };

    res.json(transformed);
  } catch (error) {
    next(error);
  }
});

// Capture photo for delegated access (public, no auth required)
router.post('/:token/capture', async (req: Request, res: Response, next) => {
  try {
    const { token } = req.params;
    const { poiId, photoUrl, location, timestamp, isNotApplicable } = req.body;

    const accessToken = await DelegatedAccessToken.findOne({
      where: { token },
      include: [
        {
          model: Inspection,
          as: 'inspection',
        },
      ],
    });

    if (!accessToken) {
      throw new AppError('Invalid access token', 404);
    }

    if (new Date(accessToken.expiresAt) < new Date()) {
      throw new AppError('Access token has expired', 401);
    }

    const inspection = (accessToken as any).inspection;

    // Find or create POI instance
    let poiInstance = await PoiInstance.findOne({
      where: {
        inspectionId: inspection.id,
        poiId,
      },
    });

    if (!poiInstance) {
      poiInstance = await PoiInstance.create({
        inspectionId: inspection.id,
        poiId,
        currentPhase: 0,
        riskLevel: 'medium',
        deadline: 30,
      });
    }

    // Create or update phase 0
    const existingPhase = await InspectionPhase.findOne({
      where: {
        poiInstanceId: poiInstance.id,
        phaseNumber: 0,
      },
    });

    if (existingPhase) {
      await existingPhase.update({
        photoUrl: isNotApplicable ? null : photoUrl,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        latitude: location?.lat ? parseFloat(location.lat.toString()) : undefined,
        longitude: location?.lng ? parseFloat(location.lng.toString()) : undefined,
        status: isNotApplicable ? 'not_applicable' : 'pending',
        comment: isNotApplicable ? 'Não se aplica ao local.' : '',
      });
    } else {
      await InspectionPhase.create({
        poiInstanceId: poiInstance.id,
        phaseNumber: 0,
        photoUrl: isNotApplicable ? null : photoUrl,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        latitude: location?.lat ? parseFloat(location.lat.toString()) : undefined,
        longitude: location?.lng ? parseFloat(location.lng.toString()) : undefined,
        status: isNotApplicable ? 'not_applicable' : 'pending',
        comment: isNotApplicable ? 'Não se aplica ao local.' : '',
        selectedRecommendationIds: [],
      });
    }

    res.json({ message: 'Photo captured successfully' });
  } catch (error) {
    next(error);
  }
});

// Generate delegated access token (requires auth)
import { requireAuth, AuthRequest } from '../middleware/auth';

router.post('/generate/:inspectionId', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { inspectionId } = req.params;
    const expiresInDays = 30; // Default 30 days

    const inspection = await Inspection.findOne({
      where: { id: inspectionId, userId: req.userId },
    });

    if (!inspection) {
      throw new AppError('Inspection not found', 404);
    }

    // Delete existing tokens for this inspection
    await DelegatedAccessToken.destroy({
      where: { inspectionId },
    });

    // Create new token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const accessToken = await DelegatedAccessToken.create({
      inspectionId,
      token: uuidv4(),
      expiresAt,
    });

    res.json({
      token: accessToken.token,
      expiresAt: accessToken.expiresAt,
      url: `/delegated/${accessToken.token}`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

