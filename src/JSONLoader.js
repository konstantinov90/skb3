import Promise from 'bluebird'
import fs from 'fs'
Promise.promisifyAll(fs)
import request from 'request'
Promise.promisifyAll(request)


class JSONLoader {
  constructor() {
    this.data = null
    this.url = null
    this.proxySettingsFileName = './.proxycfg'
    this.proxy = null
    this.promisePending = true
    // this.fetchJSON()
    // .then(() => {
    //   console.log('fetched')
    // })
  }

  async getData () {
    if (!this.data) {
      await this.fetchJSON()
    }
    return this.data
  }

  async fetchJSON () {
    await this.getProxySettings()
    console.log('fetching JSON')
    const res = await request.getAsync({
      url: this.url,
      proxy: this.proxy,
      rejectUnauthorized: false,
      headers: {
        connection: 'keep-alive'
        }
      })
    this.data = JSON.parse(res.body)
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

// const obj = new pcJSON()


export default JSONLoader
