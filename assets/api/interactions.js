// worker.js

import { verifyKey } from 'discord-interactions';

const DISCORD_PUBLIC_KEY = 'a89ac116fed10276cdca74013fbf21ce038276183607976dbb575fc39fc9a32c'; 

export default {
  async fetch(request, env, ctx) {
    const signature = request.headers.get('X-Signature-Ed25519');
    const timestamp = request.headers.get('X-Signature-Timestamp');
    const body = await request.text();

    const isValidRequest = verifyKey(body, signature, timestamp, DISCORD_PUBLIC_KEY);
    if (!isValidRequest) {
      return new Response('invalid request signature', { status: 401 });
    }

    const interaction = JSON.parse(body);

    if (interaction.type === 1) {
      // PING
      return Response.json({ type: 1 });
    }

    if (interaction.type === 2) {
      // SLASH COMMAND
      if (interaction.data.name === 'ping') {
        return Response.json({
          type: 4,
          data: {
            content: 'Pong! 🏓'
          }
        });
      }
    }

    return new Response('ok', { status: 200 });
  }
};
