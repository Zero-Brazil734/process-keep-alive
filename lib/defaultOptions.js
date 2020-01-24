module.exports = {
    cluster: {
        /**
         * @param {string} mainFile - Defines which file the cluster will run. Default: The main property of package.json
         */
        mainFile: require(`${process.cwd()}/package.json`).main,
        /**
         * @param {object} env - Defines the environment variables that will be used by workers. Default: process.env
         */
        env: process.env,
        /**
         * @param {boolean} log - Defines whether the module will alert in the console if the worker is dead. Default: true
         */
        log: true,
        /**
         * @param {boolean} logDetails - Defines whether the module will alert the console with detailed information about what it is doing. Default: false
         */
        logDetails: false,
        /**
         * @param {number} workersCount - Set the number of workers the module will create. Default: 1
         */
        workersCount: 1,
        /**
         * @param {object} logger - Configs of logger.
         */
        logger: {
            /**
             * @param {object} logger.colors - Set the hex colors of the log messages.
             */
            colors: {
                online: "#48db81",
                alert: "#f55656",
                exit: "#ff2b48",
                resurrect: "#ffec73",
                error: "#c22929",
                info: "#7289DA" // Discord's Blurple
            },
            /**
             * @param {object} logger.timezone - Set the timezone of log messages. Default: Etc/UTC. Please see the timezones list at there:
             * @see https://momentjs.com/timezone/
             */
            timezone: "Etc/UTC",
            /**
             * @param {boolean} logger.disableAllColors - Disables all the colors configured by module.
             */
            disableAllColors: false
        }
    }
}
