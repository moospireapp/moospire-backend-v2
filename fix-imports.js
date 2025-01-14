import { replaceInFile } from "replace-in-file";

async function fixImports() {
  try {
    const results = await replaceInFile({
      files: "dist/**/*.js",
      from: /from "(\..*?)(?<!\.js)";/g, // Match relative imports without .js
      to: (match, p1) => `from "${p1}.js";`, // Append .js to import
    });
    console.log(
      "Fixed imports:",
      results.filter((r) => r.hasChanged).map((r) => r.file)
    );
  } catch (error) {
    console.error("Error fixing imports:", error);
  }
}

fixImports();
