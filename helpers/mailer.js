
const nodemailer = require('nodemailer')

var current_user = {
  name: "Medi Assumani",
  github_handle: "MediBoss",
  email_address: process.env.MEDI_EMAIL
}

// Helper function to email the user whose profile was viewed
exports.emailUser = async function (github_handle, target_email, target_name, target_view_count) {

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
    subject: "Someone has viewd your Github profile",
    text: "Hello " + target_name + ",\n\n" + current_user.name + " has viewed Your Github Handle " + github_handle+ ". You now have a total of " + target_view_count + " Github viewers."
  };

  let emailInfo = await transporter.sendMail(mailOptions)
  console.log(emailInfo)
}
