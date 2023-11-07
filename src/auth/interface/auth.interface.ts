export interface JWTPayload {
  sub?: string;
  role: string;
  id?: number;
  email: string;
}
