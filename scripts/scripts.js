
const nodemailer = require('nodemailer')

var current_user = {
  name: "Medi Assumani",
  github_handle: "MediBoss",
  email_address: process.env.MEDI_EMAIL
}

// Helper function to email the user whose profile was viewed
exports.emailUser = async function (github_handle, target_email) {

  // set up the email service
  var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
          user: `${process.env.GITVIWR_ACCOUNT_EMAIL}`,
          pass: `${process.env.GITVIWR_ACCOUNT_PASSWORD}`
      }
  });

  // setup email data
  let mailOptions = {
    from: `${process.env.GITVIWR_ACCOUNT_EMAIL}`,
    to: target_email,
    subject: "Gitviwr Notification",
    text: current_user.name+" has viewed Your Github Handle "+ github_handle
  };

  let info = await transporter.sendMail(mailOptions)
}
