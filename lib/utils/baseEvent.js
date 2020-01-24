const { promisify } = require("util")

class baseEvent {
    constructor(process, cluster) {
        this.name = "base"
        this.process = process
        this.cluster = cluster

        this._wait = promisify(setTimeout)
    }

    run(...args) {

    }
}

module.exports = baseEvent