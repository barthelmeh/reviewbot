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
          name: "doer_of_good_deeds",
          title: "Whose deeds are deemed worthy of a kudo?",
          description: "Recognizing such deeds is dazzlingly desirable of you!",
          type: Schema.slack.types.user_id,
        }, {
          name: "kudo_channel",
          title: "Where should this message be shared?",
          type: Schema.slack.types.channel_id,
        }, {
          name: "kudo_message",
          title: "What would you like to say?",
          type: Schema.types.string,
          long: true,
        }, {
          name: "kudo_vibe",
          title: 'What is this kudo\'s "vibe"?',
          description: "What sorts of energy is given off?",
          type: Schema.types.string,
          enum: [
            "Appreciation for someone 🫂",
            "Celebrating a victory 🏆",
            "Thankful for great teamwork ⚽️",
            "Amazed at awesome work ☄️",
            "Excited for the future 🎉",
            "No vibes, just plants 🪴",
          ],
        }],
        required: ["doer_of_good_deeds", "kudo_channel", "kudo_message"],
      },
    },
  );

export { AssignReviewerWorkflow };