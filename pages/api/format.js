// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const text = req.body;
  console.log(typeof text);
  let formatted_text = await format(text);
  res.status(200).json({ data: formatted_text });
}
