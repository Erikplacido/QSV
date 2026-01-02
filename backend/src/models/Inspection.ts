import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export enum InspectionType {
  INTERNAL = 'Interna',
  DELEGATED = 'Delegada',
}

interface InspectionAttributes {
  id: string;
  companyId?: string;
  establishmentName: string;
  address: string;
  type: InspectionType;
  date: Date;
  cnpj?: string;
  responsibleName?: string;
  contactPhone?: string;
  totalArea?: number;
  floors?: number;
  constructionYear?: number;
  operatingHours?: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface InspectionCreationAttributes extends Optional<InspectionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Inspection extends Model<InspectionAttributes, InspectionCreationAttributes> implements InspectionAttributes {
  public id!: string;
  public companyId?: string;
  public establishmentName!: string;
  public address!: string;
  public type!: InspectionType;
  public date!: Date;
  public cnpj?: string;
  public responsibleName?: string;
  public contactPhone?: string;
  public totalArea?: number;
  public floors?: number;
  public constructionYear?: number;
  public operatingHours?: string;
  public userId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Inspection.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      field: 'company_id',
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    establishmentName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'establishment_name',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(InspectionType)),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cnpj: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    responsibleName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'responsible_name',
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'contact_phone',
    },
    totalArea: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'total_area',
    },
    floors: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    constructionYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'construction_year',
    },
    operatingHours: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'operating_hours',
    },
    userId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
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
    tableName: 'inspections',
    timestamps: true,
  }
);

export default Inspection;

