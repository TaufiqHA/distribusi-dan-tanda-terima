<template>
  <div class="document-container">
    <div class="document-card">
      <div class="document-header">
        <h1>Tanda Terima Dokumen</h1>
        <div class="info-container">
          <div class="info-row">
            <div class="info-item">
              <span class="label">Kode Distribusi:</span>
              <span class="value">{{ distribusi.kode }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="label">Penerima:</span>
              <span class="value">{{ distribusi.penerima }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="label">Tipe Pengiriman:</span>
              <span class="value">{{ distribusi.tipe }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="label">Link Dokumen:</span>
              <a :href="distribusi.link" target="_blank" class="document-link">
                <i class="fas fa-file-alt"></i>
                Buka Dokumen
              </a>
            </div>
          </div>
          <div class="info-row">
            <span class="label">Isi Dokumen:</span>
            <div class="document-content">
              {{ distribusi.isi }}
            </div>
          </div>
        </div>
      </div>
      <div class="document-footer">
        <div class="checkbox-container">
          <input id="accept-document" type="checkbox" v-model="isAccepted" />
          <label for="accept-document"> Saya telah menerima dokumen ini </label>
        </div>
        <button
          @click="submit"
          :disabled="!isAccepted"
          :class="{ disabled: !isAccepted }"
          class="submit-button !rounded-button whitespace-nowrap"
        >
          Submit
        </button>
        <div v-if="showSuccessMessage" class="success-message">
          Dokumen berhasil dikonfirmasi. Terima kasih!
        </div>
      </div>
      <div v-if="done" class="document-info">
        <p>✔️ Tanda terima berhasil disimpan.</p>
        <a
          :href="downloadUrl"
          download
        >
          Download PDF Tanda Terima
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isAccepted: false,
      accepted: false,
      done: false,
      loading: true,
      error: "",
      distribusi: {},
      downloadUrl: "",
    };
  },
  async mounted() {
    const token = this.$route.params.token;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/distribution/${token}`
      );
      this.distribusi = res.data;
    } catch (err) {
      this.error = "Data tidak ditemukan.";
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async submit() {
      const token = this.$route.params.token;
      if (this.isAccepted) {
        try {
          await axios.post(
            `http://localhost:3000/api/distribution/submit/${token}`
          );
          this.downloadUrl = `http://localhost:3000/api/pdf/${token}`;
          this.done = true;
        } catch (err) {
          alert("Gagal submit tanda terima");
        }
      }
    },
  },
};
</script>

<style scoped>
/* Import Google Fonts */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap");
/* Base font settings */
* {
  font-family: "Inter", sans-serif;
}
.document-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 3rem 1rem;
}

.document-card {
  max-width: 28rem;
  width: 100%;
  background-color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
}

.document-header {
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.document-header h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: 1.5rem;
}

.info-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.value {
  font-size: 0.875rem;
  color: #111827;
}

.document-link {
  font-size: 0.875rem;
  color: #2563eb;
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;
}

.document-link:hover {
  color: #1d4ed8;
}

.document-link i {
  margin-right: 0.25rem;
}

.document-content {
  margin-top: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  padding: 1rem;
  font-size: 0.875rem;
  font-family: monospace;
  color: #1f2937;
  overflow: auto;
  max-height: 8rem;
}

.document-footer {
  padding: 1.5rem 2rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.checkbox-container input[type="checkbox"] {
  height: 1rem;
  width: 1rem;
  color: #2563eb;
  border-color: #d1d5db;
  border-radius: 0.25rem;
  cursor: pointer;
}

.checkbox-container input[type="checkbox"]:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.checkbox-container label {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.submit-button {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #2563eb;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
}

.submit-button:hover {
  background-color: #1d4ed8;
}

.submit-button:focus {
  outline: none;
}

.submit-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.success-message {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #059669;
  text-align: center;
}

.document-info {
  padding: 1rem 2rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
}

.document-info p:last-child {
  margin-top: 0.25rem;
}
</style>
