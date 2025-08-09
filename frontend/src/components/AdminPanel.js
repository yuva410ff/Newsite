import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockAPI } from './mock';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useToast } from '../hooks/use-toast';
import { Plus, Edit, Trash2, Users, Music, List, LogOut } from 'lucide-react';

const AdminPanel = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, songsData, playlistsData] = await Promise.all([
        mockAPI.getUsers(),
        mockAPI.getSongs(),
        mockAPI.getPlaylists()
      ]);
      setUsers(usersData);
      setSongs(songsData);
      setPlaylists(playlistsData);
    } catch (error) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    setLoading(true);
    try {
      if (type === 'user') {
        await mockAPI.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } else if (type === 'song') {
        await mockAPI.deleteSong(id);
        setSongs(songs.filter(s => s.id !== id));
      } else if (type === 'playlist') {
        await mockAPI.deletePlaylist(id);
        setPlaylists(playlists.filter(p => p.id !== id));
      }
      toast({
        title: "Success",
        description: `${type} deleted successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-gray-800 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Music className="h-8 w-8 text-green-500" />
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <Button variant="ghost" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="songs" className="flex items-center space-x-2">
              <Music className="h-4 w-4" />
              <span>Songs</span>
            </TabsTrigger>
            <TabsTrigger value="playlists" className="flex items-center space-x-2">
              <List className="h-4 w-4" />
              <span>Playlists</span>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-2xl font-bold">Manage Users</h2>
                <AddUserDialog onUserAdded={() => loadData()} />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={user.avatar} 
                          alt={user.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold">{user.username}</h3>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                          <span className={`text-xs px-2 py-1 rounded ${user.role === 'admin' ? 'bg-red-600' : 'bg-blue-600'}`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" disabled={user.id === '2004'}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete('user', user.id)}
                          disabled={loading || user.id === '2004'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Songs Tab */}
          <TabsContent value="songs">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-2xl font-bold">Manage Songs</h2>
                <AddSongDialog onSongAdded={() => loadData()} />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {songs.map((song) => (
                    <Card key={song.id} className="bg-gray-700/50 border-gray-600">
                      <CardContent className="p-4">
                        <img 
                          src={song.cover} 
                          alt={song.title}
                          className="w-full aspect-square object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold truncate">{song.title}</h3>
                        <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                        <p className="text-gray-500 text-xs">{song.duration}</p>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete('song', song.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Playlists Tab */}
          <TabsContent value="playlists">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-2xl font-bold">Manage Playlists</h2>
                <AddPlaylistDialog onPlaylistAdded={() => loadData()} />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playlists.map((playlist) => (
                    <Card key={playlist.id} className="bg-gray-700/50 border-gray-600">
                      <CardContent className="p-4">
                        <img 
                          src={playlist.cover} 
                          alt={playlist.name}
                          className="w-full aspect-square object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold truncate">{playlist.name}</h3>
                        <p className="text-gray-400 text-sm truncate">{playlist.description}</p>
                        <p className="text-gray-500 text-xs">{playlist.songIds.length} songs</p>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete('playlist', playlist.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Add User Dialog Component
const AddUserDialog = ({ onUserAdded }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user'
  });
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await mockAPI.createUser(formData);
      toast({
        title: "Success",
        description: "User created successfully"
      });
      setFormData({ username: '', email: '', role: 'user' });
      setOpen(false);
      onUserAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-gray-300">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            Create User
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Add Song Dialog Component
const AddSongDialog = ({ onSongAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    duration: '',
    genre: '',
    releaseYear: new Date().getFullYear()
  });
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await mockAPI.createSong({
        ...formData,
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
      });
      toast({
        title: "Success",
        description: "Song added successfully"
      });
      setFormData({
        title: '',
        artist: '',
        album: '',
        duration: '',
        genre: '',
        releaseYear: new Date().getFullYear()
      });
      setOpen(false);
      onSongAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Song
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Song</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-300">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="artist" className="text-gray-300">Artist</Label>
            <Input
              id="artist"
              value={formData.artist}
              onChange={(e) => setFormData({...formData, artist: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="album" className="text-gray-300">Album</Label>
            <Input
              id="album"
              value={formData.album}
              onChange={(e) => setFormData({...formData, album: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="duration" className="text-gray-300">Duration</Label>
            <Input
              id="duration"
              placeholder="3:45"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            Add Song
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Add Playlist Dialog Component
const AddPlaylistDialog = ({ onPlaylistAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true
  });
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await mockAPI.createPlaylist({
        ...formData,
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        songIds: [],
        userId: "2004"
      });
      toast({
        title: "Success",
        description: "Playlist created successfully"
      });
      setFormData({ name: '', description: '', isPublic: true });
      setOpen(false);
      onPlaylistAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Playlist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-300">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            Create Playlist
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;