import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi, inviteApi } from '@/services/auth.service';
import type {
  LoginRequest,
  RegisterRequest,
  GenerateInviteRequest,
} from '../types/auth.types';
import { toast } from 'sonner';


export const authKeys = {
  me: ['auth', 'me'] as const,
  invites: (showUsed: boolean) => ['invites', { showUsed }] as const,
};


export const useMe = () => {
  const token = authApi.getToken();


  return useQuery({
    queryKey: authKeys.me,
    queryFn: authApi.getMe,
    enabled:!!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};


export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.me, { admin: data.admin });
      
      toast("Welcome back",{
        description: `Logged in as ${data.admin.username}`,
      });
      
      navigate('/inventory');
    },
  });
};


export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
     
      queryClient.setQueryData(authKeys.me, { admin: data.admin });
      
      // Redirect to dashboard
      navigate('/dashboard');
    },
  });
};

/**
 * Hook to logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      authApi.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      
      // Redirect to login
      navigate('/login');
    },
  });
};


export const useInviteCodes = (showUsed: boolean = false) => {
   const token = localStorage.getItem('adminToken');
  return useQuery({
    queryKey: authKeys.invites(showUsed),
    queryFn: () => inviteApi.getAll(showUsed),
    staleTime: 1 * 60 * 1000, 
    enabled:!!token
  });
};


export const useGenerateInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateInviteRequest) => inviteApi.generate(data),
    onSuccess: () => {
      // Invalidate invite codes to refetch
      queryClient.invalidateQueries({ queryKey: ['invites'] });
    },
  });
};


export const useRevokeInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => inviteApi.revoke(id),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['invites'] });
    },
  });
};