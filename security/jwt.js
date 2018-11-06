const jwt = require('jsonwebtoken')

// sign with RSA SHA256 with selfsigned keys
//const fs = require('fs')
//const cert = {
  //key: fs.readFileSync('private.pem'),
  //passphrase: '123abc'
//}

const theSecretWord = process.env.JWT_SECRET || 'secretySecret'

module.exports = {
  generateToken: (data, seconds=3600) => {
    const encode = {
      exp: Math.floor(Date.now() / 1000) + seconds, // One hour expiration
      ...data 
    }

    //const token = jwt.sign(encode, cert, { algorithm: 'RS256'})
    const token = jwt.sign(encode, new Buffer.from(theSecretWord, 'base64'), { algorithm: 'HS256'})

    return token
  },

  validateToken: token => {
    try {
    
      return jwt.verify(token, new Buffer.from(theSecretWord, 'base64'))
    
    } catch (e) {
      console.log('Token verification failed:')
      console.log(e.name)
      console.log(e.message)
      return null
    }
  }
}
