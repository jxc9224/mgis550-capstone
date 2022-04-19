import { ApolloServer } from 'apollo-server'

import typeDefs from './typeDefs/typeDefs.js'
import resolvers from './resolvers/resolvers.js'

const main = async () => {
  const server = new ApolloServer({ typeDefs, resolvers })
  const { url } = await server.listen(4000)

  console.log(`🚀 Apollo Server @ ${url}`)
}

main()
