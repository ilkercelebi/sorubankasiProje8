import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Popconfirm, Select, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { firestore, doc, setDoc, getDoc, getDocs, collection, deleteDoc } from '../firebase';
import { LogoutOutlined } from '@ant-design/icons';

const { Option } = Select;

const Teacher = () => {
  const navigate = useNavigate();
  const [numQuestions, setNumQuestions] = useState(1);
  const [form] = Form.useForm();
  const [exams, setExams] = useState([]);
  const [showNewExamForm, setShowNewExamForm] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const examCollection = collection(firestore, 'exams');
      const snapshot = await getDocs(examCollection);
      const examsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExams(examsData);
    } catch (error) {
      console.error('Sınavları getirme hatası:', error);
      message.error('Sınavları getirme hatası: ' + error.message);
    }
  };

  const renderQuestionForms = () => {
    const forms = [];
    for (let i = 1; i <= numQuestions; i++) {
      forms.push(
        <div key={i} style={{ marginBottom: '24px' }}>
          <h3>{`Soru ${i}`}</h3>
          <Form.Item
            label="Soru Metni"
            name={`question${i}`}
            rules={[{ required: true, message: 'Lütfen soru metnini girin' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Doğru Cevap"
            name={`correctAnswer${i}`}
            rules={[{ required: true, message: 'Lütfen doğru cevabı girin' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Şık A"
            name={`choiceA${i}`}
            rules={[{ required: true, message: 'Lütfen şık A\'yı girin' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Şık B"
            name={`choiceB${i}`}
            rules={[{ required: true, message: 'Lütfen şık B\'yi girin' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Şık C"
            name={`choiceC${i}`}
            rules={[{ required: true, message: 'Lütfen şık C\'yi girin' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Şık D"
            name={`choiceD${i}`}
            rules={[{ required: true, message: 'Lütfen şık D\'yi girin' }]}
          >
            <Input />
          </Form.Item>
        </div>
      );
    }
    return forms;
  };

  const handleSaveExam = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const questions = [];

      for (let i = 1; i <= numQuestions; i++) {
        questions.push({
          question: values[`question${i}`],
          correctAnswer: values[`correctAnswer${i}`],
          choices: {
            A: values[`choiceA${i}`],
            B: values[`choiceB${i}`],
            C: values[`choiceC${i}`],
            D: values[`choiceD${i}`],
          },
        });
      }

      const examData = {
        examCode: values.examCode,
        category: values.category,
        point: values.point,
        duration: values.duration,
        questions: questions,
      };

      await setDoc(doc(firestore, 'exams', examData.examCode), examData);
      message.success('Sınav başarıyla kaydedildi');
      fetchExams();
      form.resetFields();
      setShowNewExamForm(false);
    } catch (error) {
      console.error('Sınav kaydı başarısız:', error);
      message.error('Sınav kaydı başarısız: ' + error.message);
    }
  };

  const handleNumQuestionsChange = (e) => {
    setNumQuestions(parseInt(e.target.value) || 1);
  };

  const handleExamClick = async (examCode) => {
    try {
      const examDoc = doc(firestore, 'exams', examCode);
      const examSnap = await getDoc(examDoc);
      if (examSnap.exists()) {
        const examData = examSnap.data();
        const questionFields = examData.questions.reduce((acc, question, index) => {
          acc[`question${index + 1}`] = question.question;
          acc[`correctAnswer${index + 1}`] = question.correctAnswer;
          acc[`choiceA${index + 1}`] = question.choices.A;
          acc[`choiceB${index + 1}`] = question.choices.B;
          acc[`choiceC${index + 1}`] = question.choices.C;
          acc[`choiceD${index + 1}`] = question.choices.D;
          return acc;
        }, {});

        form.setFieldsValue({
          examCode: examData.examCode,
          category: examData.category,
          point: examData.point,
          duration: examData.duration,
          ...questionFields,
        });

        setNumQuestions(examData.questions.length);
      } else {
        message.error('Sınav bulunamadı');
      }
    } catch (error) {
      console.error('Sınav detayları getirme hatası:', error);
      message.error('Sınav detayları getirme hatası: ' + error.message);
    }
  };

  const handleDeleteExam = async (examId) => {
    try {
      await deleteDoc(doc(firestore, 'exams', examId));
      message.success('Sınav başarıyla silindi');
      fetchExams();
    } catch (error) {
      console.error('Sınav silme hatası:', error);
      message.error('Sınav silme hatası: ' + error.message);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    
      <div style={{ width: '70%' }}>
        <Card title="Yeni Sınav Ekle">
        
          {showNewExamForm ? (
            <Form
              form={form}
              name="newExamForm"
              onFinish={handleSaveExam}
              initialValues={{
                examCode: '',
                category: '',
                point: '',
                duration: '',
                numQuestions: 1,
              }}
              style={{
                backgroundColor: '#f0f2f5',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                marginTop: '16px',
              }}
            >
              <Form.Item
                label="Sınav Kodu"
                name="examCode"
                rules={[{ required: true, message: 'Lütfen sınav kodunu girin' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Kategori"
                name="category"
                rules={[{ required: true, message: 'Lütfen sınav kategorisini girin' }]}
              >
                <Select>
                  <Option value="mat">Matematik</Option>
                  <Option value="fiz">Fizik</Option>
                  <Option value="kim">Kimya</Option>
                  <Option value="web">React</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Puan"
                name="point"
                rules={[{ required: true, message: 'Lütfen sınavın puanını girin' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Süre (dakika)"
                name="duration"
                rules={[{ required: true, message: 'Lütfen sınav süresini girin' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Soru Sayısı"
                name="numQuestions"
                rules={[{ required: true, message: 'Lütfen soru sayısını girin' }]}
              >
                <Input onChange={handleNumQuestionsChange} />
              </Form.Item>
              {renderQuestionForms()}
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Kaydet
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => setShowNewExamForm(false)}>
                  İptal
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Button onClick={() => setShowNewExamForm(true)} type="primary" style={{ marginBottom: 16 }}>
              Yeni Sınav Ekle
            </Button>
          )}
        </Card>
      </div>
      <div style={{ width: '30%' }}>
        <Card title="Sınav Menüsü">
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <LogoutOutlined style={{ fontSize: '24px', cursor: 'pointer' }} onClick={handleLogout} />
      </div>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {exams.map((exam, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>
                <span onClick={() => handleExamClick(exam.id)} style={{ cursor: 'pointer' }}>
                  {exam.examCode} - {exam.category}
                </span>
                <Popconfirm
                  title="Sınavı silmek istediğinizden emin misiniz?"
                  onConfirm={() => handleDeleteExam(exam.id)}
                  okText="Evet"
                  cancelText="Hayır"
                >
                  <Button type="link" danger style={{ marginLeft: 8 }}>
                    Sil
                  </Button>
                </Popconfirm>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Teacher;
