import config from '@colyseus/tools';
import { monitor } from '@colyseus/monitor';
import { playground } from '@colyseus/playground';
import path from 'path';
import express from 'express';

/**
 * Import your Room files
 */
import { MyRoom } from './rooms/MyRoom';

export default config({
    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('my_room', MyRoom);
    },

    initializeExpress: (app) => {
        // Send colyseus client script
        app.get('/script', (req, res) => {
            res.sendFile(
                path.join(
                    __dirname,
                    '../node_modules/colyseus.js/dist/colyseus.js'
                )
            );
        });

        app.use(express.static(path.join(__dirname, '../play')));

        app.get('/ping', (req, res) => {
            res.status(200).send('pong');
        });

        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        // if (process.env.NODE_ENV !== 'production') {
            // app.use('/', playground);
        // }

        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        app.use('/colyseus', monitor());
    },

    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    },
});
