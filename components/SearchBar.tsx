'use client'

import { useState, FormEvent } from 'react'
import { Search, Loader2 } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  loading: boolean
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ onSearch, loading, value, onChange }: SearchBarProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (value.trim() && !loading) {
      onSearch(value.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="搜索或添加新单词（支持中英文）..."
          className="block w-full pl-12 pr-12 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          disabled={loading}
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          {loading ? (
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              搜索
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        💡 输入英文单词或中文意思，AI会自动为你生成详细的单词信息和例句
      </p>
    </form>
  )
}

