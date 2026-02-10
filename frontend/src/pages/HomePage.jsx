import { Link } from "react-router";
import { ArrowRightIcon, CheckIcon, SparklesIcon, VideoIcon, ZapIcon } from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

function HomePage() {
  return (
    <div className="bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* navbar */}
      <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          {/* logo */}
          <Link
            to={"/"}
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
          >
            <div className="size-10 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
              <SparklesIcon className="size-6 text-white" />
            </div>

            <div className="flex flex-col">
              <span className="font-black text-xs bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
                video calling interiview plaform
              </span>
              <span className="text-xs text-base-content/60 font-medium mt-1">
                Code Together
              </span>
            </div>
          </Link>

          {/* auth btn */}
          <SignInButton mode="modal">
            <button
              className="group px-5 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold text-xs shadowlg hover:shadow-xl transition-all
                    duration-200 hover:scale-105 flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* Hero section */}

      <div className="max-w-6xl mx-auto px-4 py-15">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}

          <div className="space-y-8">
            <div className="badge badge-primary badge-md">
              <ZapIcon className="size-4" />
              Real time collabration
            </div>

            <h1 className="text-4xl lg:text-5xl font-black leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Code Together,
              </span>
              <br />
              <span className="text-base-content">Learn Together</span>
            </h1>

             <p className="text-md text-base-content/70 leading-relaxed max-w-xl">
              The ultimate platform for collaborative coding interviews and pair programming.
              Connect face-to-face, code in real-time, and ace your technical interviews.
            </p>

             {/* FEATURE PILLS */}
             <div className="flex flex-wrap gap-3">
              <div className="badge badge-md badge-outline">
                <CheckIcon className="size-3 text-success" />
                Live Video Chat
              </div>
              <div className="badge badge-md badge-outline">
                <CheckIcon className="size-3 text-success" />
                Code Editor
              </div>
              <div className="badge badge-md badge-outline">
                <CheckIcon className="size-3 text-success" />
                Multi-Language
              </div>
            </div>

             {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <SignInButton mode="modal">
                <button className="btn btn-primary btn-md">
                  Start Coding Now
                  <ArrowRightIcon className="size-4" />
                </button>
              </SignInButton>

              <button className="btn btn-outline btn-md">
                <VideoIcon className="size-4" />
                Watch Demo
              </button>
            </div>

          {/* STATS */}
            <div className="stats stats-vertical lg:stats-horizontal bg-base-100 shadow-lg">
              <div className="stat">
                <div className="stat-value text-primary">10K+</div>
                <div className="stat-title">Active Users</div>
              </div>
              <div className="stat">
                <div className="stat-value text-secondary">50K+</div>
                <div className="stat-title">Sessions</div>
              </div>
              <div className="stat">
                <div className="stat-value text-accent">99.9%</div>
                <div className="stat-title">Uptime</div>
              </div>
            </div>
          

            
          </div>

            {/* RIGHT IMAGE */}
          
          <img
            src="/hero.png"
            alt="CodeCollab Platform"
            className="w-full h-auto rounded-3xl shadow-2xl border-4 border-base-100 hover:scale-105 transition-transform duration-500"
          />

        </div>
      </div>
    </div>
  );
}

export default HomePage;
