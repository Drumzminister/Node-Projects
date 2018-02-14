// Node Http Server
var http = require('http');
http.createServer(function(req, res){
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Hello World, I am Here\n");
}).listen(3030);
console.log("server running at http://localhost:3030");


//Making it more explicit
// var http = require('http');
// var server = http.createServer();
// server.on(function(req, res){
//     res.writeHead(200, {"Content-Type": "text/plain"});
//     res.end("Hello World \n");
// });
// server.listen(3000);
// console.log("server running at http://localhost:3000");


// // Streaming Data
// var stream = fs.createReadStream("./resource.json");
// stream.on("data", function(chunk){
//     console.log(chunk)
// });
// stream.on("end", function(){
//     console.log("finished")
// })