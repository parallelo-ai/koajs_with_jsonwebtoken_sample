const jwt = require('jsonwebtoken')

// sign with RSA SHA256 with selfsigned keys
const fs = require('fs')
const cert = {
  key: fs.readFileSync('private.pem'),
  passphrase: '123abc'
}

const theSecretWord = '123abc'

module.exports = {
  generateToken: (data,exp= Math.floor(Date.now() / 1000) + (60 * 60)*1) => {
    const encode = {
      exp, // One hour expiration
      ...data 
    }

    //const token = jwt.sign(encode, cert, { algorithm: 'RS256'})
    const token = jwt.sign(encode, theSecretWord, { algorithm: 'HS256'})

    return token
  }
}
