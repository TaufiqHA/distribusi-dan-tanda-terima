const app = require("./app");
const PORT = process.env.PORT || 3000;
const distributionRoutes = require("./routes/distributionRoutes");
const db = require("./db");
const ejs = require("ejs");
const path = require("path");
const puppeteer = require("puppeteer");

app.use("/api/distribution", distributionRoutes);

// Ambil data distribusi berdasarkan token
app.get("/api/distribution/:token", async (req, res) => {
  const token = req.params.token;
  const data = await db("distributions").where({ token }).first();
  if (!data) return res.status(404).json({ error: "Data tidak ditemukan" });
  res.json(data);
});

// Simpan tanda terima
app.post("/api/receipt/:token", async (req, res) => {
  const token = req.params.token;
  const tanggalTerima = new Date().toISOString();
  await db("distributions")
    .where({ token })
    .update({ received_at: tanggalTerima });

  // generatePDF bisa dipanggil di sini
  await generatePDF(token);

  res.json({ success: true });
});

// Unduh PDF
app.get("/api/pdf/:token", async (req, res) => {
  const token = req.params.token;
  const data = await db("distributions").where({ token }).first();

  if (!data) {
    return res.status(404).json({ error: "Data tidak ditemukan" });
  }

  // Contoh data untuk inject ke template
  const renderData = {
    kode: data.kode || "QA09.01",
    penerima: data.penerima || "Riska Juliana",
    tipe: data.tipe,
    link: data.link,
    tanggalDiterima: new Date().toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    isi: data.isi,
    // Tambahkan properti lain sesuai kebutuhan
  };

  // Render HTML pakai EJS
  const html = await ejs.renderFile(
    path.join(__dirname, "template.html"),
    renderData
  );

  // Buat PDF dari HTML pakai Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", landscape: true });
  await browser.close();

  // Kirim PDF ke client
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=tanda-terima-${token}.pdf`
  );
  res.send(pdfBuffer);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
