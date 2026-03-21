export const ADMIN_CLERK_ID = import.meta.env.VITE_ADMIN_CLERK_ID || "";

export function isAdminUser(user) {
  return Boolean(user?.id && ADMIN_CLERK_ID && user.id === ADMIN_CLERK_ID);
}
