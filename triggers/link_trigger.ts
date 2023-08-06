import { Trigger } from "deno-slack-api/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import { AssignReviewerWorkflow } from "../workflows/assign_reviewer.ts";

const link_trigger: Trigger<typeof AssignReviewerWorkflow.definition> = {
    type: TriggerTypes.Shortcut,
    name: "Assign a random reviewer",
    description: "Generates a random reviewer and tags them in the review channel",
    workflow: "#/workflows/assign_reviewer_workflow",
    inputs: {
        interactivity: {
            value: TriggerContextData.Shortcut.interactivity,
        },
        channel_id: {
            value: TriggerContextData.Shortcut.channel_id,
        }
    }};

export default link_trigger;

