export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  status: 'active' | 'inactive';
  productCount: number;
  createdAt: string;
  children?: Category[];
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  parentId?: string | null;
  status: 'active' | 'inactive';
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}