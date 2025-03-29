let seed = 1;
const seededRandom = () => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Read a word list
const wordsTxt = await Deno.readTextFile("words.txt");
const words = wordsTxt.split("\n").filter(Boolean);
const goodWordsTxt = await Deno.readTextFile("good-words.txt");
const goodWords = goodWordsTxt.split("\n").filter(Boolean);
goodWords.sort();

const outputStream = await Deno.open("case.jsonl", {
  write: true,
  create: true,
  truncate: true,
});
const encoder = new TextEncoder();

// Generate Wordle-style feedback
function generateFeedback(targetWord: string, guessWord: string) {
  const result = Array(5).fill("⬛");
  const letterCounts: Record<string, number> = {};

  for (const letter of targetWord) {
    letterCounts[letter] = (letterCounts[letter] || 0) + 1;
  }

  for (let i = 0; i < 5; i++) {
    if (guessWord[i] === targetWord[i]) {
      result[i] = "🟩";
      letterCounts[guessWord[i]]--;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] === "⬛" && letterCounts[guessWord[i]] > 0) {
      result[i] = "🟨";
      letterCounts[guessWord[i]]--;
    }
  }

  return result.join("");
}

// Find all possible solutions given the constraints
function findPossibleSolutions(
  wordList: string[],
  guesses: { guessWord: string; feedback: string }[],
) {
  const fixedLetters = Array.from(
    { length: 5 },
    () => undefined as (string | undefined),
  );
  const bannedLetters = Array.from({ length: 5 }, () => [] as string[]);
  const requiredLetters: string[] = [];
  for (const { guessWord, feedback } of guesses) {
    const feedbackBits = [...feedback];
    for (let i = 0; i < 5; i++) {
      const letter = guessWord[i];
      if (feedbackBits[i] === "🟩") {
        fixedLetters[i] = letter;
      } else if (feedbackBits[i] === "🟨") {
        bannedLetters[i].push(letter);
        requiredLetters.push(letter);
      } else {
        for (let j = 0; j < 5; j++) {
          bannedLetters[j].push(letter);
        }
      }
    }
  }
  return wordList.filter((word: string) => {
    for (const letter of requiredLetters) {
      if (!word.includes(letter)) {
        return false;
      }
    }
    for (let i = 0; i < 5; i++) {
      const letter = word[i];
      if (fixedLetters[i] && fixedLetters[i] !== letter) {
        return false;
      }
      if (bannedLetters[i].includes(letter)) {
        return false;
      }
    }
    return true;
  });
}

for (const targetWord of goodWords) {
  console.log("Guessing", targetWord);
  const guesses = [];
  let possibleSolutions = [...words];

  // Generate up to 6 guesses or until uniquely solvable
  for (let j = 0; j < 6; j++) {
    // Find a strategic guess
    let bestGuess = "";
    let bestScore = -1;

    for (let attempt = 0; attempt < 30; attempt++) {
      const candidateIndex = Math.floor(seededRandom() * words.length);
      const candidate = words[candidateIndex];
      if (candidate == targetWord) continue;

      // Score this guess based on information gain potential
      let score = 0;
      const uniqueLetters = new Set(candidate.split(""));
      score += uniqueLetters.size * 2;

      // Reward words that could eliminate many possibilities
      const tempGuesses = [...guesses, {
        guessWord: candidate,
        feedback: generateFeedback(targetWord, candidate),
      }];

      const remainingSolutions = findPossibleSolutions(
        possibleSolutions,
        tempGuesses,
      );
      score += (possibleSolutions.length - remainingSolutions.length) * 3;

      if (remainingSolutions.length == 0) {
        score = -1;
      }

      if (score > bestScore) {
        bestScore = score;
        bestGuess = candidate;
      }
    }

    if (!bestGuess) break;

    // Add this guess
    const feedback = generateFeedback(targetWord, bestGuess);
    guesses.push({ guessWord: bestGuess, feedback });

    // Update possible solutions
    possibleSolutions = findPossibleSolutions(possibleSolutions, guesses);

    // Stop if uniquely solvable
    if (possibleSolutions.length === 1) {
      // Verify the only solution is our target
      if (possibleSolutions[0] === targetWord) {
        break;
      }
    }

    // If no solutions remain, something went wrong
    if (possibleSolutions.length === 0) {
      break;
    }
  }

  // Only add puzzles that are uniquely solvable
  if (possibleSolutions.length === 1 && possibleSolutions[0] === targetWord) {
    let prompt = "I'm playing Wordle. Here are my guesses so far:\n\n";
    for (const { guessWord, feedback } of guesses) {
      prompt += `${guessWord}: ${feedback}\n`;
    }
    prompt += "\nWhat must be the target word? Just provide the word.";

    outputStream.write(
      encoder.encode(
        JSON.stringify({ input: prompt, output: targetWord }) + "\n",
      ),
    );
  }
}
