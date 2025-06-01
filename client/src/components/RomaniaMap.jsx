import React, { useEffect, useState } from 'react';
import { ReactComponent as RomaniaSVG } from './assets/romania-counties.svg';
import './RomaniaMap.css';

const RomaniaMap = () => {
  const [highlightedCounties, setHighlightedCounties] = useState([]);

  useEffect(() => {
    fetch('/api/user-counties') // Replace with your actual API endpoint
      .then((res) => res.json())
      .then((data) => {
        setHighlightedCounties(data.counties);
      })
      .catch(() => {
        setHighlightedCounties([]); // Fallback: no counties
      });
  }, []);

  useEffect(() => {
    highlightedCounties.forEach((county) => {
      const element = document.getElementById(county);
      if (element) {
        element.classList.add('highlighted');
      }
    });
  }, [highlightedCounties]);

  return (
    <div className="romania-map-container">
      <RomaniaSVG className="romania-map" />
    </div>
  );
};

export default RomaniaMap;
