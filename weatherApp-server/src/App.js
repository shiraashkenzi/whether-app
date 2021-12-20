import { BrowserRouter, Routes , Route } from 'react-router-dom'
import React from 'react';
import './App.css';
import Weather from './components/Weather';
import RecentSearches from './components/RecentSearches';

function App() {
  return (
  //basic router  
    <div className="App"> 
    
        <Routes>
          <Route path='/' element={<Weather />}></Route>
          <Route path='/recentSearches' element={<RecentSearches />}></Route>
        </Routes>    
    </div>
  

  );
}

export default App;