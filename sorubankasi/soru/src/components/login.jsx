import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore, getDoc, doc } from '../firebase';

const LoginForm = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { email, password } = values;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Success:', user);

      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        const userData = userDoc.data();
        if (userData && userData.role === 'student') {
          navigate(`/student/${userData.firstName}`);
        } else if (userData && userData.role === 'teacher') {
          navigate('/teacher');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
      message.error('Giriş başarısız: ' + error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Giriş Yap</h2>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: '100%', maxWidth: '400px', padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
      >
        <Form.Item
          label="E-posta"
          name="email" 
          rules={[{ required: true, message: 'Lütfen e-posta adresinizi giriniz' }, { type: 'email', message: 'Geçerli bir e-posta adresi giriniz' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Parola"
          name="password"
          rules={[{ required: true, message: 'Lütfen parolanızı giriniz' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Beni Hatırla</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Giriş
          </Button>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="default" htmlType="button" onClick={handleRegisterClick}>
            Kayıt Ol
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
