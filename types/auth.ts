export interface UserClaims {
    admin?: boolean;
    superUser?: boolean;
  }
  
  export interface AuthUser {
    uid: string;
    email: string | null;
    isSuperUser: boolean;
    isAdmin: boolean;
  }