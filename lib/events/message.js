const baseEvent = require("../utils/baseEvent")

class Message extends baseEvent {
    constructor(process, cluster) {
        super(process, cluster)

        this.name = "message"
    }

    async run(msg) {
        if(typeof msg === "string") msg = { message: msg, from: "unknown" }

        let { message } = msg
        switch(message) {
        case "shutdown":
            if(!msg.worker) {
                if(this.cluster._logLevel >= 1) this.logger.exited("[Shutdown] All workers were terminated by the shutdown message sent.")
                return this.cluster.worker.destroy("SIGKILL")
            }

            if(this.cluster._logLevel >= 1) this.logger.exited(`[Shutdown] Worker ${msg.worker} was terminated by the shutdown message sent.`)
            return this.cluster.workers[msg.worker.toString ? msg.worker.toString() : String(msg.worker)].destroy("SIGKILL")
        case "shutdown-all":
            if(this.cluster._logLevel >= 1) this.logger.exited("[Shutdown] All workers and master process were terminated by the shutdown message sent.")
            this.cluster.worker.destroy("SIGKILL")

            await this._wait(1000)

            return process.exit(0)
        }
    }
}

module.exports = Message