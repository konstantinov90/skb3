import express from 'express'
import parser from 'body-parser'
import Promise from 'bluebird'
import request from 'request'
Promise.promisifyAll(request)
import fs from 'fs'
import cors from 'cors'

import task3a from './task3a'

try {
  const proxy = require('proxy-settings')
} catch(err) {
  console.log('setting empty proxy...')
  const proxy = ""
}
const pcStructURL = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json'

const app = express();

app.use(express.static('public'))
app.use(parser.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => res.send('concurrently!!'));

app.post('/3a', (req, res) => {
  res.send(req.body)
})

app.use('/task3a', task3a)


request.getAsync({
  url: pcStructURL,
  proxy: proxy,
  rejectUnauthorized: false,
  headers: {
    connection: 'keep-alive'
    }
  })
  .then((res, body) => {
    fs.writeFileSync('pc.json', res.body)
    console.log('file written')
  })
  .then(() => {
    app.listen(3000, () => console.log('listening 3000'));
  })
  .catch(err => {
      console.log('failed to fetch pc URL!')
      console.log(err)
  })
