import { useEffect, useState } from 'react';
import './App.css'
import { Route, Routes } from 'react-router-dom';
import RequireAuth from './middleware/RequireAuth';
import Login from './components/Login';
import Logout from './components/Logout';
import Navbar from './components/Navbar';
import Books from './components/Books';
import BookDetail from './components/BookDetail';
import BookBorrow from './components/BookBorrow';

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={
          <RequireAuth>
            <Logout />
          </RequireAuth>
        } />
        <Route path='/books' element={
          <RequireAuth>
            <Books />
          </RequireAuth>
        } />
        <Route path='/books/:id' element={
          <RequireAuth>
            <BookDetail />
          </RequireAuth>
        } />
        <Route path='/borrow' element={
          <RequireAuth>
            <BookBorrow />
          </RequireAuth>
        } />
      </Routes>
    </>
  );
}

export default App
