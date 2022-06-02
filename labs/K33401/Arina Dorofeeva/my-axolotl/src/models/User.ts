import { DataTypes } from "@sequelize/core"
import bcrypt from "bcrypt"
import sequelize, { AssociableModel } from "../db"
import type { UserShape } from "./shapes"

class User extends AssociableModel implements UserShape {
  declare id: number
  declare username: string
  declare password: string
  declare getPosts: () => Promise<any[]>
  declare addPost: (post: any) => Promise<void>
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      set(value: string) {
        this.setDataValue("password", bcrypt.hashSync(value, 10))
      }
    }
  },
  {
    freezeTableName: true,
    sequelize
  }
)

sequelize.associableModels["User"] = User

User.associate = (models) => {
  User.belongsToMany(models["Post"], { through: "Favorites" })
}

export default User
export type { UserShape }
