// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/client/client";
import withHandler from "@/libs/server/withHandler";

function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body.email);
  return res.status(200).end();
}

export default withHandler("POST", handler);
