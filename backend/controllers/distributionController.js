const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const generatePDF = require("../utils/pdfGenerator");

exports.createDistribution = async (req, res) => {
  const { kode, penerima, tipe, link, isi } = req.body;
  const token = uuidv4();

  await db("distributions").insert({
    kode,
    penerima,
    tipe,
    link,
    isi,
    token,
    status: "pending",
  });

  res.json({ message: "Distribusi dibuat", link: `/receipt/${token}` });
};

exports.getReceiptByToken = async (req, res) => {
  const token = req.params.token;
  const distribusi = await db("distributions").where({ token }).first();

  if (!distribusi)
    return res.status(404).json({ error: "Data tidak ditemukan" });
  res.json(distribusi);
};

exports.submitReceipt = async (req, res) => {
  const token = req.params.token;
  const now = new Date().toISOString();

  const distribusi = await db("distributions").where({ token }).first();
  if (!distribusi)
    return res.status(404).json({ error: "Data tidak ditemukan" });

  await db("distributions")
    .where({ token })
    .update({ status: "done", tanggal_terima: now });

  const updatedDistribusi = { ...distribusi, tanggal_terima: now };
  const pdfPath = await generatePDF(updatedDistribusi);

  await db("distributions").where({ token }).update({ pdf_path: pdfPath });

  res.json({ message: "Tanda terima disimpan & PDF dibuat", pdf: pdfPath });
};
