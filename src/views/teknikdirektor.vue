<template>
  <div id="app">
    <h1>Teknik Direktörler Listesi</h1>
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Ad</th>
          <th>Soyad</th>
          <th>Doğum Tarihi</th>
          <th>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="direktor in direktorler" :key="direktor.DirektörID">
          <td>{{ direktor.DirektörID }}</td>
          <td>{{ direktor.Ad }}</td>
          <td>{{ direktor.Soyad }}</td>
          <td>{{ direktor.DoğumTarihi }}</td>
          <td>
            <div class="button-container">
              <button
                @click="showUpdateDialog(direktor)"
                class="button update-button"
              >
                Güncelle
              </button>
              <button
                @click="deleteTeknikDirektor(direktor.DirektörID)"
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
        Yeni Teknik Direktör Ekle
      </button>
    </div>

    <!-- Yeni Teknik Direktör Ekleme Diyaloğu -->
    <div v-if="showAddDialog" class="dialog-overlay">
      <div class="dialog">
        <h2>Yeni Teknik Direktör Ekle</h2>
        <form @submit.prevent="addTeknikDirektor">
          <div class="form-group">
            <label for="ad">Ad</label>
            <input
              type="text"
              v-model="newTeknikDirektor.Ad"
              id="ad"
              required
            />
          </div>
          <div class="form-group">
            <label for="soyad">Soyad</label>
            <input
              type="text"
              v-model="newTeknikDirektor.Soyad"
              id="soyad"
              required
            />
          </div>
          <div class="form-group">
            <label for="dogumTarihi">Doğum Tarihi</label>
            <input
              type="date"
              v-model="newTeknikDirektor.DogumTarihi"
              id="dogumTarihi"
              required
            />
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

    <!-- Teknik Direktör Güncelleme Diyaloğu -->
    <div v-if="showUpdateDialogFlag" class="dialog-overlay">
      <div class="dialog">
        <h2>Teknik Direktör Güncelle</h2>
        <form @submit.prevent="submitUpdateForm">
          <div class="form-group">
            <label for="ad-update">Ad</label>
            <input
              type="text"
              v-model="currentTeknikDirektor.Ad"
              id="ad-update"
              required
            />
          </div>
          <div class="form-group">
            <label for="soyad-update">Soyad</label>
            <input
              type="text"
              v-model="currentTeknikDirektor.Soyad"
              id="soyad-update"
              required
            />
          </div>
          <div class="form-group">
            <label for="dogumTarihi-update">Doğum Tarihi</label>
            <input
              type="date"
              v-model="currentTeknikDirektor.DoğumTarihi"
              id="dogumTarihi-update"
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
      direktorler: [],
      showAddDialog: false,
      showUpdateDialogFlag: false,
      newTeknikDirektor: {
        Ad: "",
        Soyad: "",
        DoğumTarihi: "",
      },
      currentTeknikDirektor: {
        DirektörID: "",
        Ad: "",
        Soyad: "",
        DoğumTarihi: "",
      },
    };
  },
  mounted() {
    this.getTeknikDirektorler();
  },
  methods: {
    getTeknikDirektorler() {
      axios
        .get("http://localhost:5001/api/teknik_direktorler")
        .then((response) => {
          this.direktorler = response.data;
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    showUpdateDialog(direktor) {
      this.currentTeknikDirektor = { ...direktor };
      this.showUpdateDialogFlag = true;
    },
    updateTeknikDirektor(id) {
      axios
        .put(`http://localhost:5001/api/teknik_direktorler/${id}`, {
          Ad: this.currentTeknikDirektor.Ad,
          Soyad: this.currentTeknikDirektor.Soyad,
          DogumTarihi: this.currentTeknikDirektor.DogumTarihi,
        })
        .then(() => {
          this.getTeknikDirektorler();
          this.showUpdateDialogFlag = false;
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    deleteTeknikDirektor(id) {
      axios
        .delete(`http://localhost:5001/api/teknik_direktorler/${id}`)
        .then(() => {
          this.getTeknikDirektorler();
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    addTeknikDirektor() {
      axios
        .post(
          "http://localhost:5001/api/teknik_direktorler",
          this.newTeknikDirektor
        )
        .then(() => {
          this.getTeknikDirektorler();
          this.showAddDialog = false;
          this.newTeknikDirektor = { Ad: "", Soyad: "", DogumTarihi: "" };
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    submitUpdateForm() {
      this.updateTeknikDirektor(this.currentTeknikDirektor.DirektörID);
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
