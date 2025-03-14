const db = require('../db'); // db.js dosyasını içe aktar

// Tüm hakemleri getiren controller fonksiyonu
const getHakemler = (req, res) => {
  const sql = 'SELECT * FROM Hakem';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Sorgu hatası:', err);
      res.status(500).json({ error: 'Veritabanından veri alınamadı' });
      return;
    }
    res.json(results); // Hakem verilerini JSON olarak gönder
  });
};

const addHakem = (req, res) => {
  const { Ad, Soyad } = req.body;
  const sql = 'INSERT INTO Hakem (Ad, Soyad) VALUES (?, ?)';

  db.query(sql, [Ad, Soyad], (err, results) => {
    if (err) {
      console.error('Sorgu hatası:', err);
      res.status(500).json({ error: 'Hakem eklenemedi' });
      return;
    }
    res.status(201).json({ id: results.insertId, Ad, Soyad });
  });
};

const updateHakem = (req, res) => {
  const { id } = req.params;
  const { Ad, Soyad } = req.body;
  const sql = 'UPDATE Hakem SET Ad = ?, Soyad = ? WHERE HakemID = ?';

  db.query(sql, [Ad, Soyad, id], (err) => {
    if (err) {
      console.error('Sorgu hatası:', err);
      res.status(500).json({ error: 'Hakem güncellenemedi' });
      return;
    }
    res.status(200).json({ id, Ad, Soyad });
  });
};

const deleteHakem = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Hakem WHERE HakemID = ?';

  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Sorgu hatası:', err);
      res.status(500).json({ error: 'Hakem silinemedi' });
      return;
    }
    res.status(204).end();
  });
};

module.exports = {
  getHakemler,
  addHakem,
  updateHakem,
  deleteHakem,
};
