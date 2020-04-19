
class Message {
  constructor (cluster) {
    this.cluster = cluster

    this.name = 'message'
  }

  run (wk, { message, worker }) {
    console.log(message, worker, this.cluster._cluster.workers)
    if (message === 'shutdown-all') {
      this.cluster._cluster.workers.map(wkk => wkk.kill('SIGINT'))
      this.cluster._debug('Closing process...')
      process.exit()
    } else if (message === 'shutdown') {
      if (!worker) wk.kill('SIGINT')
      else {
        Object.values(this.cluster._cluster.workers)
          .filter(f => f.id === worker)
          .forEach(wkk => wkk.kill('SIGINT'))
      }
    }
  }
}

module.exports = Message
