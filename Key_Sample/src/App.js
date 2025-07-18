import Page2 from "./components/Page2";
import Login from "./components/Login";
import Page1 from "./components/Page1";
import Dashboard from "./components/Dashboard";
import Education from "./components/Education";
import Personal from "./components/Personal";
import Guardian from "./components/Guardian";
import Preference from "./components/Preference";
import Payment from "./components/Payment";
import Exam from "./components/Exam";
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Edit from './components/Edit/Edit';
import Page13 from "./components/Page13";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Forbidden403 from "./components/Forbidden403";

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />}/>
      <Route path='/register' element={<Register />}/>
      <Route path='/forbidden' element={<Forbidden403 />}/>
      
      <Route path='/' element={
        <ProtectedRoute>
          <Page1 />
        </ProtectedRoute>
      }>
        <Route path='/page2' element={<Page2 />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/personal' element={<Personal />}/>
        <Route path='/guardian' element={<Guardian />}/>
        <Route path='/preference' element={<Preference />}/>
        <Route path='/exam' element={<Exam />}/>
        <Route path='/education' element={<Education />}/>
        <Route path='/payment' element={<Payment />}/>
        <Route path='/edit' element={<Edit/>}/>
        <Route path='/page13' element={<Page13 />}/>
      </Route>
    </Routes>
  );
}

export default App;