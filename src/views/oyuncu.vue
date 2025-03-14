<template>
  <div id="app">
    <h1>Oyuncular Listesi</h1>
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Ad</th>
          <th>Soyad</th>
          <th>Takım ID</th>
          <th>Rating</th>
          <th>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="oyuncu in oyuncular" :key="oyuncu.OyuncuID">
          <td>{{ oyuncu.OyuncuID }}</td>
          <td>{{ oyuncu.Ad }}</td>
          <td>{{ oyuncu.Soyad }}</td>
          <td>{{ oyuncu.TakimID }}</td>
          <td>{{ oyuncu.Rating }}</td>
          <td>
            <div class="button-container">
              <button
                @click="showUpdateDialog(oyuncu)"
                class="button update-button"
              >
                Güncelle
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <div class="button-container">
      <button @click="showAddDialog = true" class="button add-button">
        Yeni Oyuncu Ekle
      </button>
    </div> -->

    <!-- Yeni Oyuncu Ekleme Diyaloğu -->
    <div v-if="showAddDialog" class="dialog-overlay">
      <div class="dialog">
        <h2>Yeni Oyuncu Ekle</h2>
        <form @submit.prevent="addOyuncu">
          <div class="form-group">
            <label for="ad">Ad</label>
            <input type="text" v-model="newOyuncu.Ad" id="ad" required />
          </div>
          <div class="form-group">
            <label for="soyad">Soyad</label>
            <input type="text" v-model="newOyuncu.Soyad" id="soyad" required />
          </div>
          <div class="form-group">
            <label for="takimID">Takım ID</label>
            <input
              type="number"
              v-model="newOyuncu.TakimID"
              id="takimID"
              required
            />
          </div>
          <div class="form-group">
            <label for="hiz">Hız</label>
            <input type="number" v-model="newOyuncu.Hiz" id="hiz" required />
          </div>
          <div class="form-group">
            <label for="sut">Şut</label>
            <input type="number" v-model="newOyuncu.Sut" id="sut" required />
          </div>
          <div class="form-group">
            <label for="pas">Pas</label>
            <input type="number" v-model="newOyuncu.Pas" id="pas" required />
          </div>
          <div class="form-group">
            <label for="dribbling">Dribbling</label>
            <input
              type="number"
              v-model="newOyuncu.Dribbling"
              id="dribbling"
              required
            />
          </div>
          <div class="form-group">
            <label for="defans">Defans</label>
            <input
              type="number"
              v-model="newOyuncu.Defans"
              id="defans"
              required
            />
          </div>
          <div class="form-group">
            <label for="fizik">Fizik</label>
            <input
              type="number"
              v-model="newOyuncu.Fizik"
              id="fizik"
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

    <!-- Oyuncu Güncelleme Diyaloğu -->
    <div v-if="showUpdateDialogFlag" class="dialog-overlay">
      <div class="dialog">
        <h2>Oyuncu Güncelle</h2>
        <form @submit.prevent="submitUpdateForm">
          <div class="form-group">
            <label for="ad-update">Ad</label>
            <input
              type="text"
              v-model="currentOyuncu.Ad"
              id="ad-update"
              required
            />
          </div>
          <div class="form-group">
            <label for="soyad-update">Soyad</label>
            <input
              type="text"
              v-model="currentOyuncu.Soyad"
              id="soyad-update"
              required
            />
          </div>
          <div class="form-group">
            <label for="takimID-update">Takım ID</label>
            <input
              type="number"
              v-model="currentOyuncu.TakimID"
              id="takimID-update"
              required
            />
          </div>
          <div class="form-group">
            <label for="hiz-update">Hız</label>
            <input
              type="number"
              v-model="currentOyuncu.Hiz"
              id="hiz-update"
              required
            />
          </div>
          <div class="form-group">
            <label for="sut-update">Şut</label>
            <input
              type="number"
              v-model="currentOyuncu.Sut"
              id="sut-update"
              required
            />
          </div>
          <div class="form-group">
            <label for="pas-update">Pas</label>
            <input
              type="number"
              v-model="currentOyuncu.Pas"
              id="pas-update"
              required
            />
          </div>
          <div class="form-group">
            <label for="dribbling-update">Dribbling</label>
            <input
              type="number"
              v-model="currentOyuncu.Dribbling"
              id="dribbling-update"
              required
            />
          </div>
          <div class="form-group">
            <label for="defans-update">Defans</label>
            <input
              type="number"
              v-model="currentOyuncu.Defans"
              id="defans-update"
              required
            />
          </div>
          <div class="form-group">
            <label for="fizik-update">Fizik</label>
            <input
              type="number"
              v-model="currentOyuncu.Fizik"
              id="fizik-update"
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
      oyuncular: [],
      showAddDialog: false,
      showUpdateDialogFlag: false,
      newOyuncu: {
        Ad: "",
        Soyad: "",
        TakimID: "",
        Hiz: "",
        Sut: "",
        Pas: "",
        Dribbling: "",
        Defans: "",
        Fizik: "",
      },
      currentOyuncu: {
        OyuncuID: "",
        Ad: "",
        Soyad: "",
        TakimID: "",
        Hiz: "",
        Sut: "",
        Pas: "",
        Dribbling: "",
        Defans: "",
        Fizik: "",
      },
    };
  },
  mounted() {
    this.getOyuncular();
  },
  methods: {
    getOyuncular() {
      axios
        .get("http://localhost:5001/api/oyuncular")
        .then((response) => {
          this.oyuncular = response.data;
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    showUpdateDialog(oyuncu) {
      this.currentOyuncu = { ...oyuncu };
      this.showUpdateDialogFlag = true;
    },
    updateOyuncu(id) {
      axios
        .put(`http://localhost:5001/api/oyuncular/${id}`, this.currentOyuncu)
        .then(() => {
          this.getOyuncular();
          this.showUpdateDialogFlag = false;
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    addOyuncu() {
      axios
        .post("http://localhost:5001/api/oyuncular", this.newOyuncu)
        .then(() => {
          this.getOyuncular();
          this.showAddDialog = false;
          this.newOyuncu = {
            Ad: "",
            Soyad: "",
            TakimID: "",
            Hiz: "",
            Sut: "",
            Pas: "",
            Dribbling: "",
            Defans: "",
            Fizik: "",
          };
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    submitUpdateForm() {
      this.updateOyuncu(this.currentOyuncu.OyuncuID);
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
