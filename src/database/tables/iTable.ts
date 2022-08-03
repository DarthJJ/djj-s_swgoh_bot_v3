export interface iTable<T> {
    getById(id: Number): Promise<T>;
    save(object: T): Promise<void>;
}