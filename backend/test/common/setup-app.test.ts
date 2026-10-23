import { describe, expect, test } from "bun:test";
import { setupApp } from "../../src/setup-app";

function makeApp() {
  const calls: Record<string, any> = {};
  return {
    calls,
    app: {
      enableCors: (options: any) => {
        calls.enableCors = options;
      },
      useGlobalInterceptors: (interceptor: any) => {
        calls.useGlobalInterceptors = interceptor;
      },
      useGlobalPipes: (pipe: any) => {
        calls.useGlobalPipes = pipe;
      },
      setGlobalPrefix: (prefix: string) => {
        calls.setGlobalPrefix = prefix;
      },
    },
  };
}

function withEnv(key: string, value: string | undefined, fn: () => void) {
  const prev = process.env[key];
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
  try {
    fn();
  } finally {
    if (prev === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = prev;
    }
  }
}

describe("setupApp", () => {
  test("CORS origin * diterjemahkan ke true", () => {
    withEnv("CORS_ORIGIN", "*", () => {
      const { calls, app } = makeApp();
      setupApp(app as any);
      expect(calls.enableCors.origin).toBe(true);
      expect(calls.enableCors.credentials).toBe(true);
      expect(calls.setGlobalPrefix).toBe("api");
    });
  });

  test("origin default tanpa CORS_ORIGIN", () => {
    withEnv("CORS_ORIGIN", undefined, () => {
      const { calls, app } = makeApp();
      setupApp(app as any);
      expect(Array.isArray(calls.enableCors.origin)).toBe(true);
      expect(calls.enableCors.origin).toContain("http://localhost:5173");
      expect(calls.enableCors.credentials).toBe(true);
    });
  });

  test("CORS_ORIGIN terpisah koma ditrim & trailing slash dibuang", () => {
    withEnv("CORS_ORIGIN", " http://a.com/ ,http://b.com , ", () => {
      const { calls, app } = makeApp();
      setupApp(app as any);
      expect(calls.enableCors.origin).toEqual([
        "http://a.com",
        "http://b.com",
      ]);
    });
  });

  test("memasang prefix & global pipes/interceptors", () => {
    const { calls, app } = makeApp();
    setupApp(app as any);
    expect(calls.setGlobalPrefix).toBe("api");
    expect(calls.useGlobalPipes).toBeDefined();
    expect(calls.useGlobalInterceptors).toBeDefined();
  });
});