import type { Id } from "../../convex/_generated/dataModel";

export type ProjectSubmitMember = {
  name: string;
  xProfile: string;
  linkedInProfile: string;
};

export type ProjectSubmitFormValues = {
  teamName: string;
  members: ProjectSubmitMember[];
  repoUrl: string;
  description: string;
  video: File | null;
  eventSocialPostUrl: string;
  website: string;
};

export const PROJECT_SUBMIT_DESCRIPTION_MAX = 500;

export const DEFAULT_PROJECT_SUBMIT_MEMBERS: ProjectSubmitMember[] = [
  { name: "", xProfile: "", linkedInProfile: "" },
  { name: "", xProfile: "", linkedInProfile: "" },
  { name: "", xProfile: "", linkedInProfile: "" },
  { name: "", xProfile: "", linkedInProfile: "" },
];

export const DEFAULT_PROJECT_SUBMIT_VALUES: ProjectSubmitFormValues = {
  teamName: "",
  members: DEFAULT_PROJECT_SUBMIT_MEMBERS,
  repoUrl: "",
  description: "",
  video: null,
  eventSocialPostUrl: "",
  website: "",
};

export type ProjectSubmitUploadProgress = {
  phase: "idle" | "uploading-video" | "submitting";
  percent: number;
};

export type ProjectVideoStorageId = Id<"_storage">;
