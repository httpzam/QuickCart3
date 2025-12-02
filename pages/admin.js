import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/productTable';

export default function Admin({ user }) {
  return (
    <div className="wrapper">
      {/* Navbar */}
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#"><i className="fas fa-bars"></i></a>
          </li>
        </ul>
      </nav>

      {/* Sidebar */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <a href="#" className="brand-link text-center">QuickCart Admin</a>
        <div className="sidebar">
          <div className="user-panel mt-3 pb-3 mb-3 d-flex align-items-center">
            <div className="info"><a href="#" className="d-block">{user.name}</a></div>
          </div>
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column">
              <li className="nav-item"><a href="#" className="nav-link active"><i className="nav-icon fas fa-box"></i><p>Products</p></a></li>
              <li className="nav-item"><a href="/api/logout" className="nav-link"><i className="nav-icon fas fa-sign-out-alt"></i><p>Logout</p></a></li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Content */}
      <div className="content-wrapper" style={{ padding: '20px' }}>
        <h3>Product Management</h3>
        <ProductForm />
        <ProductTable />
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.auth;

  if (!token) return { redirect: { destination: '/', permanent: false } };
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return { props: { user } };
  } catch {
    return { redirect: { destination: '/', permanent: false } };
  }
}
