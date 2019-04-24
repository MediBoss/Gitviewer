
const nodemailer = require('nodemailer')

/** Helper function to email a registered user.
 * @param {*} current_user - the name of user who has viewed a specific github handle.
 * @param {*} user_viewed - the user whose profile was viewed.
 */
exports.emailUser = async function (current_user, user_viewed) {
  
  // set up the email service with gitviwr gmail credentials
  var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
          user: `${process.env.GITVIWR_ACCOUNT_EMAIL}`,
          pass: `${process.env.GITVIWR_ACCOUNT_PASSWORD}`
      }
  });

  // sets up subject, sender, receiver, and body of the email
  let mailOptions = {
    from: `${process.env.GITVIWR_ACCOUNT_EMAIL}`,
    to: user_viewed.email,
    subject: "Someone has just viewed your Github profile",
    text: "Hello " + user_viewed.name + ", " + current_user + " has viewed Your Github Handle " + user_viewed.login+ ". You now have a total of " + user_viewed.view_count + " Github viewers."
  };

  // sends the email
  await transporter.sendMail(mailOptions)
}
