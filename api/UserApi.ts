import { Axios } from '../core/axios';
import { UserData } from '../pages';

export const UserApi = {
  getMe: async (): Promise<UserData> => {
    const { data } = await Axios.get('/auth/me');
    return data;
  }
};
