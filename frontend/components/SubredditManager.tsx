"use client"

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Trash2, Plus, Zap, ZapOff } from 'lucide-react'

export default function SubredditManager() {
    const [subreddits, setSubreddits] = useState<any[]>([])
    const [newSub, setNewSub] = useState('')
    const [loading, setLoading] = useState(false)

    const fetchSubs = async () => {
        const { data } = await supabase
            .from('subreddits')
            .select('*')
            .order('name', { ascending: true })
        if (data) setSubreddits(data)
    }

    useEffect(() => {
        fetchSubs()
    }, [])

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newSub) return
        setLoading(true)

        // Sanitize input: remove 'r/' prefix if present
        const cleanName = newSub.replace(/^r\//, '').replace(/^\//, '').trim()

        const { error } = await supabase
            .from('subreddits')
            .insert([{ name: cleanName, active: true, added_via: 'frontend' }])

        if (error) {
            console.error('Error adding subreddit:', error)
        } else {
            setNewSub('')
            fetchSubs()
        }
        setLoading(false)
    }

    const toggleActive = async (id: string, current: boolean) => {
        await supabase.from('subreddits').update({ active: !current }).eq('id', id)
        fetchSubs()
    }

    const deleteSub = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        await supabase.from('subreddits').delete().eq('id', id)
        fetchSubs()
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" /> Managed Subreddits
            </h2>

            <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newSub}
                    onChange={(e) => setNewSub(e.target.value)}
                    placeholder="Add subreddit (e.g. forhire)"
                    className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded font-medium disabled:opacity-50"
                >
                    {loading ? 'Adding...' : <><Plus className="w-4 h-4 inline" /> Add</>}
                </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subreddits.map((sub) => (
                    <div key={sub.id} className={`p-4 border rounded flex justify-between items-center ${sub.active ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 opacity-60'}`}>
                        <span className="font-medium">r/{sub.name}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => toggleActive(sub.id, sub.active)}
                                title={sub.active ? "Pause Monitoring" : "Resume Monitoring"}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
                            >
                                {sub.active ? <Zap className="w-4 h-4 text-green-600" /> : <ZapOff className="w-4 h-4 text-gray-400" />}
                            </button>
                            <button
                                onClick={() => deleteSub(sub.id)}
                                className="p-1 hover:bg-red-100 text-red-500 rounded"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                {subreddits.length === 0 && <p className="text-gray-500 italic">No subreddits monitored.</p>}
            </div>
        </div>
    )
}
