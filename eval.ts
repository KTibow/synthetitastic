let seed = 1;
const seededRandom = () => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};
const folders = [
  "day-of-week",
  "epoch-conversion",
  "large-multiplication",
  "largest-number",
  "letter-counting",
  "wordle",
];

async function getSamples(folderPath: string, sampleCount: number) {
  seed = 1;
  const fileContent = await Deno.readTextFile(`${folderPath}/case.jsonl`);
  const lines = fileContent.split("\n").filter((line) => line.trim() !== "");
  const cases = lines.map((line) => JSON.parse(line));
  // Shuffle using Fisher-Yates
  for (let i = cases.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [cases[i], cases[j]] = [cases[j], cases[i]];
  }
  return cases.slice(0, sampleCount);
}

const sampleCount = 10;
let combinedPrompt = "";
let combinedAnswers = "";

for (const folder of folders) {
  const folderPath = `basic/${folder}`;
  const samples = await getSamples(folderPath, sampleCount);
  combinedPrompt += `Folder: ${folder}\n`;
  combinedAnswers += `Folder: ${folder}\n`;
  for (const testCase of samples) {
    combinedPrompt += `Prompt: \`${testCase.input}\`\n`;
    combinedAnswers += `Answer: \`${testCase.output}\`\n`;
  }
}

console.log(combinedPrompt);
console.log(combinedAnswers);
