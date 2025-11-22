'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { useRequireAuth } from '@/lib/auth'

interface Product {
  id: string
  name: string
  category: string
  price: string
  slug: string
  created_at: string
}

export default function ProductsAdminPage() {
  const { user, loading: authLoading } = useRequireAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && user) {
      fetchProducts()
    }
  }, [authLoading, user])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
    } finally {
      setLoading(false)
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

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchProducts()
    } catch (error) {
      alert('Error deleting product')
    }
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
                Products
              </h1>
            </div>
            <Link
              href="/admin/products/new"
              className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-sm font-semibold flex items-center space-x-2"
            >
              <FaPlus />
              <span>Add Product</span>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-600 mb-4">No products yet.</p>
              <Link
                href="/admin/products/new"
                className="text-gold-500 hover:text-gold-600 font-semibold"
              >
                Create your first product →
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Slug</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-primary-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-primary-900">{product.name}</td>
                      <td className="px-6 py-4 text-gray-700">{product.category}</td>
                      <td className="px-6 py-4 text-gray-700">{product.price}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{product.slug}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="text-gold-500 hover:text-gold-600 p-2"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => deleteProduct(product.id)}
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
