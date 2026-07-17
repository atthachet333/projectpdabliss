export interface ContactRequestBody {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  service?: unknown;
  topic?: unknown;
  subject?: unknown;
  message?: unknown;
  details?: unknown;
  consent?: unknown;
  website?: unknown;
  pageUrl?: unknown;
}
export interface ApiResponse<T> { success:boolean; message:string; data?:T; errors?:string[]; }
