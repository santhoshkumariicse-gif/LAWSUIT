import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { prismaMock } from '@/lib/__mocks__/db';
import { NextRequest } from 'next/server';

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
  }
}));

function mockRequest(body: any): NextRequest {
  return new NextRequest('http://localhost:3000/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 for invalid email', async () => {
    const req = mockRequest({ email: 'not-an-email', password: 'Password123!' });
    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('should return 400 for weak password', async () => {
    const req = mockRequest({ email: 'test@example.com', password: 'weak' });
    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('should return 409 if user exists', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: '1' } as any);
    const req = mockRequest({ email: 'test@example.com', password: 'Password123!' });
    const response = await POST(req);
    expect(response.status).toBe(409);
  });

  it('should return 201 on success', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({ id: '1', email: 'test@example.com' } as any);

    const req = mockRequest({ email: 'test@example.com', password: 'Password123!' });
    const response = await POST(req);
    expect(response.status).toBe(201);
    
    const data = await response.json();
    expect(data.status).toBe('success');
    expect(data.data.id).toBe('1');
  });
});
