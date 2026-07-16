import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const outputPath = join(publicDir, "ecj.jar");

const ECJ_VERSIONS = ["4.6.1"];

async function download(url, dest) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  const buffer = await response.arrayBuffer();
  writeFileSync(dest, Buffer.from(buffer));
  console.log(`Downloaded (${buffer.byteLength} bytes): ${url}`);
}

async function downloadEcj() {
  if (existsSync(outputPath)) {
    const stats = await import("fs").then((fs) => fs.statSync(outputPath));
    console.log(`ecj.jar already exists (${stats.size} bytes)`);
    return;
  }

  if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

  for (const version of ECJ_VERSIONS) {
    const url = `https://repo1.maven.org/maven2/org/eclipse/jdt/core/compiler/ecj/${version}/ecj-${version}.jar`;
    console.log(`Trying ${url}...`);
    try {
      await download(url, outputPath);
      console.log(`Successfully downloaded ecj-${version}.jar`);
      return;
    } catch (err) {
      console.log(`Failed: ${err.message}`);
    }
  }

  // Fallback: try the Eclipse downloads site
  const fallbackUrl = "https://www.eclipse.org/downloads/download.php?file=/eclipse/downloads/drops4/R-4.28-202306120745/ecj-4.28.jar&mirror_id=1";
  try {
    console.log("Trying Eclipse fallback...");
    await download(fallbackUrl, outputPath);
    console.log("Downloaded from Eclipse fallback");
  } catch (err) {
    console.error("All download attempts failed.");
    console.error("Please manually download ecj.jar from Maven Central:");
    console.error("  https://repo1.maven.org/maven2/org/eclipse/jdt/ecj/");
    console.error("And place it at:", outputPath);
    process.exit(1);
  }
}

downloadEcj();
