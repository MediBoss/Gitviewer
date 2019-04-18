
const nodemailer = require('nodemailer')

// Helper function to email the user whose profile was viewed
exports.emailUser = async function (current_user, user_viewed) {
  
  // set up the email service
  var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
          user: `${process.env.GITVIWR_ACCOUNT_EMAIL}`,
          pass: `${process.env.GITVIWR_ACCOUNT_PASSWORD}`
      }
  });

  console.log(user_viewed.name);
  

  // setup email data
  let mailOptions = {
    from: `${process.env.GITVIWR_ACCOUNT_EMAIL}`,
    to: user_viewed.email,
    subject: "Someone has viewed your Github profile",
    text: "Hello " + user_viewed.name + ", " + current_user + " has viewed Your Github Handle " + user_viewed.login+ ". You now have a total of " + user_viewed.view_count + " Github viewers."
  };

  await transporter.sendMail(mailOptions)
}
