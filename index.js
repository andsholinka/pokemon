const express = require("express");
const cors = require("cors");
const logger = require('morgan');

const cluster = require('cluster');
const os = require('os');
const process = require('process');

require('dotenv').config();
const PORT = process.env.PORT || 3030;

const apiRouter = require('./src/routers');

const app = express();
const router = express.Router();

app.use(cors())
app.use(logger('dev'));

app.use(express.json({
    limit: '50mb'
}));

app.use(express.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: '50mb'
}));

const db = require("./src/models");

app.get("/", (req, res) => {
    res.send({
        message: "Welcome to Pokemon API X PokeAPI"
    });
});

app.get("/close", (req, res) => {
    res.send({
        message: "Exiting NodeJS server"
    });
    process.exit()
});

app.get('/_health', (req, res) => {
    res.status(200).send('ok')
})

app.use('/api', router);

router.use('/v1', apiRouter);

app.use((req, res) => {
    res.status(404).send('404 Page Not Found')
});

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }

    cluster.addListener('exit', (worker, code, signal) => {
        console.log(`Worker-${worker.process.pid} is exit`);
        cluster.fork();
    })
}

if (cluster.isWorker) {
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT} in worker ${process.pid}`);
    });
}