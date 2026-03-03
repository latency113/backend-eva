import { User} from "./user.schema";
import { UserRepository } from "../../repositories/user/user.repository";

export namespace UserService {
    export const findAll = async (role?: string) => {
        const users = await UserRepository.findAll(role);
        return users.map(user => ({
            ...user,
            createdAt: user.createdAt.toISOString()
        }));
    }

    export const findById = async (id: string) => {
        const user = await UserRepository.findById(id);
        if (!user) return null;
        return {
            ...user,
            createdAt: user.createdAt.toISOString()
        };
    }

    export const create = async (data: Omit<User, "id" | "createdAt">) => {
        const hashPassword = await Bun.password.hash(data.password);
        const newUser = await UserRepository.create({
            name: data.name,
            email: data.email,
            password: hashPassword,
            role: data.role,
            departmentId: data.departmentId
        });
        return {
            ...newUser,
            createdAt: newUser.createdAt.toISOString()
        };
    }

    export const update = async (id: string, data: Partial<Omit<User, "id" | "createdAt">>) => {
        const hashPassword = data.password ? await Bun.password.hash(data.password) : undefined;
        const updatedUser = await UserRepository.update(id, { ...data, password: hashPassword });
        return {
            ...updatedUser,
            createdAt: updatedUser.createdAt.toISOString()
        };
    }

    export const deleteById = async (id: string) => {
        return await UserRepository.deleteById(id);
    }
}