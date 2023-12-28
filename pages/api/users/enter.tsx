// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/client/client";
import withHandler, { ResponesType } from "@/libs/server/withHandler";
import twilio from "twilio";
import smtpTransport from "@/libs/server/email";

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
            ...user, //phone과 email이 둘 다 있을 경우를 위해 ...연산자
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
    const result = await smtpTransport.sendMail(
      mailOptions,
      (error, responses) => {
        if (error) {
          console.log(error);
          return null;
        } else {
          console.log(responses);
          return null;
        }
      }
    );
    smtpTransport.close();
  }
  return res.json({
    ok: true,
  });
}

export default withHandler("POST", handler);
