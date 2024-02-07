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
  if (req.method === "GET") {
    const profile = await client.user.findUnique({
      where: { id: session.user!.id },
    });
    return res.json({ ok: true, profile });
  }
  if (req.method === "POST") {
    const { name, email, phone } = req.body;
    const currentUser = await client.user.findUnique({
      where: {
        id: session.user?.id,
      },
    });
    if (email && email !== currentUser?.email) {
      const exists = Boolean(
        await client.user.findUnique({
          where: { email },
          select: {
            id: true,
          },
        })
      );
      if (exists) {
        return res.json({ ok: false, error: "이미 존재하는 이메일 입니다." });
      }
      await client.user.update({
        where: { id: session.user?.id },
        data: { email },
      });
      res.json({ ok: true });
    }
    if (phone && currentUser?.phone !== phone) {
      const exists = Boolean(
        await client.user.findUnique({
          where: { phone },
          select: {
            id: true,
          },
        })
      );
      if (exists) {
        return res.json({ ok: false, error: "이미 존재하는 번호 입니다." });
      }
      await client.user.update({
        where: { id: session.user?.id },
        data: { phone },
      });
      res.json({ ok: true });
    }
    if (name) {
      await client.user.update({
        where: {
          id: session.user?.id,
        },
        data: {
          name,
        },
      });
    }
    res.json({ ok: true });
  }
}

export default withHandler({ methods: ["GET", "POST"], handler });
