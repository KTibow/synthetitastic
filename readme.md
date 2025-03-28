# Synthetitastic

Synthetitastic is an accelerationist set of synthetic data. It's packed with a variety of programatically generated cases that can be evaled on and RLed with. Synthetitastic isn't ordinary - it *wants* to be saturated, so that LLMs can get better at these seemingly easy tasks.

## Structure

These are the tasks in Synthetitastic:
- Basic (text in / out)
  - Day of week (eg "What day of the week is 2084-09-26? Just say the day.")
  - Epoch conversion (eg "I want to make a Discord timestamp for 19:24:17 UTC on 2129-11-29. Just say the Unix time (seconds) I should use.")
  - Large multiplication (eg "What is the product of 96933 and 90409? Just say the number.")
  - Largest number (eg "What is the largest number without the letter o? Reply with just the decimal number. Exclude numbers like googolplex.")
  - Letter counting (eg "How many 'e' are in 'bestseller'? Just say the number.")
- Multimodal (text and images in / text out)
  - Clock reading
  - Angle identification
  - Point identification
  - Icon recognition
  - Object counting
- Reward (text in / free response out)
  - TODO

## Format

Main test cases are `jsonl` files, where each line has keys like
- **`input`**: Input text
- **`input_image`**: Sometimes present, a base64 encoded image
- **`output`**: Usually present, expected output text
- **`output_reward`**: Sometimes present, a name of a reward function to use instead of simple text comparison

## Performance
TODO
