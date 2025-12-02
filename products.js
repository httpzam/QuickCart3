import { connect } from '../../lib/db';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

export default async function handler(req, res) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.auth;

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const conn = await connect();
  const { method } = req;

  if (method === 'GET') {
    const [rows] = await conn.execute('SELECT * FROM products ORDER BY id DESC');
    return res.status(200).json({ data: rows });
  }

  if (method === 'POST') {
    const { action, id, barcode, name, price } = req.body;
    if (action === 'add') {
      await conn.execute('INSERT INTO products (barcode, name, price) VALUES (?, ?, ?)', [barcode, name, price]);
      return res.status(200).json({ success: true, message: 'Product added' });
    }
    if (action === 'update') {
      await conn.execute('UPDATE products SET barcode=?, name=?, price=? WHERE id=?', [barcode, name, price, id]);
      return res.status(200).json({ success: true, message: 'Product updated' });
    }
    if (action === 'delete') {
      await conn.execute('DELETE FROM products WHERE id=?', [id]);
      return res.status(200).json({ success: true, message: 'Product deleted' });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
}
