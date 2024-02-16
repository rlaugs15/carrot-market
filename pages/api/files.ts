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
  const formData = new FormData();
  formData.append("requireSignedURLs", "true");
  formData.append("metadata", JSON.stringify({ key: "value" }));

  const response = await (
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.NEXT_PUBLIC_CF_ID}/images/v2/direct_upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CF_TOKEN}`,
        },
        body: formData,
      }
    )
  ).json();
  console.log(response);
  res.json({ ok: true, ...response.result });
}
//데이터를 mutate하는게 아니라 URL만 요청하므로 GET 요청
export default withHandler({ methods: ["GET"], handler });
