const requestp = require('request-promise');  //Incluyo el modulo "request-promise"

var options = {
    uri: 'https://reclutamiento-14cf7.firebaseio.com/personas.json',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true  ///Para que muestre bien formateado en la consola
};

requestp(options) //Hago el request de la dirección asignada en options y si pude hacerlo satisfactoriamente muestro en consola, sino muestro un error en consola
    .then((json) => console.log(json)) 
    .catch((error) => console.error(error))

