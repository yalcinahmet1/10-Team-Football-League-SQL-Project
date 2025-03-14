const db = require('../db');

const getPuanTablosu = (req, res) => {
  const sql = `
    SELECT 
      pt.TakimID,
      t.TakimAdi,
      pt.MacSayisi,
      pt.Galibiyet,
      pt.Maglubiyet,
      pt.Beraberlik,
      pt.AtilanGol,
      pt.YenilenGol,
      pt.Averaj,
      pt.Puan
    FROM 
      puan_tablosu pt
    JOIN 
      takim t ON pt.TakimID = t.TakimID
    ORDER BY 
      pt.Puan DESC, 
      pt.Averaj DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching puan tablosu:', err);
      return res.status(500).json({ error: 'Failed to fetch puan tablosu' });
    }
    res.json(results);
  });
};

module.exports = {
  getPuanTablosu,
};
