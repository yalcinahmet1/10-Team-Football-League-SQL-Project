<template>
  <div id="app">
    <h1>Oynanmış Maçlar</h1>
    <button @click="simulateMatches">Simulate</button>
    <table border="1">
      <thead>
        <tr>
          <th>Maç ID</th>
          <th>Tarih</th>
          <th>Ev Sahibi Takım</th>
          <th>Skor</th>
          <th>Deplasman Takım</th>
          <th>Stadyum</th>
          <th>Hakem</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="match in matches" :key="match.MacID">
          <td>{{ match.MacID }}</td>
          <td>{{ match.Tarih }}</td>
          <td>{{ match.EvSahibiAdi }}</td>
          <td>{{ match.EvSahibiSkor }} - {{ match.DeplasmanSkor }}</td>
          <td>{{ match.DeplasmanAdi }}</td>
          <td>{{ match.StadyumAdi }}</td>
          <td>{{ match.HakemAdi }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MacTablosu",
  data() {
    return {
      matches: [],
    };
  },
  mounted() {
    this.getPlayedMatches();
  },
  methods: {
    getPlayedMatches() {
      axios
        .get("http://localhost:5001/api/playedMatches")
        .then((response) => {
          this.matches = response.data;
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    simulateMatches() {
      axios
        .post("http://localhost:5001/api/simulateMatches") // Call the new backend endpoint
        .then(() => {
          this.getPlayedMatches(); // Refresh the matches data after simulation
        })
        .catch((error) => {
          console.error("Simulation failed!", error);
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
</style>
