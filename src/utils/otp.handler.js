import speakeasy from 'speakeasy';
import sendEmail from "../utils/mail.handler.js"


export function generateOtp() {
  // Generate a new secret key
  const secret = speakeasy.generateSecret();

  // Generate the OTP code based on the secret key
  const otp = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32',
    digits: 4
  });
  
  // Return the generated OTP as a response
  return otp ;
  
}



export function verifyOtp(otp) {
  const secret = generateOtp()

  const isValid = verify({
    secret: secret,
    encoding: "base32",
    token: otp
  });

  return isValid;
 
}


// const sendOtpVerification = async () => {
//   try{
//     const newOtpverication = await new userOtpVerifcation{
//       userId: user._id,
//       otp: otp,
//       createdAt: Date.now(),
//       expiresAt: Date.now() + 3600000
//     });
//     await newOtpverication.save()
//     await sendEmail(user.email, "Mealy Account", `This is your account token.\n\n  ${generateOtp()} \n\n\n "Your account has been created successfully`)
//   }catch(error){

//   }
// }
