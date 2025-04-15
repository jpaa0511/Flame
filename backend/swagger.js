const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'API de Flame',
        description: 'Documentación de la API para la gestion de Flame (Copia Tinder)',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./index.js'];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./index'); 
});