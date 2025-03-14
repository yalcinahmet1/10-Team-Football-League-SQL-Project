const db = require('../db'); // Import db.js

// Calculate the average rating based on individual attributes
const calculateRating = (Hiz, Sut, Pas, Dribbling, Defans, Fizik) => {
  return Math.round((Hiz + Sut + Pas + Dribbling + Defans + Fizik) / 6);
};

// Fetch all players with their ratings
const getOyuncular = (req, res) => {
  const sql = `
    SELECT 
      oyuncu.OyuncuID,
      oyuncu.Ad,
      oyuncu.Soyad,
      takim.TakimID,
      rating.Hiz,
      rating.Sut,
      rating.Pas,
      rating.Dribbling,
      rating.Defans,
      rating.Fizik,
      (rating.Hiz + rating.Sut + rating.Pas + rating.Dribbling + rating.Defans + rating.Fizik) / 6 AS Rating
    FROM oyuncu
    JOIN takim ON oyuncu.TakimID = takim.TakimID
    JOIN rating ON oyuncu.OyuncuID = rating.OyuncuID
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Sorgu hatası:', err);
      res.status(500).json({ error: 'Veritabanından veri alınamadı' });
      return;
    }
    res.json(results);
  });
};

// Update a player's name, surname, and ratings
const updateOyuncu = (req, res) => {
  const {
    OyuncuID,
    Ad,
    Soyad,
    TakimID,
    Hiz,
    Sut,
    Pas,
    Dribbling,
    Defans,
    Fizik,
  } = req.body;

  const rating = calculateRating(Hiz, Sut, Pas, Dribbling, Defans, Fizik);

  const updatePlayerSql = `
    UPDATE oyuncu 
    SET Ad = ?, Soyad = ?, TakimID = ? 
    WHERE OyuncuID = ?
  `;

  const updateRatingSql = `
    UPDATE rating 
    SET Hiz = ?, Sut = ?, Pas = ?, Dribbling = ?, Defans = ?, Fizik = ? 
    WHERE OyuncuID = ?
  `;

  db.query(updatePlayerSql, [Ad, Soyad, TakimID, OyuncuID], (err) => {
    if (err) {
      console.error('Oyuncu güncellenirken hata oluştu:', err);
      res.status(500).json({ error: 'Oyuncu bilgileri güncellenemedi' });
      return;
    }

    db.query(
      updateRatingSql,
      [Hiz, Sut, Pas, Dribbling, Defans, Fizik, OyuncuID],
      (err) => {
        if (err) {
          console.error('Rating güncellenirken hata oluştu:', err);
          res.status(500).json({ error: 'Oyuncu ratingleri güncellenemedi' });
          return;
        }

        // Recalculate the team rating after updating the player's rating
        updateTeamRating(TakimID, (teamUpdateErr) => {
          if (teamUpdateErr) {
            console.error(
              'Takım ratingi güncellenirken hata oluştu:',
              teamUpdateErr
            );
            res.status(500).json({ error: 'Takım ratingi güncellenemedi' });
            return;
          }

          res.status(200).json({ message: 'Oyuncu başarıyla güncellendi' });
        });
      }
    );
  });
};

const updateTeamRating = (TakimID, callback) => {
  const teamRatingSql = `
    SELECT AVG(
      (r.Hiz + r.Sut + r.Pas + r.Dribbling + r.Defans + r.Fizik) / 6
    ) AS TeamRating 
    FROM rating r
    JOIN oyuncu o ON o.OyuncuID = r.OyuncuID
    WHERE o.TakimID = ?
  `;

  const updateTeamSql = `
    UPDATE takim 
    SET TakimGucu = ? 
    WHERE TakimID = ?
  `;

  db.query(teamRatingSql, [TakimID], (err, results) => {
    if (err) {
      return callback(err);
    }

    const teamRating = Math.round(results[0].TeamRating); // Round the rating to the nearest integer

    db.query(updateTeamSql, [teamRating, TakimID], (err) => {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  });
};

// Add a new player
// const addOyuncu = (req, res) => {
//   const { Ad, Soyad, TakimID, Hiz, Sut, Pas, Dribbling, Defans, Fizik } =
//     req.body;

//   const insertPlayerSql = `
//     INSERT INTO oyuncu (Ad, Soyad, TakimID)
//     VALUES (?, ?, ?)
//   `;

//   db.query(insertPlayerSql, [Ad, Soyad, TakimID], (err, result) => {
//     if (err) {
//       console.error('Oyuncu eklenirken hata oluştu:', err);
//       res.status(500).json({ error: 'Yeni oyuncu eklenemedi' });
//       return;
//     }

//     const OyuncuID = result.insertId; // Get the ID of the newly inserted player

//     const insertRatingSql = `
//       INSERT INTO rating (OyuncuID, Hiz, Sut, Pas, Dribbling, Defans, Fizik)
//       VALUES (?, ?, ?, ?, ?, ?, ?)
//     `;

//     db.query(
//       insertRatingSql,
//       [OyuncuID, Hiz, Sut, Pas, Dribbling, Defans, Fizik],
//       (err) => {
//         if (err) {
//           console.error('Rating eklenirken hata oluştu:', err);
//           res.status(500).json({ error: 'Oyuncu ratingleri eklenemedi' });
//           return;
//         }

//         res.status(201).json({ message: 'Yeni oyuncu başarıyla eklendi' });
//       }
//     );
//   });
// };

module.exports = {
  getOyuncular,
  updateOyuncu,
  // addOyuncu,
};
