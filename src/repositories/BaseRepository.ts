import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/db";
import { NotFoundError } from "@/core/errors/AppError";

export abstract class BaseRepository<T, CreateDTO, UpdateDTO> {
  protected db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  abstract findById(id: string): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract create(data: CreateDTO): Promise<T>;
  abstract update(id: string, data: UpdateDTO): Promise<T>;
  abstract delete(id: string, userId?: string): Promise<void>;

  /**
   * Executes a callback within a Prisma transaction.
   * Useful for ensuring atomicity across multiple repository operations.
   */
  public async executeTransaction<R>(
    callback: (tx: PrismaClient | Parameters<Parameters<PrismaClient['$transaction']>[0]>[0]) => Promise<R>
  ): Promise<R> {
    return this.db.$transaction(callback);
  }

  protected ensureFound(item: T | null, message = "Resource not found"): asserts item is T {
    if (!item) {
      throw new NotFoundError(message);
    }
  }
}
