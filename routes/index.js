const express = require('express');
const router = express.Router();

//healthcheck route
router.get('/', (req, res) => {
    res.render('index');
})

module.exports = router