import { NextApiRequest, NextApiResponse } from "next";

type Method = "GET" | "POST" | "DELETE";
type FnResult = (req: NextApiRequest, res: NextApiResponse) => void;

export default function withHandler(method: Method, fn: FnResult) {
  //넥스트js가 실행할 함수
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== method) {
      return res.status(405).end();
    }
    try {
      await fn(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
}
