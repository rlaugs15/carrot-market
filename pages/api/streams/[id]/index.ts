import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/client/client";
import withHandler, { ResponesType } from "@/libs/server/withHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponesType>
) {
  const { id } = req.query;
  const stream = await client.stream.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      Messages: {
        select: {
          id: true,
          message: true,
          user: {
            select: {
              id: true,
              avatar: true,
              name: true,
            },
          },
        },
      },
    },
  });
  if (!id && !stream) {
    return res.json({ ok: false, error: "해당 스트리밍을 찾을 수 없습니다." });
  }
  res.json({ ok: true, stream });
}

export default withHandler({ methods: ["GET"], handler });
