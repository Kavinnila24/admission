
        import React, { useState, useEffect } from 'react';
        import "./Page3.css";
        import { useNavigate } from 'react-router-dom';
        
            import ReadAuthor from './Resource/ReadAuthor';
            export default function Page3() {
          const navigate = useNavigate();

          return (
            <>
            <div className="d-flex flex-column border border-2 h-50" id="id-5"><ReadAuthor/></div>
            </>
          );
        }