const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Tetap di-import jika Anda ingin opsi hash di masa depan
// const User = require('../models/User'); // Anda mungkin tidak butuh ini jika HANYA admin .env

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Ambil kredensial admin dari environment variables
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.error('Admin credentials not set in .env file');
    return res.status(500).send('Server configuration error');
  }

  try {
    // Cek apakah username dan password cocok dengan admin dari .env
    if (username === adminUsername && password === adminPassword) {
      // Jika cocok, buat token JWT untuk admin
      const payload = {
        user: {
          id: 'admin_static_id', // ID statis untuk admin .env
          username: adminUsername,
          role: 'admin' // Anda bisa tambahkan role jika perlu
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' }, // Token berlaku 5 jam
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } else {
      // Jika tidak cocok, kirim pesan error
      // Jika Anda masih ingin mendukung login user dari database,
      // Anda bisa menambahkan logika pengecekan ke database di sini.
      // Contoh:
      // let user = await User.findOne({ username });
      // if (!user) {
      //   return res.status(400).json({ msg: 'Invalid credentials' });
      // }
      // const isMatch = await bcrypt.compare(password, user.password);
      // if (!isMatch) {
      //   return res.status(400).json({ msg: 'Invalid credentials' });
      // }
      // // ... generate token untuk user DB ...

      // Untuk sekarang, kita hanya fokus pada admin .env
      return res.status(400).json({ msg: 'Username atau Password salah' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Fungsi register mungkin tidak relevan jika hanya ada admin statis,
// atau bisa dipertahankan untuk manajemen user via database di masa depan.
// exports.register = async (req, res) => { ... };