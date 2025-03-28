
export type BlogPost = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  category: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};

export type BlogFormValues = {
  title: string;
  content: string;
  category: string;
  tags: string[];
  published: boolean;
};
