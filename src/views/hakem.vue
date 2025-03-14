<template>
  <div id="app">
    <h1>Hakemler Listesi</h1>
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Ad</th>
          <th>Soyad</th>
          <th>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="hakem in hakemler" :key="hakem.HakemID">
          <td>{{ hakem.HakemID }}</td>
          <td>{{ hakem.Ad }}</td>
          <td>{{ hakem.Soyad }}</td>
          <td>
            <div class="button-container">
              <button
                @click="showUpdateDialog(hakem)"
                class="button update-button"
              >
                Güncelle
              </button>
              <button
                @click="deleteHakem(hakem.HakemID)"
                class="button delete-button"
              >
                Sil
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="button-container">
      <button @click="showAddDialog = true" class="button add-button">
        Yeni Hakem Ekle
      </button>
    </div>

    <!-- Yeni Hakem Ekleme Diyaloğu -->
    <div v-if="showAddDialog" class="dialog-overlay">
      <div class="dialog">
        <h2>Yeni Hakem Ekle</h2>
        <form @submit.prevent="addHakem">
          <div class="form-group">
            <label for="ad">Ad</label>
            <input type="text" v-model="newHakem.Ad" id="ad" required />
          </div>
          <div class="form-group">
            <label for="soyad">Soyad</label>
            <input type="text" v-model="newHakem.Soyad" id="soyad" required />
          </div>
          <div class="button-container">
            <button type="submit" class="button add-button">Ekle</button>
            <button
              type="button"
              @click="showAddDialog = false"
              class="button cancel-button"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Hakem Güncelleme Diyaloğu -->
    <div v-if="showUpdateDialogFlag" class="dialog-overlay">
      <div class="dialog">
        <h2>Hakem Güncelle</h2>
        <form @submit.prevent="submitUpdateForm">
          <div class="form-group">
            <label for="ad-update">Ad</label>
            <input
              type="text"
              v-model="currentHakem.Ad"
              id="ad-update"
              required
            />
          </div>
          <div class="form-group">
            <label for="soyad-update">Soyad</label>
            <input
              type="text"
              v-model="currentHakem.Soyad"
              id="soyad-update"
              required
            />
          </div>
          <div class="button-container">
            <button type="submit" class="button update-button">Güncelle</button>
            <button
              type="button"
              @click="showUpdateDialogFlag = false"
              class="button cancel-button"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      hakemler: [],
      showAddDialog: false,
      showUpdateDialogFlag: false,
      newHakem: {
        Ad: "",
        Soyad: "",
      },
      currentHakem: {
        HakemID: "",
        Ad: "",
        Soyad: "",
      },
    };
  },
  mounted() {
    this.getHakemler();
  },
  methods: {
    getHakemler() {
      axios
        .get("http://localhost:5001/api/hakemler")
        .then((response) => {
          this.hakemler = response.data;
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    showUpdateDialog(hakem) {
      this.currentHakem = { ...hakem };
      this.showUpdateDialogFlag = true;
    },
    updateHakem(id) {
      axios
        .put(`http://localhost:5001/api/hakemler/${id}`, {
          Ad: this.currentHakem.Ad,
          Soyad: this.currentHakem.Soyad,
        })
        .then(() => {
          this.getHakemler();
          this.showUpdateDialogFlag = false;
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    deleteHakem(id) {
      axios
        .delete(`http://localhost:5001/api/hakemler/${id}`)
        .then(() => {
          this.getHakemler();
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    addHakem() {
      axios
        .post("http://localhost:5001/api/hakemler", this.newHakem)
        .then(() => {
          this.getHakemler();
          this.showAddDialog = false;
          this.newHakem = { Ad: "", Soyad: "" };
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    submitUpdateForm() {
      this.updateHakem(this.currentHakem.HakemID);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

table {
  width: 80%;
  margin: auto;
  border-collapse: collapse;
}

th,
td {
  padding: 8px 12px;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 10px 0;
}

.button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.update-button {
  background-color: #4caf50; /* Yeşil */
}

.delete-button {
  background-color: #f44336; /* Kırmızı */
}

.add-button {
  background-color: #008cba; /* Mavi */
}

.cancel-button {
  background-color: #9e9e9e; /* Gri */
}

/* Diyalog Stilleri */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
</style>
