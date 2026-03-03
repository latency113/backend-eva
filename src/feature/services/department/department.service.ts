import { Department } from "./department.schema";
import { DepartmentRepository } from "../../repositories/department/department.repository";

export namespace DepartmentService {
    export const findAll = async () => {
        const departments = await DepartmentRepository.findAll();
        return departments.map(dept => ({
            ...dept,
            createdAt: dept.createdAt.toISOString()
        }));
    }

    export const findById = async (id: string) => {
        const department = await DepartmentRepository.findById(id);
        if (!department) return null;
        return {
            ...department,
            createdAt: department.createdAt.toISOString()
        };
    }

    export const create = async (data: Omit<Department, "id" | "createdAt">) => {
        const newDepartment = await DepartmentRepository.create({
            name: data.name,
        });
        return {
            ...newDepartment,
            createdAt: newDepartment.createdAt.toISOString()
        };
    }

    export const update = async (id: string, data: Partial<Omit<Department, "id" | "createdAt">>) => {
        const updatedDepartment = await DepartmentRepository.update(id, { ...data });
        return {
            ...updatedDepartment,
            createdAt: updatedDepartment.createdAt.toISOString()
        };
    }

    export const deleteById = async (id: string) => {
        return await DepartmentRepository.deleteById(id);
    }
}