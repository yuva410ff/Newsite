import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePlayer } from '../contexts/PlayerContext';
import { mockSongs, mockPlaylists } from './mock';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardContent } from './ui/card';
import { Play, Search, Music, User, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { play } = usePlayer();
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSongs(mockSongs);
    setPlaylists(mockPlaylists);
  }, []);

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlay = (song) => {
    play(song, songs);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-gray-800 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Music className="h-8 w-8 text-green-500" />
            <h1 className="text-2xl font-bold">Spotify Clone</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search songs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white w-80"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="text-sm">{user?.username}</span>
              <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-gray-700">
                <LogOut className="h-4 w-4" />
                <span className="ml-1">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 pb-24">
        {/* Popular Songs */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Popular Songs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSongs.map((song) => (
              <Card key={song.id} className="bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 border-gray-700">
                <CardContent className="p-6">
                  <div className="relative group">
                    <img 
                      src={song.cover} 
                      alt={song.title}
                      className="w-full aspect-square object-cover rounded-lg mb-4"
                    />
                    <Button 
                      onClick={() => handlePlay(song)}
                      className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold text-lg mb-1 truncate">{song.title}</h3>
                  <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                  <p className="text-gray-500 text-xs mt-1">{song.album}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Playlists */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Popular Playlists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <Card key={playlist.id} className="bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 border-gray-700">
                <CardContent className="p-6">
                  <div className="relative group">
                    <img 
                      src={playlist.cover} 
                      alt={playlist.name}
                      className="w-full aspect-square object-cover rounded-lg mb-4"
                    />
                    <Button 
                      className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold text-lg mb-1 truncate">{playlist.name}</h3>
                  <p className="text-gray-400 text-sm">{playlist.description}</p>
                  <p className="text-gray-500 text-xs mt-1">{playlist.songIds.length} songs</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;