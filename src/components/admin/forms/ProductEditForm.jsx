import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, InputNumber, Button, Select, message, Spin, Upload, Space } from 'antd'; // Space-i əlavə etdim
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const ProductEditForm = ({ product, onEditSuccess, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fileList, setFileList] = useState([]); // Yüklənmiş fayllar üçün state

    useEffect(() => {
        if (product) {
            form.setFieldsValue({
                name: product.name,
                category: product.category,
                price: product.price,
                stock: product.stock,
                description: product.description,
            });
            // Əgər mövcud bir şəkil varsa, onu fileList-ə əlavə edin (Ant Design Upload üçün)
            if (product.imageUrl) {
                setFileList([
                    {
                        uid: product._id, // Məhsulun ID-sini unikal ID kimi istifadə edə bilərik
                        name: product.imageUrl.split('/').pop(), // URL-dən fayl adını çıxarırıq
                        status: 'done',
                        url: product.imageUrl,
                        thumbUrl: product.imageUrl,
                    },
                ]);
            } else {
                setFileList([]);
            }
            setError(null);
        } else {
            setError("Məhsul məlumatları yüklənmədi. Zəhmət olmasa yenidən cəhd edin.");
        }
    }, [product, form]);

    const onFinish = async (values) => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('category', values.category);
            formData.append('price', values.price);
            formData.append('stock', values.stock);
            formData.append('description', values.description);

            let clearImage = false;

            if (fileList.length > 0 && fileList[0].originFileObj) {
                // Yeni şəkil seçilibsə
                formData.append('image', fileList[0].originFileObj);
            } else if (fileList.length === 0 && product.imageUrl) {
                // Şəkil əvvəl var idi, amma indi silinib (yeni şəkil yüklənməyib)
                // Bu o deməkdir ki, istifadəçi mövcud şəkli təmizləmək istəyir.
                clearImage = true;
                formData.append('clearImage', 'true'); // Backend string olaraq gözlədiyi üçün
            }
            // Əgər fileList.length === 1 və fileList[0].originFileObj yoxdursa
            // demək ki, mövcud şəkil saxlanılıb və heç bir dəyişiklik yoxdur.
            // Bu halda 'image' və 'clearImage' göndərməyə ehtiyac yoxdur.

            await axios.put(`http://localhost:5000/api/products/${product._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('Məhsul uğurla yeniləndi!');
            onEditSuccess();
        } catch (err) {
            console.error("Məhsul yenilənərkən xəta:", err);
            setError("Məhsul yenilənərkən xəta: " + (err.response?.data?.message || err.message));
            message.error('Məhsul yenilənə bilmədi.');
        } finally {
            setLoading(false);
        }
    };

    // Ant Design Upload üçün handleChange funksiyası
    const handleImageChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    // Fayl yükləməsini Ant Design-in özünün idarə etməsinə icazə verməmək üçün
    const beforeUpload = () => false; // Faylın avtomatik yüklənməsini qarşısını alır

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
    }

    if (!product) {
        return <Spin tip="Məhsul məlumatları yüklənir..." style={{ display: 'block', margin: '20px auto' }} />;
    }

    return (
        <Spin spinning={loading}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={product}
            >
                {/* Digər Form.Item sahələri... */}
                <Form.Item
                    name="name"
                    label="Məhsul Adı"
                    rules={[{ required: true, message: 'Zəhmət olmasa məhsul adını daxil edin!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="category"
                    label="Kateqoriya"
                    rules={[{ required: true, message: 'Zəhmət olmasa kateqoriya seçin!' }]}
                >
                    <Select placeholder="Kateqoriya seçin">
                        <Option value="Phone">Telefon</Option>
                        <Option value="Computer">Komputer</Option>
                        <Option value="Accessory">Aksesuar</Option>
                        {/* Lazım olduqda digər kateqoriyaları əlavə edin */}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Qiymət"
                    rules={[{ required: true, type: 'number', min: 0, message: 'Zəhmət olmasa düzgün qiymət daxil edin!' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="stock"
                    label="Stok"
                    rules={[{ required: true, type: 'number', min: 0, message: 'Zəhmət olmasa stok miqdarını daxil edin!' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Təsvir"
                    rules={[{ required: true, message: 'Zəhmət olmasa təsviri daxil edin!' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item label="Məhsul Şəkli">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleImageChange}
                        beforeUpload={beforeUpload}
                        maxCount={1}
                        onRemove={(file) => {
                            // İstifadəçi mövcud şəkli "X" düyməsinə basaraq silsə
                            const newFileList = fileList.filter(item => item.uid !== file.uid);
                            setFileList(newFileList);
                            return true; // Ant Design-ə silməyə icazə ver
                        }}
                    >
                        {fileList.length < 1 && (
                            <div>
                                <UploadOutlined />
                                <div style={{ marginTop: 8 }}>Şəkil Yüklə</div>
                            </div>
                        )}
                    </Upload>
                    {/* Fayl yoxdursa və əvvəlki URL mövcuddursa, onu göstər */}
                    {fileList.length === 0 && product && product.imageUrl && (
                        <div style={{ marginTop: 10 }}>
                            <img src={product.imageUrl} alt="Mövcud Şəkil" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                            <p style={{ fontSize: '12px', color: '#888' }}>Mövcud Şəkil (Dəyişmək və ya silmək üçün yeni yükləyin)</p>
                        </div>
                    )}
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Yenilə
                        </Button>
                        <Button onClick={onCancel}>Ləğv Et</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default ProductEditForm;