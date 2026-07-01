"use server";

export async function checkAdminPassword(password: string) {
  return password === process.env.ADMIN_PASSWORD;
}