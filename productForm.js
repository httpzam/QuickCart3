import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

export default function ProductForm() {
  const [form, setForm] = useState({ barcode: '', name: '', price: '' });
  const [action, setAction] = useState('add');
  const [editId, setEditId] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/products', { ...form, action, id: editId });
      toast.success(res.data.message);
      setForm({ barcode: '', name: '', price: '' });
      setAction('add');
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <input placeholder="Barcode" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} required />
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
      <input placeholder="Price" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
      <button type="submit">{action === 'add' ? 'Add Product' : 'Update Product'}</button>
    </form>
  );
}
