import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "src", "data", "portfolio.json");
    const raw = readFileSync(filePath, "utf-8");
    const projects = JSON.parse(raw);
    const visible = projects.filter((p: { visible: boolean }) => p.visible !== false);
    return NextResponse.json(visible);
  } catch {
    return NextResponse.json([]);
  }
}
