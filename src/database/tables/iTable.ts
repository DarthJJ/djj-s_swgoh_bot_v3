import { LooseObject, Model, SchemaRaw } from 'trilogy';
export interface iTable<T> {
    getById(id: Number): T;
    save(object: T): void;
    dbModel: Model;
}