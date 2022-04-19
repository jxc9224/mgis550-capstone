import { Sequelize, DataTypes, Model } from 'sequelize'

const sequelize = new Sequelize('sqlite:./data/mock-db.sqlite')

class Account extends Model {}
class DataEntry extends Model {}
class Product extends Model {}
class User extends Model {}

const sync = async () => {
  Account.init(
    {
      accountId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      addressLine1: { type: DataTypes.STRING, allowNull: false },
      addressLine2: { type: DataTypes.STRING, allowNull: true },
      country: { type: DataTypes.STRING, allowNull: false },
      state: { type: DataTypes.STRING, allowNull: false },
      city: { type: DataTypes.STRING, allowNull: false },
      zip: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize }
  )

  DataEntry.init(
    {
      entryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lifeCycleState: { type: DataTypes.STRING, allowNull: false },
      serialNumber: { type: DataTypes.STRING, allowNull: false },
      modified: { type: DataTypes.DATE, allowNull: false },
      productId: { type: DataTypes.INTEGER, allowNull: false },
      donorAccountId: { type: DataTypes.INTEGER, allowNull: false },
      recipientAccountId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize }
  )

  Product.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      productName: { type: DataTypes.STRING, allowNull: false },
      manufacturer: { type: DataTypes.STRING, allowNull: false },
      model: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize }
  )

  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      isAdministrator: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    { sequelize }
  )

  await sequelize.sync()
}

sync()

export { Account, DataEntry, Product, User }
