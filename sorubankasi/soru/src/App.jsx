import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginForm from './components/login';
import Registration from './components/register';
import Teacher from './components/teacher';
import Student from './components/student';
import StudentExam from './components/studentExam';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Registration />} />
          <Route path = "/student/:firstName" element = {<Student/>}/>
          <Route path = "/teacher" element = {<Teacher/>}/>
          <Route path="*" element={<LoginForm />} /> {}
          <Route path="exam" element={<StudentExam />} /> {}
        </Routes>
      </div>
    </Router>
  );
}


export default App
