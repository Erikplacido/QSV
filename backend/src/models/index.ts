import User from './User';
import Company from './Company';
import Inspection from './Inspection';
import PoiInstance from './PoiInstance';
import InspectionPhase from './InspectionPhase';
import DelegatedAccessToken from './DelegatedAccessToken';

// Define associations
Inspection.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Inspection.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

PoiInstance.belongsTo(Inspection, { foreignKey: 'inspectionId', as: 'inspection' });
PoiInstance.hasMany(InspectionPhase, { foreignKey: 'poiInstanceId', as: 'phases' });

InspectionPhase.belongsTo(PoiInstance, { foreignKey: 'poiInstanceId', as: 'poiInstance' });

Inspection.hasMany(PoiInstance, { foreignKey: 'inspectionId', as: 'poiInstances' });

DelegatedAccessToken.belongsTo(Inspection, { foreignKey: 'inspectionId', as: 'inspection' });

export {
  User,
  Company,
  Inspection,
  PoiInstance,
  InspectionPhase,
  DelegatedAccessToken,
};


