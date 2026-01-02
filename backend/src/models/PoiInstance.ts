import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type RiskLevel = 'critical' | 'medium' | 'low';

interface PoiInstanceAttributes {
  id: string;
  inspectionId: string;
  poiId: string;
  currentPhase: number;
  riskLevel?: RiskLevel;
  deadline?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PoiInstanceCreationAttributes extends Optional<PoiInstanceAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class PoiInstance extends Model<PoiInstanceAttributes, PoiInstanceCreationAttributes> implements PoiInstanceAttributes {
  public id!: string;
  public inspectionId!: string;
  public poiId!: string;
  public currentPhase!: number;
  public riskLevel?: RiskLevel;
  public deadline?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PoiInstance.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    inspectionId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      field: 'inspection_id',
      references: {
        model: 'inspections',
        key: 'id',
      },
    },
    poiId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'poi_id',
    },
    currentPhase: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'current_phase',
      validate: {
        min: 0,
        max: 2,
      },
    },
    riskLevel: {
      type: DataTypes.ENUM('critical', 'medium', 'low'),
      allowNull: true,
      field: 'risk_level',
    },
    deadline: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    tableName: 'poi_instances',
    timestamps: true,
  }
);

export default PoiInstance;

