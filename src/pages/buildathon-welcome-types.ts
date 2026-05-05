export type AspectFormat = "post" | "story";

export type WelcomeFormValues = {
  handle: string;
  photo: File | null;
  isOrganizer: boolean;
};
