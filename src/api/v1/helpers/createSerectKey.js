
const crypto = require('crypto');

const words = 'What is Node Crypto.createHash()';

let hashObj = [
  {algorithm: 'sha256', digestFormat: 'base64'},
  {algorithm: 'sha256', digestFormat: 'base64'},
  {algorithm: 'sha256', digestFormat: 'hex'},
  {algorithm: 'sha256', digestFormat: 'hex'},
  {algorithm: 'sha256', digestFormat: 'hex'},
  {algorithm: 'sha256', digestFormat: 'binary'}
  ]
  for (const {algorithm, digestFormat} of hashObj){
// Calling createHash method
    const hash = crypto.createHash(algorithm)

    // updating data
       .update(words)

    // Encoding to be used
    .digest(digestFormat);

    console.log(`${algorithm}-${digestFormat} gives`, hash)

  }