var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var cache = {};

function send404(response){
    response.writeHead(404, {"Content-type": "text/plain"});
    response.write("Error 404: Resource not found.");
    response.end();
}

function sendFile(response, filePath, fileContents){
    response.writeHead(
        200,
        {"Content-type": mime.lookup(path.basename(filePath))}
    );
    response.end(fileContents);
}

function serveStatic(response, cache, absPath){
    // Check if file is cached in memory
    if (cache[absPath]){
        //Serve file from memory
        sendFile(response, absPath, cache[absPath]);
    }else{
        // check if file exists
        fs.exists(absPath, function(exists){
            if (exists){
                //Read file from disk
                fs.readFile(absPath, function(err, data){
                    if(err){
                        send404(response);
                    }else{
                        // Serve file from disk
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            }else{
                // Send HTTP 404 Response
                send404(response);
            }
        });
    }
}

// App Server
var server = http.createServer( function (request, response){
    // Create HTTP server using anonymous function to define per-request behaviour
   var filePath = false;
   if(request.url == "/"){
    //Determine HTML file to be served by default
       filePath = "public/index.html";
   }else{
    //    Translate URL path to relative path
       filePath = "public/" + request.url;
   }
   var absPath = "./" + filePath;
   //Serve Static File
   serveStatic(response, cache, absPath);
});
server.listen(3000, function(){
    console.log("Server listening on port 3000")
})