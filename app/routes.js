// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	// app.get('/', function(req, res) {
	// 	res.render('index'); // load the index.ejs file
	// });

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// CHECK IF USER EXISTS BEFORE RENDERING PAGE
		if(!req.user) {
			// render the page and pass in any flash data if it exists
			res.render('login', { message: req.flash('loginMessage') });
		} else {
			// if user is logged in redirect to home page - display message
			res.render('home', {message: req.flash('homepageMessage')});
		}
		
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// CHECK IF USER EXISTS BEFORE RENDERING PAGE
		if(!req.user) {
			// render the page and pass in any flash data if it exists
			res.render('signup', { message: req.flash('signupMessage') });
		} else {
			// if user is logged (already signed up) in redirect to home page - TO DO: display a message that explains this
			// create the object to house the message
			const message = { validation: 'you are already signed up!'};
			res.render('home', { validation: message});
		}
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// HOME SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	// app.get('/home', isLoggedIn, function(req, res) {
	// 	res.render('home', {
	// 		user : req.user // get the user out of session and pass to template
	// 	});
	// });

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
		// TO DO - render a logout message for the user
		// res.render('/index', { message: req.flash('you have been logged out!') });
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
