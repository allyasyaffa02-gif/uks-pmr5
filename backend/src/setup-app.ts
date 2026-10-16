import { INestApplication, ValidationPipe } from "@nestjs/common";
import { TimeoutInterceptor } from "./common/interceptors/timeout.interceptors";

export function setupApp(app: INestApplication) {
  const allowedOrigins = (
    process.env.CORS_ORIGIN ?? "http://localhost:5173,http://127.0.0.1:5173"
  )
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

  /**
   * Refresh token dikirim sebagai cookie httpOnly, jadi request WAJIB memakai
   * credentials. Spesifikasi CORS melarang `Access-Control-Allow-Origin: *`
   * bersama `Allow-Credentials: true` - browser akan memblokir responsnya.
   * Karena itu `*` diterjemahkan ke `true` (cermin origin pemanggil) dan bukan
   * diteruskan apa adanya. `credentials: true` juga yang membuat paket `cors`
   * menulis header `Vary: Origin`, sehingga cache Vercel tidak pernah menyajikan
   * header CORS milik origin yang berbeda.
   */
  app.enableCors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
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
}
