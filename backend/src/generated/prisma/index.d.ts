
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model MasterKategori
 * 
 */
export type MasterKategori = $Result.DefaultSelection<Prisma.$MasterKategoriPayload>
/**
 * Model Pasien
 * 
 */
export type Pasien = $Result.DefaultSelection<Prisma.$PasienPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more MasterKategoris
 * const masterKategoris = await prisma.masterKategori.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more MasterKategoris
   * const masterKategoris = await prisma.masterKategori.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.masterKategori`: Exposes CRUD operations for the **MasterKategori** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MasterKategoris
    * const masterKategoris = await prisma.masterKategori.findMany()
    * ```
    */
  get masterKategori(): Prisma.MasterKategoriDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pasien`: Exposes CRUD operations for the **Pasien** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pasiens
    * const pasiens = await prisma.pasien.findMany()
    * ```
    */
  get pasien(): Prisma.PasienDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.10.0
   * Query Engine version: 0edf323efd1d98336f3f0a68684b56f689b900d3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    MasterKategori: 'MasterKategori',
    Pasien: 'Pasien'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "masterKategori" | "pasien"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      MasterKategori: {
        payload: Prisma.$MasterKategoriPayload<ExtArgs>
        fields: Prisma.MasterKategoriFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MasterKategoriFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterKategoriPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MasterKategoriFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterKategoriPayload>
          }
          findFirst: {
            args: Prisma.MasterKategoriFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterKategoriPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MasterKategoriFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterKategoriPayload>
          }
          findMany: {
            args: Prisma.MasterKategoriFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterKategoriPayload>[]
          }
          create: {
            args: Prisma.MasterKategoriCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterKategoriPayload>
          }
          createMany: {
            args: Prisma.MasterKategoriCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MasterKategoriDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterKategoriPayload>
          }
          update: {
            args: Prisma.MasterKategoriUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterKategoriPayload>
          }
          deleteMany: {
            args: Prisma.MasterKategoriDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MasterKategoriUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MasterKategoriUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterKategoriPayload>
          }
          aggregate: {
            args: Prisma.MasterKategoriAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMasterKategori>
          }
          groupBy: {
            args: Prisma.MasterKategoriGroupByArgs<ExtArgs>
            result: $Utils.Optional<MasterKategoriGroupByOutputType>[]
          }
          count: {
            args: Prisma.MasterKategoriCountArgs<ExtArgs>
            result: $Utils.Optional<MasterKategoriCountAggregateOutputType> | number
          }
        }
      }
      Pasien: {
        payload: Prisma.$PasienPayload<ExtArgs>
        fields: Prisma.PasienFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasienFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasienPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasienFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasienPayload>
          }
          findFirst: {
            args: Prisma.PasienFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasienPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasienFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasienPayload>
          }
          findMany: {
            args: Prisma.PasienFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasienPayload>[]
          }
          create: {
            args: Prisma.PasienCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasienPayload>
          }
          createMany: {
            args: Prisma.PasienCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PasienDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasienPayload>
          }
          update: {
            args: Prisma.PasienUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasienPayload>
          }
          deleteMany: {
            args: Prisma.PasienDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasienUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PasienUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasienPayload>
          }
          aggregate: {
            args: Prisma.PasienAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasien>
          }
          groupBy: {
            args: Prisma.PasienGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasienGroupByOutputType>[]
          }
          count: {
            args: Prisma.PasienCountArgs<ExtArgs>
            result: $Utils.Optional<PasienCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    masterKategori?: MasterKategoriOmit
    pasien?: PasienOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type MasterKategoriCountOutputType
   */

  export type MasterKategoriCountOutputType = {
    pasiens: number
  }

  export type MasterKategoriCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pasiens?: boolean | MasterKategoriCountOutputTypeCountPasiensArgs
  }

  // Custom InputTypes
  /**
   * MasterKategoriCountOutputType without action
   */
  export type MasterKategoriCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterKategoriCountOutputType
     */
    select?: MasterKategoriCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MasterKategoriCountOutputType without action
   */
  export type MasterKategoriCountOutputTypeCountPasiensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasienWhereInput
  }


  /**
   * Models
   */

  /**
   * Model MasterKategori
   */

  export type AggregateMasterKategori = {
    _count: MasterKategoriCountAggregateOutputType | null
    _avg: MasterKategoriAvgAggregateOutputType | null
    _sum: MasterKategoriSumAggregateOutputType | null
    _min: MasterKategoriMinAggregateOutputType | null
    _max: MasterKategoriMaxAggregateOutputType | null
  }

  export type MasterKategoriAvgAggregateOutputType = {
    id: number | null
  }

  export type MasterKategoriSumAggregateOutputType = {
    id: bigint | null
  }

  export type MasterKategoriMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type MasterKategoriMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type MasterKategoriCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type MasterKategoriAvgAggregateInputType = {
    id?: true
  }

  export type MasterKategoriSumAggregateInputType = {
    id?: true
  }

  export type MasterKategoriMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type MasterKategoriMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type MasterKategoriCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type MasterKategoriAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MasterKategori to aggregate.
     */
    where?: MasterKategoriWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MasterKategoris to fetch.
     */
    orderBy?: MasterKategoriOrderByWithRelationInput | MasterKategoriOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MasterKategoriWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MasterKategoris from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MasterKategoris.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MasterKategoris
    **/
    _count?: true | MasterKategoriCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MasterKategoriAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MasterKategoriSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MasterKategoriMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MasterKategoriMaxAggregateInputType
  }

  export type GetMasterKategoriAggregateType<T extends MasterKategoriAggregateArgs> = {
        [P in keyof T & keyof AggregateMasterKategori]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMasterKategori[P]>
      : GetScalarType<T[P], AggregateMasterKategori[P]>
  }




  export type MasterKategoriGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MasterKategoriWhereInput
    orderBy?: MasterKategoriOrderByWithAggregationInput | MasterKategoriOrderByWithAggregationInput[]
    by: MasterKategoriScalarFieldEnum[] | MasterKategoriScalarFieldEnum
    having?: MasterKategoriScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MasterKategoriCountAggregateInputType | true
    _avg?: MasterKategoriAvgAggregateInputType
    _sum?: MasterKategoriSumAggregateInputType
    _min?: MasterKategoriMinAggregateInputType
    _max?: MasterKategoriMaxAggregateInputType
  }

  export type MasterKategoriGroupByOutputType = {
    id: bigint
    name: string
    createdAt: Date
    updatedAt: Date | null
    deletedAt: Date | null
    _count: MasterKategoriCountAggregateOutputType | null
    _avg: MasterKategoriAvgAggregateOutputType | null
    _sum: MasterKategoriSumAggregateOutputType | null
    _min: MasterKategoriMinAggregateOutputType | null
    _max: MasterKategoriMaxAggregateOutputType | null
  }

  type GetMasterKategoriGroupByPayload<T extends MasterKategoriGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MasterKategoriGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MasterKategoriGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MasterKategoriGroupByOutputType[P]>
            : GetScalarType<T[P], MasterKategoriGroupByOutputType[P]>
        }
      >
    >


  export type MasterKategoriSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    pasiens?: boolean | MasterKategori$pasiensArgs<ExtArgs>
    _count?: boolean | MasterKategoriCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["masterKategori"]>



  export type MasterKategoriSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type MasterKategoriOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["masterKategori"]>
  export type MasterKategoriInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pasiens?: boolean | MasterKategori$pasiensArgs<ExtArgs>
    _count?: boolean | MasterKategoriCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $MasterKategoriPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MasterKategori"
    objects: {
      pasiens: Prisma.$PasienPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string
      createdAt: Date
      updatedAt: Date | null
      deletedAt: Date | null
    }, ExtArgs["result"]["masterKategori"]>
    composites: {}
  }

  type MasterKategoriGetPayload<S extends boolean | null | undefined | MasterKategoriDefaultArgs> = $Result.GetResult<Prisma.$MasterKategoriPayload, S>

  type MasterKategoriCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MasterKategoriFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MasterKategoriCountAggregateInputType | true
    }

  export interface MasterKategoriDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MasterKategori'], meta: { name: 'MasterKategori' } }
    /**
     * Find zero or one MasterKategori that matches the filter.
     * @param {MasterKategoriFindUniqueArgs} args - Arguments to find a MasterKategori
     * @example
     * // Get one MasterKategori
     * const masterKategori = await prisma.masterKategori.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MasterKategoriFindUniqueArgs>(args: SelectSubset<T, MasterKategoriFindUniqueArgs<ExtArgs>>): Prisma__MasterKategoriClient<$Result.GetResult<Prisma.$MasterKategoriPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MasterKategori that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MasterKategoriFindUniqueOrThrowArgs} args - Arguments to find a MasterKategori
     * @example
     * // Get one MasterKategori
     * const masterKategori = await prisma.masterKategori.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MasterKategoriFindUniqueOrThrowArgs>(args: SelectSubset<T, MasterKategoriFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MasterKategoriClient<$Result.GetResult<Prisma.$MasterKategoriPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MasterKategori that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterKategoriFindFirstArgs} args - Arguments to find a MasterKategori
     * @example
     * // Get one MasterKategori
     * const masterKategori = await prisma.masterKategori.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MasterKategoriFindFirstArgs>(args?: SelectSubset<T, MasterKategoriFindFirstArgs<ExtArgs>>): Prisma__MasterKategoriClient<$Result.GetResult<Prisma.$MasterKategoriPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MasterKategori that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterKategoriFindFirstOrThrowArgs} args - Arguments to find a MasterKategori
     * @example
     * // Get one MasterKategori
     * const masterKategori = await prisma.masterKategori.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MasterKategoriFindFirstOrThrowArgs>(args?: SelectSubset<T, MasterKategoriFindFirstOrThrowArgs<ExtArgs>>): Prisma__MasterKategoriClient<$Result.GetResult<Prisma.$MasterKategoriPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MasterKategoris that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterKategoriFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MasterKategoris
     * const masterKategoris = await prisma.masterKategori.findMany()
     * 
     * // Get first 10 MasterKategoris
     * const masterKategoris = await prisma.masterKategori.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const masterKategoriWithIdOnly = await prisma.masterKategori.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MasterKategoriFindManyArgs>(args?: SelectSubset<T, MasterKategoriFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MasterKategoriPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MasterKategori.
     * @param {MasterKategoriCreateArgs} args - Arguments to create a MasterKategori.
     * @example
     * // Create one MasterKategori
     * const MasterKategori = await prisma.masterKategori.create({
     *   data: {
     *     // ... data to create a MasterKategori
     *   }
     * })
     * 
     */
    create<T extends MasterKategoriCreateArgs>(args: SelectSubset<T, MasterKategoriCreateArgs<ExtArgs>>): Prisma__MasterKategoriClient<$Result.GetResult<Prisma.$MasterKategoriPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MasterKategoris.
     * @param {MasterKategoriCreateManyArgs} args - Arguments to create many MasterKategoris.
     * @example
     * // Create many MasterKategoris
     * const masterKategori = await prisma.masterKategori.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MasterKategoriCreateManyArgs>(args?: SelectSubset<T, MasterKategoriCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a MasterKategori.
     * @param {MasterKategoriDeleteArgs} args - Arguments to delete one MasterKategori.
     * @example
     * // Delete one MasterKategori
     * const MasterKategori = await prisma.masterKategori.delete({
     *   where: {
     *     // ... filter to delete one MasterKategori
     *   }
     * })
     * 
     */
    delete<T extends MasterKategoriDeleteArgs>(args: SelectSubset<T, MasterKategoriDeleteArgs<ExtArgs>>): Prisma__MasterKategoriClient<$Result.GetResult<Prisma.$MasterKategoriPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MasterKategori.
     * @param {MasterKategoriUpdateArgs} args - Arguments to update one MasterKategori.
     * @example
     * // Update one MasterKategori
     * const masterKategori = await prisma.masterKategori.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MasterKategoriUpdateArgs>(args: SelectSubset<T, MasterKategoriUpdateArgs<ExtArgs>>): Prisma__MasterKategoriClient<$Result.GetResult<Prisma.$MasterKategoriPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MasterKategoris.
     * @param {MasterKategoriDeleteManyArgs} args - Arguments to filter MasterKategoris to delete.
     * @example
     * // Delete a few MasterKategoris
     * const { count } = await prisma.masterKategori.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MasterKategoriDeleteManyArgs>(args?: SelectSubset<T, MasterKategoriDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MasterKategoris.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterKategoriUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MasterKategoris
     * const masterKategori = await prisma.masterKategori.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MasterKategoriUpdateManyArgs>(args: SelectSubset<T, MasterKategoriUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MasterKategori.
     * @param {MasterKategoriUpsertArgs} args - Arguments to update or create a MasterKategori.
     * @example
     * // Update or create a MasterKategori
     * const masterKategori = await prisma.masterKategori.upsert({
     *   create: {
     *     // ... data to create a MasterKategori
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MasterKategori we want to update
     *   }
     * })
     */
    upsert<T extends MasterKategoriUpsertArgs>(args: SelectSubset<T, MasterKategoriUpsertArgs<ExtArgs>>): Prisma__MasterKategoriClient<$Result.GetResult<Prisma.$MasterKategoriPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MasterKategoris.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterKategoriCountArgs} args - Arguments to filter MasterKategoris to count.
     * @example
     * // Count the number of MasterKategoris
     * const count = await prisma.masterKategori.count({
     *   where: {
     *     // ... the filter for the MasterKategoris we want to count
     *   }
     * })
    **/
    count<T extends MasterKategoriCountArgs>(
      args?: Subset<T, MasterKategoriCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MasterKategoriCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MasterKategori.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterKategoriAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MasterKategoriAggregateArgs>(args: Subset<T, MasterKategoriAggregateArgs>): Prisma.PrismaPromise<GetMasterKategoriAggregateType<T>>

    /**
     * Group by MasterKategori.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterKategoriGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MasterKategoriGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MasterKategoriGroupByArgs['orderBy'] }
        : { orderBy?: MasterKategoriGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MasterKategoriGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMasterKategoriGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MasterKategori model
   */
  readonly fields: MasterKategoriFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MasterKategori.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MasterKategoriClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pasiens<T extends MasterKategori$pasiensArgs<ExtArgs> = {}>(args?: Subset<T, MasterKategori$pasiensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasienPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MasterKategori model
   */
  interface MasterKategoriFieldRefs {
    readonly id: FieldRef<"MasterKategori", 'BigInt'>
    readonly name: FieldRef<"MasterKategori", 'String'>
    readonly createdAt: FieldRef<"MasterKategori", 'DateTime'>
    readonly updatedAt: FieldRef<"MasterKategori", 'DateTime'>
    readonly deletedAt: FieldRef<"MasterKategori", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MasterKategori findUnique
   */
  export type MasterKategoriFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterKategori
     */
    select?: MasterKategoriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterKategori
     */
    omit?: MasterKategoriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterKategoriInclude<ExtArgs> | null
    /**
     * Filter, which MasterKategori to fetch.
     */
    where: MasterKategoriWhereUniqueInput
  }

  /**
   * MasterKategori findUniqueOrThrow
   */
  export type MasterKategoriFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterKategori
     */
    select?: MasterKategoriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterKategori
     */
    omit?: MasterKategoriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterKategoriInclude<ExtArgs> | null
    /**
     * Filter, which MasterKategori to fetch.
     */
    where: MasterKategoriWhereUniqueInput
  }

  /**
   * MasterKategori findFirst
   */
  export type MasterKategoriFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterKategori
     */
    select?: MasterKategoriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterKategori
     */
    omit?: MasterKategoriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterKategoriInclude<ExtArgs> | null
    /**
     * Filter, which MasterKategori to fetch.
     */
    where?: MasterKategoriWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MasterKategoris to fetch.
     */
    orderBy?: MasterKategoriOrderByWithRelationInput | MasterKategoriOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MasterKategoris.
     */
    cursor?: MasterKategoriWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MasterKategoris from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MasterKategoris.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MasterKategoris.
     */
    distinct?: MasterKategoriScalarFieldEnum | MasterKategoriScalarFieldEnum[]
  }

  /**
   * MasterKategori findFirstOrThrow
   */
  export type MasterKategoriFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterKategori
     */
    select?: MasterKategoriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterKategori
     */
    omit?: MasterKategoriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterKategoriInclude<ExtArgs> | null
    /**
     * Filter, which MasterKategori to fetch.
     */
    where?: MasterKategoriWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MasterKategoris to fetch.
     */
    orderBy?: MasterKategoriOrderByWithRelationInput | MasterKategoriOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MasterKategoris.
     */
    cursor?: MasterKategoriWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MasterKategoris from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MasterKategoris.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MasterKategoris.
     */
    distinct?: MasterKategoriScalarFieldEnum | MasterKategoriScalarFieldEnum[]
  }

  /**
   * MasterKategori findMany
   */
  export type MasterKategoriFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterKategori
     */
    select?: MasterKategoriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterKategori
     */
    omit?: MasterKategoriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterKategoriInclude<ExtArgs> | null
    /**
     * Filter, which MasterKategoris to fetch.
     */
    where?: MasterKategoriWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MasterKategoris to fetch.
     */
    orderBy?: MasterKategoriOrderByWithRelationInput | MasterKategoriOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MasterKategoris.
     */
    cursor?: MasterKategoriWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MasterKategoris from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MasterKategoris.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MasterKategoris.
     */
    distinct?: MasterKategoriScalarFieldEnum | MasterKategoriScalarFieldEnum[]
  }

  /**
   * MasterKategori create
   */
  export type MasterKategoriCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterKategori
     */
    select?: MasterKategoriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterKategori
     */
    omit?: MasterKategoriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterKategoriInclude<ExtArgs> | null
    /**
     * The data needed to create a MasterKategori.
     */
    data: XOR<MasterKategoriCreateInput, MasterKategoriUncheckedCreateInput>
  }

  /**
   * MasterKategori createMany
   */
  export type MasterKategoriCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MasterKategoris.
     */
    data: MasterKategoriCreateManyInput | MasterKategoriCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MasterKategori update
   */
  export type MasterKategoriUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterKategori
     */
    select?: MasterKategoriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterKategori
     */
    omit?: MasterKategoriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterKategoriInclude<ExtArgs> | null
    /**
     * The data needed to update a MasterKategori.
     */
    data: XOR<MasterKategoriUpdateInput, MasterKategoriUncheckedUpdateInput>
    /**
     * Choose, which MasterKategori to update.
     */
    where: MasterKategoriWhereUniqueInput
  }

  /**
   * MasterKategori updateMany
   */
  export type MasterKategoriUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MasterKategoris.
     */
    data: XOR<MasterKategoriUpdateManyMutationInput, MasterKategoriUncheckedUpdateManyInput>
    /**
     * Filter which MasterKategoris to update
     */
    where?: MasterKategoriWhereInput
    /**
     * Limit how many MasterKategoris to update.
     */
    limit?: number
  }

  /**
   * MasterKategori upsert
   */
  export type MasterKategoriUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterKategori
     */
    select?: MasterKategoriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterKategori
     */
    omit?: MasterKategoriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterKategoriInclude<ExtArgs> | null
    /**
     * The filter to search for the MasterKategori to update in case it exists.
     */
    where: MasterKategoriWhereUniqueInput
    /**
     * In case the MasterKategori found by the `where` argument doesn't exist, create a new MasterKategori with this data.
     */
    create: XOR<MasterKategoriCreateInput, MasterKategoriUncheckedCreateInput>
    /**
     * In case the MasterKategori was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MasterKategoriUpdateInput, MasterKategoriUncheckedUpdateInput>
  }

  /**
   * MasterKategori delete
   */
  export type MasterKategoriDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterKategori
     */
    select?: MasterKategoriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterKategori
     */
    omit?: MasterKategoriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterKategoriInclude<ExtArgs> | null
    /**
     * Filter which MasterKategori to delete.
     */
    where: MasterKategoriWhereUniqueInput
  }

  /**
   * MasterKategori deleteMany
   */
  export type MasterKategoriDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MasterKategoris to delete
     */
    where?: MasterKategoriWhereInput
    /**
     * Limit how many MasterKategoris to delete.
     */
    limit?: number
  }

  /**
   * MasterKategori.pasiens
   */
  export type MasterKategori$pasiensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pasien
     */
    select?: PasienSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pasien
     */
    omit?: PasienOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasienInclude<ExtArgs> | null
    where?: PasienWhereInput
    orderBy?: PasienOrderByWithRelationInput | PasienOrderByWithRelationInput[]
    cursor?: PasienWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PasienScalarFieldEnum | PasienScalarFieldEnum[]
  }

  /**
   * MasterKategori without action
   */
  export type MasterKategoriDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterKategori
     */
    select?: MasterKategoriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterKategori
     */
    omit?: MasterKategoriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterKategoriInclude<ExtArgs> | null
  }


  /**
   * Model Pasien
   */

  export type AggregatePasien = {
    _count: PasienCountAggregateOutputType | null
    _avg: PasienAvgAggregateOutputType | null
    _sum: PasienSumAggregateOutputType | null
    _min: PasienMinAggregateOutputType | null
    _max: PasienMaxAggregateOutputType | null
  }

  export type PasienAvgAggregateOutputType = {
    id: number | null
    kategoriId: number | null
  }

  export type PasienSumAggregateOutputType = {
    id: bigint | null
    kategoriId: bigint | null
  }

  export type PasienMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    kelas: string | null
    kategoriId: bigint | null
    date: Date | null
    time: string | null
    keluhan: string | null
    penanganan: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type PasienMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    kelas: string | null
    kategoriId: bigint | null
    date: Date | null
    time: string | null
    keluhan: string | null
    penanganan: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type PasienCountAggregateOutputType = {
    id: number
    name: number
    kelas: number
    kategoriId: number
    date: number
    time: number
    keluhan: number
    penanganan: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type PasienAvgAggregateInputType = {
    id?: true
    kategoriId?: true
  }

  export type PasienSumAggregateInputType = {
    id?: true
    kategoriId?: true
  }

  export type PasienMinAggregateInputType = {
    id?: true
    name?: true
    kelas?: true
    kategoriId?: true
    date?: true
    time?: true
    keluhan?: true
    penanganan?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type PasienMaxAggregateInputType = {
    id?: true
    name?: true
    kelas?: true
    kategoriId?: true
    date?: true
    time?: true
    keluhan?: true
    penanganan?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type PasienCountAggregateInputType = {
    id?: true
    name?: true
    kelas?: true
    kategoriId?: true
    date?: true
    time?: true
    keluhan?: true
    penanganan?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type PasienAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pasien to aggregate.
     */
    where?: PasienWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pasiens to fetch.
     */
    orderBy?: PasienOrderByWithRelationInput | PasienOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasienWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pasiens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pasiens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Pasiens
    **/
    _count?: true | PasienCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PasienAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PasienSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasienMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasienMaxAggregateInputType
  }

  export type GetPasienAggregateType<T extends PasienAggregateArgs> = {
        [P in keyof T & keyof AggregatePasien]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasien[P]>
      : GetScalarType<T[P], AggregatePasien[P]>
  }




  export type PasienGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasienWhereInput
    orderBy?: PasienOrderByWithAggregationInput | PasienOrderByWithAggregationInput[]
    by: PasienScalarFieldEnum[] | PasienScalarFieldEnum
    having?: PasienScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasienCountAggregateInputType | true
    _avg?: PasienAvgAggregateInputType
    _sum?: PasienSumAggregateInputType
    _min?: PasienMinAggregateInputType
    _max?: PasienMaxAggregateInputType
  }

  export type PasienGroupByOutputType = {
    id: bigint
    name: string
    kelas: string
    kategoriId: bigint
    date: Date
    time: string
    keluhan: string
    penanganan: string
    createdAt: Date
    updatedAt: Date | null
    deletedAt: Date | null
    _count: PasienCountAggregateOutputType | null
    _avg: PasienAvgAggregateOutputType | null
    _sum: PasienSumAggregateOutputType | null
    _min: PasienMinAggregateOutputType | null
    _max: PasienMaxAggregateOutputType | null
  }

  type GetPasienGroupByPayload<T extends PasienGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasienGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasienGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasienGroupByOutputType[P]>
            : GetScalarType<T[P], PasienGroupByOutputType[P]>
        }
      >
    >


  export type PasienSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    kelas?: boolean
    kategoriId?: boolean
    date?: boolean
    time?: boolean
    keluhan?: boolean
    penanganan?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    kategori?: boolean | MasterKategoriDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pasien"]>



  export type PasienSelectScalar = {
    id?: boolean
    name?: boolean
    kelas?: boolean
    kategoriId?: boolean
    date?: boolean
    time?: boolean
    keluhan?: boolean
    penanganan?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type PasienOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "kelas" | "kategoriId" | "date" | "time" | "keluhan" | "penanganan" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["pasien"]>
  export type PasienInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kategori?: boolean | MasterKategoriDefaultArgs<ExtArgs>
  }

  export type $PasienPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pasien"
    objects: {
      kategori: Prisma.$MasterKategoriPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string
      kelas: string
      kategoriId: bigint
      date: Date
      time: string
      keluhan: string
      penanganan: string
      createdAt: Date
      updatedAt: Date | null
      deletedAt: Date | null
    }, ExtArgs["result"]["pasien"]>
    composites: {}
  }

  type PasienGetPayload<S extends boolean | null | undefined | PasienDefaultArgs> = $Result.GetResult<Prisma.$PasienPayload, S>

  type PasienCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PasienFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PasienCountAggregateInputType | true
    }

  export interface PasienDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pasien'], meta: { name: 'Pasien' } }
    /**
     * Find zero or one Pasien that matches the filter.
     * @param {PasienFindUniqueArgs} args - Arguments to find a Pasien
     * @example
     * // Get one Pasien
     * const pasien = await prisma.pasien.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasienFindUniqueArgs>(args: SelectSubset<T, PasienFindUniqueArgs<ExtArgs>>): Prisma__PasienClient<$Result.GetResult<Prisma.$PasienPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pasien that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PasienFindUniqueOrThrowArgs} args - Arguments to find a Pasien
     * @example
     * // Get one Pasien
     * const pasien = await prisma.pasien.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasienFindUniqueOrThrowArgs>(args: SelectSubset<T, PasienFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasienClient<$Result.GetResult<Prisma.$PasienPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pasien that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasienFindFirstArgs} args - Arguments to find a Pasien
     * @example
     * // Get one Pasien
     * const pasien = await prisma.pasien.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasienFindFirstArgs>(args?: SelectSubset<T, PasienFindFirstArgs<ExtArgs>>): Prisma__PasienClient<$Result.GetResult<Prisma.$PasienPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pasien that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasienFindFirstOrThrowArgs} args - Arguments to find a Pasien
     * @example
     * // Get one Pasien
     * const pasien = await prisma.pasien.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasienFindFirstOrThrowArgs>(args?: SelectSubset<T, PasienFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasienClient<$Result.GetResult<Prisma.$PasienPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pasiens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasienFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pasiens
     * const pasiens = await prisma.pasien.findMany()
     * 
     * // Get first 10 Pasiens
     * const pasiens = await prisma.pasien.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pasienWithIdOnly = await prisma.pasien.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasienFindManyArgs>(args?: SelectSubset<T, PasienFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasienPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pasien.
     * @param {PasienCreateArgs} args - Arguments to create a Pasien.
     * @example
     * // Create one Pasien
     * const Pasien = await prisma.pasien.create({
     *   data: {
     *     // ... data to create a Pasien
     *   }
     * })
     * 
     */
    create<T extends PasienCreateArgs>(args: SelectSubset<T, PasienCreateArgs<ExtArgs>>): Prisma__PasienClient<$Result.GetResult<Prisma.$PasienPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pasiens.
     * @param {PasienCreateManyArgs} args - Arguments to create many Pasiens.
     * @example
     * // Create many Pasiens
     * const pasien = await prisma.pasien.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasienCreateManyArgs>(args?: SelectSubset<T, PasienCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Pasien.
     * @param {PasienDeleteArgs} args - Arguments to delete one Pasien.
     * @example
     * // Delete one Pasien
     * const Pasien = await prisma.pasien.delete({
     *   where: {
     *     // ... filter to delete one Pasien
     *   }
     * })
     * 
     */
    delete<T extends PasienDeleteArgs>(args: SelectSubset<T, PasienDeleteArgs<ExtArgs>>): Prisma__PasienClient<$Result.GetResult<Prisma.$PasienPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pasien.
     * @param {PasienUpdateArgs} args - Arguments to update one Pasien.
     * @example
     * // Update one Pasien
     * const pasien = await prisma.pasien.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasienUpdateArgs>(args: SelectSubset<T, PasienUpdateArgs<ExtArgs>>): Prisma__PasienClient<$Result.GetResult<Prisma.$PasienPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pasiens.
     * @param {PasienDeleteManyArgs} args - Arguments to filter Pasiens to delete.
     * @example
     * // Delete a few Pasiens
     * const { count } = await prisma.pasien.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasienDeleteManyArgs>(args?: SelectSubset<T, PasienDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pasiens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasienUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pasiens
     * const pasien = await prisma.pasien.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasienUpdateManyArgs>(args: SelectSubset<T, PasienUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Pasien.
     * @param {PasienUpsertArgs} args - Arguments to update or create a Pasien.
     * @example
     * // Update or create a Pasien
     * const pasien = await prisma.pasien.upsert({
     *   create: {
     *     // ... data to create a Pasien
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pasien we want to update
     *   }
     * })
     */
    upsert<T extends PasienUpsertArgs>(args: SelectSubset<T, PasienUpsertArgs<ExtArgs>>): Prisma__PasienClient<$Result.GetResult<Prisma.$PasienPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pasiens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasienCountArgs} args - Arguments to filter Pasiens to count.
     * @example
     * // Count the number of Pasiens
     * const count = await prisma.pasien.count({
     *   where: {
     *     // ... the filter for the Pasiens we want to count
     *   }
     * })
    **/
    count<T extends PasienCountArgs>(
      args?: Subset<T, PasienCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasienCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pasien.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasienAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PasienAggregateArgs>(args: Subset<T, PasienAggregateArgs>): Prisma.PrismaPromise<GetPasienAggregateType<T>>

    /**
     * Group by Pasien.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasienGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PasienGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasienGroupByArgs['orderBy'] }
        : { orderBy?: PasienGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PasienGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasienGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pasien model
   */
  readonly fields: PasienFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pasien.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasienClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    kategori<T extends MasterKategoriDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MasterKategoriDefaultArgs<ExtArgs>>): Prisma__MasterKategoriClient<$Result.GetResult<Prisma.$MasterKategoriPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Pasien model
   */
  interface PasienFieldRefs {
    readonly id: FieldRef<"Pasien", 'BigInt'>
    readonly name: FieldRef<"Pasien", 'String'>
    readonly kelas: FieldRef<"Pasien", 'String'>
    readonly kategoriId: FieldRef<"Pasien", 'BigInt'>
    readonly date: FieldRef<"Pasien", 'DateTime'>
    readonly time: FieldRef<"Pasien", 'String'>
    readonly keluhan: FieldRef<"Pasien", 'String'>
    readonly penanganan: FieldRef<"Pasien", 'String'>
    readonly createdAt: FieldRef<"Pasien", 'DateTime'>
    readonly updatedAt: FieldRef<"Pasien", 'DateTime'>
    readonly deletedAt: FieldRef<"Pasien", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Pasien findUnique
   */
  export type PasienFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pasien
     */
    select?: PasienSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pasien
     */
    omit?: PasienOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasienInclude<ExtArgs> | null
    /**
     * Filter, which Pasien to fetch.
     */
    where: PasienWhereUniqueInput
  }

  /**
   * Pasien findUniqueOrThrow
   */
  export type PasienFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pasien
     */
    select?: PasienSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pasien
     */
    omit?: PasienOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasienInclude<ExtArgs> | null
    /**
     * Filter, which Pasien to fetch.
     */
    where: PasienWhereUniqueInput
  }

  /**
   * Pasien findFirst
   */
  export type PasienFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pasien
     */
    select?: PasienSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pasien
     */
    omit?: PasienOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasienInclude<ExtArgs> | null
    /**
     * Filter, which Pasien to fetch.
     */
    where?: PasienWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pasiens to fetch.
     */
    orderBy?: PasienOrderByWithRelationInput | PasienOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pasiens.
     */
    cursor?: PasienWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pasiens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pasiens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pasiens.
     */
    distinct?: PasienScalarFieldEnum | PasienScalarFieldEnum[]
  }

  /**
   * Pasien findFirstOrThrow
   */
  export type PasienFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pasien
     */
    select?: PasienSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pasien
     */
    omit?: PasienOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasienInclude<ExtArgs> | null
    /**
     * Filter, which Pasien to fetch.
     */
    where?: PasienWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pasiens to fetch.
     */
    orderBy?: PasienOrderByWithRelationInput | PasienOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pasiens.
     */
    cursor?: PasienWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pasiens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pasiens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pasiens.
     */
    distinct?: PasienScalarFieldEnum | PasienScalarFieldEnum[]
  }

  /**
   * Pasien findMany
   */
  export type PasienFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pasien
     */
    select?: PasienSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pasien
     */
    omit?: PasienOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasienInclude<ExtArgs> | null
    /**
     * Filter, which Pasiens to fetch.
     */
    where?: PasienWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pasiens to fetch.
     */
    orderBy?: PasienOrderByWithRelationInput | PasienOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Pasiens.
     */
    cursor?: PasienWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pasiens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pasiens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pasiens.
     */
    distinct?: PasienScalarFieldEnum | PasienScalarFieldEnum[]
  }

  /**
   * Pasien create
   */
  export type PasienCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pasien
     */
    select?: PasienSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pasien
     */
    omit?: PasienOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasienInclude<ExtArgs> | null
    /**
     * The data needed to create a Pasien.
     */
    data: XOR<PasienCreateInput, PasienUncheckedCreateInput>
  }

  /**
   * Pasien createMany
   */
  export type PasienCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Pasiens.
     */
    data: PasienCreateManyInput | PasienCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pasien update
   */
  export type PasienUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pasien
     */
    select?: PasienSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pasien
     */
    omit?: PasienOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasienInclude<ExtArgs> | null
    /**
     * The data needed to update a Pasien.
     */
    data: XOR<PasienUpdateInput, PasienUncheckedUpdateInput>
    /**
     * Choose, which Pasien to update.
     */
    where: PasienWhereUniqueInput
  }

  /**
   * Pasien updateMany
   */
  export type PasienUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Pasiens.
     */
    data: XOR<PasienUpdateManyMutationInput, PasienUncheckedUpdateManyInput>
    /**
     * Filter which Pasiens to update
     */
    where?: PasienWhereInput
    /**
     * Limit how many Pasiens to update.
     */
    limit?: number
  }

  /**
   * Pasien upsert
   */
  export type PasienUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pasien
     */
    select?: PasienSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pasien
     */
    omit?: PasienOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasienInclude<ExtArgs> | null
    /**
     * The filter to search for the Pasien to update in case it exists.
     */
    where: PasienWhereUniqueInput
    /**
     * In case the Pasien found by the `where` argument doesn't exist, create a new Pasien with this data.
     */
    create: XOR<PasienCreateInput, PasienUncheckedCreateInput>
    /**
     * In case the Pasien was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasienUpdateInput, PasienUncheckedUpdateInput>
  }

  /**
   * Pasien delete
   */
  export type PasienDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pasien
     */
    select?: PasienSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pasien
     */
    omit?: PasienOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasienInclude<ExtArgs> | null
    /**
     * Filter which Pasien to delete.
     */
    where: PasienWhereUniqueInput
  }

  /**
   * Pasien deleteMany
   */
  export type PasienDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pasiens to delete
     */
    where?: PasienWhereInput
    /**
     * Limit how many Pasiens to delete.
     */
    limit?: number
  }

  /**
   * Pasien without action
   */
  export type PasienDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pasien
     */
    select?: PasienSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pasien
     */
    omit?: PasienOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasienInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const MasterKategoriScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type MasterKategoriScalarFieldEnum = (typeof MasterKategoriScalarFieldEnum)[keyof typeof MasterKategoriScalarFieldEnum]


  export const PasienScalarFieldEnum: {
    id: 'id',
    name: 'name',
    kelas: 'kelas',
    kategoriId: 'kategoriId',
    date: 'date',
    time: 'time',
    keluhan: 'keluhan',
    penanganan: 'penanganan',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type PasienScalarFieldEnum = (typeof PasienScalarFieldEnum)[keyof typeof PasienScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const MasterKategoriOrderByRelevanceFieldEnum: {
    name: 'name'
  };

  export type MasterKategoriOrderByRelevanceFieldEnum = (typeof MasterKategoriOrderByRelevanceFieldEnum)[keyof typeof MasterKategoriOrderByRelevanceFieldEnum]


  export const PasienOrderByRelevanceFieldEnum: {
    name: 'name',
    kelas: 'kelas',
    time: 'time',
    keluhan: 'keluhan',
    penanganan: 'penanganan'
  };

  export type PasienOrderByRelevanceFieldEnum = (typeof PasienOrderByRelevanceFieldEnum)[keyof typeof PasienOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type MasterKategoriWhereInput = {
    AND?: MasterKategoriWhereInput | MasterKategoriWhereInput[]
    OR?: MasterKategoriWhereInput[]
    NOT?: MasterKategoriWhereInput | MasterKategoriWhereInput[]
    id?: BigIntFilter<"MasterKategori"> | bigint | number
    name?: StringFilter<"MasterKategori"> | string
    createdAt?: DateTimeFilter<"MasterKategori"> | Date | string
    updatedAt?: DateTimeNullableFilter<"MasterKategori"> | Date | string | null
    deletedAt?: DateTimeNullableFilter<"MasterKategori"> | Date | string | null
    pasiens?: PasienListRelationFilter
  }

  export type MasterKategoriOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    pasiens?: PasienOrderByRelationAggregateInput
    _relevance?: MasterKategoriOrderByRelevanceInput
  }

  export type MasterKategoriWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: MasterKategoriWhereInput | MasterKategoriWhereInput[]
    OR?: MasterKategoriWhereInput[]
    NOT?: MasterKategoriWhereInput | MasterKategoriWhereInput[]
    name?: StringFilter<"MasterKategori"> | string
    createdAt?: DateTimeFilter<"MasterKategori"> | Date | string
    updatedAt?: DateTimeNullableFilter<"MasterKategori"> | Date | string | null
    deletedAt?: DateTimeNullableFilter<"MasterKategori"> | Date | string | null
    pasiens?: PasienListRelationFilter
  }, "id">

  export type MasterKategoriOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: MasterKategoriCountOrderByAggregateInput
    _avg?: MasterKategoriAvgOrderByAggregateInput
    _max?: MasterKategoriMaxOrderByAggregateInput
    _min?: MasterKategoriMinOrderByAggregateInput
    _sum?: MasterKategoriSumOrderByAggregateInput
  }

  export type MasterKategoriScalarWhereWithAggregatesInput = {
    AND?: MasterKategoriScalarWhereWithAggregatesInput | MasterKategoriScalarWhereWithAggregatesInput[]
    OR?: MasterKategoriScalarWhereWithAggregatesInput[]
    NOT?: MasterKategoriScalarWhereWithAggregatesInput | MasterKategoriScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"MasterKategori"> | bigint | number
    name?: StringWithAggregatesFilter<"MasterKategori"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MasterKategori"> | Date | string
    updatedAt?: DateTimeNullableWithAggregatesFilter<"MasterKategori"> | Date | string | null
    deletedAt?: DateTimeNullableWithAggregatesFilter<"MasterKategori"> | Date | string | null
  }

  export type PasienWhereInput = {
    AND?: PasienWhereInput | PasienWhereInput[]
    OR?: PasienWhereInput[]
    NOT?: PasienWhereInput | PasienWhereInput[]
    id?: BigIntFilter<"Pasien"> | bigint | number
    name?: StringFilter<"Pasien"> | string
    kelas?: StringFilter<"Pasien"> | string
    kategoriId?: BigIntFilter<"Pasien"> | bigint | number
    date?: DateTimeFilter<"Pasien"> | Date | string
    time?: StringFilter<"Pasien"> | string
    keluhan?: StringFilter<"Pasien"> | string
    penanganan?: StringFilter<"Pasien"> | string
    createdAt?: DateTimeFilter<"Pasien"> | Date | string
    updatedAt?: DateTimeNullableFilter<"Pasien"> | Date | string | null
    deletedAt?: DateTimeNullableFilter<"Pasien"> | Date | string | null
    kategori?: XOR<MasterKategoriScalarRelationFilter, MasterKategoriWhereInput>
  }

  export type PasienOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    kelas?: SortOrder
    kategoriId?: SortOrder
    date?: SortOrder
    time?: SortOrder
    keluhan?: SortOrder
    penanganan?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    kategori?: MasterKategoriOrderByWithRelationInput
    _relevance?: PasienOrderByRelevanceInput
  }

  export type PasienWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: PasienWhereInput | PasienWhereInput[]
    OR?: PasienWhereInput[]
    NOT?: PasienWhereInput | PasienWhereInput[]
    name?: StringFilter<"Pasien"> | string
    kelas?: StringFilter<"Pasien"> | string
    kategoriId?: BigIntFilter<"Pasien"> | bigint | number
    date?: DateTimeFilter<"Pasien"> | Date | string
    time?: StringFilter<"Pasien"> | string
    keluhan?: StringFilter<"Pasien"> | string
    penanganan?: StringFilter<"Pasien"> | string
    createdAt?: DateTimeFilter<"Pasien"> | Date | string
    updatedAt?: DateTimeNullableFilter<"Pasien"> | Date | string | null
    deletedAt?: DateTimeNullableFilter<"Pasien"> | Date | string | null
    kategori?: XOR<MasterKategoriScalarRelationFilter, MasterKategoriWhereInput>
  }, "id">

  export type PasienOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    kelas?: SortOrder
    kategoriId?: SortOrder
    date?: SortOrder
    time?: SortOrder
    keluhan?: SortOrder
    penanganan?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: PasienCountOrderByAggregateInput
    _avg?: PasienAvgOrderByAggregateInput
    _max?: PasienMaxOrderByAggregateInput
    _min?: PasienMinOrderByAggregateInput
    _sum?: PasienSumOrderByAggregateInput
  }

  export type PasienScalarWhereWithAggregatesInput = {
    AND?: PasienScalarWhereWithAggregatesInput | PasienScalarWhereWithAggregatesInput[]
    OR?: PasienScalarWhereWithAggregatesInput[]
    NOT?: PasienScalarWhereWithAggregatesInput | PasienScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Pasien"> | bigint | number
    name?: StringWithAggregatesFilter<"Pasien"> | string
    kelas?: StringWithAggregatesFilter<"Pasien"> | string
    kategoriId?: BigIntWithAggregatesFilter<"Pasien"> | bigint | number
    date?: DateTimeWithAggregatesFilter<"Pasien"> | Date | string
    time?: StringWithAggregatesFilter<"Pasien"> | string
    keluhan?: StringWithAggregatesFilter<"Pasien"> | string
    penanganan?: StringWithAggregatesFilter<"Pasien"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Pasien"> | Date | string
    updatedAt?: DateTimeNullableWithAggregatesFilter<"Pasien"> | Date | string | null
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Pasien"> | Date | string | null
  }

  export type MasterKategoriCreateInput = {
    id?: bigint | number
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    deletedAt?: Date | string | null
    pasiens?: PasienCreateNestedManyWithoutKategoriInput
  }

  export type MasterKategoriUncheckedCreateInput = {
    id?: bigint | number
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    deletedAt?: Date | string | null
    pasiens?: PasienUncheckedCreateNestedManyWithoutKategoriInput
  }

  export type MasterKategoriUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pasiens?: PasienUpdateManyWithoutKategoriNestedInput
  }

  export type MasterKategoriUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pasiens?: PasienUncheckedUpdateManyWithoutKategoriNestedInput
  }

  export type MasterKategoriCreateManyInput = {
    id?: bigint | number
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    deletedAt?: Date | string | null
  }

  export type MasterKategoriUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MasterKategoriUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasienCreateInput = {
    id?: bigint | number
    name: string
    kelas: string
    date: Date | string
    time: string
    keluhan: string
    penanganan: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    deletedAt?: Date | string | null
    kategori: MasterKategoriCreateNestedOneWithoutPasiensInput
  }

  export type PasienUncheckedCreateInput = {
    id?: bigint | number
    name: string
    kelas: string
    kategoriId: bigint | number
    date: Date | string
    time: string
    keluhan: string
    penanganan: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    deletedAt?: Date | string | null
  }

  export type PasienUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    time?: StringFieldUpdateOperationsInput | string
    keluhan?: StringFieldUpdateOperationsInput | string
    penanganan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kategori?: MasterKategoriUpdateOneRequiredWithoutPasiensNestedInput
  }

  export type PasienUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    kategoriId?: BigIntFieldUpdateOperationsInput | bigint | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    time?: StringFieldUpdateOperationsInput | string
    keluhan?: StringFieldUpdateOperationsInput | string
    penanganan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasienCreateManyInput = {
    id?: bigint | number
    name: string
    kelas: string
    kategoriId: bigint | number
    date: Date | string
    time: string
    keluhan: string
    penanganan: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    deletedAt?: Date | string | null
  }

  export type PasienUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    time?: StringFieldUpdateOperationsInput | string
    keluhan?: StringFieldUpdateOperationsInput | string
    penanganan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasienUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    kategoriId?: BigIntFieldUpdateOperationsInput | bigint | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    time?: StringFieldUpdateOperationsInput | string
    keluhan?: StringFieldUpdateOperationsInput | string
    penanganan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type PasienListRelationFilter = {
    every?: PasienWhereInput
    some?: PasienWhereInput
    none?: PasienWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PasienOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MasterKategoriOrderByRelevanceInput = {
    fields: MasterKategoriOrderByRelevanceFieldEnum | MasterKategoriOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type MasterKategoriCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type MasterKategoriAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type MasterKategoriMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type MasterKategoriMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type MasterKategoriSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type MasterKategoriScalarRelationFilter = {
    is?: MasterKategoriWhereInput
    isNot?: MasterKategoriWhereInput
  }

  export type PasienOrderByRelevanceInput = {
    fields: PasienOrderByRelevanceFieldEnum | PasienOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PasienCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    kelas?: SortOrder
    kategoriId?: SortOrder
    date?: SortOrder
    time?: SortOrder
    keluhan?: SortOrder
    penanganan?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type PasienAvgOrderByAggregateInput = {
    id?: SortOrder
    kategoriId?: SortOrder
  }

  export type PasienMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    kelas?: SortOrder
    kategoriId?: SortOrder
    date?: SortOrder
    time?: SortOrder
    keluhan?: SortOrder
    penanganan?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type PasienMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    kelas?: SortOrder
    kategoriId?: SortOrder
    date?: SortOrder
    time?: SortOrder
    keluhan?: SortOrder
    penanganan?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type PasienSumOrderByAggregateInput = {
    id?: SortOrder
    kategoriId?: SortOrder
  }

  export type PasienCreateNestedManyWithoutKategoriInput = {
    create?: XOR<PasienCreateWithoutKategoriInput, PasienUncheckedCreateWithoutKategoriInput> | PasienCreateWithoutKategoriInput[] | PasienUncheckedCreateWithoutKategoriInput[]
    connectOrCreate?: PasienCreateOrConnectWithoutKategoriInput | PasienCreateOrConnectWithoutKategoriInput[]
    createMany?: PasienCreateManyKategoriInputEnvelope
    connect?: PasienWhereUniqueInput | PasienWhereUniqueInput[]
  }

  export type PasienUncheckedCreateNestedManyWithoutKategoriInput = {
    create?: XOR<PasienCreateWithoutKategoriInput, PasienUncheckedCreateWithoutKategoriInput> | PasienCreateWithoutKategoriInput[] | PasienUncheckedCreateWithoutKategoriInput[]
    connectOrCreate?: PasienCreateOrConnectWithoutKategoriInput | PasienCreateOrConnectWithoutKategoriInput[]
    createMany?: PasienCreateManyKategoriInputEnvelope
    connect?: PasienWhereUniqueInput | PasienWhereUniqueInput[]
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type PasienUpdateManyWithoutKategoriNestedInput = {
    create?: XOR<PasienCreateWithoutKategoriInput, PasienUncheckedCreateWithoutKategoriInput> | PasienCreateWithoutKategoriInput[] | PasienUncheckedCreateWithoutKategoriInput[]
    connectOrCreate?: PasienCreateOrConnectWithoutKategoriInput | PasienCreateOrConnectWithoutKategoriInput[]
    upsert?: PasienUpsertWithWhereUniqueWithoutKategoriInput | PasienUpsertWithWhereUniqueWithoutKategoriInput[]
    createMany?: PasienCreateManyKategoriInputEnvelope
    set?: PasienWhereUniqueInput | PasienWhereUniqueInput[]
    disconnect?: PasienWhereUniqueInput | PasienWhereUniqueInput[]
    delete?: PasienWhereUniqueInput | PasienWhereUniqueInput[]
    connect?: PasienWhereUniqueInput | PasienWhereUniqueInput[]
    update?: PasienUpdateWithWhereUniqueWithoutKategoriInput | PasienUpdateWithWhereUniqueWithoutKategoriInput[]
    updateMany?: PasienUpdateManyWithWhereWithoutKategoriInput | PasienUpdateManyWithWhereWithoutKategoriInput[]
    deleteMany?: PasienScalarWhereInput | PasienScalarWhereInput[]
  }

  export type PasienUncheckedUpdateManyWithoutKategoriNestedInput = {
    create?: XOR<PasienCreateWithoutKategoriInput, PasienUncheckedCreateWithoutKategoriInput> | PasienCreateWithoutKategoriInput[] | PasienUncheckedCreateWithoutKategoriInput[]
    connectOrCreate?: PasienCreateOrConnectWithoutKategoriInput | PasienCreateOrConnectWithoutKategoriInput[]
    upsert?: PasienUpsertWithWhereUniqueWithoutKategoriInput | PasienUpsertWithWhereUniqueWithoutKategoriInput[]
    createMany?: PasienCreateManyKategoriInputEnvelope
    set?: PasienWhereUniqueInput | PasienWhereUniqueInput[]
    disconnect?: PasienWhereUniqueInput | PasienWhereUniqueInput[]
    delete?: PasienWhereUniqueInput | PasienWhereUniqueInput[]
    connect?: PasienWhereUniqueInput | PasienWhereUniqueInput[]
    update?: PasienUpdateWithWhereUniqueWithoutKategoriInput | PasienUpdateWithWhereUniqueWithoutKategoriInput[]
    updateMany?: PasienUpdateManyWithWhereWithoutKategoriInput | PasienUpdateManyWithWhereWithoutKategoriInput[]
    deleteMany?: PasienScalarWhereInput | PasienScalarWhereInput[]
  }

  export type MasterKategoriCreateNestedOneWithoutPasiensInput = {
    create?: XOR<MasterKategoriCreateWithoutPasiensInput, MasterKategoriUncheckedCreateWithoutPasiensInput>
    connectOrCreate?: MasterKategoriCreateOrConnectWithoutPasiensInput
    connect?: MasterKategoriWhereUniqueInput
  }

  export type MasterKategoriUpdateOneRequiredWithoutPasiensNestedInput = {
    create?: XOR<MasterKategoriCreateWithoutPasiensInput, MasterKategoriUncheckedCreateWithoutPasiensInput>
    connectOrCreate?: MasterKategoriCreateOrConnectWithoutPasiensInput
    upsert?: MasterKategoriUpsertWithoutPasiensInput
    connect?: MasterKategoriWhereUniqueInput
    update?: XOR<XOR<MasterKategoriUpdateToOneWithWhereWithoutPasiensInput, MasterKategoriUpdateWithoutPasiensInput>, MasterKategoriUncheckedUpdateWithoutPasiensInput>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type PasienCreateWithoutKategoriInput = {
    id?: bigint | number
    name: string
    kelas: string
    date: Date | string
    time: string
    keluhan: string
    penanganan: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    deletedAt?: Date | string | null
  }

  export type PasienUncheckedCreateWithoutKategoriInput = {
    id?: bigint | number
    name: string
    kelas: string
    date: Date | string
    time: string
    keluhan: string
    penanganan: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    deletedAt?: Date | string | null
  }

  export type PasienCreateOrConnectWithoutKategoriInput = {
    where: PasienWhereUniqueInput
    create: XOR<PasienCreateWithoutKategoriInput, PasienUncheckedCreateWithoutKategoriInput>
  }

  export type PasienCreateManyKategoriInputEnvelope = {
    data: PasienCreateManyKategoriInput | PasienCreateManyKategoriInput[]
    skipDuplicates?: boolean
  }

  export type PasienUpsertWithWhereUniqueWithoutKategoriInput = {
    where: PasienWhereUniqueInput
    update: XOR<PasienUpdateWithoutKategoriInput, PasienUncheckedUpdateWithoutKategoriInput>
    create: XOR<PasienCreateWithoutKategoriInput, PasienUncheckedCreateWithoutKategoriInput>
  }

  export type PasienUpdateWithWhereUniqueWithoutKategoriInput = {
    where: PasienWhereUniqueInput
    data: XOR<PasienUpdateWithoutKategoriInput, PasienUncheckedUpdateWithoutKategoriInput>
  }

  export type PasienUpdateManyWithWhereWithoutKategoriInput = {
    where: PasienScalarWhereInput
    data: XOR<PasienUpdateManyMutationInput, PasienUncheckedUpdateManyWithoutKategoriInput>
  }

  export type PasienScalarWhereInput = {
    AND?: PasienScalarWhereInput | PasienScalarWhereInput[]
    OR?: PasienScalarWhereInput[]
    NOT?: PasienScalarWhereInput | PasienScalarWhereInput[]
    id?: BigIntFilter<"Pasien"> | bigint | number
    name?: StringFilter<"Pasien"> | string
    kelas?: StringFilter<"Pasien"> | string
    kategoriId?: BigIntFilter<"Pasien"> | bigint | number
    date?: DateTimeFilter<"Pasien"> | Date | string
    time?: StringFilter<"Pasien"> | string
    keluhan?: StringFilter<"Pasien"> | string
    penanganan?: StringFilter<"Pasien"> | string
    createdAt?: DateTimeFilter<"Pasien"> | Date | string
    updatedAt?: DateTimeNullableFilter<"Pasien"> | Date | string | null
    deletedAt?: DateTimeNullableFilter<"Pasien"> | Date | string | null
  }

  export type MasterKategoriCreateWithoutPasiensInput = {
    id?: bigint | number
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    deletedAt?: Date | string | null
  }

  export type MasterKategoriUncheckedCreateWithoutPasiensInput = {
    id?: bigint | number
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    deletedAt?: Date | string | null
  }

  export type MasterKategoriCreateOrConnectWithoutPasiensInput = {
    where: MasterKategoriWhereUniqueInput
    create: XOR<MasterKategoriCreateWithoutPasiensInput, MasterKategoriUncheckedCreateWithoutPasiensInput>
  }

  export type MasterKategoriUpsertWithoutPasiensInput = {
    update: XOR<MasterKategoriUpdateWithoutPasiensInput, MasterKategoriUncheckedUpdateWithoutPasiensInput>
    create: XOR<MasterKategoriCreateWithoutPasiensInput, MasterKategoriUncheckedCreateWithoutPasiensInput>
    where?: MasterKategoriWhereInput
  }

  export type MasterKategoriUpdateToOneWithWhereWithoutPasiensInput = {
    where?: MasterKategoriWhereInput
    data: XOR<MasterKategoriUpdateWithoutPasiensInput, MasterKategoriUncheckedUpdateWithoutPasiensInput>
  }

  export type MasterKategoriUpdateWithoutPasiensInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MasterKategoriUncheckedUpdateWithoutPasiensInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasienCreateManyKategoriInput = {
    id?: bigint | number
    name: string
    kelas: string
    date: Date | string
    time: string
    keluhan: string
    penanganan: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    deletedAt?: Date | string | null
  }

  export type PasienUpdateWithoutKategoriInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    time?: StringFieldUpdateOperationsInput | string
    keluhan?: StringFieldUpdateOperationsInput | string
    penanganan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasienUncheckedUpdateWithoutKategoriInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    time?: StringFieldUpdateOperationsInput | string
    keluhan?: StringFieldUpdateOperationsInput | string
    penanganan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasienUncheckedUpdateManyWithoutKategoriInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    time?: StringFieldUpdateOperationsInput | string
    keluhan?: StringFieldUpdateOperationsInput | string
    penanganan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}