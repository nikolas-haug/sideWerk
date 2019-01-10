const express = require("express");
const router = express.Router();

// TO DO - check if passport is needed for middleware function
// const passport = require('passport');

const connection = require('../config/connection.js');

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

//set up the routes using the express router

//GET ROUTE
router.get("/", function(req, res) {
    res.render('index');
    if(req.user) {
        // console.log(req.user.username);
    }
});

// GET ROUTE - to display all the boards saved in the db
router.get("/board", isLoggedIn, function(req, res) {
    connection.query("SELECT * FROM list", function(err, result) {
        if(err) throw err;
        console.log(result);
        res.render('board', {lists: result});
    });
});

// GET ROUTE - for the main create board page
router.get("/create", isLoggedIn, function(req, res) {
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
    // get the username data to attach to list
    let list_owner = req.user.username;

    // FIRST
    // for the list name
    const listNameQueryString = "INSERT INTO list (list_name, list_owner) VALUES (?, ?)";

    // SECOND
    // for retrieving the list id
    const listIdQueryString = "SELECT id from list WHERE list_name = (?)";

    // THIRD
    // for adding the list items to a new list
    const ItemQueryString = "INSERT INTO list_items (task_name, listID) VALUES (?, ?)";
    
    // mysql query for adding the new list to db
    connection.query(listNameQueryString, [listName, list_owner], function(err, result) {
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

    connection.query("SELECT * FROM list_items WHERE listID = (?); SELECT list_name FROM list WHERE id = (?);", [listID, listID], function(err, result) {
        if(err) throw err;
        // console.log(result[1][0].list_name);
        res.render('list', {list: result[0], name: result[1][0].list_name, listID: listID, user: req.user.username});
    });
});

// POST ROUTE for joining an existing list on the board
router.post("/list/join/:id", function(req, res) {

    let listJoiner = req.user.username;
    // get the list id to add the new user to
    let listId = req.params.id;
    
    console.log(req.params.id);

    // console.log(listId);

    // add the currently logged in user to the selected list with reference to its ID
    connection.query("INSERT INTO list_joiners (joiner, listID) VALUES (?, ?)", [listJoiner, listId], function(err, result) {
        if(err) throw err;
        console.log(result);
        res.redirect("/board");
    });

    // connection.query("UPDATE list SET list_joiners = (?) WHERE id = (?)", [listJoiner, listId], function(err, result) {
    //     if(err) throw err;
    //     res.redirect("/board");
    // });
});

module.exports = router;