// workflow
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GenerateReviewer } from "../functions/generate_random_reviewer.ts";
import { TagReviewer } from "../functions/tag_reviewer.ts";

const AssignReviewerWorkflow = DefineWorkflow({
  callback_id: "assign_reviewer_workflow",
  title: "Assign Reviewer",
  description: "Randomly assign a reviewer to a task",
  input_parameters: {
    properties: {
      channel_id: {
        description: "The channel to tag the generated reviewer",
        type: Schema.slack.types.channel_id,
      },
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["channel_id", "interactivity"],
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
            name: "story_number",
            title: "Story Number",
            description: "The number of the story the task belongs to. Please just input the number",
            type: Schema.types.integer,
        },
        {
            name: "task_description",
            title: "Task Description",
            description: "The description of the task to be reviewed.",
            type: Schema.types.string,
            long: true,
        },
        {
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
            name: "extra_info",
            title: "Extra information",
            description: "Is there any extra information the reviewer shoud know?",
            type: Schema.types.string,
            long: true,
        }],
        required: ["workers", "story_number", "task_description"],
      },
    },
  );

/* Step 2. Generate the reviewer user_id */
const reviewer_id = AssignReviewerWorkflow.addStep(GenerateReviewer, {
    workers: information.outputs.fields.workers,
  });

/* Step 3. Mention the generated reviewer */
AssignReviewerWorkflow.addStep(TagReviewer, {
    channel_id: AssignReviewerWorkflow.inputs.channel_id,
    reviewer_id: reviewer_id.outputs.reviewer,
    story_number: information.outputs.fields.story_number,
    task_description: information.outputs.fields.task_description,
    extra_information: information.outputs.fields.extra_info,
    caller: AssignReviewerWorkflow.inputs.interactivity.interactor.id,
});

export { AssignReviewerWorkflow };