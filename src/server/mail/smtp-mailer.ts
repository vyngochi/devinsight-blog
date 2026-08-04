import "server-only";

import nodemailer from "nodemailer";
import { absoluteUrl } from "@/config/site";

function getSmtpConfiguration() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM } =
    process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !EMAIL_FROM)
    return null;

  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    from: EMAIL_FROM,
  };
}

export function isSmtpConfigured() {
  return getSmtpConfiguration() !== null;
}

export async function sendEmailLoginCode(email: string, code: string) {
  const configuration = getSmtpConfiguration();
  if (!configuration) throw new Error("SMTP is not configured.");

  const transport = nodemailer.createTransport(configuration);
  await transport.sendMail({
    from: configuration.from,
    to: email,
    subject: "Mã đăng nhập DevInsight",
    text: `Mã đăng nhập DevInsight của bạn là ${code}. Mã có hiệu lực trong 10 phút.`,
    html: `<p>Mã đăng nhập DevInsight của bạn là:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p>Mã có hiệu lực trong 10 phút. Không chia sẻ mã này với bất kỳ ai.</p>`,
  });
}

export async function sendCommunityDigestEmail(input: {
  email: string;
  name: string | null;
  title: string;
  slug: string;
  answerCount: number;
}) {
  const configuration = getSmtpConfiguration();
  if (!configuration) throw new Error("SMTP is not configured.");

  const transport = nodemailer.createTransport(configuration);
  const answerLabel =
    input.answerCount === 1
      ? "một phản hồi mới"
      : `${input.answerCount} phản hồi mới`;
  const questionUrl = absoluteUrl(`/community/${input.slug}`);
  const greeting = input.name?.trim() || "bạn";
  await transport.sendMail({
    from: configuration.from,
    to: input.email,
    subject: `Cộng đồng DevInsight có ${answerLabel} cho câu hỏi của bạn`,
    text: `Chào ${greeting},\n\nCâu hỏi “${input.title}” có ${answerLabel}.\nXem và phản hồi tại: ${questionUrl}\n\nDevInsight`,
    html: `<p>Chào ${greeting},</p><p>Câu hỏi <strong>${input.title}</strong> có <strong>${answerLabel}</strong>.</p><p><a href="${questionUrl}">Xem câu hỏi và phản hồi</a></p><p>DevInsight</p>`,
  });
}
