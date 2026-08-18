import { v } from "convex/values";
import { env, query } from "./_generated/server";

export const verifyPasscode = query({
  args: { passcode: v.string() },
  returns: v.boolean(),
  handler: async (_ctx, args) => {
    return args.passcode === env.PASSCODE;
  },
});
