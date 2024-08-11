import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const expiry = decoded.exp;
    if (!expiry) return true;
    const currentTime = Date.now() / 1000; // current time in seconds
    return currentTime > expiry;
  } catch (e) {
    console.error('Error decoding token', e);
    return true;
  }
};