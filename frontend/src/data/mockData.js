export const mockData = {
  mens: {
    liveMatch: {
      homeTeam: 'Neon Strikers',
      awayTeam: 'Cyber United',
      homeScore: 2,
      awayScore: 1,
      minute: 67,
      homeForm: ['W', 'D', 'W', 'W', 'L'],
      awayForm: ['L', 'D', 'W', 'L', 'L'],
      poll: {
        homePercent: 65,
        awayPercent: 35
      }
    },
    standings: [
      { rank: 1, club: 'Neon Strikers', mp: 10, w: 8, d: 1, l: 1, gf: 24, ga: 10, gd: 14, pts: 25, form: ['W', 'D', 'W', 'W', 'L'] },
      { rank: 2, club: 'Spartan FC', mp: 10, w: 7, d: 2, l: 1, gf: 18, ga: 8, gd: 10, pts: 23, form: ['W', 'W', 'D', 'W', 'W'] },
      { rank: 3, club: 'Cyber United', mp: 10, w: 6, d: 1, l: 3, gf: 20, ga: 14, gd: 6, pts: 19, form: ['L', 'D', 'W', 'L', 'L'] },
      { rank: 4, club: 'Apex Predators', mp: 10, w: 5, d: 3, l: 2, gf: 15, ga: 11, gd: 4, pts: 18, form: ['D', 'W', 'D', 'L', 'W'] },
      { rank: 5, club: 'Shadow Runners', mp: 10, w: 3, d: 4, l: 3, gf: 12, ga: 15, gd: -3, pts: 13, form: ['D', 'L', 'D', 'W', 'L'] },
    ],
    players: [
      { id: 1, name: 'Alex Vance', club: 'Neon Strikers', rating: 89, pace: 92, shooting: 88, passing: 85, imgUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
      { id: 2, name: 'Marcus Cole', club: 'Spartan FC', rating: 87, pace: 80, shooting: 91, passing: 82, imgUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
      { id: 3, name: 'Julian Ray', club: 'Cyber United', rating: 85, pace: 85, shooting: 84, passing: 89, imgUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    ],
    vault: [
      { id: 1, category: 'Satire', headline: 'Manager Blames "Wind" for 4-0 Loss Inside Dome', snippet: 'In a stunning press conference, Cyber United coach deflects all blame.', date: 'Oct 24, 2026', imgUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
      { id: 2, category: 'Match Report', headline: 'Strikers Continue Dominance with Late Winner', snippet: 'A 90th-minute screamer ensures Neon Strikers stay top of the table.', date: 'Oct 22, 2026', imgUrl: 'https://images.unsplash.com/photo-1518605368461-1e1e1261160e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    ]
  },
  womens: {
    liveMatch: {
      homeTeam: 'Nova Phoenix',
      awayTeam: 'Valkyrie FC',
      homeScore: 3,
      awayScore: 3,
      minute: 82,
      homeForm: ['W', 'W', 'W', 'D', 'W'],
      awayForm: ['W', 'W', 'L', 'W', 'D'],
      poll: {
        homePercent: 52,
        awayPercent: 48
      }
    },
    standings: [
      { rank: 1, club: 'Nova Phoenix', mp: 10, w: 9, d: 1, l: 0, gf: 28, ga: 6, gd: 22, pts: 28, form: ['W', 'W', 'W', 'D', 'W'] },
      { rank: 2, club: 'Valkyrie FC', mp: 10, w: 8, d: 1, l: 1, gf: 25, ga: 9, gd: 16, pts: 25, form: ['W', 'W', 'L', 'W', 'D'] },
      { rank: 3, club: 'Crimson Wave', mp: 10, w: 6, d: 2, l: 2, gf: 18, ga: 11, gd: 7, pts: 20, form: ['W', 'L', 'W', 'D', 'D'] },
      { rank: 4, club: 'Lunar Eclipses', mp: 10, w: 5, d: 1, l: 4, gf: 14, ga: 14, gd: 0, pts: 16, form: ['L', 'W', 'L', 'W', 'L'] },
      { rank: 5, club: 'Aurora Edge', mp: 10, w: 3, d: 3, l: 4, gf: 10, ga: 16, gd: -6, pts: 12, form: ['D', 'D', 'L', 'W', 'D'] },
    ],
    players: [
      { id: 1, name: 'Sarah Chen', club: 'Nova Phoenix', rating: 91, pace: 94, shooting: 89, passing: 86, imgUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
      { id: 2, name: 'Elena Rostova', club: 'Valkyrie FC', rating: 88, pace: 82, shooting: 93, passing: 81, imgUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
      { id: 3, name: 'Mia Santos', club: 'Crimson Wave', rating: 86, pace: 88, shooting: 80, passing: 90, imgUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    ],
    vault: [
      { id: 1, category: 'Feature', headline: 'Inside the Mind of the League\'s Top Scorer', snippet: 'Sarah Chen opens up about her rigorous training regimes and mindset.', date: 'Oct 21, 2026', imgUrl: 'https://images.unsplash.com/photo-1551854616-8b898becc3b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
      { id: 2, category: 'Satire', headline: 'Referee Forgets Cards at Home, Gives Players "Disappointed Looks"', snippet: 'Players report feeling far worse than if they had been sent off.', date: 'Oct 19, 2026', imgUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    ]
  }
};
