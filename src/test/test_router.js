import _ from 'lodash'
import express from 'express'
import Tester from './tester'
const tester = new Tester()

const router = express.Router()

let testCntr = 0;

router.get(/.*/, async (req, res, next) => {
  try {

    const tests = await tester.getTests(req.headers.referer)
    console.log(req.headers.referer)
    console.log(req._parsedUrl.search)
    const query = req._parsedUrl.search
    // let answer = tests.filter(t => {
    //   return t.number == testCntr
    //   // return decode(t.url) === decode(query)
    //   //   || t.url == query
    //   // return t.url.replace(/=\s+/,'=').trim() === decode(query).trim()
    //   // || t.url.replace(/=\s+/,'=').trim() === query.trim()
    //   // || decode(t.url).trim() === decode(query).trim()
    //   // || t.url.trim() === query.trim()
    // })[0]
    const answer = tests[testCntr]

    testCntr +=1
    if (testCntr == tests.length)
      testCntr = 0

    console.log(answer)
    // tests.forEach(t => {;
    //   // console.log(decode(t.url), t.url.replace(/=\s+/,'='), decode(query))
    //   // console.log(t.url, t.url.replace(/=\s+/,'=') == decode(query))
    // })
    if (answer.response.status)
      res.status(answer.response.status)
    res.send(answer.response.body)
  } catch (err) {
    console.error(err)
    res.send(err)
  }
})

export default router
