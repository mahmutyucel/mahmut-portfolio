"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkAdminCredentials, createAdminSession, destroyAdminSession, isAdminAuthenticated } from "./auth";
import { prisma } from "@/lib/prisma";

export async function login(formData: FormData) {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  if (!username || !password) redirect("/mahmut-yonetim?error=empty");
  
  let valid = false;
  try { valid = await checkAdminCredentials(username, password); } catch { redirect("/mahmut-yonetim?error=config"); }
  
  if (!valid) redirect("/mahmut-yonetim?error=invalid");
  await createAdminSession();
  redirect("/mahmut-yonetim");
}

export async function logout() {
  await destroyAdminSession();
  redirect("/mahmut-yonetim");
}

export async function deleteItem(model: string, id: number) {
  if (!(await isAdminAuthenticated())) throw new Error("Yetkisiz işlem");
  if (model === "profile") await prisma.profile.delete({ where: { id } });
  if (model === "experience") await prisma.experience.delete({ where: { id } });
  if (model === "project") await prisma.project.delete({ where: { id } });
  if (model === "skill") await prisma.skill.delete({ where: { id } });
  if (model === "certificate") await prisma.certificate.delete({ where: { id } });
  if (model === "issuer") await prisma.issuer.delete({ where: { id } });
  revalidatePath("/"); revalidatePath("/mahmut-yonetim");
}

export async function updateProfile(formData: FormData) {
  if (!(await isAdminAuthenticated())) throw new Error("Yetkisiz işlem");
  await prisma.profile.update({
    where: { id: Number(formData.get("id")) },
    data: { bio: String(formData.get("bio")) }
  });
  revalidatePath("/"); revalidatePath("/mahmut-yonetim");
  redirect("/mahmut-yonetim?tab=profile");
}

// --- DENEYİM ---
export async function saveExperience(formData: FormData) {
  if (!(await isAdminAuthenticated())) throw new Error("Yetkisiz işlem");
  const id = formData.get("id");
  const data = {
    title: String(formData.get("title")),
    company: String(formData.get("company")),
    type: String(formData.get("type")),
    logo: String(formData.get("logo")),
  };
  
  if (id) await prisma.experience.update({ where: { id: Number(id) }, data });
  else await prisma.experience.create({ data });
  
  revalidatePath("/"); revalidatePath("/mahmut-yonetim");
  redirect("/mahmut-yonetim?tab=experience");
}

// --- PROJE ---
export async function saveProject(formData: FormData) {
  if (!(await isAdminAuthenticated())) throw new Error("Yetkisiz işlem");
  const id = formData.get("id");
  const data = {
    title: String(formData.get("title")),
    category: String(formData.get("category")),
    description: String(formData.get("description")),
    tags: String(formData.get("tags")),
  };
  
  if (id) {
    await prisma.project.update({ where: { id: Number(id) }, data });
  } else {
    const count = await prisma.project.count();
    await prisma.project.create({ data: { ...data, number: String(count + 1).padStart(2, '0') } });
  }
  revalidatePath("/"); revalidatePath("/mahmut-yonetim");
  redirect("/mahmut-yonetim?tab=project");
}

// --- YETENEK ---
export async function saveSkill(formData: FormData) {
  if (!(await isAdminAuthenticated())) throw new Error("Yetkisiz işlem");
  const id = formData.get("id");
  const data = {
    category: String(formData.get("category")),
    items: String(formData.get("items")),
  };
  
  if (id) await prisma.skill.update({ where: { id: Number(id) }, data });
  else await prisma.skill.create({ data });
  
  revalidatePath("/"); revalidatePath("/mahmut-yonetim");
  redirect("/mahmut-yonetim?tab=skill");
}

// --- KURUM ---
export async function saveIssuer(formData: FormData) {
  if (!(await isAdminAuthenticated())) throw new Error("Yetkisiz işlem");
  const id = formData.get("id");
  const data = {
    name: String(formData.get("name")),
    logo: String(formData.get("logo")),
  };
  
  if (id) await prisma.issuer.update({ where: { id: Number(id) }, data });
  else await prisma.issuer.create({ data });
  
  revalidatePath("/"); revalidatePath("/mahmut-yonetim");
  redirect("/mahmut-yonetim?tab=certificate");
}

// --- SERTİFİKA ---
export async function saveCertificate(formData: FormData) {
  if (!(await isAdminAuthenticated())) throw new Error("Yetkisiz işlem");
  const id = formData.get("id");
  const data = {
    name: String(formData.get("name")),
    issuerId: Number(formData.get("issuerId")),
  };
  
  if (id) await prisma.certificate.update({ where: { id: Number(id) }, data });
  else await prisma.certificate.create({ data });
  
  revalidatePath("/"); revalidatePath("/mahmut-yonetim");
  redirect("/mahmut-yonetim?tab=certificate");
}