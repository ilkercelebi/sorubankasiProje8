import React, { useState, useEffect } from 'react';
import { Button, Collapse } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import { auth, firestore } from '../firebase';

const { Panel } = Collapse;

const solvedExams = [
  {
    id: 1,
    code: "EXAM001",
    correctCount: 5,
    wrongCount: 3,
    score: 70,
  },
  {
    id: 2,
    code: "EXAM002",
    correctCount: 6,
    wrongCount: 2,
    score: 80,
  },
  {
    id: 3,
    code: "MAT309",
    correctCount: 4,
    wrongCount: 5,
    score: 60,
  },
  {
    id: 4,
    code: "MAT307",
    correctCount: 3,
    wrongCount: 2,
    score: 40,
  }
];

const StudentExam = () => {
  const { firstName } = useParams(); 
  const [currentUser, setCurrentUser] = useState(null);
  const [showExams, setShowExams] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firestore.collection('users').doc(auth.currentUser.uid).get();
        if (userDoc.exists) {
          setCurrentUser(userDoc.data());
        } else {
          console.log('User data not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const toggleExams = () => {
    setShowExams(!showExams);
  };

  const onChange = (key) => {
    setActiveKey(key);
  };

  const handleToStudent = () => {
    if (currentUser) {
      navigate(`/student/${currentUser.firstName}`);
    }
  };

  const handleGoBack = () => {
    navigate(-1); 
  };

  const loginPage = () => {
    navigate("/login"); };

  return (
    <div style={styles.container}>
      <Button type="primary" onClick={toggleExams} style={styles.toggleButton}>
        Çözülmüş Sınavlar
      </Button>
      
      <div style={styles.goBackButtonContainer}>
        <Button onClick={handleGoBack}>
          Öğrenciye Git
        </Button>
      </div>
      <div style={styles.logoutButtonContainer}>
        <LogoutOutlined style={styles.logoutIcon} onClick={loginPage} />
      </div>
      {showExams && (
        <Collapse activeKey={activeKey} onChange={onChange} style={styles.collapse}>
          {solvedExams.map((exam) => (
            <Panel header={exam.code} key={exam.id.toString()}>
              <div style={styles.examDetails}>
                <p><strong>Doğru Sayısı:</strong> {exam.correctCount}</p>
                <p><strong>Yanlış Sayısı:</strong> {exam.wrongCount}</p>
                <p><strong>Puan:</strong> {exam.score}</p>
              </div>
            </Panel>
          ))}
        </Collapse>
      )}
    </div>
  );
};

const styles = {
  container: {
    margin: '20px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  toggleButton: {
    marginBottom: '20px',
  },
  navigateButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 120,
  },
  goBackButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 50,
  },
  logoutButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  logoutIcon: {
    fontSize: '24px',
    cursor: 'pointer',
  },
  collapse: {
    marginTop: '20px',
  },
  examDetails: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};

export default StudentExam;
