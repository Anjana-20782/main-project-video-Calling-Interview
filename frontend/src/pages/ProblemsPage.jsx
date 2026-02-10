import React from 'react'
import Navbar from '../components/Navbar'
import { PROBLEMS } from '../data/problems'
import { Code2Icon } from 'lucide-react'

function ProblemsPage() {

  const problems = Object.values(PROBLEMS)
  return (
      <div className="min-h-screen bg-base-200">
      <Navbar />
         <div className="max-w-6xl mx-auto px-4 py-12">
          {/* HEADER */}
         <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Practice Problems</h1>
          <p className="text-base-content/70 text-sm">
            Sharpen your coding skills with these curated problems
          </p>
        </div>

               {/* PROBLEMS LIST */}
        <div className="space-y-4">
           {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="card bg-base-100 hover:scale-[1.01] transition-transform"
            >

              <div className="card-body">
                <div className="flex items-center justify-between gap-4">
                   {/* LEFT SIDE */}
                   <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Code2Icon className="size-6 text-primary" />
                      </div>
                      <div className="flex-1">
                         <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold">{problem.title}</h2>
                          <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                         </div>
                      </div>

                    </div>
                   </div>
                </div>
              </div>
            </Link>
           ))}
        </div>


         </div>
      </div>
  )
}

export default ProblemsPage