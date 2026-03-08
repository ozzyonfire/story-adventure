---
name: story-adventure
description: Run interactive choose-your-own-adventure storytelling with persistent markdown save data. Use when a user wants to play a branching story, create a new story run, resume an existing run, track inventory/stats/flags, or maintain continuity across turns with autosave after every choice.
---

# Story Adventure

Run a structured choose-your-own-adventure game with persistent markdown saves.

## Ask Setup Questions First

For a **new story**, ask exactly 4 setup questions before generating content:

1. What tone should the story use?
2. What setting should the story use?
3. Who is the protagonist?
4. How long/complex should the story be?

If the user already provided one or more answers, only ask for missing items.

For a **resume request**, skip setup questions and load existing files.

## Plan Mode Suggestion

When constructing the story plan (premise, arc, major beats, and endings), suggest that the user can switch to Plan Mode if they want to refine scope, constraints, or implementation details before gameplay begins.

## Use Configurable Storage Root

Determine the storage root in this order:

1. User-provided path in current request
2. Previously established path in conversation/session
3. Default: `~/.config/stories`

Create and use story path:

- `<root>/<slug>/`

Slug rules:

- Derive from title or premise
- Lowercase letters, digits, hyphens only
- Replace spaces/punctuation with hyphens
- Collapse repeated hyphens
- Trim leading/trailing hyphens

## Initialize Story Files

For a new run, create these files:

- `index.md`
- `outline.md`
- `world.md`
- `state.md`
- `log/scene-0001.md` (first playable scene)

All story data must stay inside the story folder.

## Required File Schemas

Use these schemas so future turns remain consistent.

### `index.md`

```markdown
---
story_title: "<title>"
slug: "<slug>"
storage_root: "<root>"
created_at: "<ISO-8601>"
updated_at: "<ISO-8601>"
status: "active"
current_scene: 1
latest_scene_file: "log/scene-0001.md"
---

# <title>

## Quick Resume
- Premise: <1-2 sentence premise>
- Current objective: <current player objective>
- Last consequence: <last significant outcome>
```

### `outline.md`

```markdown
# Story Outline

## Premise
<short premise>

## Protagonist
<character summary>

## Main Arc
- Beginning: <setup>
- Middle: <escalation>
- Climax: <peak conflict>
- Ending candidates:
  1. <ending option A>
  2. <ending option B>

## Major Beats
1. <beat 1>
2. <beat 2>
3. <beat 3>
```

### `world.md`

```markdown
# World Bible

## Setting
<time/place/atmosphere>

## Factions and NPCs
- <name>: <goal and relationship to protagonist>

## Rules and Constraints
- <magic/tech/social limits>

## Continuity Facts
- <fact that must remain true>
```

### `state.md`

Keep canonical game state in YAML frontmatter and notes below.

```markdown
---
player:
  name: "<name>"
  health: 100
  morale: 50
  location: "<starting location>"
inventory:
  - "<item>"
flags:
  met_key_npc: false
  major_secret_known: false
quests:
  active:
    - "<quest>"
  completed: []
turn:
  scene_number: 1
  last_choice_id: null
---

# State Notes
- Track non-quantitative status updates.
- Explain recent state changes briefly.
```

### `log/scene-XXXX.md`

Each turn must produce one scene file with zero-padded numbering.

```markdown
---
scene_number: 1
timestamp: "<ISO-8601>"
choice_selected_id: null
---

# Scene 0001

## Scene Summary
<what happened>

## Choices Presented
1. <choice 1>
2. <choice 2>
3. <choice 3>

## Choice Selected
- ID: <1|2|3 or null for opening scene>
- Player input: <verbatim or normalized input>

## Immediate Consequence
<result of selected choice>

## State Diff
- Inventory: <added/removed items>
- Stats: <health/morale/etc changes>
- Flags: <flag changes>
- Quests: <active/completed changes>
```

## Gameplay Loop

For every turn after initialization:

1. Read `index.md`, `state.md`, latest scene file, and relevant continuity from `outline.md` + `world.md`.
2. Write next narrative segment.
3. Offer numbered choices with distinct consequences.
4. Accept player choice and normalize it to a selected choice ID.
5. Create next `log/scene-XXXX.md` with summary, choices, selected ID, consequence, and state diff.
6. Update `state.md` frontmatter to reflect canonical latest state.
7. Update `index.md` fields: `updated_at`, `current_scene`, `latest_scene_file`, quick resume section.

Autosave on **every** turn. Do not wait for manual save.

## Continuity and Quality Rules

Before finalizing each turn:

1. Verify the scene does not contradict established facts in `world.md`.
2. Verify inventory/flags/quests in scene output match `state.md` updates.
3. Verify choices are meaningful (not cosmetic) and consequences are distinct.
4. Verify stakes and objective clarity remain visible to the player.

Read and apply: [`references/story-quality.md`](references/story-quality.md)

## Resume Behavior

When user asks to continue an existing story:

1. Locate story folder via slug/path.
2. Load `index.md` to find latest scene.
3. Load `state.md` as source of truth.
4. Continue from latest scene and keep numbering sequential.

If files are missing or malformed, repair minimally and note assumptions in `index.md` quick resume text.

## Output Expectations During Play

- Keep narration concise but vivid.
- Provide exactly 3 numbered choices unless user requests otherwise.
- Keep choice IDs stable within the scene.
- Never mutate historical scene files; append new scene files only.
- Act primarily as narrator/storyteller, not as a process explainer.
- Keep background/process commentary minimal unless the user explicitly asks for implementation details.
