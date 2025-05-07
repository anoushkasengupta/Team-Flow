'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  async function handleProfilePicChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const profilePic = reader.result as string;
        setUser({...user, profilePic});

        // Update profile picture in the database
        const res = await fetch('/api/users/' + user._id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profilePic }),
        });

        if (!res.ok) {
          console.error('Failed to update profile picture');
        }
      };
      reader.readAsDataURL(file);
    }
  }

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-white/10 backdrop-blur rounded-xl p-6 flex flex-col items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.profilePic || ''} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <input type="file" accept="image/*" onChange={handleProfilePicChange} className="mb-2" />
        <div className="text-white text-lg font-semibold">{user.name}</div>
        <div className="text-gray-400">{user.email}</div>
        <div className="text-gray-500 text-sm mb-4">{user.role}</div>
        <Button variant="destructive">Sign Out</Button>
      </div>
    </div>
  );
}
