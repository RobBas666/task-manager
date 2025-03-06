import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

class Tag extends Model {
  public id!: number
  public label!: string
}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    tableName: 'tags'
  }
)

export default Tag
