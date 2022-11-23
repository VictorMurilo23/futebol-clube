type customErrorObj = {
  status: number,
  message: string
};

export default function errorMessageHandler(message: string): customErrorObj {
  switch (message) {
    case 'All fields must be filled':
      return { status: 400, message };
    case 'Incorrect email or password':
      return { status: 401, message };
    case 'Insert a token':
      return { status: 401, message };
    case 'Expired or invalid token':
      return { status: 401, message };
    default:
      return { status: 500, message: 'Erro não catalogado' };
  }
}
