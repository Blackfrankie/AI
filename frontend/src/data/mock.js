// Mock data for Flappy Bird scores and game data
// This simulates backend data and will be replaced with real API calls later

export const mockScores = [
  { name: "Alex Champion", score: 47 },
  { name: "Bird Master", score: 42 },
  { name: "Sky Walker", score: 38 },
  { name: "Pipe Dodger", score: 35 },
  { name: "Flight Pro", score: 31 },
  { name: "Wing Commander", score: 28 },
  { name: "Aerial Ace", score: 25 },
  { name: "Cloud Surfer", score: 22 },
  { name: "Feather Light", score: 18 },
  { name: "Rookie Flyer", score: 12 }
];

export const mockGameStats = {
  totalGamesPlayed: 156,
  averageScore: 23.4,
  bestStreak: 8,
  totalPlayTime: "2h 34m"
};

export const mockAchievements = [
  {
    id: 1,
    name: "First Flight",
    description: "Score your first point",
    icon: "🐣",
    unlocked: true
  },
  {
    id: 2,
    name: "Sky High",
    description: "Score 10 points in a single game",
    icon: "🦅",
    unlocked: true
  },
  {
    id: 3,
    name: "Pipe Master",
    description: "Score 25 points in a single game",
    icon: "🏆",
    unlocked: false
  },
  {
    id: 4,
    name: "Wing Legend",
    description: "Score 50 points in a single game",
    icon: "👑",
    unlocked: false
  }
];

// Mock API simulation functions
export const mockApi = {
  // Simulate saving a score
  saveScore: async (playerName, score) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Mock API: Saved score ${score} for ${playerName}`);
        resolve({ success: true, message: "Score saved successfully" });
      }, 500);
    });
  },

  // Simulate fetching high scores
  getHighScores: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: mockScores
        });
      }, 300);
    });
  },

  // Simulate getting game stats
  getGameStats: async (playerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: mockGameStats
        });
      }, 400);
    });
  }
};