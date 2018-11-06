'use-strict'

// Configure KoaJS
const logger = require('koa-logger')
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')

// Adding jwt
const validateToken = require('./security/jwt').validateToken

// Set up the Koa instance
const Koa = require('koa')
const app = new Koa()

// Load Server Configurations
const serverConfigurations = require('./config')

// Set up the socket.io server
const server = require('http').createServer(app.callback())

//
// Add Middleware Routes
//
app.use(logger())
app.use(cors())
app.use(bodyParser())

app.context.unprotected = ['/', '/get']

// Custom middleware to perform JWT validation
app.use( async (ctx, next) => {
  console.log('Incoming Request')
  console.log(ctx.request)
  console.log('Request headers')
  console.log(ctx.request.header)

  // If the URL is unprotected, let the request pass
  if (app.context.unprotected.indexOf(ctx.url) >= 0) {
    return next()
  }

  // If the request does not have 'authorization' header
  if (!ctx.request.header.authorization) {
    console.log('No authorization header was present to the request')
    ctx.throw(401, { message:'Please provide a valid token' })
  }

  // If request reach this point, it has authorization header and goes
  // to a secured endpoint

  // Try-catch in case that the authorization header comes
  // in unexpected ways
  try {
    // the header is expected to be 'Authorization: Bearer <JWT token>'
    const token = ctx.request.header.authorization.split(' ')[1]
    console.log(token)
    const validation = validateToken(token)

    console.log('Token validation result:')
    console.log(validation)

    if(!validation) {
      console.log('Token validation failed')
      ctx.throw(401, { message:'Please provide a valid token' })
    }

    // 
    // Use the payload of the token to perform
    // further token validations, like getting an
    // user from a database and checking token
    // encoded information, etc...
    //

    // if(token validation against the db fails){
    //   ctx.throw(401, { message:'Please provide a valid token' })
    // }

    // Let the request pass
    return next()

  } catch (error) {
    console.log('Errors checking the authorization header')
    console.log(error)
    ctx.throw(401, { message: error.message })
  }
})

// Add the endpoint handlers
const get = require('./routes/get').get
const post = require('./routes/post').post
const postParameters = require('./routes/post').postParameters

// Add routes to the router
router
  .get('/get', get)
  .post('/post', post)
  .post('/post/:value', postParameters)

// Add the routes to the app instance
app.use(router.routes())

// Simple message to root api endpoint
app.use(async ctx => {
  ctx.throw(404, { message: 'The KoaJS API is UP!'})
})

console.log('Server listening at port ' + serverConfigurations.port)
server.listen(serverConfigurations.port)
