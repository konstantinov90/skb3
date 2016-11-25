var request = require('request');
var _ = require('lodash')
var fs = require('fs')
var proxy = fs.readFileSync('../.proxycfg', 'utf-8')

var initPokemons = require('./pokemons')
initPokemons = _.filter(initPokemons, function(o) {return !_.isEmpty(o)})


console.log(_.map(initPokemons,'name').indexOf('pikachu-belle'))

function fetchUrl(url, callback) {
  console.log('fetching ' + url)
  request.get({
    url: url,
    proxy: proxy,
    rejectUnauthorized: false,
    headers: {
      connection: 'keep-alive'
      }
    }, function (err, res) {
      if (err) throw new Error(err)
      var obj = JSON.parse(res.body)
      if (obj.next) {
        console.log(obj.next)
        fetchUrl(obj.next, function(err, newRes) {
          if (err) throw new Error(err)
          console.log(newRes)
          callback(err, newRes.concat(obj.results))
        })
      } else if (obj.detail) {
        var time = +obj.detail.match(/[^\d]*(\d*)[^\d]*/)[1] + 1
        setTimeout(function() {
          console.log('waiting ' + time + ' sec')
          fetchUrl(url, function(err, newRes) {
            if (err) throw new Error(err)
            console.log(newRes)
            callback(err, newRes.concat(obj.results))
          })
        }, time*1000)
      } else {
        console.log(obj.results)
        callback(err, obj.results)
      }
    })
}

function fetchPokemons(pokemons, callback) {
  url = pokemons.shift()
  console.log('fetching ' + url)
  request.get({
    url: url,
    proxy: proxy,
    rejectUnauthorized: false,
    headers: {
      connection: 'keep-alive'
      }
    }, function (err, res) {
      if (err) return callback(err)
      try {
        var obj = _.pick(JSON.parse(res.body), ['name', 'weight', 'height'])
      } catch(err) {
        callback(null, [])
      }
      if (pokemons.length) {
        fetchPokemons(pokemons, function(err, newRes) {
          if (err) return callback(err)
          // console.log(newRes)
          callback(err, newRes.concat(obj))
        })
      } else {
        // console.log(obj)
        callback(err, [obj])
      }
    })
}

// var pokemons = []

var nextUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=1000000';

// fetchUrl(nextUrl, function(err, res) {
//   if (err) throw new Error(err)
  var pokemons = require('./allPokemons').results
  // console.log(pokemons)
  var dummy = _.cloneDeep(pokemons)
  // fs.writeFileSync('allPokemons.json', 'utf-8')

  // dummy.forEach(function(d) {
  //   console.log(d, d.name,  _.map(initPokemons, 'name').indexOf(d.name))
  // })
  dummy = _.filter(dummy, function(d) {
    console.log(d.name, _.map(initPokemons, 'name').indexOf(d.name), _.map(initPokemons, 'name').indexOf(d.name) < 0)
    return _.map(initPokemons, 'name').indexOf(d.name) < 0
  })
  console.log(_.filter(dummy, function(d) {
    console.log(d.name, _.map(initPokemons, 'name').indexOf(d.name), _.map(initPokemons, 'name').indexOf(d.name) < 0)
    return (_.map(initPokemons, 'name').indexOf(d.name) < 0)
  }))
  dummy = _.map(dummy, 'url')
  fetchPokemons(dummy, function(err, data) {
    // console.log(data)
    fs.writeFile('pokemons.json', JSON.stringify(initPokemons.concat(data)), function(err) {
      if(err) throw new Error(err)
    })

  // })

  // nextUrl = res.body.next

  // console.log(res)
})

// console.log(_.map(initPokemons, 'name').indexOf('pikachu'))
