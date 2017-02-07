import {SafeUrl} from "@angular/platform-browser";
/**
 * Created by salho on 18.11.16.
 */
export class User {
  id?: string;
  username: string;
  password: string;
  email: string;
}

export interface Image {
  id: string;
  description?: string;
  uploaded: string;
  user: string;
  url?: SafeUrl;
}

export class POI {
  _id?: string;
  name: string;
  description: string;
  createdAt: Date;
  loc: {
    coordinates: number[]
  };
  images?: Image[];
  tags?: string;
}

export class Comment {
  _id?: string;
  creator?: {username: {local: string}};
  createdAt?: Date;
  content: string;
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
  likes?: [{userId; username: string}];
  liked?: boolean;
  comments?: [Comment];
}
