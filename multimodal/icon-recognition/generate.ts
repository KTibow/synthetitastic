import { renderAsync } from "npm:@resvg/resvg-js";

async function drawSvg(svg: string, size = 512) {
  // Create complete SVG with proper dimensions
  const fullSvg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">${svg}</svg>`;

  // Render SVG to PNG
  const pngData = await renderAsync(fullSvg, {});

  return pngData.asPng();
}

const iconJsonText = await Deno.readTextFile("material-symbols.json");
const iconJson = JSON.parse(iconJsonText);
const selectedIcons = [
  "bar-chart",
  "barcode",
  "block",
  "blur-on",
  "check",
  "close",
  "code",
  "description",
  "error",
  "extension",
  "file-present",
  "folder",
  "help",
  "more-vert",
  "pending-actions",
  "pest-control-rodent",
  "search",
  "unarchive",
  "warning",
].map((name) => {
  const data = iconJson.icons[name];
  if (!data) throw new Error(`Icon not found: ${name}`);
  return { name, body: data.body };
});

const outputStream = await Deno.open("case.jsonl", {
  write: true,
  create: true,
  truncate: true,
});
const encoder = new TextEncoder();
for (const { name, body } of selectedIcons) {
  const pngBuffer = await drawSvg(body);
  const b64 = btoa(String.fromCharCode(...pngBuffer));

  const input =
    `Identify this Material Symbols icon. Just say the name of the icon using dashes.`;
  const output = name;

  outputStream.write(
    encoder.encode(
      JSON.stringify({
        input: input,
        input_image: b64,
        output: output,
      }) + "\n",
    ),
  );
}
