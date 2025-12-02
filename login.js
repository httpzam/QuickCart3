import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { connect } from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;
  const conn = await connect();
  const [rows] = await conn.execute('SELECT * FROM admins WHERE username = ?', [username]);

  if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

  const user = rows[0];
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.setHeader('Set-Cookie', serialize('auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 3600,
  }));

  res.status(200).json({ message: 'Logged in' });
}
