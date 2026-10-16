import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { AppModule } from "../app.module";
import { setupApp } from "../setup-app";

const server = express();
let ready: Promise<void> | null = null;

function bootstrap() {
  return (async () => {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    setupApp(app);
    await app.init();
  })();
}

export default async function handler(req: any, res: any) {
  ready ??= bootstrap();
  await ready;
  return server(req, res);
}
