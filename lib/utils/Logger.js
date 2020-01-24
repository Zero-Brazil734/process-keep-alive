const chalk = require("chalk")
const moment = require("moment-timezone")

class Logger {
    constructor(options) {
        this._chalk = chalk
        this._moment = moment
        this._options = options

        this.timezone = options.logger.timezone
        this.colors = options.logger.colors
    }

    format(type, text) {
        if (this._options.logger.disableAllColors)
            return `[${moment()
                .tz(this.timezone)
                .format("MM-DD HH:mm:ss")}] [KeepAlive] [${type
                .charAt(0)
                .toUpperCase() + type.slice(1)}] ${text}`

        let keys = this.colors

        if (type === "error") return chalk.hex(keys[type])("[KeepAlive] " + text)

        return chalk.hex(keys[type] !== undefined ? keys[type] : keys["info"])(
            `[${moment()
                .tz(this.timezone)
                .format("MM-DD HH:mm:ss")}] [KeepAlive] [${type
                .charAt(0)
                .toUpperCase() + type.slice(1)}] ${text}`
        )
    }

    info(...args) {
        console.info(this.format("info", ...args))

        return this
    }

    online(...args) {
        console.info(this.format("online", ...args))

        return this
    }

    resurrect(...args) {
        console.log(this.format("resurrect", ...args))

        return this
    }

    exit(...args) {
        console.warn(this.format("exit", ...args))

        return this
    }

    alert(...args) {
        console.warn(this.format("alert", ...args))

        return this
    }

    error(...args) {
        console.error(this.format("resurrect", ...args))

        return this
    }
}

module.exports = Logger