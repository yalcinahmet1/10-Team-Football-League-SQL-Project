const db = require('../db');

const calculateTakimGucu = (takimID, callback) => {
  const sql = `
    SELECT AVG((Hiz + Sut + Pas + Dribbling + Defans + Fizik) / 6) AS OrtalamaRating
    FROM oyuncu
    JOIN rating ON oyuncu.OyuncuID = rating.OyuncuID
    WHERE oyuncu.TakimID = ?
  `;
  db.query(sql, [takimID], (err, results) => {
    if (err) {
      return callback(err);
    }
    const ortalamaRating = results[0]?.OrtalamaRating || 0;
    callback(null, ortalamaRating);
  });
};

const getTakimlar = (req, res) => {
  const sql = `
    SELECT 
      takim.TakimID,
      takim.TakimAdi,
      takim.KurulusYili,
      takim.StadyumID,
      takim.TDID
    FROM takim
    JOIN stadyum ON takim.StadyumID = stadyum.StadyumID
    JOIN teknik_direktor ON takim.TDID = teknik_direktor.DirektörID
  `;

  db.query(sql, async (err, results) => {
    if (err) {
      console.error('Sorgu hatası:', err);
      res.status(500).json({ error: 'Veritabanından veri alınamadı' });
      return;
    }

    // Takımların takım gücünü hesapla
    for (let takim of results) {
      try {
        const ortalamaRating = await new Promise((resolve, reject) => {
          calculateTakimGucu(takim.TakimID, (err, rating) => {
            if (err) reject(err);
            else resolve(rating);
          });
        });
        takim.TakimGucu = ortalamaRating;
      } catch (error) {
        console.error('Takım gücü hesaplama hatası:', error);
      }
    }

    res.json(results);
  });
};

const updateTakim = (req, res) => {
  const { id } = req.params;
  const { StadyumID, TDID } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      console.error('Transaction başlatma hatası:', err);
      return res.status(500).json({ error: 'Transaction başlatılamadı' });
    }

    const updateTakimSql = `
      UPDATE takim
      SET StadyumID = ?, TDID = ?
      WHERE TakimID = ?
    `;

    db.query(updateTakimSql, [StadyumID, TDID, id], (err) => {
      if (err) {
        return db.rollback(() => {
          console.error('Takım güncelleme hatası:', err);
          res.status(500).json({ error: 'Takım güncellenemedi' });
        });
      }

      const updateMacSql = `
        UPDATE mac
        SET StadyumID = ?
        WHERE EvSahibiTakimID = ? OR DeplasmanTakimID = ?
      `;

      db.query(updateMacSql, [StadyumID, id, id], (err) => {
        if (err) {
          return db.rollback(() => {
            console.error('Maç güncelleme hatası:', err);
            res.status(500).json({ error: 'Maçlar güncellenemedi' });
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error('Transaction commit hatası:', err);
              res.status(500).json({ error: 'Transaction commit edilemedi' });
            });
          }
          res
            .status(200)
            .json({ message: 'Takım ve maçlar başarıyla güncellendi' });
        });
      });
    });
  });
};

module.exports = {
  getTakimlar,
  calculateTakimGucu,
  updateTakim,
};
