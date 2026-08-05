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
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; background-color: #FFFDF5; color: #1E293B; padding: 40px 20px; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 2px solid #1E293B; border-radius: 12px; overflow: hidden; box-shadow: 4px 4px 0px 0px #1E293B;">
          <div style="background-color: #8B5CF6; border-bottom: 2px solid #1E293B; padding: 24px; text-align: center;">
            <h2 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">DevInsight</h2>
          </div>
          <div style="padding: 32px 24px;">
            <p style="font-size: 16px; margin-top: 0;">Chào bạn,</p>
            <p style="font-size: 16px;">Mã đăng nhập DevInsight của bạn là:</p>
            
            <div style="margin: 32px 0; text-align: center;">
              <span style="display: inline-block; background-color: #FBBF24; color: #1E293B; font-size: 32px; font-weight: 800; letter-spacing: 8px; padding: 16px 32px; border-radius: 8px; border: 2px solid #1E293B; box-shadow: 2px 2px 0px 0px #1E293B;">
                ${code}
              </span>
            </div>
            
            <p style="font-size: 14px; font-weight: 700; color: #1E293B; background-color: #F1F5F9; padding: 12px; border-radius: 8px; border: 1px dashed #1E293B;">
              ⚠️ Mã có hiệu lực trong 10 phút. Không chia sẻ mã này với bất kỳ ai.
            </p>
            
            <hr style="border: none; border-top: 2px dashed #CBD5E1; margin: 32px 0;" />
            <p style="font-size: 14px; color: #64748B; margin-bottom: 0;">
              Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.
            </p>
          </div>
        </div>
      </div>
    `,
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
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; background-color: #FFFDF5; color: #1E293B; padding: 40px 20px; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 2px solid #1E293B; border-radius: 12px; overflow: hidden; box-shadow: 4px 4px 0px 0px #1E293B;">
          <div style="background-color: #8B5CF6; border-bottom: 2px solid #1E293B; padding: 24px; text-align: center;">
            <h2 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">DevInsight</h2>
          </div>
          <div style="padding: 32px 24px;">
            <p style="font-size: 16px; margin-top: 0;">Chào <strong>${greeting}</strong>,</p>
            <p style="font-size: 16px;">Câu hỏi <strong>"${input.title}"</strong> của bạn vừa có <span style="background-color: #FBBF24; padding: 2px 6px; border-radius: 4px; font-weight: 700; border: 1px solid #1E293B;">${answerLabel}</span>.</p>
            
            <div style="margin: 32px 0; text-align: center;">
              <a href="${questionUrl}" style="display: inline-block; background-color: #34D399; color: #1E293B; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 8px; border: 2px solid #1E293B; box-shadow: 2px 2px 0px 0px #1E293B; font-size: 16px;">
                Xem phản hồi
              </a>
            </div>
            
            <hr style="border: none; border-top: 2px dashed #CBD5E1; margin: 32px 0;" />
            <p style="font-size: 14px; color: #64748B; margin-bottom: 0;">
              Email này được gửi tự động từ hệ thống Cộng đồng DevInsight.
            </p>
          </div>
        </div>
      </div>
    `,
  });
}
