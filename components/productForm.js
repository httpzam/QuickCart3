import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
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
    <div className="card card-primary">
      <div className="card-header"><h3 className="card-title">{action === 'add' ? 'Add Product' : 'Edit Product'}</h3></div>
      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-group">
          <label>Barcode</label>
          <input className="form-control" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Name</label>
          <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Price (₱)</label>
          <input type="number" step="0.01" className="form-control" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
        </div>
        <button type="submit" className={`btn ${action === 'add' ? 'btn-success' : 'btn-warning'}`}>
          {action === 'add' ? 'Add Product' : 'Update Product'}
        </button>
      </form>
    </div>
  );
}
