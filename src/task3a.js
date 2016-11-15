// require('babel-polyfill')
import _ from 'lodash'
import express from 'express'
import pc from './load_pc_json'
const pcObj = new pc()


const router = express.Router()


router.get('/volumes', async (req, res) => {
  let vol = {}
  const pc = await pcObj.getData()
  pc.hdd.forEach((hdd) => {
    const letter = hdd.volume
    if (vol[letter])
      vol[letter] = `${hdd.size + +vol[letter].slice(0, -1)}B`
    else
      vol[letter] = `${hdd.size}B`
  })
  res.status(200).json(vol)
})


router.get(/.*/, async (req, res, next) => {
  const pc = await pcObj.getData()
  const query = _.compact(req.url.split(/\//g))
  let data = pc;
  try {
    query.forEach((datum, idx) => {
      if (Object.getPrototypeOf(data).hasOwnProperty(datum)) {
        throw(Error('wrong property'))
      } else if (typeof data[datum] === 'string' && idx != (query.length - 1)) {
        throw(Error('property of String not allowed'))
      } else if (data[datum] === undefined) {
        throw(Error('not an object'))
      }
      data = data[datum]
    })

    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
})


router.use((err, req, res, next) => {
  console.error(err.stack)
  res.sendStatus(404)//.send('Not Found')
})

export default router
