import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

class User extends Model {
  public id!: number
  public email!: string
  public password!: string
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'users',
    indexes: [{
      unique: true,
      fields: ['email']
    }]
  }
)

export default User
