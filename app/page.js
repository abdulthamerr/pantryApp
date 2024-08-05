'use client';
import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);

  // Add or update item in database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.quantity !== '') {
      const existingItem = items.find(
        (item) => item.name.toLowerCase() === newItem.name.toLowerCase()
      );

      if (existingItem) {
        const updatedQuantity = parseInt(existingItem.quantity) + parseInt(newItem.quantity);
        await updateDoc(doc(db, 'items', existingItem.id), {
          quantity: updatedQuantity,
        });
      } else {
        await addDoc(collection(db, 'items'), {
          name: newItem.name.trim(),
          quantity: parseInt(newItem.quantity),
        });
      }

      setNewItem({ name: '', quantity: '' });
    }
  };

  // Read items from database
  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);

      // Calculate total quantity
      const calculateTotal = () => {
        const totalQuantity = itemsArr.reduce(
          (sum, item) => sum + parseInt(item.quantity),
          0
        );
        setTotal(totalQuantity);
      };
      calculateTotal();
      return () => unsubscribe();
    });
  }, []);

  // Delete items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  // Filtered items based on search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className='flex min-h-screen flex-col items-center justify-between sm:p-24 p-4 bg-gradient-to-b from-black to-gray-800 font-bold'>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap" rel="stylesheet" />
      
      <div className='z-10 w-full max-w-5xl items-center justify-between font-roboto text-sm'>
        <h1 className='text-4xl p-4 text-center text-white'>Welcome to your Pantry</h1>
        <h2 className='text-3xl p-3 text-center text-white'>Given to You by Thamer A</h2>

        <div className='bg-white p-4 rounded-lg'>
          <form className='grid grid-cols-6 items-center text-black'>
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className='col-span-3 p-3 border'
              type='text'
              placeholder='Enter Item'
            />
            <input
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
              className='col-span-2 p-3 border mx-3'
              type='number'
              placeholder='Enter Quantity'
            />
            <button
              onClick={addItem}
              className='text-white bg-[#003417] hover:bg-[#002d13] p-3 text-xl'
              type='submit'
            >
              +
            </button>
          </form>
          <div className='mt-4'>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full p-3 border text-black'
              type='text'
              placeholder='Search Items'
            />
          </div>
          <ul>
            {filteredItems.map((item, id) => (
              <li
                key={id}
                className='my-4 w-full flex justify-between bg-[#003417] text-white'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className='capitalize'>{item.name}</span>
                  <span>{item.quantity}</span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className='ml-8 p-4 border-l-2 border-[#002d13] hover:bg-[#002d13] w-16'
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          {items.length < 1 ? (
            ''
          ) : (
            <div className='flex justify-between p-3 text-black'>
              <span>Total</span>
              <span>{total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
