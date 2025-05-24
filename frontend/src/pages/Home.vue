<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="form-container">
    <div class="form-wrapper">
      <div class="form-header">
        <h1>Form Distribusi Dokumen</h1>
        <p>Silakan isi form berikut untuk mendistribusikan dokumen Anda</p>
      </div>
      <form @submit.prevent="submitForm" class="distribution-form">
        <!-- Kode Distribusi -->
        <div class="form-group">
          <label for="kode-distribusi">
            Kode Distribusi <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <input
              type="text"
              id="kode-distribusi"
              v-model="formData.kode"
              class="form-input readonly"
              placeholder="DIS-2025-001"
              readonly
            />
            <i class="fas fa-lock icon-lock"></i>
          </div>
          <p class="helper-text">Kode distribusi dibuat secara otomatis</p>
        </div>
        <!-- Penerima -->
        <div class="form-group">
          <label for="penerima">
            Penerima <span class="required">*</span>
          </label>
          <input
            type="text"
            id="penerima"
            v-model="formData.penerima"
            class="form-input"
            :class="{ error: errors.penerima }"
            placeholder="Masukkan nama penerima"
          />
          <p v-if="errors.penerima" class="error-message">
            {{ errors.penerima }}
          </p>
        </div>
        <!-- Tipe Pengiriman -->
        <div class="form-group">
          <label for="tipe-pengiriman">
            Tipe Pengiriman <span class="required">*</span>
          </label>
          <div class="custom-select">
            <div
              class="select-trigger"
              :class="{
                error: errors.tipe,
                active: showDropdown,
              }"
              @click="toggleDropdown"
            >
              <span :class="{ placeholder: !formData.tipe }">
                {{ formData.tipe || "Pilih tipe pengiriman" }}
              </span>
              <i
                class="fas fa-chevron-down"
                :class="{ rotate: showDropdown }"
              ></i>
            </div>
            <div v-if="showDropdown" class="select-dropdown">
              <ul>
                <li
                  v-for="option in tipePengirimanOptions"
                  :key="option"
                  @click="selectTipePengiriman(option)"
                >
                  {{ option }}
                </li>
              </ul>
            </div>
          </div>
          <p v-if="errors.tipePengiriman" class="error-message">
            {{ errors.tipePengiriman }}
          </p>
        </div>
        <!-- Link Google Drive -->
        <div class="form-group">
          <label for="link-drive">
            Link Google Drive <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <input
              type="url"
              id="link-drive"
              v-model="formData.link"
              class="form-input"
              :class="{ error: errors.link }"
              placeholder="Masukkan link Google Drive"
            />
            <i class="fas fa-link icon-link"></i>
          </div>
          <p v-if="errors.link" class="error-message">
            {{ errors.link }}
          </p>
        </div>
        <!-- Informasi Dokumen -->
        <div class="form-group">
          <label for="informasi-dokumen">
            Informasi Dokumen <span class="required">*</span>
          </label>
          <textarea
            id="informasi-dokumen"
            v-model="formData.isi"
            rows="4"
            class="form-textarea"
            :class="{ error: errors.isi }"
            placeholder="Masukkan informasi detail dokumen"
          ></textarea>
          <p v-if="errors.isi" class="error-message">
            {{ errors.isi }}
          </p>
        </div>
        <!-- Buttons -->
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="resetForm">
            Batal
          </button>
          <button type="submit" class="btn btn-primary">Simpan</button>
        </div>
      </form>
      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-body">
            <div class="success-icon">
              <i class="fas fa-check"></i>
            </div>
            <h3>Distribusi Berhasil</h3>
            <p v-if="generatedLink">
              Link dokumen:
              <a :href="generatedLink" target="_blank">{{ generatedLink }}</a>
            </p>
            <button
              @click="showSuccessModal = false"
              class="btn btn-primary btn-block"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      formData: {
        kode: "",
        penerima: "",
        tipe: "",
        link: "",
        isi: "",
      },
      errors: {
        penerima: "",
        tipe: "",
        link: "",
        isi: "",
      },
      tipePengirimanOptions: ["Email", "Whatsapp"],
      showDropdown: false,
      showSuccessModal: false,
      generatedLink: "",
    };
  },
  mounted() {
    document.addEventListener("click", this.closeDropdownOnClickOutside);
    this.generateDistributionCode();
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeDropdownOnClickOutside);
  },
  methods: {
    generateDistributionCode() {
      const year = new Date().getFullYear();
      const randomNum = Math.floor(Math.random() * 900) + 100;
      this.formData.kode = `DIS-${year}-${randomNum}`;
    },
    toggleDropdown(event) {
      event.stopPropagation();
      this.showDropdown = !this.showDropdown;
    },
    closeDropdownOnClickOutside(event) {
      const dropdown = this.$el.querySelector(".relative");
      if (dropdown && !dropdown.contains(event.target)) {
        this.showDropdown = false;
      }
    },
    selectTipePengiriman(option) {
      this.formData.tipe = option;
      this.showDropdown = false;
      this.errors.tipe = "";
    },
    validateForm() {
      let isValid = true;
      this.errors = {
        penerima: "",
        tipe: "",
        link: "",
        isi: "",
      };
      if (!this.formData.penerima.trim()) {
        this.errors.penerima = "Nama penerima wajib diisi";
        isValid = false;
      }
      if (!this.formData.tipe) {
        this.errors.tipe = "Tipe pengiriman wajib dipilih";
        isValid = false;
      }
      if (!this.formData.link.trim()) {
        this.errors.link = "Link Google Drive wajib diisi";
        isValid = false;
      } else if (!this.isValidUrl(this.formData.link)) {
        this.errors.link = "Format URL tidak valid";
        isValid = false;
      }
      if (!this.formData.isi.trim()) {
        this.errors.isi = "Informasi dokumen wajib diisi";
        isValid = false;
      } else if (this.formData.isi.trim().length < 10) {
        this.errors.isi = "Informasi dokumen minimal 10 karakter";
        isValid = false;
      }
      return isValid;
    },
    isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch (error) {
        return false;
      }
    },
    async submitForm() {
      if (this.validateForm()) {
        try {
          const res = await axios.post(
            "http://localhost:3000/api/distribution",
            this.formData
          );
          this.generatedLink = `http://localhost:5173${res.data.link}`;
          await navigator.clipboard.writeText(this.generatedLink);
          console.log("Form submitted:", this.formData);
          console.log("Generated link:", this.generatedLink);
          this.showSuccessModal = true;
        } catch (err) {
          console.error("Gagal mengirim data:", err);
        }
      }
    },
    resetForm() {
      this.generateDistributionCode();
      this.formData.penerima = "";
      this.formData.tipe = "";
      this.formData.link = "";
      this.formData.isi = "";
      this.errors = {
        penerima: "",
        tipe: "",
        link: "",
        isi: "",
      };
      this.generatedLink = "";
      this.showSuccessModal = false;
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
.form-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 48px 16px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.form-wrapper {
  max-width: 36rem;
  width: 100%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 40px;
  margin: 0 auto;
}
.form-header {
  margin-bottom: 32px;
}
.form-header h1 {
  font-family: "Poppins", sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  letter-spacing: -0.025em;
}
.form-header p {
  font-family: "Inter", sans-serif;
  font-size: 15px;
  color: #4b5563;
  line-height: 1.5;
}
.distribution-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
label {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  letter-spacing: -0.01em;
}
.required {
  color: #ef4444;
}
.input-wrapper {
  position: relative;
}
.form-input,
.form-textarea,
.select-trigger {
  width: 95%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: "Inter", sans-serif;
  transition: all 0.2s;
  letter-spacing: -0.01em;
  background-color: #fff;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #9ca3af;
}
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
.form-input.error,
.form-textarea.error,
.select-trigger.error {
  border-color: #ef4444;
}
.form-input.readonly {
  background-color: #f3f4f6;
  color: #4b5563;
}
.helper-text {
  font-family: "Inter", sans-serif;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}
.error-message {
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
}
.icon-lock,
.icon-link {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}
.custom-select {
  position: relative;
}
.select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.select-trigger.active {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
.select-trigger .placeholder {
  color: #9ca3af;
}
.select-trigger i {
  transition: transform 0.2s;
}
.select-trigger i.rotate {
  transform: rotate(180deg);
}
.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
.select-dropdown ul {
  max-height: 240px;
  overflow-y: auto;
  padding: 4px 0;
}
.select-dropdown li {
  padding: 8px 16px;
  cursor: pointer;
  white-space: nowrap;
}
.select-dropdown li:hover {
  background-color: #eff6ff;
}
.form-textarea {
  min-height: 100px;
  resize: vertical;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 16px;
}
.btn {
  font-family: "Inter", sans-serif;
  padding: 12px 24px;
  font-weight: 500;
  font-size: 14px;
  border-radius: 8px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: -0.01em;
  min-width: 100px;
}
.btn-primary {
  background-color: #2563eb;
  color: white;
  border: none;
}
.btn-primary:hover {
  background-color: #1d4ed8;
}
.btn-secondary {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
}
.btn-secondary:hover {
  background-color: #f9fafb;
}
.btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
.btn-block {
  width: 100%;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 32px;
  max-width: 28rem;
  width: 100%;
}
.modal-body {
  text-align: center;
}
.success-icon {
  width: 64px;
  height: 64px;
  background-color: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.success-icon i {
  font-size: 24px;
  color: #16a34a;
}
.modal-body h3 {
  font-family: "Poppins", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  letter-spacing: -0.025em;
}
.modal-body p {
  font-family: "Inter", sans-serif;
  font-size: 15px;
  color: #4b5563;
  margin-bottom: 24px;
  line-height: 1.5;
}
/* Custom scrollbar */
.select-dropdown ul::-webkit-scrollbar {
  width: 6px;
}
.select-dropdown ul::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.select-dropdown ul::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}
.select-dropdown ul::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
/* Hide number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
