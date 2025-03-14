const db = require('../db');

// Utility function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Utility function to generate a random date in 2024
const getRandomDateIn2024 = () => {
  const start = new Date(2024, 0, 1).getTime(); // January 1, 2024
  const end = new Date(2024, 11, 31).getTime(); // December 31, 2024
  const randomDate = new Date(start + Math.random() * (end - start));

  const year = randomDate.getFullYear();
  const month = randomDate.getMonth() + 1; // Months are zero-based, so +1
  const day = randomDate.getDate();
  const hour = randomDate.getHours();

  return { year, month, day, hour };
};

const simulateMatches = (req, res) => {
  // First, delete records from dependent tables
  const deleteMacTarihSql = 'DELETE FROM mac_tarih';
  const deletePuanTablosuSql = 'DELETE FROM puan_tablosu';
  const deleteMacSql = 'DELETE FROM mac';

  db.query(deleteMacTarihSql, (err) => {
    if (err) {
      console.error('Error clearing mac_tarih table:', err);
      return res.status(500).json({ error: 'Failed to clear mac_tarih table' });
    }

    db.query(deletePuanTablosuSql, (err) => {
      if (err) {
        console.error('Error clearing puan_tablosu table:', err);
        return res
          .status(500)
          .json({ error: 'Failed to clear puan_tablosu table' });
      }

      db.query(deleteMacSql, (err) => {
        if (err) {
          console.error('Error clearing mac table:', err);
          return res.status(500).json({ error: 'Failed to clear mac table' });
        }

        // Simulate all matches
        simulateAllMatches((err) => {
          if (err) {
            console.error('Error during match simulation:', err);
            return res.status(500).json({ error: 'Match simulation failed' });
          }
          res.status(200).json({
            message: 'Matches simulated and database populated successfully',
          });
        });
      });
    });
  });
};

