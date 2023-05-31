export interface Post {
    _id: string;
    category: string;
    title: string;
    content: string;
    cuser: string;
    cdate: Date;
    view: number;
    comments: number;
    likes: number;
  }