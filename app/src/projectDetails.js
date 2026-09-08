import { projectDetailsProducts } from "./projectDetailsProducts.js";
import { projectDetailsTools } from "./projectDetailsTools.js";

// Reviewed, bilingual snapshots of the owner's README introductions and code.
// No GitHub API calls are needed when a visitor opens a project.
export const projectDetails = {
  ...projectDetailsProducts,
  ...projectDetailsTools,
};
