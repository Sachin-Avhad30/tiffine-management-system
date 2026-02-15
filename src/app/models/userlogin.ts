export interface Login {
  email: string | null;
  password: string | null;
}
export interface TokenResponse {
  token: string;
  statusCode: number;
  success: boolean,
  message: string,
  _id: string,
  refreshToken: string,
}
export const Roles = {
  SUPER_ADMIN: '67276c8186b969fac0d57362',
  ADMIN: '672775e4f2a1e38ef52c63c6',
};


