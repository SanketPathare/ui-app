import { NextRequest, NextResponse } from "next/server";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import os from "os";

const BASE_TMP = join(os.tmpdir(), "java-compiler");

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || id.length > 64 || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const jarPath = join(BASE_TMP, id, "output.jar");
  if (!existsSync(jarPath)) {
    return NextResponse.json({ error: "JAR not found" }, { status: 404 });
  }

  const jar = readFileSync(jarPath);
  return new NextResponse(jar, {
    headers: {
      "Content-Type": "application/java-archive",
      "Content-Disposition": `attachment; filename="${id}.jar"`,
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
