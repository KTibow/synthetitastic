// Generate LLM test set for number-letter puzzles

// Convert a number to its English spelling
function numberToWords(num: number): string {
  if (num === 0) return "zero";

  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];
  const scales = ["", "thousand", "million", "billion", "trillion"];

  function convertLessThanOneThousand(num: number): string {
    if (num === 0) return "";

    let result = "";

    if (num >= 100) {
      result += ones[Math.floor(num / 100)] + " hundred";
      num %= 100;
      if (num > 0) result += " and ";
    }

    if (num >= 10 && num < 20) {
      result += teens[num - 10];
    } else {
      if (num >= 20) {
        result += tens[Math.floor(num / 10)];
        num %= 10;
        if (num > 0) result += "-";
      }

      if (num > 0) {
        result += ones[num];
      }
    }

    return result;
  }

  let result = "";
  let chunkIndex = 0;

  while (num > 0) {
    const chunk = num % 1000;

    if (chunk > 0) {
      const chunkWords = convertLessThanOneThousand(chunk);
      result = chunkWords +
        (chunkIndex > 0 ? " " + scales[chunkIndex] + (result ? " " : "") : "") +
        result;
    }

    num = Math.floor(num / 1000);
    chunkIndex++;
  }

  return result.trim();
}

// Check if a number's spelling contains a specific letter
function containsLetter(num: number, letter: string): boolean {
  return numberToWords(num).toLowerCase().includes(letter.toLowerCase());
}

// Define test case structure
interface TestCase {
  input: string;
  output: string;
}

const outputFile = await Deno.open("./case.jsonl", {
  write: true,
  create: true,
  truncate: true,
});
const encoder = new TextEncoder();

// Define sample numbers to check
const sampleNumbers: number[] = [];
for (let i = 0; i <= 1000; i++) {
  sampleNumbers.push(i);
}
// Add larger numbers at regular intervals for better coverage
for (let i = 3; i < 10; i++) {
  const power = Math.pow(10, i);

  for (let j = 0; j < 10; j++) {
    const base = power * j;

    // Add the number and its predecessor
    sampleNumbers.push(base - 1);
    sampleNumbers.push(base);
    sampleNumbers.push(Math.floor(base * 10 / 9));
  }
}

let testCaseCount = 0;

// For each letter of the alphabet
for (const letter of "abcdefghijklmnopqrstuvwxyz") {
  // Find the largest number without this letter
  let largestWithout = null;
  for (const num of [...sampleNumbers].sort((a, b) => b - a)) {
    if (!containsLetter(num, letter)) {
      largestWithout = num;
      break;
    }
  }

  // Find the smallest number with this letter
  let smallestWith = null;
  for (const num of sampleNumbers) {
    if (containsLetter(num, letter)) {
      smallestWith = num;
      break;
    }
  }

  // Add test cases if interesting
  if (largestWithout !== null && largestWithout < 1000000) {
    const testCase = {
      input:
        `What is the largest number without the letter ${letter}? Reply with just the decimal number. Exclude numbers like googolplex.`,
      output: largestWithout.toString(),
    };
    await outputFile.write(encoder.encode(JSON.stringify(testCase) + "\n"));
    testCaseCount++;
  }

  if (smallestWith !== null && smallestWith > 0) {
    const testCase = {
      input:
        `What is the smallest number that contains the letter ${letter} when spelled out? Reply with just the decimal number.`,
      output: smallestWith.toString(),
    };
    await outputFile.write(encoder.encode(JSON.stringify(testCase) + "\n"));
    testCaseCount++;
  }
}

outputFile.close();
