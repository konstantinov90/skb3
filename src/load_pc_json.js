// require('babel-polyfill')
import {} from 'babel-polyfill'
import Promise from 'bluebird'
import request from 'request'
Promise.promisifyAll(request)

let proxy
try {
  proxy = require('../proxy-settings').value
} catch(err) {
  console.log('setting empty proxy...')
  proxy = null
}
const pcStructURL = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json'


class pcJSON {
  constructor() {
    this.data = null
    this.getJSON()
  }

  async getData () {
    if (!this.data) {
      await this.getJSON()
    }
    return this.data
  }

  async getJSON () {
    console.log('fetching JSON')
    const res = await request.getAsync({
      url: pcStructURL,
      proxy: proxy,
      rejectUnauthorized: false,
      headers: {
        connection: 'keep-alive'
        }
      })
    this.data = JSON.parse(res.body)
  }
}
// getJSON().then((d) => {
//   console.log(d)
// })
const obj = new pcJSON()
// obj.getJSON()

export default obj
// request.getAsync({
//   url: pcStructURL,
//   proxy: proxy,
//   rejectUnauthorized: false,
//   headers: {
//     connection: 'keep-alive'
//     }
//   })
//   .then((res, body) => {
//     console.log(res.body)
//     // fs.writeFileSync('pc.json', res.body)
//     // console.log('file written')
//   })
//   .then(() => {
//     null
//     // app.listen(3000, () => console.log('listening 3000'));
//   })
//   .catch(err => {
//       console.log('failed to fetch pc URL!')
//       console.log(err)
//   })
