export interface ContactRequestBody { name:string; phone:string; email?:string; service:string; message?:string; }
export interface ApiResponse<T> { success:boolean; message:string; data?:T; errors?:string[]; }
