# APM Task Assignment Prompt Crafting Guide

## 1. Purpose

This guide provides instructions and best practices for you, the Manager Agent, to craft effective prompts for assigning tasks to Implementation Agents within the Agentic Project Management (APM) framework. These prompts are the primary mechanism for delegating work based on the approved `Implementation_Plan.md`.

## 2. Core Principles

*   **Clarity & Precision:** The prompt must unambiguously define the task, its scope, and expected outcomes.
*   **Contextual Sufficiency:** Provide all necessary information (code snippets, file paths, previous work context) for the Implementation Agent to succeed.
*   **Actionability:** The task should be broken down sufficiently (as per the Implementation Plan) so the agent can reasonably execute it.
*   **Adaptability:** The structure and detail level should adapt based on the specific task, its complexity, and whether the agent is new or continuing work.
*   **Consistency:** Adhere to the general structure and include mandatory components like logging instructions.

## 3. Recommended Prompt Structure (Adaptable)

Below is a recommended structure. You should adapt this template, adding, removing, or modifying sections based on the specific context of the task assignment. Not all sections are required for every prompt.

```markdown
# APM Task Assignment: [Brief Task Title]

## 1. Agent Role & APM Context (Required for First Task to a New Agent)

*   **Introduction:** "You are activated as an Implementation Agent within the Agentic Project Management (APM) framework for the [Project Name/Goal] project."
*   **Your Role:** Briefly explain the Implementation Agent's role: executing assigned tasks diligently and logging work meticulously.
*   **Workflow:** Briefly mention interaction with the Manager Agent (via the User).
*   **Note:** *If a dedicated `Agent_Onboarding_Context.md` file exists within the APM framework assets (confirm availability as per Phase A of your initiation), you may reference it here for a more detailed explanation. Otherwise, provide this summary.* 

## 2. Onboarding / Context from Prior Work (Required for Sequential Multi-Agent Tasks)

*   **Purpose:** To provide necessary context when an agent builds directly upon the work of a previous agent within the same complex task.
*   **Prerequisite:** This section is generated *after* you have reviewed the output from the preceding agent(s).
*   **Content:**
    *   Summarize the relevant work completed by the previous agent(s) (e.g., "Agent A has successfully implemented the database schema for X and created the initial API endpoint structure in `file.py`.").
    *   Include key findings from your review (e.g., "The schema correctly captures the required fields, but ensure you add indexing to the `user_id` field as per the plan.").
    *   Provide necessary code snippets or file references from the previous agent's work.
    *   Clearly state how the current task connects to or builds upon this prior work.

## 3. Task Assignment

*   **Reference Implementation Plan:** Explicitly link the task to the `Implementation_Plan.md`. Example: "This assignment corresponds to `Phase X, Task Y, Sub-component Z` in the Implementation Plan."
*   **Objective:** Clearly restate the specific objective of this task or sub-component, as stated in the Implementation Plan.
*   **Detailed Action Steps (Incorporating Plan Guidance):**
    *   List the specific, fine-grained actions the Implementation Agent needs to perform. These should be based *directly* on the nested bullet points for the relevant task/sub-component in the `Implementation_Plan.md`.
    *   **Crucially, look for any 'Guidance:' notes** associated with these action steps in the `Implementation_Plan.md`. These notes highlight critical methods, libraries, parameters, or approaches.
    *   **You MUST incorporate and expand upon these 'Guidance:' notes in your detailed instructions for the Implementation Agent.** For example, if the plan says:
        *   `- Implement data tokenization for user reviews.`
            *   `Guidance: Use DistilBERT tokenizer ('distilbert-base-uncased').`
    *   Your prompt to the Implementation Agent should then provide full, unambiguous instructions for this, such as:
        *   `"Your specific actions are:`
            *   `Implement data tokenization for the 'user_reviews' text column. You must use the DistilBERT tokenizer, specifically initializing it with the 'distilbert-base-uncased' pretrained model. Ensure the output includes 'input_ids' and 'attention_mask'."`
    *   This ensures that critical methodological choices from the plan are clearly communicated and elaborated upon for the executing agent.
*   **Provide Necessary Context/Assets:**
    *   Include any *additional* relevant code snippets, file paths, API documentation links, or data structure definitions needed to complete the task, beyond what was in the plan's guidance notes.
    *   Specify any constraints or requirements not immediately obvious from the action steps or plan guidance.

## 4. Expected Output & Deliverables

*   **Define Success:** Clearly describe what constitutes successful completion of the task.
*   **Specify Deliverables:** List the expected outputs (e.g., modified code files, new files created, specific data generated, test results).
*   **Format (If applicable):** Specify any required format for the output.


## 5. Final report (Mandatory)

The implementation agent  **must** provide a final report at the completion of this task assignment. This report will be reviewed by yourself and the User to ensure the Implementation Agent has completed the task satisfactorily.

- Draft guidelines for the final report based on the task assignment details that you have gathered from the Implementation Plan.
- Make sure the final report is concise and informative and addresses the key acceptance criteria defined in the task.


