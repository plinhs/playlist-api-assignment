const swaggerJSDoc = require('swagger-jsdoc'); 
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'Playlist API',
            version: '1.0.0',
            description: 'A simple Express Playlist API with Swagger.',
        },
        servers: [
            {
                url: '/',
            },
        ],
    },
    apis: ['./src/app.js'],
};

module.exports = swaggerJSDoc(options);