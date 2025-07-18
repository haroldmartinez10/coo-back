import { LoginUserDTO } from "@application/dtos/user.dto";
import { IUserRepository } from "@application/interfaces/user-repository.interface";
import { User } from "@domain/entities/User";
import { JwtService } from "@application/services/JwtService";
import bcrypt from "bcrypt";

export interface LoginResult {
  user: User;
  token: string;
}

export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: JwtService
  ) {}

  async login(data: LoginUserDTO): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Contraseña inválida");
    }

    const token = this.jwtService.generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return {
      user,
      token,
    };
  }
}
