import { BrowserRouter, Routes , Route } from 'react-router-dom'
import React from 'react';
import './App.css';
import Weather from './components/Weather';
import Favorites from './components/Favorites';

function App() {
  return (
  
    <div className="App">    
        <Routes>
          <Route path='/' element={<Weather />}></Route>
          <Route path='/favorites' element={<Favorites />}></Route>
        </Routes>    
    </div>
  

  );
}

export default App;