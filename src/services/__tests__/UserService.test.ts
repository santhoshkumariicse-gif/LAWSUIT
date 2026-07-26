import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserService } from '../UserService'
import { prismaMock } from '@/lib/__mocks__/db'
import { ValidationError, NotFoundError } from '@/core/errors/AppError'

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: '1', email: 'test@example.com', passwordHash: 'hash', role: 'USER',
        failedLoginAttempts: 0, lockedUntil: null, consentGiven: true, consentDate: new Date(),
        mfaEnabled: false, mfaSecret: null, createdAt: new Date()
      } as any;

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const user = await userService.getUserById('1');
      expect(user).toEqual(mockUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundError if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(userService.getUserById('99')).rejects.toThrow(NotFoundError);
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      
      const input = { email: 'new@example.com', passwordHash: 'hashedPass', role: 'USER' } as any;
      const expectedOutput = { id: '1', ...input } as any;
      
      prismaMock.user.create.mockResolvedValue(expectedOutput);

      const user = await userService.createUser(input);
      expect(user).toEqual(expectedOutput);
    });

    it('should throw ValidationError if email is missing', async () => {
      await expect(userService.createUser({ passwordHash: 'hash' } as any))
        .rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid email format', async () => {
      await expect(userService.createUser({ email: 'invalid', passwordHash: 'hash' } as any))
        .rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: '1' } as any);

      await expect(userService.createUser({ email: 'existing@example.com', passwordHash: 'hash' } as any))
        .rejects.toThrow(ValidationError);
    });
  });
});
