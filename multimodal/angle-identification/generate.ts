import { createCanvas } from "https://deno.land/x/canvas/mod.ts";

// Helper function to draw an angle with specified degree
function drawAngle(degree: number, size = 512) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;

  // White background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, size, size);

  // Draw horizontal reference line
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + radius, centerY);
  ctx.stroke();

  // Convert degree to radians and draw the angle line
  const radians = degree * Math.PI / 180;
  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
    centerX + radius * Math.cos(radians),
    centerY - radius * Math.sin(radians),
  );
  ctx.stroke();

  // Draw an arc to visualize the angle
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.2, 0, -radians, true);
  ctx.stroke();

  // Add center dot
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(centerX, centerY, size * 0.01, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

// Main function to generate test cases
const outputStream = await Deno.open("case.jsonl", {
  write: true,
  create: true,
  truncate: true,
});
const encoder = new TextEncoder();

// Generate test cases for all angles from 1 to 360 degrees
for (let degree = 1; degree <= 360; degree++) {
  const angleCanvas = drawAngle(degree);
  const pngBuffer = angleCanvas.toBuffer();
  const b64 = btoa(String.fromCharCode(...pngBuffer));

  // Prepare test case
  const input =
    "What is the measure of the angle shown? Just say the degree number without any units.";
  const output = `${degree}`;

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

outputStream.close();