const simulateAllMatches = (callback) => {
  const teams = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]; // Example team IDs
  const matches = [];

  // Generate all possible team pairs
  teams.forEach((team1, index) => {
    teams.slice(index + 1).forEach((team2) => {
      matches.push([team1, team2]);
    });
  });

  // Shuffle matches to randomize home/away team distribution
  const shuffledMatches = shuffleArray(matches);

  const simulateMatch = (homeTeamID, awayTeamID, cb) => {
    const getTakimGucleri = `
      SELECT 
        te.TakimAdi AS EvSahibiTakim, 
        te.TakimGucu AS EvSahibiTakimGucu, 
        td.TakimAdi AS DeplasmanTakim, 
        td.TakimGucu AS DeplasmanTakimGucu 
      FROM 
        lig.takim te
      JOIN 
        lig.takim td ON td.TakimID = ?
      WHERE 
        te.TakimID = ?;
    `;

    db.query(getTakimGucleri, [awayTeamID, homeTeamID], (err, results) => {
      if (err) {
        return cb(err);
      }

      if (
        results.length === 0 ||
        !results[0].EvSahibiTakimGucu ||
        !results[0].DeplasmanTakimGucu
      ) {
        return cb(new Error('Failed to retrieve team strengths'));
      }

      const homeStrength = results[0].EvSahibiTakimGucu;
      const awayStrength = results[0].DeplasmanTakimGucu;

      // Ensure totalStrength is not zero to avoid division by zero
      const totalStrength = homeStrength + awayStrength;
      if (totalStrength === 0) {
        return cb(new Error('Total strength is zero, cannot simulate match'));
      }

      // Calculate scores based on team strengths
      const homeScore = Math.floor(
        Math.random() * (4 + Math.floor((homeStrength / totalStrength) * 3))
      );
      const awayScore = Math.floor(
        Math.random() * (4 + Math.floor((awayStrength / totalStrength) * 3))
      );

      // Fetch the stadium ID for the home team and a random referee
      const getStadiumAndRefereeSql = `
        SELECT t.StadyumID, h.HakemID 
        FROM takim t 
        CROSS JOIN (SELECT HakemID FROM hakem ORDER BY RAND() LIMIT 1) h
        WHERE t.TakimID = ?;
      `;

      db.query(getStadiumAndRefereeSql, [homeTeamID], (err, results) => {
        if (err) {
          return cb(err);
        }

        const stadiumID = results[0].StadyumID;
        const refereeID = results[0].HakemID;

        const insertMacSql = `
          INSERT INTO mac (Tarih, EvSahibiTakimID, DeplasmanTakimID, StadyumID, HakemID, EvSahibiSkor, DeplasmanSkor)
          VALUES (NOW(), ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertMacSql,
          [homeTeamID, awayTeamID, stadiumID, refereeID, homeScore, awayScore],
          (err, result) => {
            if (err) {
              return cb(err);
            }

            const macID = result.insertId;
            const { year, month, day, hour } = getRandomDateIn2024();

            const insertMacTarihSql = `
              INSERT INTO mac_tarih (MacID, Yil, Ay, Gun, Saat)
              VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
              insertMacTarihSql,
              [macID, year, month, day, hour],
              (err) => {
                if (err) {
                  return cb(err);
                }

                updatePuanTablosu(
                  homeTeamID,
                  awayTeamID,
                  homeScore,
                  awayScore,
                  (err) => {
                    if (err) {
                      return cb(err);
                    }

                    const updateMacSql = `
                      UPDATE mac
                      SET Tarih = STR_TO_DATE(CONCAT(?, '-', ?, '-', ?, ' ', ?, ':00:00'), '%Y-%m-%d %H:%i:%s')
                      WHERE MacID = ?
                    `;

                    db.query(
                      updateMacSql,
                      [year, month, day, hour, macID],
                      (err) => {
                        if (err) {
                          return cb(err);
                        }
                        cb(null);
                      }
                    );
                  }
                );
              }
            );
          }
        );
      });
    });
  };

  const updatePuanTablosu = (
    homeTeamID,
    awayTeamID,
    homeScore,
    awayScore,
    cb
  ) => {
    const homeResult =
      homeScore > awayScore
        ? [1, 0, 0]
        : homeScore < awayScore
        ? [0, 1, 0]
        : [0, 0, 1];
    const awayResult =
      awayScore > homeScore
        ? [1, 0, 0]
        : awayScore < homeScore
        ? [0, 1, 0]
        : [0, 0, 1];

    const updateSql = `
      INSERT INTO puan_tablosu (TakimID, MacSayisi, Galibiyet, Maglubiyet, Beraberlik, AtilanGol, YenilenGol)
      VALUES (?, 1, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        MacSayisi = MacSayisi + 1,
        Galibiyet = Galibiyet + VALUES(Galibiyet),
        Maglubiyet = Maglubiyet + VALUES(Maglubiyet),
        Beraberlik = Beraberlik + VALUES(Beraberlik),
        AtilanGol = AtilanGol + VALUES(AtilanGol),
        YenilenGol = YenilenGol + VALUES(YenilenGol)
    `;

    db.query(
      updateSql,
      [homeTeamID, ...homeResult, homeScore, awayScore],
      (err) => {
        if (err) {
          return cb(err);
        }

        db.query(
          updateSql,
          [awayTeamID, ...awayResult, awayScore, homeScore],
          cb
        );
      }
    );
  };

  // Simulate matches in shuffled order
  const totalMatches = shuffledMatches.length;
  let matchCounter = 0;

  shuffledMatches.forEach(([team1, team2]) => {
    const isHomeFirst = Math.random() > 0.5; // Randomly decide which team is home
    const homeTeamID = isHomeFirst ? team1 : team2;
    const awayTeamID = isHomeFirst ? team2 : team1;

    simulateMatch(homeTeamID, awayTeamID, (err) => {
      if (err) {
        return callback(err);
      }

      matchCounter++;
      if (matchCounter === totalMatches) {
        callback(null);
      }
    });
  });
};

const getPlayedMatches = (req, res) => {
  const sql = `
    SELECT 
      mac.MacID,
      mac.Tarih,
      mac.EvSahibiTakimID,
      mac.DeplasmanTakimID,
      mac.EvSahibiSkor,
      mac.DeplasmanSkor,
      t1.TakimAdi AS EvSahibiAdi,
      t2.TakimAdi AS DeplasmanAdi,
      s.StadyumAdi,
      h.Ad AS HakemAdi
    FROM mac
    JOIN takim t1 ON mac.EvSahibiTakimID = t1.TakimID
    JOIN takim t2 ON mac.DeplasmanTakimID = t2.TakimID
    JOIN stadyum s ON mac.StadyumID = s.StadyumID
    JOIN hakem h ON mac.HakemID = h.HakemID
    WHERE mac.EvSahibiSkor IS NOT NULL AND mac.DeplasmanSkor IS NOT NULL
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Sorgu hatası:', err);
      return res.status(500).json({ error: 'Veritabanından veri alınamadı' });
    }
    res.json(results);
  });
};

module.exports = {
  simulateMatches,
  getPlayedMatches,
};
