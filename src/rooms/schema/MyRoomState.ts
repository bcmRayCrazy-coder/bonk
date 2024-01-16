import { Schema, MapSchema, type } from '@colyseus/schema';

export class Player extends Schema {
    @type('number') x: number = 0;
    @type('number') y: number = 0;
    @type('number') z: number = 0;
    @type('number') forceX: number = 0;
    @type('number') forceY: number = 0;
    @type('number') forceZ: number = 0;
}

export class MyRoomState extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
}