import React from 'react';
import { useRouter } from 'next/router';
import { Profile } from '../../components/Profile';
import { Header } from '../../components/Header';

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Header />
      <div className="container mt-30">
        <Profile
          avatarUrl="http://localhost:3000/static/avatar-so.jpg"
          fullname="Skrypnykov Oleh"
          username="skrypnykov"
          about="front-end developer"
        />
      </div>
    </>
  );
}
