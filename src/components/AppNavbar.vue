<template>
  <nav class="navbar">
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/puantablosu">Puan Tablosu</router-link></li>
      <li><router-link to="/oyuncu">Oyuncular</router-link></li>
      <li><router-link to="/takim">Takımlar</router-link></li>
      <li><router-link to="/hakem">Hakemler</router-link></li>
      <li><router-link to="/stadyum">Stadyumlar</router-link></li>
      <li>
        <router-link to="/teknikdirektor">Teknik Direktörler</router-link>
      </li>
      <li><router-link to="/mac">Maçlar</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "AppNavbar",
};
</script>

<style scoped>
.navbar {
  background-color: #333;
  overflow: hidden;
}

.navbar ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
}

.navbar li {
  padding: 14px 20px;
}

.navbar a {
  color: white;
  text-align: center;
  text-decoration: none;
  display: block;
}

.navbar a:hover {
  background-color: #ddd;
  color: black;
}
</style>
