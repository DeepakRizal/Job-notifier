import Job from "../models/Job.js";

export const test = async (req, res, next) => {
  try {
    const body = req.body;

    const url = body.url || null;
    const sourceId = body.sourceId || null;

    let postedAt = null;

    if (body.postedAt) {
      const d = new Date(body.postedAt);

      if (!isNaN(d)) postedAt = d;
    }

    const doc = {
      title: body.title || "No title",
      company: body.company || "",
      location: body.location || "",
      description: body.description || "",
      url,
      source: body.source || "test",
      sourceId,
      postedAt,
      discoveredAt: new Date(),
      rawHTML: body.rawHTML,
    };

    // upsert by url if available, otherwise by sourceId, otherwise insert new
    const query = url
      ? { url }
      : sourceId
      ? { source: doc.source, sourceId }
      : { title: doc.title, company: doc.company };
    // findOneAndUpdate with upsert
    const job = await Job.findOneAndUpdate(
      query,
      { $set: doc },
      { upsert: true, new: true }
    );

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};
