let seed = 1;
const seededRandom = () => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};
const formatTime = (h: number, m: number, s: number) =>
  `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${
    s.toFixed(0).padStart(2, "0")
  }`;

const outputStream = await Deno.open("case.jsonl", {
  write: true,
  create: true,
  truncate: true,
});
const encoder = new TextEncoder();
let everyOther = false;
for (
  let s = 0;
  s < 60 * 60 * 24 * 365 * 100;
  s += Math.floor(seededRandom() * 60 * 60 * 24 * 100)
) {
  const date = new Date("2030-01-01T00:00:00.000Z");
  date.setTime(1000 * Math.floor(date.getTime() / 1000 + s));

  let input: string, output: string;
  if (everyOther) {
    input =
      `What is Unix time ${date.getTime()}? Respond with just the format YYYY-MM-DDTHH:MM:SS.`;
    output = date.toISOString().split(".")[0];
    everyOther = false;
  } else {
    input = `I want to make a Discord timestamp for ${
      formatTime(
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
      )
    } UTC on ${
      date.toISOString().slice(0, 10)
    }. Just say the Unix time (seconds) I should use.`;
    output = `${Math.floor(date.getTime() / 1000)}`;
    everyOther = true;
  }
  outputStream.write(
    encoder.encode(JSON.stringify({ input, output }) + "\n"),
  );
}
