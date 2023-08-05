// function
import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";

export const GenerateReviewer = DefineFunction({
    callback_id: "generate_reviewer",
    title: "Generate a Reviewer",
    description: "Randomly generate a reviewer that didn't work on the task.",
    source_file: "functions/generate_random_reviewer.ts",
    input_parameters: {
        properties: {
            workers: {
              type: Schema.types.array,
              description: "The users that worked on the story required for a review. These users won't be asked to be reviewed.",
            },
            user_group: {
                type: Schema.slack.types.usergroup_id,
                description: "The user group to choose a reviewer from"
            }
          },
          required: ["workers", "user_group"],
    },
    output_parameters: {
        properties: {
            reviewer: {
              type: Schema.slack.types.user_id,
              description: "The randomly assigned reviewer",
            },
          },
          required: ["reviewer"],
    },
});

export default SlackFunction(
    GenerateReviewer, 
    async ({ inputs, client, token }) => {
        const { workers, user_group } = inputs;

        // Get list of users in the given group
        const users_in_group = await client.usergroups.users.list({
            token: token,
            usergroup: user_group,
        });

        if(!users_in_group.ok) {
            console.log("Error during request for users in group!", users_in_group.error);
        }
        const users = users_in_group.users;

        // Remove workers from users group so that workers can't be their own reviewer
        workers.forEach(worker => {
            const index = users.indexOf(worker);

            if(index !== -1) {
                users.splice(index, 1);
            } else {
                console.log(`Given worker: ${worker} doesn't exist in the user group: ${user_group}.`);
            }
        });

        // Generate a random reviewer
        const reviewer = users[Math.floor(Math.random() * users.length)];

        return { outputs : reviewer };
});

