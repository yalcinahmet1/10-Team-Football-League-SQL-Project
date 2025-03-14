<template>
  <div id="app">
    <h1>Stadyumlar Listesi</h1>
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Stadyum Adı</th>
          <th>Kapasite</th>
          <th>Şehir</th>
          <th>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stadyum in stadyumlar" :key="stadyum.StadyumID">
          <td>{{ stadyum.StadyumID }}</td>
          <td>{{ stadyum.StadyumAdi }}</td>
          <td>{{ stadyum.Kapasite }}</td>
          <td>{{ stadyum.Sehir }}</td>
          <td>
            <div class="button-container">
              <button
                @click="showUpdateDialog(stadyum)"
                class="button update-button"
              >
                Güncelle
              </button>
              <button
                @click="deleteStadyum(stadyum.StadyumID)"
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
        Yeni Stadyum Ekle
      </button>
    </div>

    <!-- Yeni Stadyum Ekleme Diyaloğu -->
    <div v-if="showAddDialog" class="dialog-overlay">
      <div class="dialog">
        <h2>Yeni Stadyum Ekle</h2>
        <form @submit.prevent="addStadyum">
          <div class="form-group">
            <label for="stadyumAdi">Stadyum Adı</label>
            <input
              type="text"
              v-model="newStadyum.StadyumAdi"
              id="stadyumAdi"
              required
            />
          </div>
          <div class="form-group">
            <label for="kapasite">Kapasite</label>
            <input
              type="number"
              v-model="newStadyum.Kapasite"
              id="kapasite"
              required
            />
          </div>
          <div class="form-group">
            <label for="sehir">Şehir</label>
            <input type="text" v-model="newStadyum.Sehir" id="sehir" required />
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

    <!-- Stadyum Güncelleme Diyaloğu -->
    <div v-if="showUpdateDialogFlag" class="dialog-overlay">
      <div class="dialog">
        <h2>Stadyum Güncelle</h2>
        <form @submit.prevent="submitUpdateForm">
          <div class="form-group">
            <label for="stadyumAdi-update">Stadyum Adı</label>
            <input
              type="text"
              v-model="currentStadyum.StadyumAdi"
              id="stadyumAdi-update"
              required
            />
          </div>
          <div class="form-group">
            <label for="kapasite-update">Kapasite</label>
            <input
              type="number"
              v-model="currentStadyum.Kapasite"
              id="kapasite-update"
              required
            />
          </div>
          <div class="form-group">
            <label for="sehir-update">Şehir</label>
            <input
              type="text"
              v-model="currentStadyum.Sehir"
              id="sehir-update"
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
      stadyumlar: [],
      showAddDialog: false,
      showUpdateDialogFlag: false,
      newStadyum: {
        StadyumAdi: "",
        Kapasite: "",
        Sehir: "",
      },
      currentStadyum: {
        StadyumID: "",
        StadyumAdi: "",
        Kapasite: "",
        Sehir: "",
      },
    };
  },
  mounted() {
    this.getStadyumlar();
  },
  methods: {
    getStadyumlar() {
      axios
        .get("http://localhost:5001/api/stadyumlar")
        .then((response) => {
          this.stadyumlar = response.data;
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    showUpdateDialog(stadyum) {
      this.currentStadyum = { ...stadyum };
      this.showUpdateDialogFlag = true;
    },
    updateStadyum(id) {
      axios
        .put(`http://localhost:5001/api/stadyumlar/${id}`, {
          StadyumAdi: this.currentStadyum.StadyumAdi,
          Kapasite: this.currentStadyum.Kapasite,
          Sehir: this.currentStadyum.Sehir,
        })
        .then(() => {
          this.getStadyumlar();
          this.showUpdateDialogFlag = false;
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    deleteStadyum(id) {
      axios
        .delete(`http://localhost:5001/api/stadyumlar/${id}`)
        .then(() => {
          this.getStadyumlar();
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    addStadyum() {
      axios
        .post("http://localhost:5001/api/stadyumlar", this.newStadyum)
        .then(() => {
          this.getStadyumlar();
          this.showAddDialog = false;
          this.newStadyum = { StadyumAdi: "", Kapasite: "", Sehir: "" };
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    submitUpdateForm() {
      this.updateStadyum(this.currentStadyum.StadyumID);
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
