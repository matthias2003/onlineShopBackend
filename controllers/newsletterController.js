const mailtrap = require("mailtrap");
const { z } = require("zod");

exports.subscribeNewsletter = async (req, res) => {
    const token = process.env.EMAIL_API_KEY;
    const senderEmail = process.env.EMAIL_SENDER;
    const recipient = req.body.email;

    const emailSchema = z.string().email();

    try {
        emailSchema.parse(recipient);
    } catch (err) {
        return res.status(400).json({ status: false, message: "Invalid email format." });
    }

    const client = new mailtrap.MailtrapClient({ token: token });
    const sender = { name: "Sneaker Store", email: senderEmail };

    try {
        await client.send({
            from: sender,
            to: [{ email: recipient }],
            template_uuid: "ae54ea25-0d9a-4e4f-8d47-a5e103b5eba5",
            template_variables: {}
        });

        res.status(200).json({ status: true, message: "Subscription successful!" });
    } catch (err) {
        res.status(500).json({ status: false, message: "An error occurred while sending the email." });
    }
};
