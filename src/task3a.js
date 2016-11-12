import express from 'express'

const pc = require('pc.json')

const router = express.Router()


router.get('/volumes', (req, res) => {
  let vol = {}
  pc.hdd.forEach((hdd) => {
    const letter = hdd.volume
    if (vol[letter])
      vol[letter] = `${hdd.size + +vol[letter].slice(0, -1)}B`
    else
      vol[letter] = `${hdd.size}B`
  })
  res.status(200).json(vol)
})


router.get(/.*/, (req, res) => {

  const query = req.url.split(/\//g).slice(1)
  let data = pc;
  try {
    while (query.length) {
      const datum = query.shift()
      if (datum) {
        console.log(query)
        data = data[datum]
      }
    }
    // data = JSON.stringify(data)
    if (!JSON.stringify(data))
      throw Error('not json');
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    res.status(404).send('Not found')
  }
})

export default router
