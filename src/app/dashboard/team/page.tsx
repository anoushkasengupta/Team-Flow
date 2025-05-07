'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { useSocketContext } from '@/components/layout/SocketProvider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePic: string;
}

interface RegisteredUser {
  _id: string;
  name: string;
}

const formSchema = z.object({
  user: z.string(),
});

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { socket } = useSocketContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: values.user }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Team member added successfully!');
        setOpen(false);
        // Refresh the team list
        fetchTeam();
      } else {
        setError(data.error || 'Failed to add team member');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/team');
      if (res.ok) {
        const data = await res.json();
        setTeam(data);
      } else {
        console.error('Failed to fetch team');
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.user.role);
        } else {
          console.error('Failed to fetch user role');
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      }
    };

    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await res.json();
        setRegisteredUsers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    }

    fetchUserRole();
    fetchUsers();
    fetchTeam();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onUserConnected = () => {
      // Implementation for user connected event
    };
    const onUserDisconnected = () => {
      // Implementation for user disconnected event
    };
    socket.on('userConnected', onUserConnected);
    socket.on('userDisconnected', onUserDisconnected);
    return () => {
      socket.off('userConnected', onUserConnected);
      socket.off('userDisconnected', onUserDisconnected);
    };
  }, [socket]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Team</h1>
        {(userRole === 'admin' || userRole === 'manager') && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-black">Add Team Member</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>
                  Create a new team member account.
                </DialogDescription>
              </DialogHeader>
              {error && <p className="text-red-600">{error}</p>}
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="user">User</Label>
                  <select 
                    id="user" 
                    className="w-full border rounded px-2 py-1" 
                    {...form.register("user")}
                  >
                    <option value="">Select a user</option>
                    {registeredUsers.length > 0 ? (
                      registeredUsers.map(user => (
                        <option key={user._id} value={user._id}>{user.name}</option>
                      ))
                    ) : (
                      <option disabled>No users available</option>
                    )}
                  </select>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Member'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {team.length > 0 ? (
          team.map(member => (
            <div key={member._id} className="flex items-center gap-4 bg-white/10 rounded-lg p-4">
              <Avatar>
                <AvatarImage src={member.profilePic} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-black">{member.name}</div>
                <div className="text-gray-400 text-sm">{member.role}</div>
                <div className="text-gray-500 text-xs">{member.email}</div>
              </div>
              {(userRole === 'admin' || userRole === 'manager') && (
                <Button variant="destructive" size="sm" onClick={() => handleDeleteMember(member._id)}>
                  Delete
                </Button>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-gray-500">
            No team members found. Add team members to get started.
          </div>
        )}
      </div>
    </div>
  );

  async function handleDeleteMember(memberId: string) {
    try {
      const res = await fetch(`/api/users/${memberId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Team member deleted successfully!');
        setTeam(prev => prev.filter(member => member._id !== memberId));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete team member');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      console.error(error);
    }
  }
}
