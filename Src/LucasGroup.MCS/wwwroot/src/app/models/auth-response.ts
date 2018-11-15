export class AuthResponse {
  user: AppUser;
  token: Token;
}

export class AppUser {
  userName: string;
  firstName: string;
  lastName: string;
  branchId: number;
  bullhornUserId: number;
  roles: string[];
}

export class Token {
  accessToken: string;
  bearerType: string;
  expiresOn: Date;
}
