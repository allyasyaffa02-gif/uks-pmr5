import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "../generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import mariadb from "mariadb";
import { describeConnection, requireDatabaseConnection, toMariadbPoolOptions } from "../../prisma/db-url";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger("PrismaService");
  private readonly pool: ReturnType<typeof mariadb.createPool>;
  private readonly target: string;

  constructor() {
    // Handing `process.env.DATABASE_URL` straight to createPool() only worked
    // while the URL used the mariadb:// scheme: TiDB Cloud issues mysql://...
    // URLs, which the connector's parser rejects ("error parsing connection
    // string") and it cannot express TLS there either. Build the options from
    // the parsed URL instead - see prisma/db-url.ts.
    const connection = requireDatabaseConnection();
    const pool = mariadb.createPool(toMariadbPoolOptions(connection) as any);
    const adapter = new PrismaMariaDb(pool as any);
    super({ adapter });
    this.pool = pool;
    this.target = describeConnection(connection);
  }

  async onModuleInit() {
    this.logger.log(`Connecting to ${this.target}`);
    try {
      await this.$connect();
    } catch (error) {
      this.logger.error(
        `Cannot reach ${this.target} - check DATABASE_URL, TLS settings and the IP allow-list: ${
          error instanceof Error ? error.message : error
        }`,
      );
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
