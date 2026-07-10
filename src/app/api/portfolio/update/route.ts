import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

function getProjects() {
  const filePath = join(process.cwd(), "src", "data", "portfolio.json");
  try {
    return JSON.parse(readFileSync(filePath, "utf-8")) as Record<string, unknown>[];
  } catch {
    return [];
  }
}

function saveProjects(projects: Record<string, unknown>[]) {
  const filePath = join(process.cwd(), "src", "data", "portfolio.json");
  writeFileSync(filePath, JSON.stringify(projects, null, 2), "utf-8");
}

function checkAuth(req: NextRequest) {
  const pass = req.headers.get("x-admin-password");
  const expected = process.env.ADMIN_PASSWORD || "zynd2024";
  return pass === expected;
}

// GET all (including hidden) – for admin panel
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getProjects());
}

// PUT – update a project
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { githubId, ...updates } = body;

  if (!githubId) return NextResponse.json({ error: "githubId required" }, { status: 400 });

  const projects = getProjects();
  const idx = projects.findIndex((p) => p.githubId === githubId);
  try {
    if (idx === -1) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    projects[idx] = { ...projects[idx], ...updates };
    saveProjects(projects);
    return NextResponse.json(projects[idx]);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Internal server error: ${err?.message || err}` },
      { status: 500 }
    );
  }
}

// DELETE – remove a project
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { githubId } = await req.json();
  if (!githubId) return NextResponse.json({ error: "githubId required" }, { status: 400 });

  const projects = getProjects().filter((p) => p.githubId !== githubId);
  saveProjects(projects);
  return NextResponse.json({ success: true });
}
