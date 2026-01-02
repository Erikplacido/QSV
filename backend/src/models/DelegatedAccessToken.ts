import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface DelegatedAccessTokenAttributes {
  id: string;
  inspectionId: string;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DelegatedAccessTokenCreationAttributes extends Optional<DelegatedAccessTokenAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class DelegatedAccessToken extends Model<DelegatedAccessTokenAttributes, DelegatedAccessTokenCreationAttributes> implements DelegatedAccessTokenAttributes {
  public id!: string;
  public inspectionId!: string;
  public token!: string;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DelegatedAccessToken.init(
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
    token: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
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
    tableName: 'delegated_access_tokens',
    timestamps: true,
  }
);

export default DelegatedAccessToken;

