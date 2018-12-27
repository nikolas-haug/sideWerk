const express = require("express");
const router = express.Router();

const connection = require('../config/connection.js');

//set up the routes using the express router

//GET ROUTE
router.get("/", function(req, res) {
    res.render('index');
});

// GET ROUTE - to display all the boards saved in the db
router.get("/board", function(req, res) {
    connection.query("SELECT * FROM list", function(err, result) {
        if(err) throw err;
        console.log(result);
        res.render('board', {lists: result});
    });
});

// GET ROUTE - for the main create board page
router.get("/create", function(req, res) {
    connection.query("SELECT * FROM items", function(err, result) {
        if(err) throw err;
        // console.log(result);
        res.render('create', {items: result});
    });
});

// POST ROUTE - for adding new lists to database
router.post("/list/create", function(req, res) {
    // console.log("post route connected!");
    // make the database query variables
    let listName = req.body.listName;
    let items = req.body.items;

    // FIRST
    // for the list name
    const listNameQueryString = "INSERT INTO list (list_name) VALUES (?)";

    // SECOND
    // for retrieving the list id
    const listIdQueryString = "SELECT id from list WHERE list_name = (?)";

    // THIRD
    // for adding the list items to a new list
    const ItemQueryString = "INSERT INTO list_items (task_name, listID) VALUES (?, ?)";
    
    // mysql query for adding the new list to db
    connection.query(listNameQueryString, [listName], function(err, result) {
        if(err) throw err;
        console.log(result);
    });

    // mysql query for retrieving the list id from new list
    connection.query(listIdQueryString, [listName], function(err, result) {
        if(err) throw err;
        console.log(result);
        // console.log(`the id is: `)
        // console.log(result[0].id);
        let newListId = result[0].id;

        // mysql query for adding the selected items to db with list name ids
        // TO DO - DRY UP THIS POST QUERY WITH BULK INSERT
        for(let i = 0; i < req.body.items.length; i++) {
            connection.query(ItemQueryString, [items[i], newListId], function(err, result) {
                if(err) throw err;
                console.log(result);
            });
        }
    });
    // redirect the user to a different route
    res.redirect("/");
});

// GET ROUTE - for the individual list pages
router.get("/list/:id", function(req, res) {
    // res.send(`connected at ${req.params.id}`);
    // create the list id variable
    let listID = req.params.id;

    connection.query("SELECT * FROM list_items WHERE listID = (?)", [listID], function(err, result) {
        if(err) throw err;
        console.log(result);
        res.render('list', {list: result});
    });
});

module.exports = router;