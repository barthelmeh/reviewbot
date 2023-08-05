import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const AssignReviewerWorkflow = DefineWorkflow({
  callback_id: "assign_reviewer_workflow",
  title: "Assign Reviewer",
  description: "Randomly assign a reviewer to a task",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

// your steps go here

/* Step 1. Collect message information */
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
        required: ["workers", "description"],
      },
    },
  );

export { AssignReviewerWorkflow };