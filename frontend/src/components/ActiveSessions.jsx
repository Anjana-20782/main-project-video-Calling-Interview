import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
  Trash2Icon, // 1. Added Trash Icon
} from "lucide-react";
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react"; // 2. Need this to check who the host is
import { getDifficultyBadgeClass } from "../lib/utils";
import { isAdminUser } from "../lib/admin";

// 3. Added onDelete to props
function ActiveSessions({ sessions, isLoading, isUserInSession, onDelete }) {
  const { user } = useUser();
  const isAdmin = isAdminUser(user);

  return (
    <div className="lg:col-span-2 card bg-base-100 border-2 border-primary/20 hover:border-primary/30 h-full">
      <div className="card-body">
        {/* HEADERS SECTION */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl">
              <ZapIcon className="size-4" />
            </div>
            <h2 className="text-xl font-black">Live Sessions</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-2 bg-success rounded-full" />
            <span className="text-sm font-medium text-success">{sessions.length} active</span>
          </div>
        </div>

        {/* SESSIONS LIST */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoaderIcon className="size-5 animate-spin text-primary" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => {
              // 4. Logic to check if the current user is the host
              const isHost = session.host?.clerkId === user?.id;

              return (
                <div
                  key={session._id}
                  className="card bg-base-200 border-2 border-base-300 hover:border-primary/50"
                >
                  <div className="flex items-center justify-between gap-4 p-5">
                    {/* LEFT SIDE CONTENT (Problem, Badge, Host info) */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative size-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                        <Code2Icon className="size-7 text-white" />
                        <div className="absolute -top-1 -right-1 size-4 bg-success rounded-full border-2 border-base-100" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg truncate">{session.problem}</h3>
                          <span className={`badge badge-sm ${getDifficultyBadgeClass(session.difficulty)}`}>
                            {session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1)}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm opacity-80">
                          <div className="flex items-center gap-1.5">
                            <CrownIcon className="size-4 text-warning" />
                            <span className="font-medium truncate max-w-[100px]">{session.host?.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <UsersIcon className="size-4" />
                            <span className="text-xs">{session.participant ? "2/2" : "1/2"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT SIDE ACTIONS (Rejoin + Delete) */}
                    <div className="flex items-center gap-2">
                      {(isHost || isAdmin) && (
                        <button
                          onClick={() => onDelete(session._id)}
                          className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                          title="Delete Session"
                        >
                          <Trash2Icon className="size-4" />
                        </button>
                      )}

                      {session.participant && !isUserInSession(session) ? (
                        <button className="btn btn-disabled btn-sm">Full</button>
                      ) : (
                        <Link to={`/session/${session._id}`} className="btn btn-primary btn-sm gap-2">
                          {isUserInSession(session) ? "Rejoin" : "Join"}
                          <ArrowRightIcon className="size-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center">
                <SparklesIcon className="w-10 h-10 text-primary/50" />
              </div>
              <p className="text-lg font-semibold opacity-70 mb-1">No active sessions</p>
              <p className="text-sm opacity-50">Be the first to create one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActiveSessions;