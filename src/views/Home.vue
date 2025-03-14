<template>
  <div id="home">
    <h1>Şampiyon Takım</h1>
    <p v-if="champion">Tebrikler, {{ champion }} şampiyon oldu! 🎉🎆🎇</p>
    <p v-else>Puan tablosu yükleniyor...</p>
    <p>Şampiyonlar Ligi'nde Temsilcimize Başarılar!</p>

    <img :src="logo" alt="Logo" />
  </div>
</template>
  
  <script>
import axios from "axios";

import logo from "@/assets/logo.jpg"; // Import the image

export default {
  name: "HomePage",
  data() {
    return {
      champion: "",
      logo: logo,
    };
  },
  mounted() {
    this.fetchChampion();
  },
  methods: {
    fetchChampion() {
      axios
        .get("http://localhost:5001/api/puanTablosu")
        .then((response) => {
          if (response.data.length > 0) {
            this.champion = response.data[0].TakimAdi;
          } else {
            this.champion = "Bilinmiyor";
          }
        })
        .catch((error) => {
          console.error("Puan tablosu alınamadı:", error);
          this.champion = "Hata oluştu";
        });
    },
  },
};
</script>
  
  <style scoped>
#home {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1 {
  font-size: 2em;
  margin-bottom: 20px;
}

p {
  font-size: 1.2em;
}
</style>
  