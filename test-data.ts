type Credentials = {
  email: string;
  password: string;
  role?: string;
};

export const validUser: Credentials = {
    email: 'ua.testmail@gmail.com',
    password: 'Test@1234',
}

export function getLoginUrl(env: string): string {
    return `https://${env}.example.com/login`;
}