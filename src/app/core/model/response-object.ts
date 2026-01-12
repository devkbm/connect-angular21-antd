export interface ResponseObject<T> {
  success: boolean;
  message: string;
  data: T;
}
