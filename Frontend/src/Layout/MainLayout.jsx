import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import './MainLayout.css';
import { Outlet } from 'react-router';

export default function MainLayout() {
  return (
    <div className="layout">
      <Header />
      <main className="layout-main">
        <Outlet/>
      </main>
      <Footer />
    </div>
  );
}
