import nodemailer from 'nodemailer'
import { env } from '../../../config/src'

const sender = nodemailer.createTransport({
    host : 'smtp.gmail.com',
    auth : {
      user : env.NODEMAILER_USER as string,
      pass : env.NODEMAILER_PASS as string  
    }
});



export default sender;