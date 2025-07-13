
        import React, { useState, useEffect } from 'react';
        import "./Page5.css";
        import { useNavigate } from 'react-router-dom';
        
            import ReadBook from './Resource/ReadBook';
            export default function Page5() {
          const navigate = useNavigate();

          return (
            <>
            <div className="d-flex flex-column border border-2 h-50" id="id-9"><ReadBook/></div>
            </>
          );
        }