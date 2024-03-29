import { Schema, MapSchema, type } from '@colyseus/schema';

export class Player extends Schema {
    @type('number') x: number = 0;
    @type('number') y: number = 0;
    @type('number') z: number = 0;
    @type('boolean') alive: boolean = true;
}

export class MyRoomState extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
    @type('number') alive = 0;
}
