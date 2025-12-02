import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProductTable() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await axios.get('/api/products');
      setProducts(res.data.data);
    }
    fetchProducts();
  }, []);

  const handleDelete = async id => {
    if (!confirm('Delete this product?')) return;
    await axios.post('/api/products', { action: 'delete', id });
    window.location.reload();
  };

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr><th>ID</th><th>Barcode</th><th>Name</th><th>Price</th><th>Actions</th></tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.barcode}</td>
            <td>{p.name}</td>
            <td>{p.price.toFixed(2)}</td>
            <td>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
