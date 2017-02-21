const router = require('express').Router()
const graphqlHTTP = require('express-graphql')
const schema = require('../graphql')

router.use('/', graphqlHTTP({
	schema,
	graphiql: true
}))

module.exports = router