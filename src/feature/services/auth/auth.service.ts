import { UserRepository } from "../../repositories/user/user.repository";

export namespace AuthService {
  export const logIn = async (email: string, password: string, jwt: any) => {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const matchPassword = await Bun.password.verify(password, user.password);
    if (!matchPassword) {
      throw new Error("Invalid password");
    }

    const payload = {
      username: user.name,
      role: user.role,
    };

    const token = await jwt.sign(payload);

    return {
      token,
      user,
    };
  };

  export const register = async (
    name: string,
    email: string,
    password: string,
    departmentId: string,
    role: "ADMIN" | "EVALUATEE" | "EVALUATOR"
  ) => {
    const hashedPassword = await Bun.password.hash(password);
    const newUser = await UserRepository.create({
      name,
      email,
      password: hashedPassword,
      departmentId,
      role,
    });
    return newUser;
  };
}
