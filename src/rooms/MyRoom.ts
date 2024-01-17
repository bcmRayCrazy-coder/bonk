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
            if (!player.alive) return;
            player.x = data.x;
            player.y = data.y;
            player.z = data.z;
            if (player.y < -2) {
                console.log(client.sessionId, 'die');
                player.alive = false;
                this.broadcast('die', { sessionId: client.sessionId });
                var alive = 0;
                this.state.players.forEach((player) => {
                    if (player.alive) alive += 1;
                });
                this.state.alive = alive;
                if (alive == 0) this.disconnect(4001);
            }
            this.state.players.set(client.sessionId, player);
        });
        this.onMessage('updateForce', (client, data) => {
            this.broadcast('force', {
                sessionId: client.sessionId,
                force: data,
            });
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
        this.state.alive += 1;
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, 'left!');
        this.state.players.delete(client.sessionId);
        this.state.alive -= 1;
    }

    onDispose() {
        console.log('room', this.roomId, 'disposing...');
    }
}
