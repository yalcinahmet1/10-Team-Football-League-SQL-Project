<template>
  <div class="puan-tablosu">
    <h1>Puan Tablosu</h1>
    <table v-if="puanTablosu && puanTablosu.length > 0">
      <thead>
        <tr>
          <th>Takım Adı</th>
          <th>Maç Sayısı</th>
          <th>Galibiyet</th>
          <th>Mağlubiyet</th>
          <th>Beraberlik</th>
          <th>Atılan Gol</th>
          <th>Yenilen Gol</th>
          <th>Averaj</th>
          <th>Puan</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(team, index) in puanTablosu"
          :key="team.TakimID"
          :class="{
            'champions-league': index === 0,
            'relegation-zone': index >= puanTablosu.length - 2,
          }"
        >
          <td>{{ team.TakimAdi }}</td>
          <td>{{ team.MacSayisi }}</td>
          <td>{{ team.Galibiyet }}</td>
          <td>{{ team.Maglubiyet }}</td>
          <td>{{ team.Beraberlik }}</td>
          <td>{{ team.AtilanGol }}</td>
          <td>{{ team.YenilenGol }}</td>
          <td>{{ team.Averaj }}</td>
          <td>{{ team.Puan }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Puan tablosu verileri yüklenemedi veya boş.</p>

    <!-- Legend for colors -->
    <div class="legend">
      <div class="legend-item">
        <div class="color-box champions-league"></div>
        <span>Şampiyonlar Ligi</span>
      </div>
      <div class="legend-item">
        <div class="color-box relegation-zone"></div>
        <span>Küme Düşme</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PuanTablosu",
  data() {
    return {
      puanTablosu: [],
    };
  },
  created() {
    this.fetchPuanTablosu();
  },
  methods: {
    async fetchPuanTablosu() {
      try {
        const response = await fetch("http://localhost:5001/api/puantablosu");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        this.puanTablosu = data;
      } catch (error) {
        console.error("Puan tablosu verileri alınamadı:", error);
        this.puanTablosu = [];
      }
    },
  },
};
</script>

<style scoped>
.puan-tablosu {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

h1 {
  margin-bottom: 20px;
  font-size: 24px;
}

/* Row coloring */
.champions-league {
  background-color: #d0e7ff; /* Light blue */
}

.relegation-zone {
  background-color: #ffd6d6; /* Light red */
}

/* Legend styling */
.legend {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.color-box {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.color-box.champions-league {
  background-color: #d0e7ff;
}

.color-box.relegation-zone {
  background-color: #ffd6d6;
}
</style>
