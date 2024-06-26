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
  if (req.method === "POST") {
    const { name, price, description } = req.body;
    const stream = await client.stream.create({
      data: {
        name,
        price: price,
        description,
        user: {
          connect: {
            id: session.user?.id,
          },
        },
      },
    });
    res.json({ ok: true, stream });
  }
  if (req.method === "GET") {
    const streams = await client.stream.findMany({
      take: 10, //목록에서 반환할 개체 수를 지정
      skip: 10, //n페이지로 갈 경우 n*10개를 건너뜀
    });
    res.json({ ok: true, streams });
  }
}

export default withHandler({ methods: ["GET", "POST"], handler });
