import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, Table, Button, Space, Modal, Statistic, 
  Tag, Input, Typography, message, Spin 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SearchOutlined, UserOutlined, ShoppingOutlined, 
  LogoutOutlined, DashboardOutlined, OrderedListOutlined 
} from '@ant-design/icons';

// Import the specific forms
import AddProductForm from '../../components/admin/forms/AddProductForm';
import ProductEditForm from '../../components/admin/forms/ProductEditForm'; // Import ProductEditForm

import { 
  fetchDashboardStats, 
  fetchRecentActivities 
} from '../../api/admin';
import { 
  getAllProducts, 
  deleteProduct 
} from '../../api/product';
import { apiLogout } from '../../api/auth';

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [stats, setStats] = useState({
    usersCount: 0,
    productsCount: 0,
    pendingOrdersCount: 0
  });
  const [activities, setActivities] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState({
    stats: true,
    activities: true,
    products: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState({
    visible: false,
    mode: 'create', // 'create' or 'edit'
    product: null
  });

  // Fetch data on mount
  useEffect(() => {
    loadDashboardData();
    loadProducts();
  }, []);

  // Filter products when search term changes
  useEffect(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const loadDashboardData = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true, activities: true }));
      
      const [statsData, activitiesData] = await Promise.all([
        fetchDashboardStats(),
        fetchRecentActivities()
      ]);
      
      setStats(statsData);
      setActivities(activitiesData);
    } catch (error) {
      message.error('Panel məlumatları yüklənə bilmədi.');
    } finally {
      setLoading(prev => ({ ...prev, stats: false, activities: false }));
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      const productsData = await getAllProducts();
      setProducts(productsData);
    } catch (error) {
      message.error('Məhsullar yüklənə bilmədi.');
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const handleCreate = () => {
    setModal({
      visible: true,
      mode: 'create',
      product: null
    });
  };

  const handleEdit = (product) => {
    setModal({
      visible: true,
      mode: 'edit',
      product
    });
  };

  const handleDelete = async (productId) => {
    Modal.confirm({
      title: 'Məhsulun Silinməsini Təsdiqlə',
      content: 'Bu məhsulu silmək istədiyinizə əminsinizmi?',
      okText: 'Sil',
      okType: 'danger',
      cancelText: 'Ləğv Et',
      async onOk() {
        try {
          await deleteProduct(productId);
          message.success('Məhsul uğurla silindi!');
          loadProducts(); // Məhsul siyahısını yeniləyin
        } catch (error) {
          message.error('Məhsul silinə bilmədi.');
        }
      }
    });
  };

  const handleFormSuccess = () => {
    setModal({ ...modal, visible: false });
    loadProducts(); // Məhsul siyahısını yeniləyin
    message.success(`Məhsul uğurla ${modal.mode === 'create' ? 'əlavə edildi' : 'yeniləndi'}!`);
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
      navigate('/login');
      message.success('Uğurla çıxış edildi!');
    } catch (error) {
      message.error('Çıxış uğursuz oldu.');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Məhsul',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {record.imageUrl ? (
            <img 
              src={record.imageUrl} 
              alt={text}
              style={{ 
                width: 50, 
                height: 50, 
                objectFit: 'cover',
                borderRadius: 4
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/50'; // Fallback image
              }}
            />
          ) : (
            <div style={{
              width: 50,
              height: 50,
              background: '#f0f2f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4
            }}>
              <ShoppingOutlined style={{ fontSize: 20, color: '#999' }} />
            </div>
          )}
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Kateqoriya',
      dataIndex: 'category',
      key: 'category',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Qiymət',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
      align: 'right',
    },
    {
      title: 'Stok',
      dataIndex: 'stock', // Ensure your product data includes a 'stock' field
      key: 'stock',
      render: (text) => (
        <Tag color={text > 0 ? 'green' : 'red'}>
          {text > 0 ? `${text} stokda` : 'Stokda yoxdur'}
        </Tag>
      ),
      align: 'center',
    },
    {
      title: 'Hərəkətlər',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Redaktə Et
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Sil
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand">
            <DashboardOutlined className="logo-icon" />
            <Title level={3} className="logo-text">Admin Paneli</Title>
          </div>
          <Button 
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Çıxış
          </Button>
        </div>
      </header>

      <main className="dashboard-content">
        {/* Stats Cards */}
        <section className="stats-section">
          <Card title="Panelə Baxış" className="stats-card">
            <Spin spinning={loading.stats}>
              <div className="stats-grid">
                <Statistic 
                  title="Ümumi İstifadəçilər" 
                  value={stats.usersCount} 
                  prefix={<UserOutlined />}
                />
                <Statistic 
                  title="Ümumi Məhsullar" 
                  value={stats.productsCount} 
                  prefix={<ShoppingOutlined />}
                />
                <Statistic 
                  title="Gözləyən Sifarişlər" 
                  value={stats.pendingOrdersCount}
                  prefix={<OrderedListOutlined />}
                />
              </div>
            </Spin>
          </Card>
        </section>

        {/* Recent Activities */}
        <section className="activities-section">
          <Card 
            title="Son Fəaliyyətlər"
            loading={loading.activities}
            className="activities-card"
          >
            {activities.length > 0 ? (
              <ul className="activities-list">
                {activities.map((activity, index) => (
                  <li key={index} className="activity-item">
                    <Text type="secondary">[{activity.date}]</Text>{' '}
                    <Text>{activity.description}</Text>
                  </li>
                ))}
              </ul>
            ) : (
              <Text type="secondary">Son fəaliyyət yoxdur.</Text>
            )}
          </Card>
        </section>

        {/* Products Section */}
        <section className="products-section">
          <Card 
            title="Məhsul İdarəetməsi"
            extra={
              <Space>
                <Input
                  placeholder="Məhsulları axtar..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: 250 }}
                />
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  Məhsul Əlavə Et
                </Button>
              </Space>
            }
            className="products-card"
          >
            <Spin spinning={loading.products}>
              <Table
                columns={columns}
                dataSource={filteredProducts}
                rowKey="_id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Cəmi ${total} məhsul`,
                }}
                scroll={{ x: 'max-content' }}
              />
            </Spin>
          </Card>
        </section>
      </main>

      {/* Product Form Modal */}
      <Modal
        title={modal.mode === 'create' ? 'Yeni Məhsul Əlavə Et' : 'Məhsulu Redaktə Et'}
        open={modal.visible}
        onCancel={() => setModal({ ...modal, visible: false })}
        footer={null}
        width={800}
        centered
        destroyOnClose // Ensures the form remounts and resets when closed
      >
        {modal.mode === 'create' ? (
          <AddProductForm onAddSuccess={handleFormSuccess} />
        ) : (
          <ProductEditForm product={modal.product} onEditSuccess={handleFormSuccess} onCancel={() => setModal({ ...modal, visible: false })} />
        )}
      </Modal>

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background-color: #f5f7fa;
        }
        
        .dashboard-header {
          background: #001529;
          color: white;
          padding: 0 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 64px;
        }
        
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .logo-icon {
          font-size: 24px;
          color: #1890ff;
        }
        
        .logo-text {
          color: white !important;
          margin-bottom: 0;
        }
        
        .dashboard-content {
          max-width: 1200px;
          margin: 24px auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        
        .stats-card :global(.ant-card-head) {
          border-bottom: none;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        
        .activities-card {
          margin-bottom: 24px;
        }
        
        .activities-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .activity-item {
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .activity-item:last-child {
          border-bottom: none;
        }
        
        @media (max-width: 768px) {
          .header-content {
            padding: 0 16px;
          }
          
          .dashboard-content {
            padding: 0 16px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;