import Promise from 'bluebird'
import _ from 'lodash'
import fs from 'fs'
Promise.promisifyAll(fs)
import request from 'request'
Promise.promisifyAll(request)


class testFetcher {
  constructor() {
    this.tests = null
    this.proxySettingsFileName = './.proxycfg'
    this.proxy = null
    this.referer = ''
  }

  async getTests (referer) {
    if (!this.tests || this.referer != referer) {
      this.referer = referer
      // this.referer = 'http://account.skill-branch.ru/cabinet/task/582028a3810efcd5f5c4d63c'
      await this.fetchTests()
    }
    return this.tests
  }

  async fetchTests () {
    await this.getProxySettings()
    console.log('fetching tests')

    function getReqOpts (number) { // варианты number "1" и "01"
      const url = this.referer.replace(/cabinet/, 'api/v1') + '/checkTest'
      return {
        url,
        proxy: this.proxy,
        body: `{
              "taskId": "582028a3810efcd5f5c4d63c",
              "response": {
                "status": 200,
                "body": "#000000"
              },
              "index": 0,
              "number": "${number}"
            }`,
        rejectUnauthorized: false,
        headers: {
          connection: 'keep-alive',
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODE4ZDJiNTJmYjc0ZDAwMTFiZTdjYjUiLCJ1c2VybmFtZSI6ImtvbnN0YW50aW5vdjkwQGxpc3QucnUiLCJyb2xlIjoidXNlciIsImlhdCI6MTQ3OTc0OTM3MX0.mpsEQKAZZ5Y9gXQMm9Sqr7kJC4zXMzkYE8GNsHoHkVM',
          'Content-Type': 'application/json'
        }
      }
    }

    let res;
    res = await request.postAsync(getReqOpts.call(this, "1"))
    if (!JSON.parse(res.body).userTask) {
      res = await request.postAsync(getReqOpts.call(this, "01"))
    }
    this.tests = JSON.parse(res.body).userTask.task.checker.tests

    const tasknum = _.compact(this.referer.split('/'))
    fs.writeFile(`tests/tests_${tasknum.pop()}.json`, JSON.stringify(JSON.parse(res.body), null, ' '))
  }

  async getProxySettings () {
    try {
      await fs.accessAsync(this.proxySettingsFileName, fs.constants.R_OK)
      this.proxy = await fs.readFileAsync(this.proxySettingsFileName, 'utf-8')
    } catch (err) {
      console.log('setting empty proxy')
    }
  }
}

export default testFetcher
