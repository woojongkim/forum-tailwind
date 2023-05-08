export class Post {
    constructor(
      public _id: string,
      public category: string,
      public title: string,
      public content: string,
      public cuser: string,
      public cdate: Date,
      public view: number,
      public comments: number,
      public likes: number,
    ) {}

    static from(body: unknown): Post {
        const { _id, category, title, content, cuser, view, comments, likes } = body as any;
        return new Post(_id?.toString(), category, title, content, cuser, new Date(), view, comments, likes);
      }
  }