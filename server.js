const express = require('express');
const cors = require('cors');
var app = express();
var http = require('http').createServer(app);

var allowedOrigins = ['http://localhost:*'];
const io = require('socket.io')(http, {
    cors: {
        origins: allowedOrigins
    }
});

const five = require('johnny-five');
// const path = require('path');
const router = express.Router();

const port = process.env.PORT || 3000;

var board = new five.Board();
var boton1, boton2;
var placaCargada = false;

var botonPresionado;

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// app.set('views', path.join(__dirname + '/public'));
// app.use(express.static(__dirname + '/public'));

comprobarPlaca(placaCargada);

board.on('ready', function(){

    placaCargada = true;
    comprobarPlaca(placaCargada);

    //Configuraciones de los pulsadores
    boton1 = new five.Button({
        pin: 2,
        isPullup: true
    });

    boton2 = new five.Button({
        pin: 3,
        isPullup: true
    });

    boton1.on('down', function(){
        console.log('Boton1 presionado');
        botonPresionado = 1;
        io.emit('data', botonPresionado);
    });

    boton2.on('down', function(){
        console.log('Boton2 presionado');
        botonPresionado = 2;
        io.emit('data', botonPresionado);
    });

});

router.get('/', cors(), (req, res) => {
    res.send('Cargando' + botonPresionado);
});

app.use(router);

http.listen(port, function(){
    console.log('Server listening on port 3000!');
});

function comprobarPlaca(placa){
    if(placa){
        console.log('Placa cargada.');
    } else {
        console.log('Cargando Placa...');
    }
}