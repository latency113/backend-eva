import { Assignment } from "./assignment.schema";
import { AssignmentRepository } from "../../repositories/assignment/assignment.repository";

export namespace AssignmentService {
  export const findAll = async () => {
    const assignments = await AssignmentRepository.findAll();
    return assignments.map((assignment) => ({
      ...assignment,
      createdAt: assignment.createdAt.toISOString(),
    }));
  };

  export const findById = async (id: string) => {
    const assignment = await AssignmentRepository.findById(id);
    if (!assignment) return null;
    return {
      ...assignment,
      createdAt: assignment.createdAt.toISOString(),
    };
  };

  export const findByEvaluationId = async (evaluationId: string) => {
    const assignments = await AssignmentRepository.findByEvaluationId(evaluationId);
    return assignments.map((assignment) => ({
      ...assignment,
      createdAt: assignment.createdAt.toISOString(),
    }));
  };

  export const findByEvaluatorId = async (evaluatorId: string) => {
    const assignments = await AssignmentRepository.findByEvaluatorId(evaluatorId);
    return assignments.map((assignment) => ({
      ...assignment,
      createdAt: assignment.createdAt.toISOString(),
    }));
  };

  export const findByEvaluateeId = async (evaluateeId: string) => {
    const assignments = await AssignmentRepository.findByEvaluateeId(evaluateeId);
    return assignments.map((assignment) => ({
      ...assignment,
      createdAt: assignment.createdAt.toISOString(),
    }));
  };

  export const create = async (data: Omit<Assignment, "id" | "createdAt">) => {
    const newAssignment = await AssignmentRepository.create(data);
    return {
      ...newAssignment,
      createdAt: newAssignment.createdAt.toISOString(),
    };
  };

  export const update = async (
    id: string,
    data: Partial<Omit<Assignment, "id" | "createdAt">>
  ) => {
    const updatedAssignment = await AssignmentRepository.update(id, data);
    return {
      ...updatedAssignment,
      createdAt: updatedAssignment.createdAt.toISOString(),
    };
  };

  export const deleteById = async (id: string) => {
    return await AssignmentRepository.deleteById(id);
  };
}
