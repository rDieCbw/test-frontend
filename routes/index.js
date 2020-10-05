const express = require('express');
const router = express.Router();
var fetch = require('node-fetch');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);
const LogMessages = require('../helpers/log-messages');

router.get('/', (req, res, next) => {
    const finalQueryString = queryStringExtractor(req.query);
    res.render('pages/index', finalQueryString);
});

router.get('/simular', (req, res, next) => {
    const formData = req.query;
    const tax = 0.00517;
    const expression = `${parseFloat(formData.monthValue)}*(((1+${tax})^${parseFloat(formData.period) * 12}-1)/${tax})`;
    const formBody = { "expr": expression};
    let responseBody = {...formData, result: 0};

    fetch('http://api.mathjs.org/v4', {
        method: 'POST',
        body: JSON.stringify(formBody),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(body => {responseBody.result = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(body.result)})
    .catch(function (error) {
      LogMessages.log("ERROR", req.originalUrl, error, url);
      res.json({
        status: error.status,
        error: true,
        message: 'Unable to simulate'
      });

    });

    responseBody.monthValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(responseBody.monthValue)

   res.render('pages/resultado', {context: responseBody});
});

function queryStringExtractor(queryString) {
    try {
        const queryStringArr = Object.entries(queryString);
        let finalQueryString = [];

        const purifyConfig = {
            SAFE_FOR_TEMPLATES: true,
        };

        for (const [param, value] of queryStringArr) {
            let cleanedValue = DOMPurify.sanitize(value, purifyConfig);
            finalQueryString.push([`${param}=${cleanedValue}`]);
        }

        return finalQueryString.join('&');

    } catch (error) {
        LogMessages.log("ERROR", "Query String Extractor", error);
    }
    
}

module.exports = router;
