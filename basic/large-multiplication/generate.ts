let seed = 1;
const seededRandom = () => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};
const randomExponentialBigint = () =>
  BigInt(Math.floor(Math.pow(2, seededRandom() * 16)));

const outputStream = await Deno.open("case.jsonl", {
  write: true,
  create: true,
  truncate: true,
});
const encoder = new TextEncoder();
for (let i = 10000n; i <= 100000n; i += randomExponentialBigint()) {
  for (let j = 10000n; j <= 100000n; j += randomExponentialBigint()) {
    const input = `What is the product of ${i} and ${j}? Just say the number.`;
    const output = `${i * j}`;
    outputStream.write(
      encoder.encode(JSON.stringify({ input, output }) + "\n"),
    );
  }
}
