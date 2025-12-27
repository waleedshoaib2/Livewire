"use client"

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { formatDistanceToNow } from 'date-fns'
import { ExternalLink, CheckCircle, ArrowUp } from 'lucide-react'

export default function PostTable() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchPosts = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) console.error('Error fetching posts:', error)
        else setPosts(data || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchPosts()
        const interval = setInterval(fetchPosts, 30000) // Poll every 30s
        return () => clearInterval(interval)
    }, [])

    const markResponded = async (id: string, current: boolean) => {
        if (current) return // Already responded

        // Optimistic update
        setPosts(posts.map(p => p.id === id ? { ...p, responded: true } : p))

        const { error } = await supabase
            .from('posts')
            .update({ responded: true, responded_at: new Date().toISOString() })
            .eq('id', id)

        if (error) {
            console.error('Error updating post:', error)
            fetchPosts() // Revert on error
        }
    }

    if (loading && posts.length === 0) return <div className="p-4">Loading leads...</div>

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Score</th>
                        <th className="px-6 py-3">Post</th>
                        <th className="px-6 py-3">Subreddit</th>
                        <th className="px-6 py-3">Time</th>
                        <th className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {posts.map((post) => (
                        <tr key={post.id} className={post.responded ? 'opacity-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {post.responded ?
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Responded</span> :
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">New</span>
                                }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <ArrowUp className="w-4 h-4" /> {post.score}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white max-w-md truncate">
                                    {post.title}
                                </div>
                                <div className="text-sm text-gray-500 max-w-md truncate">
                                    {post.body?.substring(0, 100)}...
                                </div>
                                <div className="flex gap-2 mt-1">
                                    {post.matched_keywords?.map((k: string) => (
                                        <span key={k} className="text-xs bg-blue-100 text-blue-800 px-1 rounded">{k}</span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                r/{post.subreddit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {post.created_utc ? formatDistanceToNow(new Date(post.created_utc * 1000), { addSuffix: true }) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                                <button
                                    onClick={() => markResponded(post.id, post.responded)}
                                    className={`text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 disabled:opacity-50`}
                                    disabled={post.responded}
                                >
                                    <CheckCircle className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
