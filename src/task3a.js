// require('babel-polyfill')
import express from 'express'
import _ from 'lodash'
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


router.get(/.*/, async (req, res) => {
  // console.log(req.params, req.url.match(/\/?([^\/]+)/g))
  const pc = await pcObj.getData()
  const query = _.compact(req.url.split(/\//g))
  // console.log(`has ${_.has(pc, dummy.join('.'))}`)
  // const lastAttr = dummy.pop()
  //
  // const query = ['init'].concat(dummy)
  // const data = _.get({init: pc}, query.join('.') || lastAttr)


  let data = pc;
  try {
    // var result
    // if (lastAttr && Object.getPrototypeOf(data).hasOwnProperty(lastAttr)) {
    //   throw Error('wrong property');
    // } else if (lastAttr) {
    //   result = data[lastAttr]
    // } else {
    //   result = data
    // }
    while (query.length) {
      const datum = query.shift()
      if (datum) {
        if (!Object.getPrototypeOf(data).hasOwnProperty(datum)) {
          data = data[datum]
        } else {
          throw Error('wrong property');
        }
      }
    }
    if (!JSON.stringify(data)){
      throw Error('not json');
    }
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    res.status(404).send('Not Found')
  }
})

export default router
