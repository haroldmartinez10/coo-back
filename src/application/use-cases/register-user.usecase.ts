import { User } from "@domain/entities/User";
import { IUserRepository } from "../interfaces/user-repository.interface";
import bcrypt from "bcrypt";
import { RegisterUserDTO } from "@application/dtos/user.dto";

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: RegisterUserDTO): Promise<User> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new User(Date.now(), data.email, hashedPassword, data.name);
    return await this.userRepository.save(newUser);
  }
}
