const express = require("express");
const router = express.Router();

const connection = require('../config/connection.js');

//set up the routes using the express router

//GET ROUTE
router.get("/", function(req, res) {
    res.render('index');
});

router.get("/create", function(req, res) {
    res.render('create');
});

router.get("/board", function(req, res) {
    connection.query("SELECT * FROM items", function(err, result) {
        if(err) throw err;
        console.log(result);
        console.log(typeof result);
        res.render('board', {items: result});
    });
});

// POST ROUTE - for adding new lists to database
router.post("/list/create", function(req, res) {
    console.log("post route connected!");
    console.log(req.body);
    res.redirect("/");
});

module.exports = router;