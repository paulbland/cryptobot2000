var express = require('express');
var app = express();

app.get('/', function(req, res) {
	res.send('hello world');
})

app.listen(process.env.PORT, function() { 
	console.log('running n port: + process.env_PORT')
}

