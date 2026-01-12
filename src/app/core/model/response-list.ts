export interface ResponseList<T> {
  success: boolean;
  message: string;
  data: Array<T>;
}
