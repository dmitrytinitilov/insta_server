const util = require('util');

var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());
app.use(express.static('public'));

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })
var fs = require('fs');

app.set('view engine','pug');


var mongo = require('mongodb');
var host  = 'localhost';
var port  = 27017;
var ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';





app.get('/',function(req,res) {

	res.end('server for uploading your files');

})

app.get('/panel',function(req,res){

	(async function() {
		try {
			var database = await MongoClient.connect(url);
			const db = database.db('insta')
			
			var insta_posts = db.collection("insta_posts");

			var name = req.query.name;
			var description = req.query.description;

			var data = await insta_posts.find().toArray();

			console.log(data);
			console.log(data.length);

			res.render('admin_panel.pug',{'postsList':data});

			database.close();
			
		} catch(e) {
			console.log(e);
		}
	})()

})

app.get('/api/posts',function(req,res){
		(async function() {
		try {
			var database = await MongoClient.connect(url);
			const db = database.db('insta')
			
			var insta_posts = db.collection("insta_posts");

			var name = req.query.name;
			var description = req.query.description;

			var data = await insta_posts.find().toArray();

			res.end(JSON.stringify(data));	

			database.close();
			
		} catch(e) {
			console.log(e);
		}
	})()
})

app.get('/api/post/:id',function(req,res){
		(async function() {
		try {
			var database = await MongoClient.connect(url);
			const db = database.db('insta')
			
			var insta_posts = db.collection("insta_posts");

			var name = req.query.name;
			var description = req.query.description;

			var data = await insta_posts.find().toArray();

			res.end(JSON.stringify(data));	

			database.close();
			
		} catch(e) {
			console.log(e);
		}
	})()
})

app.post('/add_post', upload.single('picture'), function (req, res, next){

	(async function() {

		try {

			var database = await MongoClient.connect(url);
			const db = database.db('insta')
			var insta_posts = db.collection("insta_posts");

			var name = req.body.name;
			var description = req.body.description;
			var filename = req.file.originalname;

			await insta_posts.insert({name:name,description:description,filename:filename})

			await fs.rename(req.file.path, 'public/uploads/'+req.file.originalname)

			res.redirect('/panel');
		
		} catch(e) {
			console.log(e);
		}
	

	})()
})


var server = app.listen(8080,function(){

	console.log('Server got the power');

})