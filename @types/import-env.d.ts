declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    NEXT_PUBLIC_TWILIO_ACCOUNT_SID: string;
    NEXT_PUBLIC_TWILIO_TOKEN: string;
    NEXT_PUBLIC_TWILIO_SID: string;
    NEXT_PUBLIC_PHONE_NUMBER: string;
    NEXT_PUBLIC_MAIL_ID: string;
    NEXT_PUBLIC_PASSWORD: string;
    NEXT_PUBLIC_COOKIE_PASSWORD: string;
  }
}
