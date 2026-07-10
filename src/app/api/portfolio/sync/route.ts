import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  pushed_at: string;
  created_at: string;
  fork: boolean;
  archived: boolean;
  private: boolean;
}

export async function POST(req: NextRequest) {
  const adminPass = req.headers.get("x-admin-password");
  if (adminPass !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username } = await req.json();
  if (!username) {
    return NextResponse.json({ error: "GitHub username is required" }, { status: 400 });
  }

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch all repos (paginated up to 5 pages)
    let allRepos: GitHubRepo[] = [];
    for (let page = 1; page <= 5; page++) {
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=pushed`,
        { headers }
      );
      if (!res.ok) {
        const err = await res.json();
        return NextResponse.json({ error: err.message || "GitHub API error" }, { status: res.status });
      }
      const data: GitHubRepo[] = await res.json();
      if (data.length === 0) break;
      allRepos = [...allRepos, ...data];
    }

    // Filter out forks, archived, private
    const filtered = allRepos.filter((r) => !r.fork && !r.archived && !r.private);

    // Read existing projects to preserve custom data
    const filePath = join(process.cwd(), "src", "data", "portfolio.json");
    let existing: Record<string, unknown>[] = [];
    try {
      existing = JSON.parse(readFileSync(filePath, "utf-8"));
    } catch {
      existing = [];
    }

    const existingMap = new Map(existing.map((p) => [p.githubId, p]));

    const projects = filtered.map((repo) => {
      const prev = existingMap.get(repo.id) as Record<string, unknown> | undefined;
      return {
        githubId: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: (prev?.customDescription as string) || repo.description || "",
        customDescription: (prev?.customDescription as string) || null,
        url: repo.html_url,
        demo: (prev?.demo as string) || repo.homepage || null,
        language: repo.language || "Other",
        topics: repo.topics || [],
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        pushedAt: repo.pushed_at,
        createdAt: repo.created_at,
        visible: prev ? (prev.visible as boolean) : true,
        featured: prev ? (prev.featured as boolean) : false,
        order: prev ? (prev.order as number) : 999,
        category: (prev?.category as string) || "Geral",
        coverImage: (prev?.coverImage as string) || null,
      };
    });

    // Sort: featured first, then by order, then by stars
    projects.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.order !== b.order) return a.order - b.order;
      return b.stars - a.stars;
    });

    writeFileSync(filePath, JSON.stringify(projects, null, 2), "utf-8");

    return NextResponse.json({
      synced: projects.length,
      projects,
    });
  } catch (err) {
    console.error("Sync error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
