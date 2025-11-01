'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { useRequireAuth } from '@/lib/auth'

interface BlogPost {
  id: string
  title: string
  slug: string
  status: string
  published_date: string
  created_at: string
}

export default function BlogAdminPage() {
  const { user, loading: authLoading } = useRequireAuth()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && user) {
      fetchPosts()
    }
  }, [authLoading, user])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Fetched posts:', data) // Debug log
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      alert(`Error loading posts: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom section-padding py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Link href="/admin" className="text-sm text-gray-600 hover:text-primary-800 mb-4 inline-block">
                ← Back to Admin
              </Link>
              <h1 className="text-4xl font-serif font-bold text-primary-900">
                Blog Posts
              </h1>
            </div>
            <Link
              href="/admin/blog/new"
              className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-sm font-semibold flex items-center space-x-2"
            >
              <FaPlus />
              <span>New Post</span>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            null
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Slug</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Published</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-primary-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-primary-900">{post.title}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{post.slug}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          post.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {post.published_date 
                          ? new Date(post.published_date).toLocaleDateString('en-GB')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/admin/blog/${post.id}`}
                            className="text-gold-500 hover:text-gold-600 p-2"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => deletePost(post.id)}
                            className="text-red-500 hover:text-red-600 p-2"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
