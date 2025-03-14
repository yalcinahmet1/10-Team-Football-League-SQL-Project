const mysql = require('mysql2');

// MySQL bağlantı bilgilerinizi burada ayarlayın
const connection = mysql.createConnection({
  host: 'localhost', // MySQL sunucunuzun adresi
  user: 'root', // MySQL kullanıcı adı
  password: '12!Ahmet', // MySQL kullanıcı şifresi
  database: 'Liggg', // Bağlanmak istediğiniz veritabanı
});

connection.connect((err) => {
  if (err) {
    console.error('Bağlantı hatası: ' + err.stack);
    return;
  }
  console.log('MySQL veritabanına bağlandı: ' + connection.threadId);
});

module.exports = connection;
