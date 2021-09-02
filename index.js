var express = require('express');
var app = express();

app.use(express.static('src'));
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "src/dragFile.html" );
})

app.get('/process_get', function (req, res) {
   // Prepare output in JSON format
   response = {
      first_name:req.query.first_name,
      last_name:req.query.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

var server = app.listen(8000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})











// // vamos importar os módulos http e filesystem
// const http = require('http'), fs = require('fs')

// // então, criamos o servidor http
// http.createServer((req, res) => {
//   // esse é o cabeçalho da nossa resposta
//   res.writeHead(200, {
//     'Content-Type': 'text/html',
//     'Access-Control-Allow-Origin' : '*'
//   })
//   // leremos o index.html
//   let readStream = fs.createReadStream(__dirname + '/src/dragFile.html')
//   // então, enviamos ele para o cliente
//   readStream.pipe(res)
// }).listen(8000)

// // no fim, informamos o endpoint para o usuário
// console.log('Visite-me em: http://localhost:8000')