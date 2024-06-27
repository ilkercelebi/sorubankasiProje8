import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Alert } from 'antd';
import { firestore, doc, getDoc } from '../firebase';

const ExamQuestions = ({ examId }) => {
  const [loading, setLoading] = useState(true);
  const [examData, setExamData] = useState(null);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const examDoc = doc(firestore, 'exams', examId);
        const docSnapshot = await getDoc(examDoc);

        if (docSnapshot.exists()) {
          setExamData(docSnapshot.data());
        } else {
          console.error('Sınav bulunamadı');
        }
      } catch (error) {
        console.error('Sınav yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [examId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Spin size="large" />
        <p>Sınav yükleniyor...</p>
      </div>
    );
  }

  if (!examData) {
    return (
      <Alert
        message="Hata"
        description="Sınav bilgileri yüklenemedi."
        type="error"
        showIcon
        style={{ marginTop: '20px' }}
      />
    );
  }

  return (
    <div>
      <h1>{examData.examCode} Sınavı</h1>
      <p>Sınav Süresi: {examData.duration} dakika</p>
      <p>Puanı: {examData.point}</p>
      <h2>Sorular</h2>
      <ul>
        {examData.questions.map((question, index) => (
          <li key={index}>
            <h3>Soru {index + 1}</h3>
            <p>{question.question}</p>
            <ul>
              <li>{question.choices.A}</li>
              <li>{question.choices.B}</li>
              <li>{question.choices.C}</li>
              <li>{question.choices.D}</li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExamQuestions;
