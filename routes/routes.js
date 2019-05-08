let express = require('express');
let route = express.Router();

const controller = require('../controller/controller.js');
var dbconfig = require('../config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection); 
var bcrypt = require('bcrypt-nodejs');
var app = express();

app.use(express.static("public"));

module.exports = function(app,passport) {
		
	app.get('/' ,controller.index);
	app.get('/login/:id' ,controller.loginPage);
// user
	//add user
	app.post('/users', passport.authenticate('local-signup', {
            session : false,
            successRedirect: '/',
            failureRedirect: '/users',
            failureFlash : true 
    }));
	// get user
	app.get('/users', controller.getUsers);
	
	//Get info user
	app.get('/users/:id', controller.getIdUser);
	// Delete user
	app.delete('/users/:id', controller.getDelUser);
// auth-login

	// app.post('/login', passport.authenticate('local-login', {
 //            successRedirect: '/users/:id',
 //            failureRedirect: '/login',
 //            failureFlash : true 
	// }));
	app.post('/login', function(req, res, next){
		var id =  req.body.id;
		passport.authenticate('local-login', {
            session : false,
            successRedirect: '/login/'+id,
            failureRedirect: '/login',
            failureFlash : true 
		})(req, res, next);
	});
	
	app.get('/login', controller.getLogin);	
	// app.get('/logout', controller.getLogout);		
// Gate
	app.post('/gates', controller.addGates);
	app.get('/gates', controller.getGates);
	app.get('/gates/:g_id', controller.getIdGate);
	app.delete('/gates/:g_id', controller.getDelGate);

	app.get('/logout', controller.getLogout);


	app.post('/hakakses', controller.addHakAkses);
	app.get('/hakakses', controller.getHakAkses);

	return route;

};

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
    }else{
        res.redirect('/login');
    }
}