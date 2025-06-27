import { IUserRepository } from "@application/interfaces/user-repository.interface";
import { User } from "@domain/entities/User";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return null;
  }

  async save(user: User): Promise<User> {
    return user;
  }
}
