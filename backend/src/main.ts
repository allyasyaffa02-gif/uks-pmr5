import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { TimeoutInterceptor } from "./common/interceptors/timeout.interceptors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Refresh token disimpan sebagai cookie httpOnly, jadi CORS wajib memakai
  // credentials. Karena itu origin tidak boleh "*" - browser menolak kombinasi
  // keduanya. Daftar origin diambil dari CORS_ORIGIN (dipisah koma); default
  // hanya untuk dev Vite.
  const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });

  app.useGlobalInterceptors(new TimeoutInterceptor());

  // Enable global validation pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Set global API prefix
  app.setGlobalPrefix("api");

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 UKS PMR Backend is running on: http://localhost:${port}/api`);
}
bootstrap();
