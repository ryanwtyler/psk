


// Check dependencies
console.log('0..');
var http = require('http');
// Create the http server.
// reference: http://net.tutsplus.com/tutorials/javascript-ajax/node-js-for-beginners/
 console.log('1...');
/***************
* Correction 1: Using the request.on('close', function()( ... )-listener isn't required anymore
***************/
http.createServer(function(req, res) {
    console.log('Receving request...');
    var callback = function(err, result) {
        res.writeHead(200, {
            'Content-Type' : 'x-application/json'
        });
        //console.log('json:', res);
        res.end(result);
    };
 console.log('3d...');
    getSQL(callback);
 console.log('4...');
}).listen(3000);

// Access MySQL via node-mysql
// https://github.com/felixge/node-mysql
function getSQL(callback) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host : '127.0.0.1',
        user : 'ryantyler',
        password : 'Bob44al88',
        database : 'Weightlifting',
    });

    connection.connect();
    var json = '';
    var query = 'SELECT DATE_FORMAT(dateHeld, "%m-%d-%Y") as date, ageGroup, eventName, eventId, eventType FROM event ORDER BY dateHeld desc';
    connection.query(query, function(err, results, fields) {
        if (err) {
          console.log('5  ' + err);
            return callback(err, null);
        }
        console.log('The query-result is: ', results[0]);

        // wrap result-set as json
        json = JSON.stringify(results);

        /***************
        * Correction 2: Nest the callback correctly!
        ***************/
        connection.end();
        //console.log('JSON-result:', json);
        callback(null, json);
    });
};