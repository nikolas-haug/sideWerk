const express = require("express");
const router = express.Router();

//set up the routes using the express router

//GET ROUTE
router.get("/", function(req, res) {
    res.render('index');
});

router.get("/create", function(req, res) {
    res.render('create');
});

router.get("/board", function(req, res) {
    res.render('board');
});

module.exports = router;