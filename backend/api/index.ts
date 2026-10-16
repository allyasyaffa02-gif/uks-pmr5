import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { AppModule } from "../src/app.module";
import { setupApp } from "../src/setup-app";

const server = express();

/**
 * Serverless: satu instance server dipakai ulang antar invocation (warm start).
 * Yang di-cache adalah PROMISE-nya, bukan hasilnya, supaya beberapa request yang
 * datang bersamaan saat cold start tidak menjalankan bootstrap berulang kali.
 */
let ready: Promise<void> | null = null;

function bootstrap(): Promise<void> {
  return (async () => {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    // CORS, ValidationPipe, interceptor & global prefix semuanya diatur di sini
    // agar perilaku Vercel identik dengan `npm run start:prod` (src/main.ts).
    // Jangan duplikasi konfigurasi CORS di file ini: origin hardcoded ("*")
    // membuat browser menolak cookie httpOnly dan menghilangkan `Vary: Origin`.
    setupApp(app);
    await app.init();
  })();
}

export default async function handler(req: any, res: any) {
  ready ??= bootstrap();
  await ready;
  return server(req, res);
}
