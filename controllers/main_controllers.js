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
    // res.render('index');
    if(req.user) {
        // console.log(req.user.username);
        res.render('index', {user: req.user.username})
    } else {
        res.render('index');
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

    connection.query("SELECT * FROM list_items WHERE listID = (?); SELECT list_name FROM list WHERE id = (?); SELECT list_owner FROM list WHERE id = (?); SELECT * FROM list_joiners WHERE listID = (?)", [listID, listID, listID, listID], function(err, result) {
        if(err) throw err;
        // console.log(result[1][0].list_name);
        res.render('list', {list: result[0], 
                            name: result[1][0].list_name,
                            list_owner: result[2][0].list_owner, 
                            listID: listID, 
                            user: req.user.username,
                            joiners: result[3]
                        });
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

// =====================================
// TEST ROUTES FOR HOME PAGE LOGIC
// =====================================

// GET route for the user's created lists
router.get("/owned", function(req, res) {
    // get the user data
    let user = req.user.username;

    // get all the user's owned lists from the db
    connection.query("SELECT * FROM list WHERE list_owner = (?)", [user], function(err, result) {
        if(err) throw err;
        res.render('user_lists', {user_lists: result});
    });
});

// GET route for the user lists
router.get("/joined", function(req, res) {
    let user = req.user.username;
    console.log(user);
    connection.query("SELECT list_name FROM list INNER JOIN list_joiners ON list.id = list_joiners.listID WHERE list_joiners.joiner = (?)", [user], function(err, result) {
        if(err) throw err;
        console.log(result);
        res.render('joined', {lists: result});
    });
});

// GET route to test mysql query
router.get("/group", function(req, res) {
    let user = req.user.username;
    connection.query("SELECT T1.list_name, confirmed FROM list AS T1 INNER JOIN list_joiners AS T2 ON T1.id = T2.listID WHERE T2.joiner = (?)", [user], function(err, result) {
        if(err) throw err;
        console.log(result);
    });
});

//====================================================

// GET route - for the main/home page after sign in/up
router.get("/home", isLoggedIn, function(req, res) {
    let user = req.user.username;
    // TO DO - make the query string variables for each separate query
    connection.query("SELECT * FROM list WHERE list_owner = (?); SELECT T1.list_name, confirmed FROM list AS T1 INNER JOIN list_joiners AS T2 ON T1.id = T2.listID WHERE T2.joiner = (?) GROUP BY listID", [user, user], function(err, result) {
        if(err) throw err;
        // console.log(result);
        // console.log(result[1]);
        res.render('home', {
                        user_lists: result[0],
                        joined_lists: result[1]
        });
    });
});

// GET route - for the single page user owned list
router.get("/list/owned/:id", function(req, res) {
    res.render('owned_list');
});

module.exports = router;