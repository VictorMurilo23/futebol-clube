const createMatch = {
  homeTeam: 16,
  awayTeam: 8,
  homeTeamGoals: 2,
  awayTeamGoals: 2,
};

const incorrectCreateMatch = {
  homeTeam: 16,
  awayTeam: 16,
}

const sameTeamsCreateMatch = {
  ...incorrectCreateMatch,
  homeTeamGoals: 2,
  awayTeamGoals: 2,
}

export { createMatch, incorrectCreateMatch, sameTeamsCreateMatch };
