// Mock data for Spotify-like app
export const mockUsers = [
  {
    id: "1",
    username: "john_doe",
    email: "john@example.com",
    role: "user",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    username: "jane_smith", 
    email: "jane@example.com",
    role: "user",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    createdAt: "2024-02-10"
  },
  {
    id: "2004",
    username: "admin",
    email: "admin@spotify.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    createdAt: "2024-01-01"
  }
];

export const mockSongs = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    genre: "Pop",
    releaseYear: 2020
  },
  {
    id: "2", 
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: "2:54",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    genre: "Pop",
    releaseYear: 2020
  },
  {
    id: "3",
    title: "Good 4 U", 
    artist: "Olivia Rodrigo",
    album: "SOUR",
    duration: "2:58",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    genre: "Pop Rock",
    releaseYear: 2021
  },
  {
    id: "4",
    title: "Levitating",
    artist: "Dua Lipa", 
    album: "Future Nostalgia",
    duration: "3:23",
    cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    genre: "Disco Pop",
    releaseYear: 2020
  },
  {
    id: "5",
    title: "Stay",
    artist: "The Kid LAROI & Justin Bieber",
    album: "F*CK LOVE 3: OVER YOU",
    duration: "2:21", 
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    genre: "Pop",
    releaseYear: 2021
  }
];

export const mockPlaylists = [
  {
    id: "1",
    name: "My Favorites",
    description: "Songs I love the most",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    songIds: ["1", "3", "5"],
    userId: "1",
    isPublic: true,
    createdAt: "2024-03-01"
  },
  {
    id: "2",
    name: "Workout Mix",
    description: "High energy tracks for the gym",
    cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop", 
    songIds: ["2", "4"],
    userId: "1",
    isPublic: false,
    createdAt: "2024-03-15"
  },
  {
    id: "3",
    name: "Chill Vibes",
    description: "Relaxing tunes for any mood",
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
    songIds: ["1", "2", "4"],
    userId: "2",
    isPublic: true, 
    createdAt: "2024-02-20"
  }
];

// Auth helpers
export const mockLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => 
        u.username === username || u.email === username
      );
      
      if (user) {
        // Admin requires correct password, regular users accept any password
        if (user.id === "2004" && password !== "14") {
          reject(new Error("Invalid credentials"));
          return;
        }
        resolve(user);
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
};

// CRUD operations helpers
export const mockAPI = {
  // Users
  getUsers: () => Promise.resolve(mockUsers),
  createUser: (userData) => {
    const newUser = { id: Date.now().toString(), ...userData, createdAt: new Date().toISOString() };
    mockUsers.push(newUser);
    return Promise.resolve(newUser);
  },
  updateUser: (id, userData) => {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...userData };
      return Promise.resolve(mockUsers[index]);
    }
    return Promise.reject(new Error("User not found"));
  },
  deleteUser: (id) => {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mockUsers.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.reject(new Error("User not found"));
  },

  // Songs
  getSongs: () => Promise.resolve(mockSongs),
  createSong: (songData) => {
    const newSong = { id: Date.now().toString(), ...songData };
    mockSongs.push(newSong);
    return Promise.resolve(newSong);
  },
  updateSong: (id, songData) => {
    const index = mockSongs.findIndex(s => s.id === id);
    if (index !== -1) {
      mockSongs[index] = { ...mockSongs[index], ...songData };
      return Promise.resolve(mockSongs[index]);
    }
    return Promise.reject(new Error("Song not found"));
  },
  deleteSong: (id) => {
    const index = mockSongs.findIndex(s => s.id === id);
    if (index !== -1) {
      mockSongs.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.reject(new Error("Song not found"));
  },

  // Playlists
  getPlaylists: () => Promise.resolve(mockPlaylists),
  createPlaylist: (playlistData) => {
    const newPlaylist = { 
      id: Date.now().toString(), 
      ...playlistData, 
      createdAt: new Date().toISOString() 
    };
    mockPlaylists.push(newPlaylist);
    return Promise.resolve(newPlaylist);
  },
  updatePlaylist: (id, playlistData) => {
    const index = mockPlaylists.findIndex(p => p.id === id);
    if (index !== -1) {
      mockPlaylists[index] = { ...mockPlaylists[index], ...playlistData };
      return Promise.resolve(mockPlaylists[index]);
    }
    return Promise.reject(new Error("Playlist not found"));
  },
  deletePlaylist: (id) => {
    const index = mockPlaylists.findIndex(p => p.id === id);
    if (index !== -1) {
      mockPlaylists.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.reject(new Error("Playlist not found"));
  }
};