import { Platform } from "react-native";

// When running on a physical device via Expo Go, replace "localhost" with your
// computer's LAN IP address (e.g. http://192.168.1.23:4000), since the device
// cannot resolve "localhost" to your development machine.
const DEV_HOST = Platform.select({
  android: "http://10.0.2.2:4000",
  default: "http://localhost:4000",
});

export const API_BASE_URL = DEV_HOST as string;

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  return res.json();
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  return res.json();
}

export const apiClient = {
  get: <T,>(path: string) => request<T>(path),
  post: <T,>(path: string, body?: unknown) => post<T>(path, body),
};
