let seed = 1;
const seededRandom = () => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const outputStream = await Deno.open("case.jsonl", {
  write: true,
  create: true,
  truncate: true,
});
const encoder = new TextEncoder();
for (let days = 0; days < 20000; days += Math.floor(seededRandom() * 50)) {
  const date = new Date("2030-01-01T00:00:00.000Z");
  date.setDate(date.getDate() + days);
  const input = `What day of the week is ${
    date.toISOString().slice(0, 10)
  }? Just say the day.`;
  const output = date.toLocaleDateString("en-US", { weekday: "long" });
  outputStream.write(
    encoder.encode(JSON.stringify({ input, output }) + "\n"),
  );
}
