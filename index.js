// Example express application adding the parse-server module to expose Parse
// compatible API routes.
var express = require('express');
var ParseServer = require('parse-server').ParseServer;
const config=require('./config');
const Config=config.Config;
const SSL=config.SSL;

var api = new ParseServer(Config);

var app = express();
var mountPath =  '/parse';
app.use(mountPath, api);

app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

const Server = (Config.serverType=='http')?require('http'):require('https');
var httpServer;

const fs = require('fs');
if(Config.serverType=='http'){
  httpServer = Server.createServer(app);
}else{
  httpServer = Server.createServer({
    key: fs.readFileSync(SSL.key),
    cert: fs.readFileSync(SSL.cert)
  },app);
}

httpServer.listen(Config.port, function() {
    console.log('parse-server-example running on port ' + Config.port + '.');
});

console.log()
// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
