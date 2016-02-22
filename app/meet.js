


// Check dependencies
console.log('a..');
var http = require('http');
// Create the http server.
// reference: http://net.tutsplus.com/tutorials/javascript-ajax/node-js-for-beginners/
 console.log('b...');
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
 console.log('cd...');
 
 var url = require('url');
var url_parts = url.parse(req.url, true);
//var s_q = url_parts['query'];
console.log(url_parts);
 
 //console.log(url_parts['path']);
 var qType = url_parts.query.t;

 var strPath = url_parts['path'];
    
    console.log("qt:  " + qType);
 
 if (qType == 1) {
    var query = 'SELECT CONCAT(a.firstName , " " , a.lastName) as name, a.athleteId, DATE_FORMAT(dateHeld, "%m-%d-%Y") as dateHeld, ageGroup, bweight, eventName, e.eventId, cj, snatch, total, IF(rank=0 ,"---", rank) rank, category, gender FROM athlete a ';
    query +=    'INNER JOIN athleteMeet am ON am.athleteId = a.athleteId INNER JOIN event e on e.eventId = am.eventId WHERE e.eventId = ' + url_parts.query.meetId ;
    query +=    ' ORDER BY gender, category DESC, IF(rank=0 ,99999, rank) ';
 }
 else if(qType == 2) {
    var query = 'SELECT CONCAT(a.firstName , " " , a.lastName) as name, a.athleteId, DATE_FORMAT(dateHeld, "%m-%d-%Y") as dateHeld, ageGroup, eventName, e.eventId, am.* FROM athlete a ';
    query +=    'INNER JOIN athleteMeet am ON am.athleteId = a.athleteId INNER JOIN event e on e.eventId = am.eventId WHERE a.athleteId = ' + url_parts.query.athleteId  ;
    query +=    ' ORDER BY dateHeld desc';
 }
 else if(qType == 3) {
    var query = 'SELECT CONCAT(firstName , " " , lastName) as name, athleteId FROM athlete  ';
    
 }
 else if(qType == 4) {
    var query = 'SELECT DATE_FORMAT(dateHeld, "%m-%d-%Y") as date, ageGroup, eventName, eventId, eventType FROM event ORDER BY dateHeld desc';
 }
 getSQL(callback, query);
}).listen(4000);

// Access MySQL via node-mysql
// https://github.com/felixge/node-mysql
function getSQL(callback, s_query) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host : '127.0.0.1',
        user : 'ryantyler',
        password : 'Bob44al88',
        database : 'Weightlifting',
    });

    connection.connect();
    var json = '';
    
    connection.query(s_query, function(err, results, fields) {
        if (err) {
          console.log(err);
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