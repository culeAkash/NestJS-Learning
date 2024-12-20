export class CreatePostDto {
  title: string;
  content: string;
  authorId: string;
  published: boolean;
}

export class PostDto {
  id: string;
  title: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
  published: boolean | null;
  authorId: string | null;
  postImages: PostImageDto[];
  author: AuthorDto;
}

export class UpdatePostDto {
  title: string | null;
  content: string | null;
  published: boolean | null;
}

export class PostImageDto {
  id: string;
  imageUrl: string;
}

export class AuthorDto {
  name: string;
  email: string;
}
