import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/client/client";
import withHandler, {
  ResponesType,
  SessionData,
} from "@/libs/server/withHandler";
import { getIronSession, IronSession } from "iron-session";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponesType>,
  session: IronSession<SessionData>
) {
  const { question, latitude, longitude } = req.body;
  if (req.method === "POST") {
    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: session.user!.id,
          },
        },
      },
    });
    res.json({ ok: true, post });
  }
  if (req.method === "GET") {
    const { latitude, longitude } = req.query; //req.body와 충돌을 피하기 위해 지역변수로 기입
    const posts = await client.post.findMany({
      include: {
        user: {
          select: {
            id: true, //사용자 페이지에 대한 링크를 만들 때 map의 키로 사용
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: { Wonderings: true, Answers: true },
        },
      },
      where: {
        latitude: {
          gte: Number(latitude) - 0.01,
          lte: Number(latitude) + 0.01,
        },
        longitude: {
          gte: Number(longitude) - 0.01,
          lte: Number(longitude) + 0.01,
        },
      },
    });
    res.json({ ok: true, posts });
  }
}

export default withHandler({ methods: ["GET", "POST"], handler });
