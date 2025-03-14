<template>
  <div id="app">
    <h1>Takımlar Listesi</h1>
    <table border="1">
      <thead>
        <tr>
          <th>Takım ID</th>
          <th>Takım Adı</th>
          <th>Kuruluş Yılı</th>
          <th>Takım Gücü</th>
          <th>Stadyum ID</th>
          <th>Teknik Direktör ID</th>
          <th>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="takim in takimlar" :key="takim.TakimID">
          <td>{{ takim.TakimID }}</td>
          <td>{{ takim.TakimAdi }}</td>
          <td>{{ takim.KurulusYili }}</td>
          <td>{{ takim.TakimGucu }}</td>
          <td>{{ takim.StadyumID }}</td>
          <td>{{ takim.TDID }}</td>
          <td>
            <div class="button-container">
              <button
                @click="updateTakim(takim.TakimID)"
                class="button update-button"
              >
                Güncelle
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Takım Güncelleme Diyaloğu -->
    <div v-if="showUpdateDialog" class="dialog-overlay">
      <div class="dialog">
        <h2>Takım Güncelle</h2>
        <form @submit.prevent="submitUpdateTakim">
          <div class="form-group">
            <label for="stadyumID">Stadyum ID</label>
            <input
              type="number"
              v-model="selectedTakim.StadyumID"
              id="stadyumID"
              required
            />
          </div>
          <div class="form-group">
            <label for="tdID">Teknik Direktör ID</label>
            <input
              type="number"
              v-model="selectedTakim.TDID"
              id="tdID"
              required
            />
          </div>
          <div class="button-container">
            <button type="submit" class="button update-button">Güncelle</button>
            <button
              type="button"
              @click="showUpdateDialog = false"
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
  name: "TakimListesi",
  data() {
    return {
      takimlar: [],
      showUpdateDialog: false,
      selectedTakim: {
        TakimID: null,
        StadyumID: "",
        TDID: "",
      },
    };
  },
  mounted() {
    this.getTakimlar();
  },
  methods: {
    getTakimlar() {
      axios
        .get("http://localhost:5001/api/takimlar")
        .then((response) => {
          this.takimlar = response.data;
        })
        .catch((error) => {
          console.error("Takım bilgileri alınırken hata oluştu:", error);
        });
    },
    updateTakim(takimID) {
      const takim = this.takimlar.find((t) => t.TakimID === takimID);
      this.selectedTakim = { ...takim };
      this.showUpdateDialog = true;
    },
    submitUpdateTakim() {
      axios
        .put(
          `http://localhost:5001/api/takimlar/${this.selectedTakim.TakimID}`,
          {
            StadyumID: this.selectedTakim.StadyumID,
            TDID: this.selectedTakim.TDID,
          }
        )
        .then(() => {
          this.getTakimlar();
          this.showUpdateDialog = false;
        })
        .catch((error) => {
          console.error("Takım güncellenirken hata oluştu:", error);
        });
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
