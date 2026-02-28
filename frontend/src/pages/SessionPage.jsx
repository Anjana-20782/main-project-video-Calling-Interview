import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClass } from "../lib/utils";
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();

  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // fetch session
  const {
    data: sessionData,
    isLoading: loadingSession,
    refetch,
  } = useSessionById(id);

  const session = sessionData?.session;

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } =
    useStreamClient(session, loadingSession, isHost, isParticipant);

  // problem info
  const problemData = session
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(
    problemData?.starterCode?.[selectedLanguage] || ""
  );

  // auto join
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;
    if (joinSessionMutation.isLoading) return;

    joinSessionMutation.mutate(id, {
      onSuccess: () => refetch(),
    });
  }, [
    session,
    user,
    loadingSession,
    isHost,
    isParticipant,
    id,
    refetch,
    joinSessionMutation,
  ]);

  // redirect if complete
  useEffect(() => {
    if (!session || loadingSession) return;
    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  // update code editor when problem changes
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
      setOutput(null);
    }
  }, [problemData, selectedLanguage]);

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (
      confirm(
        "Are you sure you want to end this session? All participants will be notified."
      )
    ) {
      endSessionMutation.mutate(id, {
        onSuccess: () => navigate("/dashboard"),
      });
    }
  };

  // show loader before data arrives
  if (loadingSession && !session) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2Icon className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* left side — problem + editor */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              {/* problem header */}
              <Panel defaultSize={50} minSize={20}>
                <div className="h-full overflow-y-auto bg-base-200">
                  <div className="p-6 bg-base-100 border-b border-base-300">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h1 className="text-3xl font-bold text-base-content">
                          {session?.problem}
                        </h1>
                        <p className="text-base-content/60 mt-2">
                          Host: {session?.host?.name} •{" "}
                          {session?.participant ? 2 : 1}/2 participants
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`badge badge-lg ${getDifficultyBadgeClass(
                            session?.difficulty
                          )}`}
                        >
                          {session?.difficulty
                            ? session.difficulty.charAt(0).toUpperCase() +
                              session.difficulty.slice(1)
                            : "Easy"}
                        </span>

                        {isHost && session?.status === "active" && (
                          <button
                            onClick={handleEndSession}
                            disabled={endSessionMutation.isPending}
                            className="btn btn-error btn-sm gap-2"
                          >
                            {endSessionMutation.isPending ? (
                              <Loader2Icon className="w-4 h-4 animate-spin" />
                            ) : (
                              <LogOutIcon className="w-4 h-4" />
                            )}
                            End Session
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {problemData?.description && (
                    <div className="p-6 space-y-6">
                      <div className="bg-base-100 rounded-xl p-5 border">
                        <h2 className="text-xl font-bold mb-4">
                          Description
                        </h2>
                        <p className="text-base-content/90">
                          {problemData.description.text}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 cursor-row-resize" />

              {/* code editor + output */}
              <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={(val) => setCode(val)}
                      onRunCode={handleRunCode}
                    />
                  </Panel>
                  <PanelResizeHandle className="h-2 bg-base-300 cursor-row-resize" />
                  <Panel defaultSize={30}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 cursor-col-resize" />

          {/* right side — video */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-base-200 p-4">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2Icon className="animate-spin text-primary w-12 h-12" />
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center">
                  <PhoneOffIcon className="text-error w-12 h-12" />
                </div>
              ) : (
                <StreamVideo client={streamClient}>
                  <StreamCall call={call}>
                    <VideoCallUI chatClient={chatClient} channel={channel} />
                  </StreamCall>
                </StreamVideo>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default SessionPage;
