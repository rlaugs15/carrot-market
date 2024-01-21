import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/client/client";
import withHandler, {
  ResponesType,
  SessionData,
} from "@/libs/server/withHandler";
import { IronSession } from "iron-session";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponesType>,
  session: IronSession<SessionData>
) {
  const profile = await client.user.findUnique({
    where: { id: session.user!.id },
  });
  return res.json({ ok: true, profile });
}

export default withHandler({ methods: ["GET"], handler });
