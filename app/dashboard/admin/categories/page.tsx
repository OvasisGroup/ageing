'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/layout';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  slug: string;
  isActive: boolean;
  createdAt: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  slug: string;
  isActive: boolean;
  categoryId: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const [categoryForm, setCategoryForm] = useState({
    title: '',
    description: '',
    image: null as File | null,
    isActive: true,
  });

  const [subcategoryForm, setSubcategoryForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    image: null as File | null,
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories?includeSubcategories=true');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', categoryForm.title);
    formData.append('description', categoryForm.description);
    formData.append('isActive', categoryForm.isActive.toString());
    if (categoryForm.image) {
      formData.append('image', categoryForm.image);
    }

    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories';
      
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success(editingCategory ? 'Category updated successfully' : 'Category created successfully');
        setShowCategoryModal(false);
        resetCategoryForm();
        fetchCategories();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Error saving category');
    }
  };

  const handleSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', subcategoryForm.title);
    formData.append('description', subcategoryForm.description);
    formData.append('categoryId', subcategoryForm.categoryId);
    formData.append('isActive', subcategoryForm.isActive.toString());
    if (subcategoryForm.image) {
      formData.append('image', subcategoryForm.image);
    }

    try {
      const url = editingSubcategory
        ? `/api/subcategories/${editingSubcategory.id}`
        : '/api/subcategories';
      
      const response = await fetch(url, {
        method: editingSubcategory ? 'PUT' : 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success(editingSubcategory ? 'Subcategory updated successfully' : 'Subcategory created successfully');
        setShowSubcategoryModal(false);
        resetSubcategoryForm();
        fetchCategories();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save subcategory');
      }
    } catch (error) {
      console.error('Error saving subcategory:', error);
      toast.error('Error saving subcategory');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure? This will also delete all subcategories.')) return;

    try {
      const response = await fetch(`/api/categories?ids=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Category deleted successfully');
        fetchCategories();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category');
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;

    try {
      const response = await fetch(`/api/subcategories?ids=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Subcategory deleted successfully');
        fetchCategories();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete subcategory');
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast.error('Error deleting subcategory');
    }
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      title: category.title,
      description: category.description || '',
      image: null,
      isActive: category.isActive,
    });
    setShowCategoryModal(true);
  };

  const openEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryForm({
      title: subcategory.title,
      description: subcategory.description || '',
      categoryId: subcategory.categoryId,
      image: null,
      isActive: subcategory.isActive,
    });
    setShowSubcategoryModal(true);
  };

  const openAddSubcategory = (categoryId: string) => {
    setSelectedCategoryForSub(categoryId);
    setSubcategoryForm({
      ...subcategoryForm,
      categoryId,
    });
    setShowSubcategoryModal(true);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      title: '',
      description: '',
      image: null,
      isActive: true,
    });
    setEditingCategory(null);
  };

  const resetSubcategoryForm = () => {
    setSubcategoryForm({
      title: '',
      description: '',
      categoryId: '',
      image: null,
      isActive: true,
    });
    setEditingSubcategory(null);
    setSelectedCategoryForSub('');
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Categories Management</h1>
            <p className="text-muted-foreground mt-1">Manage service categories and subcategories</p>
          </div>
          <Button onClick={() => setShowCategoryModal(true)}>
            + Add Category
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-muted-foreground">Total Categories</h3>
            <p className="text-2xl font-bold mt-1">{categories.length}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-muted-foreground">Total Subcategories</h3>
            <p className="text-2xl font-bold mt-1">
              {categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-muted-foreground">Active Categories</h3>
            <p className="text-2xl font-bold mt-1">
              {categories.filter(cat => cat.isActive).length}
            </p>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-card rounded-lg border">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No categories yet</p>
              <p className="text-sm mt-2">Click &quot;Add Category&quot; to create your first category</p>
            </div>
          ) : (
            <div className="divide-y">
              {categories.map((category) => (
                <div key={category.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {expandedCategories.has(category.id) ? '▼' : '▶'}
                      </button>
                      
                      {category.image && (
                        <img 
                          src={category.image} 
                          alt={category.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      
                      <div className="flex-1">
                        <h3 className="font-semibold flex items-center gap-2">
                          {category.title}
                          {!category.isActive && (
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                              Inactive
                            </span>
                          )}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {category.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {category.subcategories.length} subcategories
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openAddSubcategory(category.id)}
                      >
                        + Add Sub
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditCategory(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {expandedCategories.has(category.id) && category.subcategories.length > 0 && (
                    <div className="mt-4 ml-8 space-y-2">
                      {category.subcategories.map((sub) => (
                        <div 
                          key={sub.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {sub.image && (
                              <img 
                                src={sub.image} 
                                alt={sub.title}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <div>
                              <h4 className="font-medium text-sm flex items-center gap-2">
                                {sub.title}
                                {!sub.isActive && (
                                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                    Inactive
                                  </span>
                                )}
                              </h4>
                              {sub.description && (
                                <p className="text-xs text-muted-foreground">{sub.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditSubcategory(sub)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteSubcategory(sub.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h2>
            
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={categoryForm.title}
                  onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.files?.[0] || null })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="categoryActive"
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="categoryActive" className="text-sm font-medium">
                  Active
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCategoryModal(false);
                    resetCategoryForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
      {showSubcategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingSubcategory ? 'Edit Subcategory' : 'Add Subcategory'}
            </h2>
            
            <form onSubmit={handleSubcategorySubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={subcategoryForm.categoryId}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, categoryId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subcategoryForm.title}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, title: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Description</label>
                <textarea
                  value={subcategoryForm.description}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, image: e.target.files?.[0] || null })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="subcategoryActive"
                  checked={subcategoryForm.isActive}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="subcategoryActive" className="text-sm font-medium">
                  Active
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingSubcategory ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowSubcategoryModal(false);
                    resetSubcategoryForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
