import type React from 'react';

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  username: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}
