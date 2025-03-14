const db = require('../db');

const getTeknikDirektorler = (req, res) => {
  const sql = 'SELECT * FROM teknik_direktor';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Sorgu hatası:', err);
      res.status(500).json({ error: 'Veritabanından veri alınamadı' });
      return;
    }
    res.json(results);
  });
};

const addTeknikDirektor = (req, res) => {
  const { Ad, Soyad, DoğumTarihi } = req.body;
  const sql =
    'INSERT INTO teknik_direktor (Ad, Soyad, DoğumTarihi) VALUES (?, ?, ?)';

  db.query(sql, [Ad, Soyad, DoğumTarihi], (err, results) => {
    if (err) {
      console.error('Sorgu hatası:', err);
      res.status(500).json({ error: 'Teknik direktör eklenemedi' });
      return;
    }
    res.status(201).json({ id: results.insertId, Ad, Soyad, DoğumTarihi });
  });
};

const updateTeknikDirektor = (req, res) => {
  const { id } = req.params;
  const { Ad, Soyad, DoğumTarihi } = req.body;
  const sql =
    'UPDATE teknik_direktor SET Ad = ?, Soyad = ?, DoğumTarihi = ? WHERE DirektörID = ?';

  db.query(sql, [Ad, Soyad, DoğumTarihi, id], (err) => {
    if (err) {
      console.error('Sorgu hatası:', err);
      res.status(500).json({ error: 'Teknik direktör güncellenemedi' });
      return;
    }
    res.status(200).json({ id, Ad, Soyad, DoğumTarihi });
  });
};

const deleteTeknikDirektor = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM teknik_direktor WHERE DirektörID = ?';

  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Sorgu hatası:', err);
      res.status(500).json({ error: 'Teknik direktör silinemedi' });
      return;
    }
    res.status(204).end();
  });
};

module.exports = {
  getTeknikDirektorler,
  addTeknikDirektor,
  updateTeknikDirektor,
  deleteTeknikDirektor,
};
