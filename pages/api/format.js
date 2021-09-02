// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
const { format } = require("astyle");
export default async function handler(req, res) {
  const text = req.body;
  let formatted_text = await format(text);
  res.status(200).json({ data: formatted_text });
}
