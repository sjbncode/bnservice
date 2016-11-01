var express = require('express');
var router = express.Router();

var ctrlClient=require('../controllers/client/index');

router.get('/',ctrlClient.home)
router.get('/about',ctrlClient.about)

module.exports = router;