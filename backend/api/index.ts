import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { TimeoutInterceptor } from "../src/common/interceptors/timeout.interceptors";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";

const server = express();

export const createNestServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  });

  app.useGlobalInterceptors(new TimeoutInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix("api");

  await app.init();
};

let cachedServer: any;

export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    await createNestServer(server);
    cachedServer = server;
  }
  return server(req, res);
}
