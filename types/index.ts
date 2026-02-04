// Shared Types for Gold Business Solution SaaS

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'SALES' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
