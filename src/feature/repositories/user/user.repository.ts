import prisma from "../../../providers/database/database.provider";

export namespace UserRepository {
    export const findAll = async (role?: string) => {
        return await prisma.user.findMany({
            where: role ? { role: role as any } : undefined,
            include: {
                department: true,
                evaluations:true
            }
        });
    }

    export const findById = async (id: string) => {
        return await prisma.user.findUnique({
            where: { id },
            include: {
                department: true,
                evaluations:true
            }
        });
    }

    export const findByEmail = async (email: string) => {
        return await prisma.user.findUnique({
            where: { email },
        });
    }

    export const create = async (data: { name: string, 
        email: string, 
        password: string, 
        departmentId: string,
        role: "ADMIN" | "EVALUATEE" | "EVALUATOR"}) => {
        return await prisma.user.create({
            data,
            include: {
                department: true,
                evaluations:true
            }
        });
    }

    export const update = async (id: string, data: { 
            name?: string, 
            email?: string, 
            password?: string, 
            role?: "ADMIN" | "EVALUATEE" | "EVALUATOR" 
        } ) => {
        return await prisma.user.update({
            where: { id },
            data,
        })
    }

    export const deleteById = async (id: string) => {
        return await prisma.user.delete({
            where: { id },
        })
    }

}