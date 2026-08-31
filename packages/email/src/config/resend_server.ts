import {Resend} from "resend"
import { env } from "../../../config/src"




const resend = new Resend(env.RESEND_API_KEY as string);
export default resend;