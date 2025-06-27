import { LoginUserDTO } from "@application/dtos/user.dto";
import { IUserRepository } from "@application/interfaces/user-repository.interface";
import { User } from "@domain/entities/User";
import bcrypt from "bcrypt";

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: LoginUserDTO): Promise<User> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return user;
  }
}
