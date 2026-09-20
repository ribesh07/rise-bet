'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Newspaper,
  RefreshCw,
  AlertTriangle,
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  Tag,
  User as UserIcon,
  EyeOff,
  TrendingUp,
  FolderOpen,
  CheckCircle2,
  XCircle,
  Save,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { GlassCard, GlassHeader } from '@/components/ui/GlassCard';
import { SkeletonRows } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Switch } from '@/components/ui/Switch';

import { fetchPosts, fetchCategories } from '@/lib/api';
import type { Post, Category } from '@/lib/types';
import { formatNumber, formatDate, cn } from '@/lib/utils';

type ViewMode = 'posts' | 'categories';

interface PostForm {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  content: string;
  published: boolean;
}

interface CategoryForm {
  id: string;
  name: string;
  slug: string;
}

const emptyPostForm: PostForm = {
  id: '',
  title: '',
  slug: '',
  categoryId: '',
  content: '',
  published: true,
};

const emptyCategoryForm: CategoryForm = {
  id: '',
  name: '',
  slug: '',
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function BlogPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('posts');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const [postModalOpen, setPostModalOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postForm, setPostForm] = useState<PostForm>(emptyPostForm);
  const [submittingPost, setSubmittingPost] = useState<boolean>(false);

  const [categoryModalOpen, setCategoryModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategoryForm);
  const [submittingCategory, setSubmittingCategory] = useState<boolean>(false);

  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    type: 'post' | 'category';
    id: string;
    name: string;
  }>({ open: false, type: 'post', id: '', name: '' });

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [postsRes, catsRes] = await Promise.all([fetchPosts(), fetchCategories()]);
      if (!postsRes.success) throw new Error(postsRes.message || 'Failed to load posts');
      setPosts(postsRes.data || []);
      setCategories(catsRes.success ? (catsRes.data || []) : []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error loading blog';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, statusFilter, viewMode]);

  const handleRetry = () => void loadData();

  const filteredPosts = React.useMemo(() => {
    return posts.filter((p) => {
      if (search) {
        const s = search.toLowerCase();
        if (
          !p.title.toLowerCase().includes(s) &&
          !p.slug.toLowerCase().includes(s) &&
          !p.author.toLowerCase().includes(s)
        ) {
          return false;
        }
      }
      if (categoryFilter && p.categoryId !== categoryFilter) return false;
      if (statusFilter === 'published' && !p.published) return false;
      if (statusFilter === 'draft' && p.published) return false;
      return true;
    });
  }, [posts, search, categoryFilter, statusFilter]);

  const totalPublished = posts.filter((p) => p.published).length;
  const totalViews = posts.reduce((s, p) => s + p.viewsCount, 0);

  const postColumns: Column<Post>[] = [
    {
      key: 'post',
      header: 'Post',
      width: '300px',
      cell: (row) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 overflow-hidden">
            {row.image ? (
              <span className="text-xs text-gold truncate w-full text-center px-1">IMG</span>
            ) : (
              <Newspaper className="w-5 h-5 text-gold" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold truncate">{row.title}</p>
            <p className="text-muted text-xs truncate">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'author',
      header: 'Author',
      width: '140px',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <UserIcon className="w-3.5 h-3.5 text-muted shrink-0" />
          <span className="text-gray-300 text-sm">{row.author}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      width: '150px',
      cell: (row) => (
        <Badge variant="pill" className="w-fit">
          <Tag className="w-3 h-3 mr-1" />
          {row.categoryName || 'Uncategorized'}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      cell: (row) =>
        row.published ? (
          <Badge variant="success">
            <Eye className="w-3 h-3 mr-1" />
            Published
          </Badge>
        ) : (
          <Badge variant="muted">
            <EyeOff className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        ),
    },
    {
      key: 'views',
      header: 'Views',
      width: '110px',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5 text-white font-semibold">
          <TrendingUp className="w-3.5 h-3.5 text-info" />
          {formatNumber(row.viewsCount)}
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Updated',
      width: '130px',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-sm text-gray-300">
          <Calendar className="w-3.5 h-3.5 text-muted shrink-0" />
          <span>{formatDate(row.updatedAt)}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Edit3 className="w-4 h-4 text-gold" />}
            onClick={(e) => {
              e.stopPropagation();
              openEditPost(row);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Trash2 className="w-4 h-4 text-danger" />}
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDelete({ open: true, type: 'post', id: row.id, name: row.title });
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const categoryColumns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Name',
      width: '240px',
      cell: (row) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
            <FolderOpen className="w-4 h-4 text-gold" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold truncate">{row.name}</p>
            <p className="text-muted text-xs truncate">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'posts',
      header: 'Posts',
      width: '120px',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-white font-semibold">
          <Newspaper className="w-3.5 h-3.5 text-info" />
          {row.postCount}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Edit3 className="w-4 h-4 text-gold" />}
            onClick={(e) => {
              e.stopPropagation();
              openEditCategory(row);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Trash2 className="w-4 h-4 text-danger" />}
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDelete({ open: true, type: 'category', id: row.id, name: row.name });
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const openAddPost = () => {
    setEditingPost(null);
    setPostForm({ ...emptyPostForm, categoryId: categories[0]?.id || '' });
    setPostModalOpen(true);
  };

  const openEditPost = (p: Post) => {
    setEditingPost(p);
    setPostForm({
      id: p.id,
      title: p.title,
      slug: p.slug,
      categoryId: p.categoryId,
      content: p.content,
      published: p.published,
    });
    setPostModalOpen(true);
  };

  const submitPost = async () => {
    if (!postForm.title.trim()) {
      toast.error('Post title is required');
      return;
    }
    if (!postForm.categoryId) {
      toast.error('Please select a category');
      return;
    }
    setSubmittingPost(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const cat = categories.find((c) => c.id === postForm.categoryId);
      if (editingPost) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === editingPost.id
              ? {
                  ...p,
                  title: postForm.title,
                  slug: postForm.slug || slugify(postForm.title),
                  categoryId: postForm.categoryId,
                  categoryName: cat?.name,
                  content: postForm.content,
                  published: postForm.published,
                  updatedAt: new Date().toISOString(),
                }
              : p
          )
        );
        toast.success(`Post "${postForm.title}" updated`);
      } else {
        const newPost: Post = {
          id: `post-${Date.now()}`,
          title: postForm.title,
          slug: postForm.slug || slugify(postForm.title),
          author: 'admin',
          categoryId: postForm.categoryId,
          categoryName: cat?.name,
          content: postForm.content,
          published: postForm.published,
          viewsCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setPosts((prev) => [newPost, ...prev]);
        setCategories((prev) =>
          prev.map((c) => (c.id === newPost.categoryId ? { ...c, postCount: c.postCount + 1 } : c))
        );
        toast.success(`Post "${newPost.title}" created`);
      }
      setPostModalOpen(false);
    } finally {
      setSubmittingPost(false);
    }
  };

  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm(emptyCategoryForm);
    setCategoryModalOpen(true);
  };

  const openEditCategory = (c: Category) => {
    setEditingCategory(c);
    setCategoryForm({ id: c.id, name: c.name, slug: c.slug });
    setCategoryModalOpen(true);
  };

  const submitCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSubmittingCategory(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      if (editingCategory) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id
              ? { ...c, name: categoryForm.name, slug: categoryForm.slug || slugify(categoryForm.name) }
              : c
          )
        );
        toast.success(`Category "${categoryForm.name}" updated`);
      } else {
        const newCat: Category = {
          id: `cat-${Date.now()}`,
          name: categoryForm.name,
          slug: categoryForm.slug || slugify(categoryForm.name),
          postCount: 0,
        };
        setCategories((prev) => [...prev, newCat]);
        toast.success(`Category "${newCat.name}" created`);
      }
      setCategoryModalOpen(false);
    } finally {
      setSubmittingCategory(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (confirmDelete.type === 'post') {
      const deleted = posts.find((p) => p.id === confirmDelete.id);
      setPosts((prev) => prev.filter((p) => p.id !== confirmDelete.id));
      if (deleted) {
        setCategories((prev) =>
          prev.map((c) => (c.id === deleted.categoryId ? { ...c, postCount: Math.max(0, c.postCount - 1) } : c))
        );
      }
      toast.success(`Post "${confirmDelete.name}" deleted`);
    } else {
      if (categories.find((c) => c.id === confirmDelete.id)?.postCount ?? 0 > 0) {
        toast.error('Cannot delete category with existing posts');
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== confirmDelete.id));
      toast.success(`Category "${confirmDelete.name}" deleted`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent gold-text">
            Blog & Content
          </h1>
          <p className="mt-1.5 text-muted text-sm sm:text-base">
            Manage blog posts, categories, and publishing.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="default"
            size="md"
            leftIcon={<RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />}
            onClick={handleRetry}
            disabled={loading}
          >
            Refresh
          </Button>
          {viewMode === 'posts' ? (
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />} onClick={openAddPost}>
              New Post
            </Button>
          ) : (
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />} onClick={openAddCategory}>
              New Category
            </Button>
          )}
        </div>
      </div>

      {error && (
        <GlassCard className="border-danger/40">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-danger/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5.5 h-5.5 text-danger" />
              </div>
              <div className="min-w-0">
                <h4 className="text-white font-semibold">Failed to load blog</h4>
                <p className="text-muted text-sm mt-0.5 truncate">{error}</p>
              </div>
            </div>
            <Button variant="default" size="md" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </GlassCard>
      )}

      {viewMode === 'posts' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Newspaper} title="Total Posts" value={formatNumber(posts.length)} />
          <StatCard icon={CheckCircle2} title="Published" value={formatNumber(totalPublished)} delta={3.2} />
          <StatCard icon={EyeOff} title="Drafts" value={formatNumber(posts.length - totalPublished)} />
          <StatCard icon={TrendingUp} title="Total Views" value={formatNumber(totalViews)} accent />
        </div>
      )}

      <div className="flex gap-2 p-1 bg-card/50 backdrop-blur-sm rounded-xl border border-border w-fit">
        <button
          onClick={() => setViewMode('posts')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            viewMode === 'posts'
              ? 'bg-gold-gradient text-black shadow-gold'
              : 'text-gray-300 hover:text-gold hover:bg-white/5'
          )}
        >
          <Newspaper className="w-4 h-4" />
          Posts
        </button>
        <button
          onClick={() => setViewMode('categories')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            viewMode === 'categories'
              ? 'bg-gold-gradient text-black shadow-gold'
              : 'text-gray-300 hover:text-gold hover:bg-white/5'
          )}
        >
          <FolderOpen className="w-4 h-4" />
          Categories
        </button>
      </div>

      {viewMode === 'posts' ? (
        <>
          <GlassCard>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              <Select
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
              <Input
                label="Search"
                placeholder="Title, slug, author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                wrapperClassName="lg:col-span-2"
              />
            </div>
          </GlassCard>

          {loading && filteredPosts.length === 0 ? (
            <GlassCard>
              <GlassHeader title="Blog Posts" />
              <SkeletonRows count={6} columns={7} />
            </GlassCard>
          ) : filteredPosts.length === 0 ? (
            <EmptyState
              icon={Newspaper}
              title="No posts found"
              description={posts.length === 0 ? 'No blog posts yet. Publish your first article!' : 'Try adjusting filters or search.'}
              action={
                posts.length === 0
                  ? { text: 'Create Post', onClick: openAddPost }
                  : {
                      text: 'Clear filters',
                      onClick: () => {
                        setCategoryFilter('');
                        setStatusFilter('');
                        setSearch('');
                      },
                    }
              }
            />
          ) : (
            <DataTable<Post>
              columns={postColumns}
              data={filteredPosts}
              rowKey={(row) => row.id}
              title="Blog Posts"
              page={page}
              pageSize={10}
              onPageChange={setPage}
              loading={loading}
              headerRight={
                <span className="text-sm text-muted">
                  Total: <span className="text-white font-semibold">{filteredPosts.length}</span>
                </span>
              }
            />
          )}
        </>
      ) : (
        <>
          {loading && categories.length === 0 ? (
            <GlassCard>
              <GlassHeader title="Categories" />
              <SkeletonRows count={5} columns={3} />
            </GlassCard>
          ) : categories.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title="No categories yet"
              description="Create your first category to organize blog posts."
              action={{ text: 'Create Category', onClick: openAddCategory }}
            />
          ) : (
            <DataTable<Category>
              columns={categoryColumns}
              data={categories}
              rowKey={(row) => row.id}
              title="Categories"
              page={page}
              pageSize={10}
              onPageChange={setPage}
              loading={loading}
              headerRight={
                <span className="text-sm text-muted">
                  Total: <span className="text-white font-semibold">{categories.length}</span>
                </span>
              }
            />
          )}
        </>
      )}

      <Modal
        open={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        title={editingPost ? `Edit Post: ${editingPost.title}` : 'Create New Post'}
        description={editingPost ? 'Update post content and settings' : 'Publish a new blog article'}
        maxWidthClass="max-w-3xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Title"
              placeholder="Post title..."
              value={postForm.title}
              onChange={(e) =>
                setPostForm({
                  ...postForm,
                  title: e.target.value,
                  slug: postForm.slug || slugify(e.target.value),
                })
              }
              wrapperClassName="md:col-span-2"
            />
            <Select
              label="Category"
              value={postForm.categoryId}
              onChange={(e) => setPostForm({ ...postForm, categoryId: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <Input
            label="Slug"
            placeholder="auto-generated if empty"
            value={postForm.slug}
            onChange={(e) => setPostForm({ ...postForm, slug: slugify(e.target.value) })}
            leftIcon={<Tag className="w-4 h-4" />}
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Content</label>
            <Textarea
              placeholder="Write post content (HTML supported)..."
              value={postForm.content}
              onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
              rows={10}
            />
          </div>
          <div className="rounded-xl bg-black/20 border border-white/5 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-white font-semibold flex items-center gap-2">
                <Save className="w-4 h-4 text-gold" />
                Publish Status
              </p>
              <p className="text-muted text-sm mt-0.5">
                {postForm.published ? 'Post will be visible to users immediately.' : 'Post will be saved as draft.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={postForm.published}
                onCheckedChange={(v: boolean) => setPostForm({ ...postForm, published: v })}
              />
              <span className="text-sm font-medium text-white">
                {postForm.published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2.5 pt-2 border-t border-border">
            <Button variant="outline" onClick={() => setPostModalOpen(false)} disabled={submittingPost}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void submitPost()} loading={submittingPost}>
              {editingPost ? 'Update Post' : 'Publish Post'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create Category'}
        description={editingCategory ? 'Update category details' : 'Organize posts with a new category'}
      >
        <div className="space-y-4">
          <Input
            label="Name"
            placeholder="e.g. News, Promotions, Guides..."
            value={categoryForm.name}
            onChange={(e) =>
              setCategoryForm({
                ...categoryForm,
                name: e.target.value,
                slug: categoryForm.slug || slugify(e.target.value),
              })
            }
          />
          <Input
            label="Slug"
            placeholder="auto-generated if empty"
            value={categoryForm.slug}
            onChange={(e) => setCategoryForm({ ...categoryForm, slug: slugify(e.target.value) })}
            leftIcon={<Tag className="w-4 h-4" />}
          />
          <div className="flex justify-end gap-2.5 pt-2 border-t border-border">
            <Button variant="outline" onClick={() => setCategoryModalOpen(false)} disabled={submittingCategory}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void submitCategory()} loading={submittingCategory}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, type: 'post', id: '', name: '' })}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${confirmDelete.type === 'post' ? 'Post' : 'Category'}`}
        description={`Are you sure you want to delete ${confirmDelete.type === 'post' ? 'post' : 'category'} "${confirmDelete.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
