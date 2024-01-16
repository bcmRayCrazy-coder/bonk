import { Room, Client } from '@colyseus/core';
import { MyRoomState, Player } from './schema/MyRoomState';

export class MyRoom extends Room<MyRoomState> {
    maxClients = 4;
    floorSize = 6;
    playerEntities = {};

    onCreate(options: any) {
        this.setState(new MyRoomState());

        this.onMessage('updatePosition', (client, data) => {
            const player = this.state.players.get(client.sessionId);
            player.x = data.x;
            player.y = data.y;
            player.z = data.z;
            this.state.players.set(client.sessionId, player);
        });
        this.onMessage('updateForce', (client, data) => {
            const player = this.state.players.get(client.sessionId);
            player.forceX = data.x;
            player.forceY = data.y;
            player.forceZ = data.z;
            this.state.players.set(client.sessionId, player);
        });
    }

    onJoin(client: Client, options: any) {
        console.log(client.sessionId, 'joined!');

        // Spawn player
        const player = new Player();
        player.x = -(this.floorSize / 2) + Math.random() * this.floorSize;
        player.y = 0.31;
        player.z = -(this.floorSize / 2) + Math.random() * this.floorSize;

        this.state.players.set(client.sessionId, player);
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, 'left!');
        this.state.players.delete(client.sessionId);
    }

    onDispose() {
        console.log('room', this.roomId, 'disposing...');
    }
}
