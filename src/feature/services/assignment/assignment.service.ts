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

  export const calculateScore = async (assignmentId: string) => {
    // We need to fetch the assignment, its evaluation, topics, indicators, and results.
    // To avoid circular dependencies, we'll use Prisma directly here for this complex query.
    const { default: prisma } = require("../../../providers/database/database.provider");

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        evaluation: {
          include: {
            topics: {
              include: {
                indicators: true
              }
            }
          }
        },
        indicatorResults: true
      }
    });

    if (!assignment) return null;

    let totalScore = 0;
    let maxPossibleScore = 0;

    const resultsMap = new Map();
    for (const result of assignment.indicatorResults) {
      resultsMap.set(result.indicatorId, result.score);
    }

    // Iterate through all indicators for this evaluation
    for (const topic of assignment.evaluation.topics) {
      for (const indicator of topic.indicators) {
        const score = resultsMap.get(indicator.id) || 0;
        const weight = indicator.weight;

        maxPossibleScore += weight;

        // "Scale 1-4"
        if (indicator.IndicatorType === "scale 1-4") {
           // Score is 1, 2, 3, or 4. Divide by 4 and multiply by weight.
           totalScore += (score / 4) * weight;
        } 
        // "yes/no"
        else if (indicator.IndicatorType === "yes/no") {
           // Score is 1 (yes) or 0 (no). Multiply by weight.
           totalScore += score * weight;
        }
      }
    }

    return {
      assignmentId,
      totalScore,
      maxPossibleScore,
      percentage: maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0
    };
  };
}
