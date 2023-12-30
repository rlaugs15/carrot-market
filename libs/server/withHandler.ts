import { NextApiRequest, NextApiResponse } from "next";
import { getIronSession, IronSession } from "iron-session";

export interface ResponesType {
  ok: boolean;
  [key: string]: any; //NextApiResponse 콜 시그니쳐로 확인 가능
}

interface ConfigType {
  method: "GET" | "POST" | "DELETE";
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    session: IronSession<SessionData>
  ) => void;
  isPrivate?: boolean;
}

export interface SessionData {
  user?: {
    id: number;
  };
}
//인자가 많아지면 객체 형식으로 표현해주는것이 가독성에 좋다
export default function withHandler({
  method,
  handler,
  isPrivate = true, //기본값 지정
}: ConfigType) {
  //넥스트js가 실행할 함수
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const session = await getIronSession<SessionData>(req, res, {
      password: process.env.NEXT_PUBLIC_COOKIE_PASSWORD,
      cookieName: "carrotsession",
    });
    if (req.method !== method) {
      return res.status(405).end();
    }
    if (isPrivate && !session.user?.id) {
      return res.status(401).json({ ok: false, error: "로그인을 해주세요." });
    }
    try {
      await handler(req, res, session);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
}
