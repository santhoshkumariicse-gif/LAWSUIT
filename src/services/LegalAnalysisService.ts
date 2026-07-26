import { MatterType, AnalysisData, matterData } from "@/lib/legalEngine";
import { QueryRepository } from "@/repositories/QueryRepository";
import { Prisma } from "@prisma/client";
import { ValidationError } from "@/core/errors/AppError";

export class LegalAnalysisService {
  private queryRepository: QueryRepository;

  constructor() {
    this.queryRepository = new QueryRepository();
  }

  public analyzeMatter(matter: MatterType): AnalysisData {
    const data = matterData[matter];
    if (!data) {
      throw new ValidationError(`Invalid matter type: ${matter}`);
    }
    return data;
  }

  public async saveQuery(userId: string, rawInput: string, matterType: MatterType): Promise<string> {
    const data = this.analyzeMatter(matterType);
    
    const query = await this.queryRepository.create({
      user: { connect: { id: userId } },
      rawInput,
      inferredMatter: matterType,
      results: {
        create: {
          analysisData: data as unknown as Prisma.InputJsonValue
        }
      }
    });

    return query.id;
  }

  public async getQueryHistory(userId: string) {
    return this.queryRepository.findByUserId(userId);
  }
}
