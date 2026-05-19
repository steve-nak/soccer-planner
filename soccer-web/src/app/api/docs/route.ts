import { readFile } from "fs/promises";
import { fileURLToPath } from "url";

export async function GET() {
  try {
    const filePath = fileURLToPath(new URL("./docs.html", import.meta.url));
    const html = await readFile(filePath, "utf8");
    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    return new Response("Not found", { status: 404 });
  }
}
