import {} from 'babel-polyfill'
import express from 'express'
import parser from 'body-parser'
import cors from 'cors'

import task3a from './task3a'


const app = express();

app.use(express.static('public'))
app.use(parser.urlencoded({ extended: true }))
app.use(parser.json())
app.use(cors())

app.get('/', (req, res) => res.send('concurrently!!'));

app.post('/3a', (req, res) => {
  res.send(req.body)
})

app.use('/task3a', task3a)

app.listen(3000, () => console.log('listening 3000'));
