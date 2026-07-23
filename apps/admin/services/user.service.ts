import api from '@/lib/interceptor/axiosRES';
import { UserItem } from '@/types/users';

class UserService {
    private baseUrl = 'http://localhost:4000/api/admin/users'
  // Pulls data nodes once. We compute summaries instantly on the client side to avoid endpoint overhead.
  async getUsersList(): Promise<UserItem[]> {
    const res = await api.get(`${this.baseUrl}` , {withCredentials : true})
    if (!res.data) throw new Error('Failed to resolve data node streams.');
    return res.data.users;
  }
}

export const userService = new UserService();