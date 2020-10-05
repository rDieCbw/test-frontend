const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200)
        .json({success: true});
});

module.exports = router;
