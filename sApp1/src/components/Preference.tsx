import React, { useState } from 'react';
import './Preference.css';
import CreateProgrampreference from './resources/CreateProgrampreference';

const programOptions = [
  "B.Tech CSE",
  "B.Tech ECE",
  "B.Tech Artificial Intelligence & Data Science",
  "Integrated Master of Technology CSE",
  "Integrated Master of Technology ECE"
];

export default function Preference() {
  
  return(
    <div>
      <CreateProgrampreference/>
    </div>
  )
}
