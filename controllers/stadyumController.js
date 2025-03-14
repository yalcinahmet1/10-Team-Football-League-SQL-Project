const db = require('../db');

const getStadyumlar = (req, res) => {
  const sql = 'SELECT * FROM stadyum';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Sorgu hatası:', err);
      res.status(500).json({ error: 'Veritabanından veri alınamadı' });
      return;
    }
    res.json(results);
  });
};

const addStadyum = (req, res) => {
  const { StadyumAdi, Kapasite, Sehir } = req.body;
  const sql =
    'INSERT INTO stadyum (StadyumAdi, Kapasite, Sehir) VALUES (?, ?, ?)';

  db.query(sql, [StadyumAdi, Kapasite, Sehir], (err, results) => {
    if (err) {
      console.error('Sorgu hatası:', err);
      res.status(500).json({ error: 'Stadyum eklenemedi' });
      return;
    }
    res.status(201).json({ id: results.insertId, StadyumAdi, Kapasite, Sehir });
  });
};
const updateStadyum = (req, res) => {
  const { id } = req.params;
  const { StadyumAdi, Kapasite, Sehir } = req.body;
  const sql =
    'UPDATE stadyum SET StadyumAdi = ?, Kapasite = ?, Sehir = ? WHERE StadyumID = ?';

  db.query(sql, [StadyumAdi, Kapasite, Sehir, id], (err) => {
    if (err) {
      console.error('Sorgu hatası:', err);
      res.status(500).json({ error: 'Stadyum güncellenemedi' });
      return;
    }
    res.status(200).json({ id, StadyumAdi, Kapasite, Sehir });
  });
};

const deleteStadyum = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM stadyum WHERE StadyumID = ?';

  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Sorgu hatası:', err);
      res.status(500).json({ error: 'Stadyum silinemedi' });
      return;
    }
    res.status(204).end();
  });
};

module.exports = {
  getStadyumlar,
  addStadyum,
  updateStadyum,
  deleteStadyum,
};
