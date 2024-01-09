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
  const { name, price, description } = req.body;
  if (req.method === "GET") {
    const products = await client.product.findMany({});

    return res.json({ ok: true, products });
  }
  if (req.method === "POST") {
    const products = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        image: "1234",
        user: {
          connect: {
            id: session.user!.id,
          },
        },
      },
    });
    return res.json({ ok: true, products });
  }
}

export default withHandler({ methods: ["POST", "GET"], handler });
