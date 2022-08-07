export interface iTable<T> {
  getById(id: number | string): Promise<T | null>;
  save(object: T): Promise<void>;
  delete(id: number | string): Promise<void>;
}
