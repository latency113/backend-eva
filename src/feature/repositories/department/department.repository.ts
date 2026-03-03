import prisma from "../../../providers/database/database.provider";

export namespace DepartmentRepository {
  export const findAll = async () => {
    return await prisma.department.findMany({});
  };

  export const findById = async (id: string) => {
    return await prisma.department.findUnique({
      where: { id },
    });
  };

  export const create = async (data: { name: string }) => {
    return await prisma.department.create({
      data,
    });
  };

  export const update = async (
    id: string,
    data: {
      name?: string;
    },
  ) => {
    return await prisma.department.update({
      where: { id },
      data,
    });
  };

  export const deleteById = async (id: string) => {
    return await prisma.department.delete({
      where: { id },
    });
  };
}
