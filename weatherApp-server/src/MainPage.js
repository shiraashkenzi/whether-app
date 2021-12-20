
import './App.css';
import { BrowserRouter as Router, Route,Routes , Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Weather from './components/Weather';
import RecentSearches from './components/RecentSearches';

export default function MainPage() {
  return (
    <div className="App">
 
 
  <Routes>
    <Route exact path="/" component={Weather}></Route>
    <Route exact path="/recentSearches" component={RecentSearches}></Route>
  </Routes>

    </div>
  );
}
