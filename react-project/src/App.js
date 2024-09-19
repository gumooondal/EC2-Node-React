import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
//mport ProfileCard from './component/ProfileCard'; // ProfileCard 컴포넌트 import
import LoginPage from './component/login/LoginPage';
import TicketAddForm from './component/addForm/MainForm';
import TicketList from './component/list/TicketList';
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"></link>



function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/ticket-add" element={<TicketAddForm />} />
      <Route path="/ticket-list" element={<TicketList />} />
    </Routes>
  </Router>
  );
}

export default App;
