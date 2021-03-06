const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env' })
const Recipe = require('./models/Recipe')
const User = require('./models/User')

const { typeDefs } = require('./schema')
const { resolvers } = require('./resolvers')

// Bring in GraphQL-Express middleware
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')

// Create schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

// Connects to database
mongoose
    .connect(
            process.env.MONGO_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }
        )
    .then(() => console.log('DB connected'))
    .catch(err => console.error(err))

// Initializes application
const app = express()

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   credentials: true
// }

app.use(cors())

// Set up JWT authentication middleware
app.use(async (req, res, next) => {
  const token = req.headers['authorization']
  if (token !== "null") {
    try{
      const currentUser = await jwt.verify(token, process.env.SECRET)
      req.currentUser = currentUser
      // console.log(currentUser)
    } catch (err) {
      console.error(err)
    }
  }
  next()
})

// Create GraphiQL application
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));
 
// Connect schemas with GraphQL
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress(({ currentUser }) => ({
    schema,
    context: {
      Recipe,
      User,
      currentUser
    }
  }))
);

const PORT = process.env.PORT || 4444

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})