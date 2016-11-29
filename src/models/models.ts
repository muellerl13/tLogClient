/**
 * Created by salho on 18.11.16.
 */
export class User {
  username: string;
  password: string;
  email: string;
}

export class Trip {
  name: string;
  description: string;
  begin: Date;
  end: Date;
  createdAt: Date;
  creator: {username: {local: string}}
}
