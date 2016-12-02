
/**
 * Created by salho on 18.11.16.
 */
export class User {
  username: string;
  password: string;
  email: string;
}

export class POI {
  _id?: string
  name: string;
  description: string;
  createdAt: Date;
  loc: {
    coordinates: [number]
  }
}

export class Trip {
  _id?: string;
  name: string;
  description?: string;
  begin?: Date;
  end?: Date;
  createdAt?: Date;
  creator?: {username: {local: string}};
  pois?:[POI];
}
