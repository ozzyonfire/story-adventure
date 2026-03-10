# Ink Commands

## Compile

```bash
npx inklecate -o story.json adventure.ink
```

## Playtest in Terminal (if inkjs runtime is available)

```bash
node play.js
```

## Typical Compile Error Triage

1. Check for missing `->` targets.
2. Check for unclosed braces or brackets.
3. Check for variable declaration/usage mismatch.
4. Check for duplicate knot or stitch names.
5. Recompile after each fix and append results to `feedback.md`.
