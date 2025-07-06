import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Page2.css";

import ReadApplicant from './resources/ReadApplicant';

export default function Page13() {
  const navigate = useNavigate();

  return (
    <>
      <div className="d-flex flex-column border border-2 h-50" id="id-99">
        <ReadApplicant />
      </div>
    </>
  );
}