const { urlencoded } = require('body-parser');
var express = require('express'); //Requiero el modulo express
var rp = require('request-promise');

var app = express(); //Para iniciar el servidor con express
var PORT = 4000;

app.use(express.json());

app.use(express.urlencoded({ extended: false })); //

app.use(express.static('./'))


///POST desde Postman al server
app.post('/crear_persona', function (request, response) {
    request.body;

    //Realizo las validaciones a los campos
    if (typeof request.body.nombre !== 'string' || request.body.nombre === "") { // || request.body.nombre instanceof String 
        throw new Error('El campo nombre debe ser un string.');
    }

    if (typeof request.body.apellido !== 'string' || request.body.apellido === "") {
        throw new Error('El campo apellido debe ser un string.');
    }

    if (!request.body.dni) {
        request.body.dni = null; //Si no se ingresa un DNI, se asigna un null
    } else if (typeof request.body.dni !== "number") {
        request.body.dni = parseInt(request.body.dni, 10); ///Como desde el input de html viene un string tengo que convertir a int
    } else if (request.body.dni <= 0 || request.body.dni.toString().length > 10) {
        throw new Error('El campo DNI debe ser numérico y menor a 10 dígitos.');
    }

    var nombre = request.body.nombre;
    var apellido = request.body.apellido;
    var dni = request.body.dni;

    response.status(201).json({ //Muestro el estado 201 y los valores obtenidos
        status: 'OK',
        nombre,
        apellido,
        dni,
    })

    ///Preparo las opciones para el request promise 
    var options = {
        uri: 'https://reclutamiento-14cf7.firebaseio.com/personas.json',
        method: 'POST',
        body: {
            nombre: nombre,
            apellido: apellido,
            dni: dni
        },
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        json: true
    };

    ///POST con request-promise a firebase
    rp(options)
    .then((json) => console.log(json)) 
    .catch((error) => console.error(error))
});

///Error para validaciones 
app.use((error, req, res, next) => {
    res.status(400).json({
        status: 'Error. El formato del json es inválido.',
        message: error.message,
    });
})

///Error desconocido
app.use((error, req, res, next) => {
    res.status(500).json({
        status: 'Error Desconocido.',
        message: error.message,
    });
})

///Mensaje de error
// req.on('error'), (e) => {
//     console.error('Hubo un problema con el request' + e.message);
// };

///Indica a que puerto escuchar y muestra en consola
app.listen(PORT, () => {
    console.log('server running on http://localhost:' + PORT);
});