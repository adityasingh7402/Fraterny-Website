
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  published: boolean;
  category: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  image_key: string | null;
}

export interface BlogFormValues {
  title: string;
  content: string;
  category: string;
  tags: string[];
  published: boolean;
  image_key: string | null;
}
