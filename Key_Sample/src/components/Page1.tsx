import React from 'react';
import { Outlet } from 'react-router-dom';
import SharedLayout from './SharedLayout';

export default function Page1() {
  return (
    <SharedLayout>
      <Outlet />
    </SharedLayout>
  );
}