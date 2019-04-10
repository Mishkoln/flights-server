const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const querystring = require('querystring');

const contentTypes = new Map();
contentTypes.set('html', 'text/html');
contentTypes.set('js', 'text/javascript');
contentTypes.set('css', 'text/css');
contentTypes.set('json', 'application/json');

function filterFlight(data, queryData) {
    const dataJson = JSON.parse(data);
    let desFilter;
    if (Object.keys(queryData)[0] === 'to') {
        desFilter = dataJson.filter(flight => flight.to.toLowerCase() === queryData.to.toLowerCase());
    }
    if (Object.keys(queryData)[0] === 'by') {
        desFilter = dataJson.filter(flight => flight.by.toLowerCase() === queryData.by.toLowerCase());
    }
    return JSON.stringify(desFilter);
}

http.createServer(function (req, res) {
    const reqUrl = url.parse(req.url);
    console.log('reqUrl', reqUrl)
    const fileName = reqUrl.pathname === '/' ?
		'index.html' : path.basename(reqUrl.pathname);
    const ext = path.extname(fileName).substring(1);
    const cType = contentTypes.get(ext);
    const queryData = querystring.parse(reqUrl.query);

    fs.readFile('public/' + fileName, function(err, data) {
        if(err) {
            if(err.code == 'ENOENT'){
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('Resource no found');
            }
            else {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.write('Server Error');
            }
        } else {
            res.writeHead(200, {'Content-Type': cType});
            if (queryData !== null && Object.keys(queryData).length !== 0) {
                data = filterFlight(data, queryData);
            }
            res.write(data);
        }
        res.end();
    });
}).listen(8080, function () {
    console.log('Client is available at http://localhost:8080');
});