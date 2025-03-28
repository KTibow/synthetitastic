let seed = 1;
const seededRandom = () => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};
const wordsTxt = await Deno.readTextFile("words.txt");

const justText = /^[a-z]+$/;
let words = wordsTxt.split("\n");
words = words.map((word) => word.toLowerCase());
words = words.filter((word) => justText.test(word));
words = [...new Set(words)];

const outputStream = await Deno.open("case.jsonl", {
  write: true,
  create: true,
  truncate: true,
});
const encoder = new TextEncoder();
for (const word of words) {
  if (word.length < "strawberry".length) continue;
  const frequency: Record<string, number> = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    f: 0,
    g: 0,
    h: 0,
    i: 0,
    j: 0,
    k: 0,
    l: 0,
    m: 0,
    n: 0,
    o: 0,
    p: 0,
    q: 0,
    r: 0,
    s: 0,
    t: 0,
    u: 0,
    v: 0,
    w: 0,
    x: 0,
    y: 0,
    z: 0,
  };
  for (const letter of word) {
    frequency[letter] = frequency[letter] + 1;
  }
  for (const [k, v] of Object.entries(frequency)) {
    if (v == 0 && seededRandom() > 0.001) continue;
    if (v == 1 && seededRandom() > 0.01) continue;
    if (v == 2 && seededRandom() > 0.01) continue;

    const input = `How many "${k}" are in "${word}"? Just say the number.`;
    const output = `${v}`;
    outputStream.write(
      encoder.encode(JSON.stringify({ input, output }) + "\n"),
    );
  }
}
