export interface ResponseMap<T> {
  success: boolean;
  message: string;
  data: Map<string, Array<T>>;
}
