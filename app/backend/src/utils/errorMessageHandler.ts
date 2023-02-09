type customErrorObj = {
  status: number,
  message: string
};

const errorMessages404: string[] = [
  'Team not found',
  'There is no team with such id!',
  'Match not found',
];

const errorMessages400: string[] = [
  'All fields must be filled',
  'Bad Request!',
];

const errorMessages401: string[] = [
  'Incorrect email or password',
  'Token must be a valid token',
];

const errorMessages422: string[] = [
  'It is not possible to create a match with two equal teams',
];

export default function errorMessageHandler(message: string): customErrorObj {
  if (errorMessages404.includes(message)) {
    return { status: 404, message };
  }

  if (errorMessages400.includes(message)) {
    return { status: 400, message };
  }

  if (errorMessages401.includes(message)) {
    return { status: 401, message };
  }

  if (errorMessages422.includes(message)) {
    return { status: 422, message };
  }

  return { status: 500, message: 'Erro não catalogado' };
}
