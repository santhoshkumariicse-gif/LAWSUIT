import { UserRepository } from "@/repositories/UserRepository";
import { User, Prisma } from "@prisma/client";
import { ValidationError, NotFoundError } from "@/core/errors/AppError";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    if (!data.email || !data.passwordHash) {
      throw new ValidationError("Email and password are required.");
    }

    // Since we're receiving the raw password in 'passwordHash' from the register route right now before hashing,
    // wait, the register route hashes the password BEFORE passing it to UserService.
    // That means we must validate the raw password inside the route OR pass both.
    // For architecture purity, we should pass raw password to UserService and let it handle hashing.
    // However, I will just enforce email format here for now and update the Zod schema in the route for password.
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new ValidationError("Invalid email format.");
    }

    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError("Email is already registered.");
    }

    return this.userRepository.create(data);
  }
}
