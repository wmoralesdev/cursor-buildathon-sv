import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

export const isConvexConfigured = Boolean(convexUrl);

export const convexClient = isConvexConfigured ? new ConvexReactClient(convexUrl!) : null;
