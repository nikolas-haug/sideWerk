const express = require("express");
const router = express.Router();

//set up the routes using the express router

//GET ROUTE
router.get("/", function(req, res) {
    res.render('index');
});

module.exports = router;