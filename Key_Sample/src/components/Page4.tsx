
        import React, { useState, useEffect } from 'react';
        import "./Page4.css";
        import { useNavigate } from 'react-router-dom';
        
            import CreateBook from './Resource/CreateBook';
            export default function Page4() {
          const navigate = useNavigate();

          return (
            <>
            <div className="d-flex flex-column border border-2 h-50" id="id-7"><CreateBook/></div>
            </>
          );
        }