import Query from "../models/Query";

export const getQueries = async (req, res) => {
  const secret = req.headers["x-worker-secret"];

  if (secret !== process.env.WORKER_SECRET) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const docs = await Query.find({ active: true }).select("query -_id");

  return res.json({
    success: true,
    queries: docs.map((d) => d.query),
  });
};

export const createQueries = async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string" || query.trim().length < 3) {
    return res.status(400).json({
      status: false,
      message: "Invalid query.",
    });
  }

  const qTrim = query.trim().toLowerCase();

  const doc = await Query.findOneAndUpdate(
    { query: qTrim },
    { $setOnInsert: { query: qTrim }, $set: { active: true } },
    { upsert: true, new: true }
  );

  res.status(200).json({
    success: true,
    query: doc.query,
  });
};
