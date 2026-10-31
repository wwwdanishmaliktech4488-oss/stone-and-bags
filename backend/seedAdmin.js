const bcrypt = require('bcryptjs');
const db = require('./config/db');

const seedAdmin = async () => {
  try {
    const name = 'Admin';
    const email = 'admin@stoneandbags.com';
    const plainPassword = 'admin123';

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const [existing] = await db.query(
      'SELECT id FROM admins WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log('ℹ️  Admin already exists, skipping.');
      process.exit(0);
    }

    await db.query(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    console.log('✅ Admin created:');
    console.log('   Email:    ', email);
    console.log('   Password: ', plainPassword);
    console.log('   ⚠️  Change this password after first login!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:');
    console.error('   code:    ', err.code);
    console.error('   errno:   ', err.errno);
    console.error('   message: ', err.message);
    process.exit(1);
  }
};

seedAdmin();