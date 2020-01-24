const clusterOptions = require("../defaultOptions").cluster
const cluster = require("cluster")
const { readdirSync } = require("fs")
const { join } = require("path")
const { mergeDefaults } = require("../utils/index")

class ClusterManager {
    constructor(options = clusterOptions) {
        options = mergeDefaults(clusterOptions, options)

        if (cluster.isWorker) {
            this._wait(500).then(() => process.exit(0))
            throw new Error(this.logger.error("You tried to run KeepAlive Cluster in the worker process. Ignoring the attempt."))
        }

        this._cluster = cluster
        this._wait = require("util").promisify(setTimeout)
        this._logLevel = 0

        this.options = options
        this.logger = new (require("../utils/Logger"))(options)

        if(this.options.log === true) this._logLevel = 1
        if(this.options.logDetails === true) this._logLevel = 2

        let dir = join(__dirname, "../events/")
        readdirSync(dir).forEach(Event => {
            let event = new (require(dir + Event))(process, this._cluster)

            process.on(event.name, (...args) => event.run(...args))
        })

        try {
            this._cluster.setupMaster({ exec: this.options.mainFile })
            if (this._logLevel === 2) this.logger.info(`Main file directory of your application to run with node configured successfully to ${this.options.mainFile}.`)
        } catch(err) {
            throw new Error(this.logger.error("There was a problem configuring your main application file."))
        }
    }

    init() {
        let workers = this.options.workersCount

        if(workers <= 0) throw new RangeError(this.logger.error("The number of workers must be above 0."))

        this._cluster.on("online", worker => this._logLevel >= 1 ? this.logger.online(`Worker ID ${worker.id} is now online.`) : null)
        this._cluster.on("exit", (worker, code, signal) => {
            if (signal === "SIGINT") return process.exit(0)

            let forked = this._cluster.fork(this.options.env)
            this.logger.resurrect(`Worker ID ${forked.id} successfully resurrected.`)

            this.logger.exit(`Dead worker ${worker.id} with exit code "${code}" and signal "${signal}" detected. Resurrecting as a new worker.`)
        })

        for(let i = 0; i < workers; i++) {
            this._cluster.fork(this.options.env)
        }
    }
}

module.exports = ClusterManager
