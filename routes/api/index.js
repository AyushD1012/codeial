const express = require('express');

const router = express.Router();

router.use('/v1', require('./v1'));
//isko likhne ke baad jab tak jisko point kar rhe ho usme 
// const express = require('express');
// const router = express.Router();
// module.exports = router;
// ye nhi likhoge toh error aayega

module.exports = router;