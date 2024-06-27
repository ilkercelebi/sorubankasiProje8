import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';

const Registration = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { email, password, role, firstName, lastName } = values;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fskbk
      await setDoc(doc(firestore, "users", user.uid), {
        firstName,
        lastName,
        email: user.email,
        role,
        uid: user.uid
      });

      message.success('Kayıt başarılı');
      setIsRegistered(true);
    } catch (error) {
      console.error('Error registering:', error);
      message.error('Kayıt başarısız: ' + error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    if (isRegistered) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isRegistered, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      {isRegistered ? (
        <div style={{ textAlign: 'center' }}>Kayıt başarılı, giriş sayfasına yönlendiriliyorsunuz...</div>
      ) : (
        <>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Kayıt Ol</h2>
          <Form
            name="registration"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ width: '100%', maxWidth: '400px', padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <Form.Item
              label="Ad"
              name="firstName"
              rules={[{ required: true, message: 'Lütfen adınızı giriniz' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Soyad"
              name="lastName"
              rules={[{ required: true, message: 'Lütfen soyadınızı giriniz' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="E-posta Adresi"
              name="email"
              rules={[{ required: true, message: 'Lütfen e-posta adresinizi giriniz' }, { type: 'email', message: 'Geçerli bir e-posta adresi giriniz' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Şifre"
              name="password"
              rules={[{ required: true, message: 'Lütfen şifrenizi giriniz' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Rol"
              name="role"
              rules={[{ required: true, message: 'Lütfen rolünüzü seçiniz' }]}
            >
              <Radio.Group>
                <Radio value="student">Öğrenci</Radio>
                <Radio value="teacher">Öğretmen</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Kayıt Ol
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};

export default Registration;
