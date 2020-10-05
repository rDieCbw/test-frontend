const path = require('path');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const compression = require('compression');
const createError = require('http-errors');
const LogMessages = require('./helpers/log-messages');


process.on('uncaughtException', (err, origin) => {
    let logMessage = {
        "date": new Date().toLocaleString(),
        "type": "UNCAUGHT EXCEPTION",
        "env": 'dev',
        "what": `${err}`,
        "where": `${origin}`
    };
    console.log(JSON.stringify(logMessage));
});

let app = express();

app.use(helmet());
// Sets "X-Download-Options: noopen".
app.use(helmet.ieNoOpen());
// Sets "X-DNS-Prefetch-Control: off".
app.use(helmet.dnsPrefetchControl())
// Sets "X-Frame-Options"
app.use(helmet.frameguard({ action: 'sameorigin' }))
// Sets "X-Content-Type-Options: nosniff".
app.use(helmet.noSniff())

app.use(hpp());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.use(compression());
app.use(express.static('public'));


app.locals.RESOURCES_STATIC_PATH = '/assets';
app.locals.ENVIRONMENT_NAME = 'dev';

//Health check
app.use('/healthz', require('./routes/health-check'));

app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404, 'Página não encontrada'));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

    var message = {};
    message.name = `Response: ${err.status}`;
    message.description = err.message;
    message.error = res.locals.error;

    LogMessages.log("ERROR", req.originalUrl, message);

    // render the error page
    res.status(err.status || 500);

    if (err.status === 404) {
        res.render('404', { title: "Página não encontrada" });
        return;
    }

    if (err.status === 500) {
        res.render('500', { title: "Encontramos um probleminha" });
        return;
    }
    else {
        res.render('500');
        return;
    }

    return;
});

app.listen(3000, 'localhost', () => {
    console.log(
        `Servidor rodando em http://localhost:3000`
    );
    console.log('Para derrubar o servidor: ctrl + c');
});

module.exports = app;
