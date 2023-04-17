import * as dotenv from 'dotenv';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';

import Mental from './db.js';

dotenv.config();

const mental = new Mental('db.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
  ],
});

const koa = new Koa();
const router = new Router();

koa.use(cors({ origin: '*' }));

router.get('/', (ctx) => {
  ctx.body = JSON.stringify(mental.db);
  ctx.headers['content-type'] = 'application/json';
  ctx.status = 200;
});

const nixosRegex = /(^|\s+)nix(?=\s+|$)/g;
const windowsRegex = /(^|\s+)windows(?=\s+|$)/g;
const alpineRegex = /(^|\s+)alpine(?=\s+|$)/g;
const voidRegex = /(^|\s+)void(?=\s+|$)/g;
const archRegex = /(^|\s+)arch(?=\s+|$)/g;

client.on(Events.MessageCreate, (message) => {
  [nixosRegex, windowsRegex, alpineRegex, voidRegex, archRegex].forEach(
    (regex) => {
      const res = regex.exec(message.content);
      if (!res) return;
      const os = res[0].trim();
      mental.add({
        os,
        author: message.author.id,
        timestamp: Date.now(),
        url: message.url,
      });
      message.react('✏️');
    },
  );
});

client.once(Events.ClientReady, () => {
  mental.init();
  mental.refresh();
  console.log('the mental illinois is real');
});

client.login(process.env.TOKEN);
koa
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.KOA_PORT);
