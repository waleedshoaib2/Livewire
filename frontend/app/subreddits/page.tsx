"use client"

import SubredditManager from '../../components/SubredditManager'

export default function SubredditsPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="pb-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-3xl font-bold tracking-tight">Subreddits</h2>
                <p className="text-gray-500">Manage the communities you are monitoring.</p>
            </header>

            <SubredditManager />
        </div>
    )
}
