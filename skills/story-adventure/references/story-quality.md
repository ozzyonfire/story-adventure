# Story Quality Guide

Apply this guide while creating outlines, planning scenes, writing Ink, revising branches, and evaluating completed adventures.

## What Good CYOA Feels Like

A strong choose-your-own-adventure should feel like this:

- The player quickly understands what they want and why it matters.
- The world resists them in specific, escalating ways.
- Choices feel consequential before selection and distinct after selection.
- The story remembers what the player did.
- Information, items, alliances, and mistakes matter later.
- Endings feel earned rather than randomly assigned.

## Core Criteria

1. Establish a clear player goal, motive, and stakes early.
2. Put meaningful obstacles and tradeoffs between the player and that goal.
3. Escalate pressure over time; avoid repetition, stalling, or filler.
4. Offer choices that materially change information, risk, relationships, resources, or route.
5. Preserve continuity across facts, tone, chronology, inventory, flags, and character behavior.
6. Maintain scene momentum with a hook, reveal, dilemma, setback, or new pressure.
7. Reward attention, experimentation, and memory.
8. Ensure endings pay off the story's central question and the player's accumulated decisions.

## Player Goal and Stakes

- Give the protagonist one concrete central goal.
- State the goal in actionable terms: escape the manor, find the lost child, reach the tower before dawn, stop the ritual before moonrise.
- Establish why the player should care now, not eventually.
- Make the cost of failure legible early: death, loss, guilt, exposure, betrayal, missed rescue, permanent transformation.
- Avoid aimless atmosphere without motive, direction, or consequence.

## Player Agency

- Let the player change outcomes through decisions, not just witness prewritten events.
- Make choices alter what the player learns, what they lose, who trusts them, what becomes possible, or what later scenes become harder.
- Avoid fake agency where multiple options collapse into the same scene with no meaningful change.
- If branches reconverge, preserve state differences so the path still matters.
- Let the player be clever, cautious, reckless, kind, selfish, suspicious, or bold in ways the story can remember.

## Obstacles and Friction

- Make the world push back in ways that force decisions.
- Prefer obstacles that create tradeoffs: a locked gate, a suspicious ally, dwindling lamp oil, a promise that conflicts with survival, a shortcut that risks exposure.
- Use friction to reveal character, not just delay progress.
- Avoid arbitrary blocking without an understandable cause.
- Use a mix of obstacle types:
  - external: enemies, weather, time, geography, social danger
  - internal: fear, guilt, doubt, loyalty, temptation
  - informational: incomplete clues, lies, conflicting testimony, hidden motives
  - systemic: scarce inventory, limited opportunities, rising alert level, unstable alliances

## Escalation

- Let early choices create later consequences.
- Increase complication, not just activity.
- Raise both practical stakes and emotional stakes where possible.
- Escalate by changing the meaning of what the player already knows.
- Examples:
  - a small lie becomes a betrayal
  - a missing key becomes a moral dilemma
  - a rescued stranger becomes a liability or ally
  - a harmless clue reveals the true villain
- Avoid middle sections where the player merely repeats the loop with different wallpaper.

## Scene Purpose

Every scene should do at least one of the following:

- advance the main goal
- reveal new information
- force a meaningful decision
- deepen or strain a relationship
- create or pay off a consequence
- reframe a prior assumption
- increase urgency, danger, or uncertainty

If a scene does none of these, cut it or combine it with another scene.

## Scene Imagery

- Give each planned image one job: establish place, clarify pressure, show a consequence, or reward a reveal.
- Match each image to the narrative scene or beat, not every micro-transition in Ink.
- Keep protagonist appearance, setting anchors, props, and mood consistent with `canon.md`.
- Use `scenes.json` to decide when an image should be reused instead of generating decorative duplicates.
- Avoid prompts that spoil unrevealed information, contradict branch state, or flatten important ambiguity.
- Treat `IMAGE:` tags as part of scene entry logic, not optional polish added after the story is finished.

## Choice Design

For each set of options:

- Reject obvious choices, disguised duplicates, and purely cosmetic branches.
- Ensure each option changes risk, resource usage, alliances, information state, timing, or available routes.
- Make the player trade something real: safety vs speed, honesty vs advantage, helping someone vs preserving resources, curiosity vs caution.
- Avoid one joke option plus one real option plus one suicidal option unless the tone explicitly supports that pattern.
- Keep option text action-oriented, specific, and immediately understandable.
- Present options the character could plausibly attempt in the current situation.
- Keep option count consistent with skill rules (default: 3 options).

### Choice Quality Checks

Before finalizing a choice set, ask:

- Would a reasonable player hesitate between these options?
- Does each option reveal something about the player's priorities?
- Does each option change the next few beats, not just the next sentence?
- Does at least one option create a future problem and at least one option preserve a future advantage?
- Are consequences visible enough that the player feels ownership, but not so obvious that one option is trivially optimal?

## Consequence Design

