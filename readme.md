# Synthetitastic

Synthetitastic is an accelerationist set of synthetic data. It's packed with a variety of programatically generated cases that can be evaled on and RLed with. Synthetitastic isn't ordinary - it *wants* to be saturated, so that LLMs can get better and more efficient at these seemingly easy tasks.

## Basic tasks

These are the kinds of tasks that computers are great at, reasoning LLMs are okay at, and normal LLMs are bad at. With Synthetitastic, LLMs can hone their skills on these tasks, reaching perfect accuracy and speed.

The test cases are `jsonl` files, where each line has keys like
- **`input`**: Input text
- **`output`**: Expected output text

And we have these tests
- Day of week (eg "What day of the week is 2084-09-26? Just say the day.")
- Epoch conversion (eg "I want to make a Discord timestamp for 19:24:17 UTC on 2129-11-29. Just say the Unix time (seconds) I should use.")
- Large multiplication (eg "What is the product of 96933 and 90409? Just say the number.")
- Largest number (eg "What is the largest number without the letter o? Reply with just the decimal number. Exclude numbers like googolplex.")
- Letter counting (eg "How many 'e' are in 'bestseller'? Just say the number.")
- Wordle (eg "I guessed raxes and got 🟨🟨🟨🟨⬛ - so what's the word?")

Here are the results:
### Day of week

Llama 70b: 2/10

Claude 3.7: 0/10

QwQ max: 8/10

R1: 8/10

### Epoch conversion

Llama 70b: 0/10

Claude 3.7: 0/10

QwQ max: 2/10

R1: 0/10

### Large multiplication

Llama 70b: 0/10

Claude 3.7: 0/10

QwQ max: 9/10

R1: 10/10

### Largest number

Llama 70b: 3/10

Claude 3.7: 5/10

QwQ max: 7/10

R1: 7/10

### Letter counting

Llama 70b: 6/10

Claude 3.7: 6/10

QwQ max: 10/10

R1: 10/10

### Wordle

Llama 70b: 0/10

Claude 3.7: 2/10

QwQ max: 5/10

R1: 9/10

## Multimodal tasks

These tasks are closer to real life. LLMs should be perfect at these in theory, but currently aren't that great.
- Angle identification
- Clock reading
- Icon recognition
- Object counting
- Point identification

The test cases are `jsonl` files, where each line has keys like
- **`input`**: Input text
- **`input_image`**: Base 64 encoded input image (PNG)
- **`output`**: Expected output text

## More

If you have an idea, PR it.

I might add more things like test cases that mirror my workflow or reward functions for drawing things in the future.
