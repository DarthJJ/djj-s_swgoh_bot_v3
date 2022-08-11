import { Repository } from "typeorm";
import { DatabaseError } from "../../exceptions/databaseError.js";
import { Ship } from "../../models/swgoh/ship.js";
import { iDao } from "./iDao.js";

export class ShipDao implements iDao<Ship> {
  private readonly _database: Repository<Ship>;
  constructor(databse: Repository<Ship>) {
    this._database = databse;
  }
  getById(id: string | number): Promise<Ship | null> {
    throw new Error("Method not implemented.");
  }
  async save(object: Ship): Promise<void> {
    try {
      await this._database.save(object);
    } catch (exception: unknown) {
      throw new DatabaseError("Something went wrong saving the Ship", exception);
    }
  }

  async saveAll(object: Ship[]): Promise<void> {
    for (var ship of object) {
      await this.save(ship);
    }
  }

  delete(id: string | number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
