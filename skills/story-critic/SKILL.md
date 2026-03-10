---
name: story-critic
description: Critique Ink-first adventure artifacts and produce structured feedback for revision passes. Use when a story needs continuity, pacing, choice quality, tone, and Ink structure review before finalization.
---

# Story Critic

Provide a structured critique pass for the story-adventure pipeline.

## Contract

### Inputs

Required:

- `premise.md`
- `outline.md`
- `canon.md`
- `scenes.json`

Optional:

- `adventure.ink` (draft or revised)

### Output

Write or update `feedback.md` with these required sections:

1. `## Continuity`
2. `## Choice Quality`
3. `## Pacing`
4. `## Tone`
5. `## Scene Imagery`
6. `## Ink Structure`
7. `## Actionable Fixes`
8. `## Ink Compile Report`

## Review Focus

- Continuity must be measured against `canon.md` as source of truth.
- Choices must be materially different and produce meaningful consequences.
- Pacing must escalate conflict and maintain clear stakes.
- Tone must remain aligned with `premise.md` targets.
- Scene imagery must be measured against `scenes.json` for prompt quality, reuse decisions, and `IMAGE:` tag coverage.
- Ink structure must avoid dead ends, unclear flow, and weak branch labeling.

## Non-Goals

- Do not rewrite `premise.md`, `outline.md`, `canon.md`, `scenes.json`, or `adventure.ink` unless explicitly requested.
- Do not change artifact names or workflow phase order.

## Compile Integration Notes

If compile output is provided, summarize pass/fail and key errors under `## Ink Compile Report`.
If compile output is not provided, mark compile status as pending and request a compile checkpoint.
