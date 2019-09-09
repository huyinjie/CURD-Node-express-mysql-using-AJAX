var router = require('express').Router();


router.get('/test', function (req, res, next) {
	res.send('TEST PAGE');
});


module.exports = router;