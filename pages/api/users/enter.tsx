// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/client/client";
import withHandler, {
  ResponesType,
  SessionData,
} from "@/libs/server/withHandler";
import twilio from "twilio";
import smtpTransport from "@/libs/server/email";
import { IronSession } from "iron-session";

const twilioClient = twilio(
  process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
  process.env.NEXT_PUBLIC_TWILIO_TOKEN
);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponesType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user, //user를 적으면 스키마의 속성과 맞지 않으므로 ...user를 사용하여 user 안에 있는 속성들을 반영
          },
          create: {
            name: "jun",
            ...user,
          },
        },
      },
    },
  });
  if (phone) {
    //크래딧 낭비 방지를 위한 주석처리
    /*await twilioClient.messages.create({
      from: "+15179851026",
      to: process.env.NEXT_PUBLIC_PHONE_NUMBER!,
      body: `로그인 토큰은 ${payload}입니다.`,
    });*/
  }

  if (email) {
    const mailOptions = {
      from: process.env.NEXT_PUBLIC_MAIL_ID,
      to: email,
      subject: "당근 인증 이메일",
      text: `인증 코드 : ${payload}`,
    };
    await smtpTransport.sendMail(mailOptions, (error, responses) => {
      if (error) {
        console.log(error);
        return null;
      } else {
        console.log(responses);
        return null;
      }
    });
    smtpTransport.close();
  }
  return res.json({
    ok: true,
  });
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
