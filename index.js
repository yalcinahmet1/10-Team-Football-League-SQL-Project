const express = require('express');
const cors = require('cors');
const hakemRoutes = require('./routes/hakemRoute'); // Route dosyasını import et
const stadyumRoutes = require('./routes/stadyumRoute');
const teknikDirektorRoutes = require('./routes/teknik_direktorRoute');
const takimRoutes = require('./routes/takimRoute');
const oyuncuRoutes = require('./routes/oyuncuRoute');
const macRoutes = require('./routes/macRoute');
const puanTablosuRoutes = require('./routes/puanTablosuRoute'); // Yeni eklenen route

const app = express();

app.use(cors());
app.use(express.json()); // JSON veri işlemesi için

// Hakemler route'unu kullan
app.use('/api', hakemRoutes);
app.use('/api', stadyumRoutes);
app.use('/api', teknikDirektorRoutes);
app.use('/api', takimRoutes);
app.use('/api', oyuncuRoutes);
app.use('/api', macRoutes);
app.use('/api', puanTablosuRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
