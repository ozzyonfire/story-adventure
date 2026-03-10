---
name: ink-story-writer
description: Author, refactor, and debug Ink DSL files (.ink). Use when Codex needs to translate narrative specs into Ink syntax, structure knots/stitches/diverts, model state with variables and lists, fix compile or flow errors, or make existing Ink scripts compile and run reliably with the Ink Node toolchain.
---

# Ink Story Writer

Implement Ink correctly and keep `.ink` files compilable, readable, and safe to modify.

## Inputs and Outputs

Input:

- narrative intent/specification, or
- existing `.ink` files with requested changes/fixes.

When available, also treat `scenes.json` as a required wiring input for scene image tags.

Output:

- valid/refactored `.ink` content,
- compile/debug guidance and error triage notes,
- compiled JSON output instructions for viewer pickup.

Non-goals:

- do not own story quality evaluation,
- do not adjudicate canon,
- do not run critique-pipeline policy.

## DSL Workflow

### 1) Scaffold Structure

Build a clean structure first:

1. `-> start` entry.
2. top-level knots for major beats.
3. stitches for local subflows.
4. explicit `-> target` names.

Use `assets/templates/adventure.ink` when starting from scratch.

### 2) Branching Patterns

Use explicit, readable choice routing:

- `* [Choice] -> target` for normal options.
- conditional choices with `{ condition }`.
- temporary loops only when intentional and bounded.
- avoid unreachable branches and orphan targets.

### 2a) Scene Image Tagging

When `scenes.json` is present:

- preserve every planned `inkTarget` and its corresponding `# IMAGE:` tag,
- emit the image tag at the first paragraph of the target scene entrypoint,
- use the exact path `/stories/<slug>/images/<imageFilename>` from the manifest,
- if `reuseOf` is set, point at the reused scene's image file instead of inventing a new one,
- do not delete or relocate valid image tags during refactors unless the manifest changes.

### 3) State Modeling (Variables and Lists)

Use:

- `VAR` for scalar story state,
- `LIST` for enumerated/ordered state,
- helper functions for state transitions when repeated.

Prefer deterministic state transitions and descriptive names.

### 4) Functions, Tunnels, and Diverts

Use:

- `=== function name(...)` for reusable state logic,
- `->->` to return from tunnels,
- `-> label` for direct navigation.

Keep side effects localized and obvious.

### 5) Include Strategy

For larger projects, split files and include them with:

```ink
INCLUDE filename.ink
```

Rules:

- keep shared declarations in a stable base include,
- avoid circular include patterns,
- keep knot names globally unique.

### 6) Compile Triage

Compile with Ink Node tooling:

```bash
npx inklecate -o story.json adventure.ink
```

For web viewer delivery, compile to the configured stories directory:

```bash
npx inklecate -o "${STORIES_DIR:-./stories}/<slug>.json" adventure.ink
```

When the caller indicates the story is finished, produce the final compiled artifact in that directory.

When compile fails:

1. fix missing divert targets,
2. fix duplicate knot/stitch names,
3. fix malformed condition/list syntax,
4. fix declaration-before-use issues,
5. confirm `scenes.json` `inkTarget` names still exist and `IMAGE:` tags still map correctly,
6. recompile after each fix.

Use `references/ink-commands.md` for command and triage checklist.

### 7) Refactor-Safe Editing Rules

When modifying existing `.ink`:

1. preserve existing public knot/stitch names unless renaming is requested,
2. keep branch destinations stable when behavior should remain unchanged,
3. isolate mechanical rewrites from behavior changes,
4. preserve valid `IMAGE:` tags at scene entrypoints defined by `scenes.json`,
5. run compile checks before finalizing.

## Resources

- Use `assets/templates/adventure.ink` as the starter skeleton.
- Use `references/ink-commands.md` for compile/debug commands.
- Use `references/ink-example-crime-scene.ink` for advanced list/state and branching patterns.
