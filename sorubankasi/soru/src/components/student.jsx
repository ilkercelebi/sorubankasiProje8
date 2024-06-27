import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal, message, Select } from 'antd';
import { firestore, getDocs, collection, where, query } from '../firebase';
import ExamQuestions from './examQuestions';
import { LogoutOutlined } from '@ant-design/icons';

const { Option } = Select;

const Student = () => {
  const { firstName } = useParams();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterCategory, setFilterCategory] = useState("Tümü");
  const [showExamQuestions, setShowExamQuestions] = useState(false);

  useEffect(() => {
    fetchExams();
  }, [filterCategory]);

  const fetchExams = async () => {
    try {
      const examCollection = collection(firestore, 'exams');
      let snapshot;

      if (filterCategory !== "Tümü") {
        const q = query(examCollection, where('category', '==', filterCategory));
        snapshot = await getDocs(q);
      } else {
        snapshot = await getDocs(examCollection);
      }

      const examsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data };
      });
      setExams(examsData);
    } catch (error) {
      console.error('Sınavları getirme hatası:', error);
      message.error('Sınavları getirme hatası: ' + error.message);
    }
  };

  const handleToSolvedExamClick = () => {
    navigate('/exam');
  };

  const handleExamClick = (exam) => {
    setSelectedExam(exam);
    setModalVisible(true);
  };

  const handleModalConfirm = () => {
    setModalVisible(false);
    setShowExamQuestions(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setShowExamQuestions(false);
  };

  const handleCategoryChange = (value) => {
    setFilterCategory(value);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div>
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <LogoutOutlined style={{ fontSize: '24px', cursor: 'pointer' }} onClick={handleLogout} />
      </div>
      <div style={{ position: 'absolute', top: 10, right: 50 }}>
        <Button onClick={handleToSolvedExamClick}>
          Çözülmüş sınavlar
        </Button>
      </div>
      <h1>Öğrenci Adı: {firstName}</h1>
      <h2>Sınavlar</h2>

      {}
      <Select
        defaultValue="Tümü"
        style={{ width: 120, marginBottom: 16 }}
        onChange={handleCategoryChange}
      >
        <Option value="Tümü">Tümü</Option>
        <Option value="mat">Matematik</Option>
        <Option value="fiz">Fizik</Option>
        <Option value="kim">Kimya</Option>
        <Option value="web">React</Option>
      </Select>

      <ul>
        {exams.map((exam, index) => (
          <li key={index}>
            {exam.examCode} - {exam.duration} dakika - Puan: {exam.point}
            <Button type="primary" onClick={() => handleExamClick(exam)}>
              Sınava Gir
            </Button>
          </li>
        ))}
      </ul>

      {}
      <Modal
        title="Sınava Girmek İstiyor Musunuz?"
        visible={modalVisible}
        onOk={handleModalConfirm}
        onCancel={handleModalCancel}
        okText="Evet"
        cancelText="Hayır"
      >
        <p>{selectedExam && `${selectedExam.examCode} sınavına girmek istiyor musunuz?`}</p>
      </Modal>

      {}
      {showExamQuestions && selectedExam && (
        <ExamQuestions examId={selectedExam.id} />
      )}
    </div>
  );
};

export default Student;
