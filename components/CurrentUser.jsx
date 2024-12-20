'use client';
import { useContext, useEffect, useState } from 'react';
import { inputsContext } from './Context';
import { useAuth } from '../components/authContext/AuthContext';

export default function CurrentUser() {
  const { profile_image, rerender } = useContext(inputsContext);

  const [user, setUser] = useState();
  const { data: session, status } = useAuth();
  console.log('session', session);

  useEffect(() => {
    if (status === 'authenticated') {
      getUserData();
    }
    // console.log('rerender from CurrentUser');
  }, [status, profile_image?.image, rerender]);

  async function getUserData() {
    if (session) {
      const email = session?.user?.email;
      // console.log('email', email);
      const response = await fetch(`/api/user?email=${email}`);
      const json = await response?.json();
      // console.log('json', json);
      if (response.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('CurrentUser', JSON.stringify(json[0]));
        }

        setUser(json[0]);
      }
    }
  }

  return { ...user };
}
