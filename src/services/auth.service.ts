import apiClient from "@/config/axios.config";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  MeResponse,
  GenerateInviteRequest,
  GenerateInviteResponse,
  InviteCodesResponse,
} from '../types/auth.types';



export const authApi = {
    login: async(data:LoginRequest):Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>(
            `/login`,
            data
        );

        if (response.data.token) {
            localStorage.setItem('adminToken', response.data.token);
        }

        return response.data
    },

    register: async (data:RegisterRequest):Promise<RegisterResponse> => {
        const response = await apiClient.post<RegisterResponse>(
            `/register`,
            data
        );

        if (response.data.token) {
            localStorage.setItem('adminToken', response.data.token);
        }
            
        return response.data;
    },

   
    getMe: async (): Promise<MeResponse> => {
        const response = await apiClient.get<MeResponse>(`/me`);
        return response.data;
    },

  
    logout: (): void => {
        localStorage.removeItem('adminToken');
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('adminToken');
    },

    
    getToken: (): string | null => {
        return localStorage.getItem('adminToken');
    },
}


export const inviteApi = {
 
  generate: async (
    data: GenerateInviteRequest = {}
  ): Promise<GenerateInviteResponse> => {
    const response = await apiClient.post<GenerateInviteResponse>(
      `/generate-invite`,
      data
    );
    return response.data;
  },

  
  getAll: async (showUsed: boolean = false): Promise<InviteCodesResponse> => {
    console.log(showUsed)
    const response = await apiClient.get<InviteCodesResponse>(
      `/invites`,
      {
        params: { showUsed: showUsed.toString() },
      }
    );
    return response.data;
  },

 
  revoke: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      `/invites/${id}`
    );
    return response.data;
  },
};