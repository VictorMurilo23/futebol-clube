const matchesMock = [
  {
    id: 1,
    homeTeam: 16,
    homeTeamGoals: 1,
    awayTeam: 8,
    awayTeamGoals: 1,
    inProgress: false,
    teamHome: {
      teamName: "São Paulo",
    },
    teamAway: {
      teamName: "Grêmio",
    },
  },
  {
    id: 2,
    homeTeam: 9,
    homeTeamGoals: 1,
    awayTeam: 14,
    awayTeamGoals: 1,
    inProgress: false,
    teamHome: {
      teamName: "Internacional",
    },
    teamAway: {
      teamName: "Santos",
    },
  },
  {
    id: 3,
    homeTeam: 4,
    homeTeamGoals: 3,
    awayTeam: 11,
    awayTeamGoals: 0,
    inProgress: false,
    teamHome: {
      teamName: "Corinthians",
    },
    teamAway: {
      teamName: "Napoli-SC",
    },
  },
  {
    id: 41,
    homeTeam: 16,
    homeTeamGoals: 2,
    awayTeam: 9,
    awayTeamGoals: 0,
    inProgress: true,
    teamHome: {
      teamName: "São Paulo",
    },
    teamAway: {
      teamName: "Internacional",
    },
  },
  {
    id: 42,
    homeTeam: 6,
    homeTeamGoals: 1,
    awayTeam: 1,
    awayTeamGoals: 0,
    inProgress: true,
    teamHome: {
      teamName: "Ferroviária",
    },
    teamAway: {
      teamName: "Avaí/Kindermann",
    },
  },
  {
    id: 43,
    homeTeam: 11,
    homeTeamGoals: 0,
    awayTeam: 10,
    awayTeamGoals: 0,
    inProgress: true,
    teamHome: {
      teamName: "Napoli-SC",
    },
    teamAway: {
      teamName: "Minas Brasília",
    },
  },
];

const inProgressMatches = [
  {
    id: 41,
    homeTeam: 16,
    homeTeamGoals: 2,
    awayTeam: 9,
    awayTeamGoals: 0,
    inProgress: true,
    teamHome: {
      teamName: "São Paulo",
    },
    teamAway: {
      teamName: "Internacional",
    },
  },
  {
    id: 42,
    homeTeam: 6,
    homeTeamGoals: 1,
    awayTeam: 1,
    awayTeamGoals: 0,
    inProgress: true,
    teamHome: {
      teamName: "Ferroviária",
    },
    teamAway: {
      teamName: "Avaí/Kindermann",
    },
  },
  {
    id: 43,
    homeTeam: 11,
    homeTeamGoals: 0,
    awayTeam: 10,
    awayTeamGoals: 0,
    inProgress: true,
    teamHome: {
      teamName: "Napoli-SC",
    },
    teamAway: {
      teamName: "Minas Brasília",
    },
  },
];

const notInProgressMatches = [
  {
    id: 1,
    homeTeam: 16,
    homeTeamGoals: 1,
    awayTeam: 8,
    awayTeamGoals: 1,
    inProgress: false,
    teamHome: {
      teamName: "São Paulo",
    },
    teamAway: {
      teamName: "Grêmio",
    },
  },
  {
    id: 2,
    homeTeam: 9,
    homeTeamGoals: 1,
    awayTeam: 14,
    awayTeamGoals: 1,
    inProgress: false,
    teamHome: {
      teamName: "Internacional",
    },
    teamAway: {
      teamName: "Santos",
    },
  },
  {
    id: 3,
    homeTeam: 4,
    homeTeamGoals: 3,
    awayTeam: 11,
    awayTeamGoals: 0,
    inProgress: false,
    teamHome: {
      teamName: "Corinthians",
    },
    teamAway: {
      teamName: "Napoli-SC",
    },
  },
];

const match = {
  id: 2,
  homeTeam: 9,
  homeTeamGoals: 1,
  awayTeam: 14,
  awayTeamGoals: 1,
  inProgress: false,
};

const updateMatch = {
  homeTeamGoals: 3,
  awayTeamGoals: 1,
};

export { matchesMock, inProgressMatches, notInProgressMatches, match, updateMatch };
