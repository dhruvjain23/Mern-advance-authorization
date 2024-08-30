// const { MailtrapClient } = require("mailtrap");

import {MailtrapClient} from 'mailtrap'
import dotenv from 'dotenv';

dotenv.config();

const TOKEN = "ca0e56c6e6d5199e99c518c19adfcbc8";
const ENDPOINT = "https://send.api.mailtrap.io/";

export const mailtrapClient = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN  });

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Mailtrap Test",
};

