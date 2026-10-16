import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { setupApp } from "./setup-app";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupApp(app);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 UKS PMR Backend is running on: http://localhost:${port}/api`);
}
bootstrap();
