import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/client/client";
import withHandler, {
  ResponesType,
  SessionData,
} from "@/libs/server/withHandler";
import { getIronSession } from "iron-session";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponesType>
) {
  const session = await getIronSession<SessionData>(req, res, {
    password: process.env.NEXT_PUBLIC_COOKIE_PASSWORD,
    cookieName: "carrotsession",
  });

  const profile = await client.user.findUnique({
    where: { id: session.user!.id },
  });
  res.json({ ok: true, profile });
}

export default withHandler({ method: "GET", handler });
