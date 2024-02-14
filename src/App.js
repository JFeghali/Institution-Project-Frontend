import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './home/login';
import InstitutionsTable from './institutions/institutions';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route  path="/" element={<Login />} />
        <Route path="/institutions" element={<InstitutionsTable />} />
      </Routes>
    </Router>
  );
};

export default App;
