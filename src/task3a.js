// require('babel-polyfill')
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


router.get(/.*/, async (req, res) => {
  const query = req.url.split(/\//g).slice(1)
  const pc = await pcObj.getData()
  let data = pc;
  try {
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
