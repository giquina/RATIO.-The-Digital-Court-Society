/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as aiSessions from "../aiSessions.js";
import type * as ai_argumentBuilder from "../ai/argumentBuilder.js";
import type * as ai_caseBrief from "../ai/caseBrief.js";
import type * as auth from "../auth.js";
import type * as daily from "../daily.js";
import type * as governance_executive from "../governance/executive.js";
import type * as governance_judicial from "../governance/judicial.js";
import type * as governance_legislative from "../governance/legislative.js";
import type * as governance_tiers from "../governance/tiers.js";
import type * as http from "../http.js";
import type * as notifications from "../notifications.js";
import type * as profiles from "../profiles.js";
import type * as research from "../research.js";
import type * as seed from "../seed.js";
import type * as sessions from "../sessions.js";
import type * as sidebar from "../sidebar.js";
import type * as social from "../social.js";
import type * as users from "../users.js";
import type * as videoSessions from "../videoSessions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  aiSessions: typeof aiSessions;
  "ai/argumentBuilder": typeof ai_argumentBuilder;
  "ai/caseBrief": typeof ai_caseBrief;
  auth: typeof auth;
  daily: typeof daily;
  "governance/executive": typeof governance_executive;
  "governance/judicial": typeof governance_judicial;
  "governance/legislative": typeof governance_legislative;
  "governance/tiers": typeof governance_tiers;
  http: typeof http;
  notifications: typeof notifications;
  profiles: typeof profiles;
  research: typeof research;
  seed: typeof seed;
  sessions: typeof sessions;
  sidebar: typeof sidebar;
  social: typeof social;
  users: typeof users;
  videoSessions: typeof videoSessions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
