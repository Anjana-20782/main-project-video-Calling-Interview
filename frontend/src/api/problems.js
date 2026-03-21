import axiosInstance from "../lib/axios";

export const problemApi = {
  getProblems: async () => {
    const response = await axiosInstance.get("/problems");
    return response.data;
  },
  createProblem: async (payload) => {
    const response = await axiosInstance.post("/problems", payload);
    return response.data;
  },
  updateProblem: async ({ id, payload }) => {
    const response = await axiosInstance.put(`/problems/${id}`, payload);
    return response.data;
  },
  deleteProblem: async (id) => {
    const response = await axiosInstance.delete(`/problems/${id}`);
    return response.data;
  },
};
