const Config={
	databaseURI : 'mongodb://localhost:27017/dev',
	cloud : 'cloud/main.js',
	appId : 'jobReferralSystem',
	serverURL : 'http://localhost:1304/parse',//this is just to check if it's running server will start at localhost:port/parse
	masterKey : 'adfasdfadsf',
	port : 1304,
	serverType : 'http' //choose between http and https if choosing https give proper certificate and key location in SSL object below
}
const SSL={
	key : '',//give key loction inside quotes
	cert: '', //give certificate location inside quotes
}


module.exports = {Config,SSL};