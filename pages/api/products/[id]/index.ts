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
  const { id } = req.query;
  const product = await client.product.findUnique({
    where: {
      id: +id!,
    },
    include: {
      user: {
        //판매자 정보 필요로 인해 상품과 관련된 유저정보 가져옴
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  //()안에 {}를 넣어서 객체로 리턴,
  //[ { name: { contains: 'galaxy' } }, { name: { contains: 's20' } }, ...] 반환
  //사실 이 부분은 어떤 머신러닝 알고리즘에 의해 분류를 하거나 검색을 할 것
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
    orderBy: { createdAt: "desc" }, //최근 상품 기준으로 4개 가져옴
    take: 10,
  });
  const isLiked = Boolean(
    await client.fav.findFirst({
      where: {
        productId: product?.id,
        userId: session.user?.id,
      },
      select: {
        id: true,
      },
    })
  );

  return res.json({ ok: true, product, isLiked, relatedProducts });
}

export default withHandler({ methods: ["GET"], handler });