- Show consequences at multiple time scales:
  - immediate: injury, clue found, trust lost, alarm triggered
  - delayed: a door later found locked, a witness returns, an ally remembers kindness
  - ending-level: escape, corruption, reconciliation, sacrifice, ruin
- Do not let important actions vanish into the void.
- Use flags, inventory, reputation, and remembered behavior as narrative memory.
- Whenever possible, turn consequences into later dilemmas rather than simple punishment.

## Branching Structure

- Prefer meaningful branching over branch explosion.
- It is fine for branches to reconverge, but they should reconverge with altered state, tone, available options, or knowledge.
- Distinguish between:
  - route variation: different path to a similar milestone
  - state variation: same scene entered with different facts, items, trust, or danger
  - outcome variation: materially different later events or endings
- Avoid branches that exist only to add volume.
- Reward replay by surfacing new scenes, new interpretations, or new solutions.

## Information and Mystery

- Seed important clues before major reveals.
- Hide answers in ways that feel fair, not arbitrary.
- Let the player form theories.
- Use uncertainty to create tension, not confusion.
- Avoid reveals that depend on information the player could never have learned.
- Aim for: "That makes sense, and I did not see it coming."

## Consistency and Surprise

- Keep the world internally coherent.
- Preserve logic across facts, geography, social rules, inventory, time, and causality.
- Allow surprise through implication, withheld perspective, mistaken assumptions, and conflicting motives.
- Do not invent late twists that break the established rules just to seem clever.

## Specificity

- Prefer concrete, memorable details over generic mood statements.
- Replace vague description with particulars that imply story and tone.
- Example: use "a nursery where every rocking horse faces the window" instead of "a spooky room."
- Let details perform double duty by also implying danger, history, class, motive, or theme.
- Avoid overdescribing every scene; choose a few strong details that carry narrative weight.

## Character Agency

- Give NPCs wants, fears, leverage, and lines they will not cross.
- Do not use characters as passive lore dispensers.
- Let recurring characters remember what the player did.
- Give allies and antagonists plans that continue even when the player is absent.
- Let NPCs complicate decisions instead of merely explaining them.

## Theme

- Give the story a light but legible thematic core.
- Common themes include greed, memory, cowardice, sacrifice, curiosity, identity, loyalty, and control.
- Let theme shape what choices cost and what endings mean.
- Use repeated motifs, mirrored dilemmas, and character contrasts to reinforce theme.
- Do not lecture; let theme emerge through consequences.

## Pacing and Tension

- Deliver a strong opening hook within the first turn.
- Use a compact structure: one central goal, a handful of recurring locations and characters, inventory with payoff, flags that alter later scenes, and multiple endings earned by choices.
- Alternate action, decision, consequence, and reflection beats.
- Use short-term consequences that feed longer-term stakes.
- Introduce new complications before old ones fully cool off.
- Avoid consecutive scenes that do the same dramatic job.
- End most scenes with one of the following:
  - a new threat
  - a reveal
  - a dilemma
  - a cost
  - a commitment point
  - a ticking clock

## Difficulty and Fairness

- Challenge the player, but do not require mind reading.
- Telegraph danger before punishing failure.
- Let costly choices still feel reasonable in hindsight.
- Provide enough information for attentive players to improve on replay.
- Avoid arbitrary death, random failure, or "gotcha" endings unless the project explicitly wants old-school cruelty.
- If using harsh failure, make it fast, legible, and instructive.

## Continuity Checks

Before saving a turn:

- Confirm facts, constraints, and character behavior still match `canon.md`.
- Confirm `scenes.json` still maps correctly to the intended scene entrypoints.
- Confirm protagonist motivation remains coherent with `outline.md`.
- Confirm chronology is consistent with previous scene logs.
- Confirm consequences from stealing, lying, hesitating, rescuing, or abandoning still matter later.
- Confirm NPC knowledge matches what they have actually seen, heard, or inferred.
- Confirm any gated choices have the required setup.

## Ending Guidance

- Build toward endings foreshadowed by prior choices.
- Tie ending quality to accumulated flags, quests, relationships, sacrifices, and failures.
- Ensure endings resolve the central stakes, not only side events.
- Let endings differ in more than flavor text; they should reflect different values, costs, or truths.
- Good endings need not be happy, but they should feel earned.
- Bad endings should usually follow from visible patterns of behavior, not random punishment.

## Reward Attention

- Make the story reward attention.
- If the player notices clues, remembers names, keeps unusual items, or distrusts the right person, the world should respond.
- Use inventory and flags as dramatic memory, not decorative bookkeeping.
- Let optional discoveries unlock shortcuts, better endings, safer plans, or richer interpretation.

## Revision Checklist

When revising an outline or scene, ask:

- Is the player's goal clear right now?
- What is the actual dilemma here?
- What changes if the player picks each option?
- What future consequence is being planted?
- What detail makes this scene specific and memorable?
- What pressure is increasing?
- Why does this scene need to exist?
- What would a second playthrough reveal that the first one missed?
