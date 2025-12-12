import Query from "../models/Query.js";

export const getQueries = async (req, res) => {
  const secret = req.headers["x-worker-secret"];

  if (secret !== process.env.WORKER_SECRET) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const docs = await Query.find({ active: true }).select("query owner -_id");

  return res.json({
    success: true,
    queries: docs.map((d) => ({
      query: d.query,
      owner: d.owner.toString(),
    })),
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

  // Require authenticated user
  if (!req.user || !req.user._id) {
    return res.status(401).json({
      status: false,
      message: "Authentication required.",
    });
  }

  const qTrim = query.trim().toLowerCase();
  const ownerId = req.user._id;

  const doc = await Query.findOneAndUpdate(
    { query: qTrim, owner: ownerId },
    {
      $setOnInsert: { query: qTrim, owner: ownerId },
      $set: { active: true },
    },
    { upsert: true, new: true }
  );

  res.status(200).json({
    success: true,
    query: doc.query,
    id: doc._id,
  });
};

export const getMyQueries = async (req, res) => {
    
  if (!req.user || !req.user._id) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const docs = await Query.find({ owner: req.user._id })
    .select("query active createdAt lastScrapedAt")
    .sort({ createdAt: -1 });

  return res.json({
    success: true,
    queries: docs.map((d) => ({
      _id: d._id.toString(),
      query: d.query,
      active: d.active,
      createdAt: d.createdAt,
      lastScrapedAt: d.lastScrapedAt,
    })),
  });
};

export const deleteQuery = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const { id } = req.params;

  const doc = await Query.findOne({ _id: id, owner: req.user._id });

  if (!doc) {
    return res.status(404).json({
      success: false,
      message: "Query not found or you don't have permission to delete it.",
    });
  }

  await Query.deleteOne({ _id: id });

  return res.json({
    success: true,
    message: "Query deleted successfully.",
  });
};

export const toggleQueryActive = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const { id } = req.params;
  const { active } = req.body;

  if (typeof active !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Invalid active value. Must be a boolean.",
    });
  }

  const doc = await Query.findOneAndUpdate(
    { _id: id, owner: req.user._id },
    { $set: { active } },
    { new: true }
  );

  if (!doc) {
    return res.status(404).json({
      success: false,
      message: "Query not found or you don't have permission to update it.",
    });
  }

  return res.json({
    success: true,
    query: {
      _id: doc._id.toString(),
      query: doc.query,
      active: doc.active,
      createdAt: doc.createdAt,
      lastScrapedAt: doc.lastScrapedAt,
    },
  });
};
