import { Manifest } from "deno-slack-sdk/mod.ts";
import { AssignReviewerWorkflow } from "./workflows/assign_reviewer.ts";
import { GenerateReviewer } from "./functions/generate_random_reviewer.ts";
import { TagReviewer } from "./functions/tag_reviewer.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "ReviewBot",
  description: "A simple bot designed to automatically assign reviewers.",
  icon: "assets/default_new_app_icon.png",
  functions: [GenerateReviewer, TagReviewer],
  workflows: [AssignReviewerWorkflow],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public", "usergroups:read"],
});
