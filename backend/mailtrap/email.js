import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email, verificationToken)=>{
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Verify Your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category:"Email verification"
        })
        console.log("Email sent successfully",response) 
    } catch (error) {
        console.error("Erroe sending in verification", error)
    }
}

export const sendWelcomeEmail = async (email,name) =>{
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            template_uuid: "5c1ff9e3-0028-4ce6-b9c5-b38f189311fa",
            template_variables: {
                "company_info_name": "19 Restaraunts",
                "name": name
              }

        })
        console.log("Welcome Email sent successfully")
    } catch (error) {
        console.log("Error sending welcome email", error)
    }
}

export const sendForgotPassEmail = async (email, resetURL) =>{
    const recipient =[{email}];

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject: "Reset Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}',resetURL),
            category:"Forgot"
        })
        console.log("Forgot Password email sent successfully",response)  
    } catch (error) {
        console.log("Error in sending the dorgot pass email",error)
    }
}

export const sendResetSuccessfullEmail = async (email)=>{
    const recipient= [{email}];
    try {
        const response =await mailtrapClient.send({
            from : sender,
            to: recipient,
            subject: "Reset password successfull",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Reset Password Successfull"
        })
        console.log("Forgot Password email sent successfully",response) 
    } catch (error) {
        console.log("Error in sending the SRM",error)
    }
}