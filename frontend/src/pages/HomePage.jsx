import {Link} from "react-router"

import {SparklesIcon} from "lucide-react"

function HomePage() {

  return (
    <div className="bg-gradient-to-br from-base-100 via-base-200 to-base-300">

       {/* navbar */}
        <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">

            <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">

                {/* logo */}
                <Link to={"/"}
                className='flex items-center gap-3 hover:scale-105 transition-transform duration-200'
                >
                    <div className="size-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
                        <SparklesIcon className="size-6 text-white"/>
                    </div>
                </Link>
            </div>
        </nav>

    </div>
  )
}

export default HomePage;