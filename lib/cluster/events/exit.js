
class Exit {
  constructor (cluster) {
    this.cluster = cluster

    this.name = 'exit'
  }

  _validate (signal, code) {
    if (this.cluster.options.stopSignals.includes(signal) || this.cluster.options.stopSignals.includes(code)) return true
    if (this.cluster.options.stopCodes.includes(code) || this.cluster.options.stopCodes.includes(signal)) return true

    return false
  }

  run (worker, signal, code) {
    if (this._validate(signal, code)) return

    this.cluster._debug(`Worker ${worker.id} dead. Resurrecting...`)

    if (!worker.isDead) worker.kill('SIGKILL')

    const newWorker = this.cluster._cluster.fork(this.cluster.options.env)
    newWorker.on('resurrect', () => this.cluster._debug(`New worker ${newWorker.id} is online instead of dead worker ${worker.id}`))
  }
}

module.exports = Exit
