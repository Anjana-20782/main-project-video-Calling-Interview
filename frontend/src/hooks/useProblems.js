import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { problemApi } from "../api/problems";
import { PROBLEMS } from "../data/problems";

function toMap(problems) {
  return problems.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
}

export function useProblems() {
  const result = useQuery({
    queryKey: ["problems"],
    queryFn: problemApi.getProblems,
  });

  const apiProblems = result.data?.problems || [];
  const mergedMap = { ...PROBLEMS, ...toMap(apiProblems) };
  const mergedList = Object.values(mergedMap);

  return {
    ...result,
    apiProblems,
    problemMap: mergedMap,
    problems: mergedList,
  };
}

export function useCreateProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: problemApi.createProblem,
    onSuccess: (data) => {
      const created = data?.problem;
      if (created) {
        queryClient.setQueryData(["problems"], (prev) => {
          const list = prev?.problems ?? [];
          if (list.some((p) => p.id === created.id)) return prev;
          return { problems: [created, ...list] };
        });
      }
      toast.success("Problem added");
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to add problem"),
  });
}

export function useUpdateProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: problemApi.updateProblem,
    onSuccess: (data) => {
      const updated = data?.problem;
      if (updated) {
        queryClient.setQueryData(["problems"], (prev) => {
          const list = prev?.problems ?? [];
          const idx = list.findIndex((p) => p.id === updated.id);
          if (idx === -1) return { problems: [updated, ...list] };
          const next = [...list];
          next[idx] = updated;
          return { problems: next };
        });
      }
      toast.success("Problem updated");
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to update problem"),
  });
}

export function useDeleteProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: problemApi.deleteProblem,
    onSuccess: () => {
      toast.success("Problem deleted");
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to delete problem"),
  });
}
