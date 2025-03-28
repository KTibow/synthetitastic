import { createCanvas } from "https://deno.land/x/canvas/mod.ts";

// Helper function to draw a clock face with given hour and minute
function drawClock(hour: number, minute: number, size = 512) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;

  // White background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, size, size);

  // Draw clock face
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Hour hand
  const hourAngle = ((hour % 12) * Math.PI / 6) + (minute * Math.PI / 360) -
    Math.PI / 2;
  ctx.lineWidth = size * 0.02;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
    centerX + radius * 0.5 * Math.cos(hourAngle),
    centerY + radius * 0.5 * Math.sin(hourAngle),
  );
  ctx.stroke();

  // Minute hand
  const minuteAngle = (minute * Math.PI / 30) - Math.PI / 2;
  ctx.lineWidth = size * 0.01;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
    centerX + radius * 0.8 * Math.cos(minuteAngle),
    centerY + radius * 0.8 * Math.sin(minuteAngle),
  );
  ctx.stroke();

  // Center dot
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(centerX, centerY, size * 0.02, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

// Format time in standard format
function formatTime(hour: number, minute: number): string {
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")}`;
}

// Main function to generate test cases
const outputStream = await Deno.open("case.jsonl", {
  write: true,
  create: true,
  truncate: true,
});
const encoder = new TextEncoder();

// Generate test cases for all 12 hours and 60 minutes
for (let hour = 1; hour <= 12; hour++) {
  for (let minute = 0; minute < 60; minute++) {
    const clockCanvas = drawClock(hour, minute);
    const pngBuffer = clockCanvas.toBuffer();
    const b64 = btoa(String.fromCharCode(...pngBuffer));

    // Prepare AM test case
    const input =
      "What time is shown on this clock? Just say the 12 hour time (eg 9:45).";
    const output = formatTime(hour, minute);

    // Write AM test case to output file
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
