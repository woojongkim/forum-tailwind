export interface Comment{
    _id: string;
    post_id: string;
    content: string;
    cuser: string;
    cdate: Date;
    likes: number;
    comments: Comment[];
}