import { Utilizador } from "@/types";

export const getCurrentUser = (): Utilizador | null => {
  const data = localStorage.getItem('current_user');
  return data ? JSON.parse(data) : null;
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem('current_user');
};
