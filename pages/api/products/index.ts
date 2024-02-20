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
  const { name, price, description, image } = req.body;
  if (req.method === "GET") {
    const products = await client.product.findMany({
      include: {
        //include만 하면 전체 Favs 레코드를 불러오기에 좋은 방법은 아님. 숫자만 세면 된다.
        _count: {
          select: { Favs: true },
        },
      },
    });

    return res.json({ ok: true, products });
  }
  if (req.method === "POST") {
    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        image,
        user: {
          connect: {
            id: session.user!.id,
          },
        },
      },
    });
    return res.json({ ok: true, product });
  }
}

export default withHandler({ methods: ["POST", "GET"], handler });
