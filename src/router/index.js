import { createWebHashHistory, createRouter } from 'vue-router';
//dasfasgfsS
const routes = [
  {
    name: 'Home',
    path: '/',
    component: () => import('@/views/Home.vue'),
  },
  {
    name: 'Hakem',
    path: '/hakem',
    component: () => import('@/views/hakem.vue'),
  },
  {
    name: 'Stadyum',
    path: '/stadyum',
    component: () => import('@/views/stadyum.vue'),
  },
  {
    name: 'PuanTablosu',
    path: '/puantablosu',
    component: () => import('@/views/puantablosu.vue'),
  },
  {
    name: 'Takim',
    path: '/takim',
    component: () => import('@/views/takim.vue'),
  },
  {
    name: 'TeknikDirektor',
    path: '/teknikdirektor',
    component: () => import('@/views/teknikdirektor.vue'),
  },
  {
    name: 'Oyuncu',
    path: '/oyuncu',
    component: () => import('@/views/oyuncu.vue'),
  },
  {
    name: 'Mac',
    path: '/mac',
    component: () => import('@/views/mac.vue'),
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

export default router;
