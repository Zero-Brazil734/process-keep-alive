const { EventEmitter } = require('events')
const Cluster = require('cluster')
const { readdirSync } = require('fs')

class MainCluster extends EventEmitter {
  constructor (options = {}) {
    super()

    if (Cluster.isWorker) throw new Error('Cannot run KeepAlive module in worker process.')

    this.options = options
    this.options.file = options.file
    this.options.workerCount = options.workerCount || 1
    this.options.env = options.env || process.env
    this.options.inspectPort = options.inspectPort || 8080
    this.options.stopCodes = options.stopCodes || [0]
    this.options.stopSignals = options.stopSignals || ['SIGINT', 'SIGKILL']

    this._cluster = Cluster

    this._cluster.schedulingPolicy = this._cluster.SCHED_RR
  }

  init () {
    if (!this.options.file) throw new Error(`Cannot run file ${this.options.file}`)

    this._cluster.setupMaster({
      inspectPort: this.options.inspectPort,
      exec: this.options.file
    })

    const files = readdirSync(`${__dirname}/events`).filter(f => /\.js$/gi.test(f))

    for (const file of files) {
      const event = new (require(`${__dirname}/events/${file}`))(this)
      this._cluster.on(event.name, (...args) => event.run(...args))
    }

    for (let i = 0; i < this.options.workerCount; i++) {
      const worker = this._cluster.fork(this.options.env)
      this.emit('online', worker)
    }
  }

  _debug (...args) {
    this.emit('debug', ...args)

    return args
  }
}

module.exports = MainCluster
