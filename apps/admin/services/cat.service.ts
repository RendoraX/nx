import api from '@/lib/interceptor/axiosRES';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types/cat.types';

// Static memory array mimicking live state
let cachedCat: Category[] = [
];

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    try {
        cachedCat = await api.get("http://localhost:4000/api/cat" , {
            withCredentials : true
        }).then(response => response.data.categories as Category[]);

        return cachedCat
    } catch (error) {
        return cachedCat as Category[]
    }
  },

  async getById(id: string): Promise<Category | undefined> {
    return cachedCat.find(c => c.id === id);
  },

  async create(input: CreateCategoryInput): Promise<Category> {
    const newCategory = {
      ...input,
    };

    await api.post("http://localhost:4000/api/cat" , newCategory , {withCredentials : true});
    cachedCat.push(newCategory as Category);
    return newCategory as Category;
  },

  async update(input: UpdateCategoryInput): Promise<Category> {
    const updated = await api.patch("http://localhost:4000/api/cat/update" , input , {withCredentials : true })
    return updated.data;
  },

  async delete(id: string): Promise<boolean> {
    const initialLength = cachedCat.length;
    await api.delete("http://localhost:4000/api/cat/delete" , {
      data : {
        id 
      },
      withCredentials : true
    });
    return cachedCat.length < initialLength;
  }
};