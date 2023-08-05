// workflow
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GenerateReviewer } from "../functions/generate_random_reviewer.ts";

const AssignReviewerWorkflow = DefineWorkflow({
  callback_id: "assign_reviewer_workflow",
  title: "Assign Reviewer",
  description: "Randomly assign a reviewer to a task",
  input_parameters: {
    properties: {
      caller: {
        description: "The user that wanted to generate a reviewer",
        type: Schema.slack.types.user_id
      },
      channel_id: {
        description: "The channel to tag the generated reviewer",
        type: Schema.slack.types.channel_id,
      },
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["caller", "channel_id", "interactivity"],
  },
});

// your steps go here

/* Step 1. Collect task information */
const information = AssignReviewerWorkflow.addStep(
    Schema.slack.functions.OpenForm,
    {
      title: "Assign a reviewer",
      interactivity: AssignReviewerWorkflow.inputs.interactivity,
      submit_label: "Generate Reviewer",
      description: "Assign a reviewer randomly",
      fields: {
        elements: [{
            name: "workers",
            title: "Assigned to",
            description: "The users that the task was assigned to. These users won't be asked to review this task.", 
            type: Schema.types.array, 
            items: {
                title: "User ID",
                type: Schema.slack.types.user_id,
            }, 
        },
        {
            name: "user_group",
            title: "Possible Reviewers",
            description: "The group of possible reviewers (team800)",
            type: Schema.slack.types.usergroup_id,
        },
        {
            name: "description",
            title: "Review Description",
            description: "The task that the reviewer should review in plain text.",
            type: Schema.types.string,
            long: true,
        },
        {
            name: "extra_info",
            title: "Extra information",
            description: "Is there any extra information the reviewer shoud know?",
            type: Schema.types.string,
            long: true,
        }],
        required: ["workers", "user_group", "description"],
      },
    },
  );

/* Step 2. Generate the reviewer user_id */
const reviewer_id = AssignReviewerWorkflow.addStep(GenerateReviewer, {
    workers: information.outputs.fields.workers,
    user_group: information.outputs.fields.user_group,
  });

/* Step 3. Mention the generated reviewer */
AssignReviewerWorkflow.addStep(Schema.slack.functions.SendMessage, {
    channel_id: AssignReviewerWorkflow.inputs.channel_id,
    message:
      `*Hey <@${reviewer_id}>!* <@${AssignReviewerWorkflow.inputs.caller}> has summoned you for a review :white_check_mark:\n` +
      `Please see the following review description:\n` + 
      `> ${information.outputs.fields.description}\n` +
      `\nMake sure to react when you have seen this message!`,
  });

export { AssignReviewerWorkflow };