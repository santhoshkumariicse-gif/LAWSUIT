import { BaseRepository } from "./BaseRepository";
import { Query, Prisma } from "@prisma/client";
import { CryptoService } from "@/core/security/CryptoService";
import { config } from "@/core/config";
import { ForbiddenError } from "@/core/errors/AppError";
import { redis } from "@/lib/redis";

export class QueryRepository extends BaseRepository<Query, Prisma.QueryCreateInput, Prisma.QueryUpdateInput> {
  // Step 4: Enforce data isolation by requiring userId
  async findById(id: string, userId: string): Promise<Query | null> {
    const query = await this.db.query.findUnique({
      where: { id },
      include: { results: true, documents: true },
    });

    if (query) {
      if (query.userId !== userId) {
        throw new ForbiddenError("Access denied: You do not have permission to view this query.");
      }
      // Step 3: Decrypt sensitive field
      query.rawInput = CryptoService.decrypt(query.rawInput, config.auth.secret);
    }
    
    return query;
  }

  async findByUserId(userId: string): Promise<Query[]> {
    const cacheKey = `queries:user:${userId}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const queries = await this.db.query.findMany({
      where: { userId },
      include: { results: true },
      orderBy: { createdAt: "desc" },
    });

    // Decrypt all raw inputs
    const processedQueries = queries.map(q => {
      q.rawInput = CryptoService.decrypt(q.rawInput, config.auth.secret);
      return q;
    });

    await redis.set(cacheKey, JSON.stringify(processedQueries), "EX", 300); // 5 min TTL
    return processedQueries;
  }

  async findAll(): Promise<Query[]> {
    throw new ForbiddenError("Global findAll for queries is restricted due to data isolation policies.");
  }

  async create(data: Prisma.QueryCreateInput): Promise<Query> {
    // Step 3: Encrypt sensitive field before saving
    const inputStr = data.rawInput as string;
    const encryptedInput = CryptoService.encrypt(inputStr, config.auth.secret);
    
    const result = await this.db.query.create({ 
      data: {
        ...data,
        rawInput: encryptedInput
      } 
    });
    
    if (data.userId) {
      await redis.del(`queries:user:${data.userId}`);
    }
    
    return result;
  }

  async update(id: string, data: Prisma.QueryUpdateInput, userId: string): Promise<Query> {
    const existing = await this.findById(id, userId); // verifies ownership
    this.ensureFound(existing);

    if (typeof data.rawInput === 'string') {
      data.rawInput = CryptoService.encrypt(data.rawInput, config.auth.secret);
    }

    const result = await this.db.query.update({ where: { id }, data });
    await redis.del(`queries:user:${userId}`);
    return result;
  }

  async delete(id: string, userId: string): Promise<void> {
    const existing = await this.findById(id, userId); // verifies ownership
    this.ensureFound(existing);
    
    await this.db.query.delete({ where: { id } });
    await redis.del(`queries:user:${userId}`);
  }
}
