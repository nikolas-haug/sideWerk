const express = require("express");
    bodyParser = require("body-parser");
    exphbs = require("express-handlebars");
    // methodOverride = require("method-override");

// TO DO - EITHER SET UP SEQUELIZE OR SIMPLE SQL ORM
//import the exported connection and orm files
// const connection = require("./config/connection.js");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//sets up the express app to serve static files
app.use(express.static("public"));

// TO DO - ADD PACKAGE IF NEEDED
// Override with POST having ?_method=DELETE
// app.use(methodOverride("_method"));

//sets up the express app with handlebars layouts/templates
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//import the router from the controller file
const routes = require('./controllers/main_controllers');
//use the express router for all routes defined in the controller file
app.use("/", routes);

//start the server to listen
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});