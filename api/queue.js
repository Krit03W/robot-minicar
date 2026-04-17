let queue = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    queue = req.body.steps || [];
    return res.status(200).json({ ok: true });
  }

  if (req.method === "GET") {
    const data = { steps: queue };
    queue = [];
    return res.status(200).json(data);
  }

  res.status(405).end();
}