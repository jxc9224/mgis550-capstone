/**
 * @author John Carr <jxc9224@rit.edu>
 * @license MIT
 */

import { DateTimeResolver } from 'graphql-scalars'
import { Account, DataEntry, Product, User } from '../model.js'

const forEachAsync = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

export const resolvers = {
  LifeCycleState: {
    DISTRIBUTED: 'Distributed',
    EWASTE: 'E-Waste Scrapped',
    PENDING: 'Pending',
    PROBLEM: 'Problem',
    RECEIVED: 'Received',
  },
  Query: {
    findAllAccounts: async () => await Account.findAll(),
    findAllDataEntries: async () => await DataEntry.findAll(),
    findAllProducts: async () => await Product.findAll(),
    findAllUsers: async () => await User.findAll(),

    findAccountById: async (_, { accountId }) =>
      await Account.findByPk(accountId),
    findDataEntryById: async (_, { entryId }) =>
      await DataEntry.findByPk(entryId),
    findProductById: async (_, { productId }) =>
      await Product.findByPk(productId),
    findUserById: async (_, { userId }) =>
      await User.findOne({
        where: { userId: userId },
      }),

    findFirstAccountMatchName: async (_, { name }) => {
      return (await Account.findAll()).find(
        (account) =>
          account
            .getDataValue('name')
            .toLowerCase()
            .indexOf(name.toLowerCase()) === 0
      )
    },
    findAllAccountsMatchName: async (_, { name }) => {
      const queriedAccounts = []
      const allAccounts = await Account.findAll()

      await forEachAsync(allAccounts, async (account) => {
        if (
          account
            .getDataValue('name')
            .toLowerCase()
            .indexOf(name.toLowerCase()) === 0
        ) {
          queriedAccounts.push(account)
        }
      })

      return queriedAccounts
    },

    // query heavily relies on data integrity
    // this requires strict checks when adding new data entries
    findAllDataEntriesInGridFormat: async (_, {}) => {
      const queriedData = []
      const dataEntries = await DataEntry.findAll()

      if (dataEntries.length > 0) {
        await forEachAsync(dataEntries, async (entry) => {
          const productId = entry.getDataValue('productId')
          const donorAccountId = entry.getDataValue('donorAccountId')
          const recipientAccountId = entry.getDataValue('recipientAccountId')

          let model = '{N/A}'
          let productName = '{N/A}'
          let manufacturer = '{N/A}'
          let donorAccountName = '{N/A}'
          let recipientAccountName = '{N/A}'

          if (productId !== -1) {
            const product = await Product.findByPk(productId)
            manufacturer = product.getDataValue('manufacturer')
            productName = product.getDataValue('productName')
            model = product.getDataValue('model')
          }

          if (donorAccountId !== -1) {
            const donor = await Account.findByPk(donorAccountId)
            donorAccountName = donor.getDataValue('name')
          }

          if (recipientAccountId !== -1) {
            const recipient = await Account.findByPk(recipientAccountId)
            recipientAccountName = recipient.getDataValue('name')
          }

          queriedData.push({
            entryId: entry.getDataValue('entryId'),
            modified: entry.getDataValue('modified'),
            serialNumber: entry.getDataValue('serialNumber'),
            lifeCycleState: entry.getDataValue('lifeCycleState'),
            model: model,
            productName: productName,
            manufacturer: manufacturer,
            donorAccount: donorAccountName,
            recipientAccount: recipientAccountName,
          })
        })
      }

      return queriedData
    },

    findFirstProductMatchName: async (_, { productName }) => {
      return (await Product.findAll()).find(
        (product) =>
          product
            .getDataValue('productName')
            .toLowerCase()
            .indexOf(productName.toLowerCase()) === 0
      )
    },
    findFirstProductMatchManufacturer: async (_, { manufacturer }) => {
      return (await Product.findAll()).find(
        (product) =>
          product
            .getDataValue('manufacturer')
            .toLowerCase()
            .indexOf(manufacturer.toLowerCase()) === 0
      )
    },
    findFirstProductMatchModel: async (_, { model }) => {
      return (await Product.findAll()).find(
        (product) =>
          product
            .getDataValue('model')
            .toLowerCase()
            .indexOf(model.toLowerCase()) === 0
      )
    },
    findAllProductsMatchName: async (_, { productName }) => {
      const queriedProducts = []
      const allProducts = await Product.findAll()

      await forEachAsync(allProducts, async (product) => {
        if (
          product
            .getDataValue('productName')
            .toLowerCase()
            .indexOf(productName.toLowerCase()) === 0
        ) {
          queriedProducts.push(product)
        }
      })

      return queriedProducts
    },
    findAllProductsMatchManufacturer: async (_, { manufacturer }) => {
      const queriedProducts = []
      const allProducts = await Product.findAll()

      await forEachAsync(allProducts, async (product) => {
        if (
          product
            .getDataValue('manufacturer')
            .toLowerCase()
            .indexOf(manufacturer.toLowerCase()) === 0
        ) {
          queriedProducts.push(product)
        }
      })

      return queriedProducts
    },
    findAllProductsMatchModel: async (_, { model }) => {
      const queriedProducts = []
      const allProducts = await Product.findAll()

      forEachAsync(allProducts, async (product) => {
        if (
          product
            .getDataValue('model')
            .toLowerCase()
            .indexOf(model.toLowerCase()) === 0
        ) {
          queriedProducts.push(product)
        }
      })

      return queriedProducts
    },

    findFirstUserMatchEmail: async (_, { email }) => {
      return (await User.findAll()).find(
        (user) =>
          user
            .getDataValue('email')
            .toLowerCase()
            .indexOf(email.toLowerCase()) === 0
      )
    },
    findUserUsingLogin: async (_, { email, password }) =>
      await User.findOne({
        where: { email: email, password: password },
      }),
  },
  Mutation: {
    createDataEntry: async (_, { input }) => {
      await DataEntry.create({
        ...input,
        complete: false,
      })
      return {
        success: true,
      }
    },
    updateDataEntry: async (_, { entryId, input }) => {
      await DataEntry.update({ ...input }, { where: { entryId: entryId } })
      return {
        success: true,
      }
    },
    deleteDataEntry: async (_, { entryId }) => {
      const record = await DataEntry.findByPk(entryId)
      if (!record) {
        throw new Error(`Record with entryId ${entryId} was not found.`)
      }
      await record.destroy()
      return {
        success: true,
      }
    },
    createProduct: async (_, { input }) => {
      const product = await Product.create({
        ...input,
        complete: false,
      })
      return {
        success: true,
        productId: product.getDataValue('productId'),
      }
    },
    updateProduct: async (_, { productId, input }) => {
      await Product.update({ ...input }, { where: { productId: productId } })
      return {
        success: true,
      }
    },
    deleteProduct: async (_, { productId }) => {
      const record = await Product.findByPk(productId)
      if (!record) {
        throw new Error(`Record with productId ${productId} was not found.`)
      }
      await record.destroy()
      return {
        success: true,
      }
    },
    createAccount: async (_, { input }) => {
      const account = await Account.create({
        ...input,
        complete: false,
      })
      return {
        success: true,
        accountId: account.getDataValue('accountId'),
      }
    },
    updateAccount: async (_, { accountId, input }) => {
      await Account.update({ ...input }, { where: { accountId: accountId } })
      return {
        success: true,
      }
    },
    deleteAccount: async (_, { accountId }) => {
      const record = await Account.findByPk(accountId)
      if (!record) {
        throw new Error(`Record with accountId ${accountId} was not found.`)
      }
      await record.destroy()
      return {
        success: true,
      }
    },
    createUser: async (_, { input }) => {
      await User.create({
        ...input,
        complete: false,
      })
      return {
        success: true,
      }
    },
    updateUser: async (_, { userId, input }) => {
      await User.update({ ...input }, { where: { userId: userId } })
      return {
        success: true,
      }
    },
    deleteUser: async (_, { userId }) => {
      const record = await User.findByPk(userId)
      if (!record) {
        throw new Error(`Record with optionId ${optionId} was not found.`)
      }
      await record.destroy()
      return {
        success: true,
      }
    },
  },
  DateTime: DateTimeResolver,
}

export default resolvers
