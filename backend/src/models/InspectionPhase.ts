import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type PhaseStatus = 'satisfactory' | 'not_satisfactory' | 'pending' | 'not_applicable';

interface InspectionPhaseAttributes {
  id: string;
  poiInstanceId: string;
  phaseNumber: number;
  photoUrl?: string;
  timestamp: Date;
  latitude?: number;
  longitude?: number;
  status: PhaseStatus;
  comment?: string;
  selectedRecommendationIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface InspectionPhaseCreationAttributes extends Optional<InspectionPhaseAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class InspectionPhase extends Model<InspectionPhaseAttributes, InspectionPhaseCreationAttributes> implements InspectionPhaseAttributes {
  public id!: string;
  public poiInstanceId!: string;
  public phaseNumber!: number;
  public photoUrl?: string;
  public timestamp!: Date;
  public latitude?: number;
  public longitude?: number;
  public status!: PhaseStatus;
  public comment?: string;
  public selectedRecommendationIds!: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

InspectionPhase.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    poiInstanceId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      field: 'poi_instance_id',
      references: {
        model: 'poi_instances',
        key: 'id',
      },
    },
    phaseNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'phase_number',
      validate: {
        min: 0,
        max: 2,
      },
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'photo_url',
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('satisfactory', 'not_satisfactory', 'pending', 'not_applicable'),
      allowNull: false,
      defaultValue: 'pending',
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    selectedRecommendationIds: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      field: 'selected_recommendation_ids',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'inspection_phases',
    timestamps: true,
  }
);

export default InspectionPhase;

