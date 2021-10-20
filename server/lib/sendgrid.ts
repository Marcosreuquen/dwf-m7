// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail(
  to: string,
  tel,
  petName: string,
  report: string
) {
  return await sgMail.send({
    to, // Change to your recipient
    from: "marcosreuquendiaz@gmail.com", // Change to your verified sender
    subject: `Someone find your pet: ${petName}`,
    text: `Someone let this report about yout pet: ${petName}.\n ${report}\n You can contact with the reporter on: ${tel}`,
    html: `<strong>Someone let this report about yout pet: ${petName}.\n ${report}\n You can contact with the reporter on: ${tel}</strong>`,
  });
}
