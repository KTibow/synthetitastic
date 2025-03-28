import { createCanvas } from "https://deno.land/x/canvas/mod.ts";

let seed = 1;
const seededRandom = () => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Helper function to draw a unit square with a random point
function drawPointInUnitSquare(x: number, y: number, size = 512) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  const padding = size * 0.1; // 10% padding on all sides
  const squareSize = size - 2 * padding;

  // White background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, size, size);

  // Draw coordinate system
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  // Draw square border
  ctx.strokeRect(padding, padding, squareSize, squareSize);

  // Annotate
  ctx.fillStyle = "black";
  ctx.font = `${size * 0.03}px Arial`;
  ctx.fillText("0", padding * 0.8, size - padding * 0.8);
  ctx.fillText("1", size - padding * 0.8, size - padding * 0.8);
  ctx.fillText("1", padding * 0.8, padding * 0.8);

  // Add axis labels
  ctx.fillStyle = "black";
  ctx.font = `${size * 0.04}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText("x", size / 2, size - padding / 3);
  ctx.textAlign = "right";
  ctx.fillText("y", padding / 3, size / 2);

  // Draw the point
  const pointX = padding + x * squareSize;
  const pointY = padding + (1 - y) * squareSize; // Invert y to match coordinate system

  // Draw a red dot
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(pointX, pointY, size * 0.01, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

// Helper function to format coordinates as (x, y)
function formatCoordinates(x: number, y: number): string {
  return `(${x.toFixed(2)}, ${y.toFixed(2)})`;
}

// Main function to generate test cases
const outputStream = await Deno.open("case.jsonl", {
  write: true,
  create: true,
  truncate: true,
});
const encoder = new TextEncoder();

// Generate 900 test cases with random points
for (let i = 0; i < 1; i += seededRandom() * 0.1) {
  for (let j = 0; j < 1; j += seededRandom() * 1) {
    // Round to 2 decimal places for cleaner output
    const x = Math.round(i * 100) / 100;
    const y = Math.round(j * 100) / 100;

    const canvas = drawPointInUnitSquare(x, y);
    const pngBuffer = canvas.toBuffer();
    const b64 = btoa(String.fromCharCode(...pngBuffer));

    // Prepare test case
    const input =
      "What are the coordinates of the red point? Just say the (x, y) answer with two decimal places.";
    const output = formatCoordinates(x, y);

    // Write test case to output file
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
}

outputStream.close();
