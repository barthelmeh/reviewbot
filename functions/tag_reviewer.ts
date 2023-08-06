// function
import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";

export const TagReviewer = DefineFunction({
    callback_id: "tag_reviewer",
    title: "Tag a reviewer",
    description: "Tag a reviewer with a detailed message",
    source_file: "functions/tag_reviewer.ts",
    input_parameters: {
        properties: {
            channel_id: {
              description: "The ID of the channel to send the message",
              type: Schema.slack.types.channel_id,
            },
            reviewer_id: {
                description: "The ID of the reviewer",
                type: Schema.slack.types.user_id,
            },
            story_number: {
                description: "The story number of the task to review",
                type: Schema.types.integer,
            },
            task_description: {
                description: "The description of the task to be reviewed",
                type: Schema.types.string,
            },
            extra_information: {
                description: "Extra information needed",
                type: Schema.types.string,
            },
            caller: {
                description: "The user ID of the caller of the function",
                type: Schema.slack.types.user_id,
            }
          },
          required: ["caller", "story_number", "task_description", "reviewer_id", "channel_id"],
    },
    output_parameters: {
        properties: {
        },
        required: [],
    }
});

export default SlackFunction(
    TagReviewer, 
    async ({ inputs, client, token }) => {
        const { channel_id, reviewer_id, story_number, task_description, extra_information, caller } = inputs;
        
        const message = `*Hey <@${reviewer_id}>!* <@${caller}> has summoned you for a review :tada:\n` +
        `>*UC ${story_number}*\n` +
        `> ${task_description}\n` + 
        `${
            extra_information
            ? "``` Extra information: " + extra_information + "```\n"
            : ""
        }` + 
        `\nMake sure to inform <@${caller}> when you have seen this message! :smile:`;

        console.log("Attempting to write message!");

        try {

            const result = await client.chat.postMessage({
                token: token,
                channel: channel_id,
                text: message
            });

            console.log(result.ok);

            if(!result.ok) {
                return { outputs: {}, error: "Error when trying to post message" }
            }
            
        } catch (err) {
            console.log("Error in posting message!", err);
            return { outputs: {}, error: "Error in posting message" };
        }

        return {
            outputs: {}
        }
    });