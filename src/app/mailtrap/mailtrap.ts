import {MailtrapClient} from "mailtrap";
import dotenv from "dotenv";
import config from "../config";

dotenv.config();
 
export const client = new MailtrapClient({token: config.mailtrap_key! });

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "azad",
};