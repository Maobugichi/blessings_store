export interface Admin {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
  created_at?: string; 
}


export interface LoginResponse {
  message: string;
  admin: Admin;
  token: string;
}

export interface RegisterResponse {
  message: string;
  admin: Admin;
  token: string;
}

export interface MeResponse {
  admin: Admin;
}


export interface InviteCode {
  id: number;
  code: string;
  used: boolean;
  expiresAt: string;
  createdAt: string;
  usedAt: string | null;
  createdBy: string | null;
  usedBy: string | null;
}

export interface GenerateInviteResponse {
  message: string;
  inviteCode: {
    id: number;
    code: string;
    expiresAt: string;
    createdAt: string;
  };
}

export interface InviteCodesResponse {
  inviteCodes: InviteCode[];
}


export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  inviteCode: string;
}

export interface GenerateInviteRequest {
  expiresInDays?: number;
}


export interface ApiError {
  error: string;
  message?: string;
}