import { createCanvas } from "https://deno.land/x/canvas/mod.ts";
import { CanvasRenderingContext2D } from "https://deno.land/x/canvas@v1.4.2/src/types.ts";

let seed = 1;
const seededRandom = () => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Helper function to draw a set of objects to be counted
function drawObjects(count: number, objectType: string, size = 512) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // White background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, size, size);

  // Set up object properties
  const minObjectSize = size * 0.05;
  const maxObjectSize = size * 0.15;
  const colors = [
    "#8B0000", // Dark red
    "#006400", // Dark green
    "#00008B", // Dark blue
    "#A52A2A", // Brown
    "#2F4F4F", // Dark slate gray
    "#4B0082", // Indigo
    "#556B2F", // Dark olive green
    "#483D8B", // Dark slate blue
    "#800080", // Purple
    "#708090", // Slate gray
  ];

  // Avoid overlapping by tracking occupied spaces
  const occupiedSpaces = [];

  // Place each object
  for (let i = 0; i < count; i++) {
    // Choose random size and color
    const objectSize = minObjectSize +
      seededRandom() * (maxObjectSize - minObjectSize);
    const colorIndex = Math.floor(seededRandom() * colors.length);
    const color = colors[colorIndex];

    // Try to find a non-overlapping position
    let x, y;
    let attempts = 0;
    const maxAttempts = 100;
    let validPosition = false;

    while (!validPosition && attempts < maxAttempts) {
      // Generate random position with padding
      x = objectSize + seededRandom() * (size - 2 * objectSize);
      y = objectSize + seededRandom() * (size - 2 * objectSize);

      // Check if position overlaps with existing objects
      validPosition = true;
      for (const space of occupiedSpaces) {
        const distance = Math.sqrt(
          Math.pow(x - space.x, 2) + Math.pow(y - space.y, 2),
        );
        if (distance < (objectSize + space.size) * 0.8) {
          validPosition = false;
          break;
        }
      }

      attempts++;
    }

    // If we couldn't find a non-overlapping position, use the last generated position anyway
    if (!validPosition) {
      x = objectSize + seededRandom() * (size - 2 * objectSize);
      y = objectSize + seededRandom() * (size - 2 * objectSize);
    }

    // Track this object's position
    occupiedSpaces.push({ x, y, size: objectSize });

    // Draw the object
    ctx.fillStyle = color;

    switch (objectType) {
      case "circle":
        ctx.beginPath();
        ctx.arc(x, y, objectSize / 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "square":
        ctx.fillRect(
          x - objectSize / 2,
          y - objectSize / 2,
          objectSize,
          objectSize,
        );
        break;

      case "triangle":
        ctx.beginPath();
        ctx.moveTo(x, y - objectSize / 2);
        ctx.lineTo(x + objectSize / 2, y + objectSize / 2);
        ctx.lineTo(x - objectSize / 2, y + objectSize / 2);
        ctx.closePath();
        ctx.fill();
        break;

      case "star":
        drawStar(ctx, x, y, 5, objectSize / 2, objectSize / 4);
        break;
    }
  }

  return canvas;
}

// Helper function to draw a star
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

// Main function to generate test cases
const outputStream = await Deno.open("case.jsonl", {
  write: true,
  create: true,
  truncate: true,
});
const encoder = new TextEncoder();

for (let count = 1; count <= 20; count++) {
  const objectTypes = ["circle", "square", "triangle", "star"];
  for (const objectType of objectTypes) {
    const canvas = drawObjects(count, objectType);
    const pngBuffer = canvas.toBuffer();
    const b64 = btoa(String.fromCharCode(...pngBuffer));

    // Prepare test case
    const input =
      `How many ${objectType}s are in this image? Just respond with the number.`;
    const output = `${count}`;

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
