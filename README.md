<center>
    <h1>process-keep-alive📡</h1>
    <p>
        <a href="https://www.npmjs.com/package/process-keep-alive" target="_blank">
            <img alt="Version" src="https://img.shields.io/npm/v/process-keep-alive.svg">
        </a>
        <a href="https://github.com/Zero-Brazil734/process-keep-alive/graphs/commit-activity" target="_blank">
            <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
        </a>
        <a href="https://github.com/Zero-Brazil734/process-keep-alive/blob/master/LICENSE" target="_blank">
            <img alt="License: MIT" src="https://img.shields.io/github/license/Zero-Brazil734/process-keep-alive" />
        </a>
        <a href="https://npmcharts.com/compare/process-keep-alive?minimal=true" target="_blank">
            <img alt="Downloads" src="https://img.shields.io/npm/dm/process-keep-alive.svg">
        </a>
    </p>
<center>

> A simple module using cluster to force your process running permanently.

## Important notes before you use the module

0. **The main file, that is, your application, you need to _configure in the different file_, like keepalive.js, for example, and _run with node the keepalive file_.**
1. **Connection** and **process** are _very_ different things. Be that in mind.
2. If your machine(including servers) is down, it is clear that this module will not work.
3. (**Unterminated**) If you shutdown the process using `ctrl + c` or `pm2 stop`, `pm2 restart`, the actions that trigger the "SIGINT" signal, the module will not resurrect the workers. 
4. (**Unterminated**) If you send a `shutdown` message to the master process using `process.send({ message: "shutdown" })`, the cluster will shutdown all worker processes, and if you define the worker to shutdown by sending `process.send({ message: "shutdown", worker: 0 })`, it will only shutdown in that worker.
5. (**Unterminated**) If you send `process.send({ message: "shutdown-all" })`, the cluster will shutdown all workers processes and will execute `process.exit(0)`
6. The KeepAlive module will alert a error message and close the process if you try to run the KeepAlive Cluster in worker process.

## Install

Install with [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com)

```sh
$ npm i process-keep-alive --save
```

```sh
$ yarn add process-keep-alive
```

## Usage

-   main.js

```js
const { Cluster } = require("process-keep-alive")
const cluster = new Cluster({
    /**
     * @param {string} mainFile - Defines which file the cluster will run. Default: The main property of package.json
     */
    mainFile: __filename, //Edited
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
    logDetails: true, //Edited
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
            exited: "#f55656",
            ressurected: "#ffec73",
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
})

cluster.init()

setTimeout(() => undefinedMethod(), 10000)

/**
 * Expected output:
 *
 * $ node main.js
 *
 * [MM-DD HH:mm:ss] [KeepAlive] [Online] Worker ID {int} is now online.
 *
 * :::::::::::::::::::::: Error output ::::::::::::::::::::::
 *
 * [MM-DD HH:mm:ss] [KeepAlive] [Exit] Dead worker {int} detected. Resurrecting as a new worker.
 * [MM-DD HH:mm:ss] [KeepAlive] [Online] Worker ID {int+1} is now online.
 *
 * :::::::::::::::::::::: Error output ::::::::::::::::::::::
 *
 * [MM-DD HH:mm:ss] [KeepAlive] [Exit] Dead worker {int+1} detected. Resurrecting as a new worker.
 * [MM-DD HH:mm:ss] [KeepAlive] [Online] Worker ID {int+2} is now online.
 */
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/Zero-Brazil/process-keep-alive/issues)

## Author

**제로ㅣBrazil**

-   [GitHub/Zero-Brazil734](https://github.com/Zero-Brazil734)

## License

Copyright © 2020 [제로ㅣBrazil](#제로ㅣBrazil)
Licensed under the [MIT](LICENSE) license.

---

_This file was generated by [readme-generator](https://github.com/jonschlinkert/readme-generator) on January 22, 2020._
