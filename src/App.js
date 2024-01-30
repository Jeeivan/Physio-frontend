import { Routes, Route } from "react-router-dom";
import ResponsePage from './pages/ResponsePage/ResponsePage';
import NavBar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import PhysioForm from './pages/PhysioForm/PhysioForm';
import Exercise from './pages/Exercise/Exercise';
import Faq from './pages/Faq/Faq';
import Management from './pages/Management/Management';
import { Logout } from "./components/logout";
import { Login } from "./components/login";
import Signup from "./components/signup";
import './App.css'
import PhysioFormUpdate from "./pages/PhysioForm/PhysioFormUpdate";
import Treatment from "./pages/Treatment/Treatment";
import Footer from "./components/Footer/Footer";
import Discussion from "./pages/Discussion/Discussion";

export default function App() {
  return (

    <main className="App">
      <NavBar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/form' element={<PhysioForm />} />
        <Route path='/form/update' element={<PhysioFormUpdate />} />
        <Route path='/response' element={<ResponsePage />} />
        <Route path='/exercise' element={<Exercise />} />
        <Route path='/management' element={<Management />} />
        <Route path='/faq' element={<Faq />} />
        <Route path='/discussion' element={<Discussion />} />
        <Route path="/treatments/add/:id" element={<Treatment />}/>
      </Routes>
      <Footer />
    </main>
  );
}
