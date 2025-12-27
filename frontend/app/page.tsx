import PostTable from '../components/PostTable'

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-black text-black dark:text-white">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Livewire</h1>
          <p className="text-gray-500">Reddit Lead Monitor</p>
        </div>
      </header>

      <section className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <PostTable />
      </section>
    </main>
  )
}
