import express from 'express'
import _ from 'lodash'

const pokemons = require('/pokemons')

const router = express.Router()

function compareByKey(key) {
  return function compare(a,b) {return a[key] < b[key]? -1: a[key] > b[key]? 1: a.name < b.name? -1: a.name > b.name? 1: 0}
}
function compareByName(a,b) {return a < b? -1: a > b? 1: 0}


router.use((req, res, next) => {
  req.limit = req.query.limit || 20
  req.offset = req.query.offset || 0
  next()
})


router.use((req, res, next) => {
  pokemons.forEach(p => {
    p.fat = -p.weight / +p.height
    p.angular = +p.weight / +p.height
    p.heavy = -p.weight
    p.light = +p.weight
    p.huge = -p.height
    p.micro = +p.height
  })
  next()
})

router.get(/^\/[^\/]*$/, (req, res) => {
  const Url = req.url.match(/^\/([^\/\?]*)(?:.*)/)[1]
  const ans = pokemons.sort(compareByKey(Url)).slice(req.offset, +req.offset + +req.limit)//.sort(compareByKey('name'))
  res.send(_.map(ans, 'name'))
})

export default router
