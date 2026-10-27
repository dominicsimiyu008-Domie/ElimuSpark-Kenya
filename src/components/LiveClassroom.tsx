import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Hand,
  MessageSquare,
  Users,
  PenTool,
  Eraser,
  Download,
  X,
  Send,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { LiveSession } from '../types';

interface LiveClassroomProps {
  session: LiveSession;
  onLeave: () => void;
  userRole?: 'student' | 'teacher' | 'parent';
}

interface ChatMessage {
  id: string;
  sender: string;
  role: 'teacher' | 'student';
  text: string;
  time: string;
}

export const LiveClassroom: React.FC<LiveClassroomProps> = ({
  session,
  onLeave,
  userRole = 'student',
}) => {
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [activeTab, setActiveTab] = useState<'board' | 'chat' | 'participants' | 'notes'>('board');
  
  // Whiteboard drawing states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#008751');

  // Video stream simulation
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: session.teacherName,
      role: 'teacher',
      text: `Habari za jioni and welcome to today's ${session.subject} masterclass! We are looking at ${session.topic}.`,
      time: '5:02 PM',
    },
    {
      id: '2',
      sender: 'Akinyi Omondi',
      role: 'student',
      text: 'Good evening Mwalimu! Ready with my paper and calculator.',
      time: '5:03 PM',
    },
    {
      id: '3',
      sender: 'Kelvin Mwangi',
      role: 'student',
      text: 'Mwalimu, will we also cover the 2023 KCSE Question 14 on matrix transformations?',
      time: '5:04 PM',
    },
    {
      id: '4',
      sender: session.teacherName,
      role: 'teacher',
      text: 'Yes Kelvin! That is item #3 on our board today. Pay attention to the determinant sign inversion.',
      time: '5:05 PM',
    },
  ]);

  // Turn on real camera if requested
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (cameraOn && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: micOn })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera permission denied or camera not found:', err);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const s = videoRef.current.srcObject as MediaStream;
        s.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cameraOn, micOn]);

  // Whiteboard initial draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.parentElement?.clientWidth || 700;
    canvas.height = canvas.parentElement?.clientHeight || 450;

    // Draw grid & sample KCSE equation
    ctx.fillStyle = '#0f172a'; // Chalkboard dark
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Teacher's sample problem written on board
    ctx.fillStyle = '#38bdf8';
    ctx.font = '16px monospace';
    ctx.fillText('ELIMUSPARK KENYA - LIVE LECTURE BOARD [KCSE REVISION]', 20, 35);

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 20px "Space Grotesk", sans-serif';
    ctx.fillText('Problem: Given Matrix M = [ 3  -2 ; 1   4 ], find M⁻¹', 20, 75);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '15px sans-serif';
    ctx.fillText('Step 1: Determinant |M| = (3 × 4) - (-2 × 1) = 12 + 2 = 14', 20, 115);
    ctx.fillText('Step 2: Adjoint Matrix = [ 4   2 ; -1   3 ]', 20, 145);
    ctx.fillStyle = '#4ade80';
    ctx.fillText('Step 3: Inverse M⁻¹ = 1/14 × [ 4   2 ; -1   3 ]  ✓ (Verified)', 20, 180);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 13px sans-serif';
    ctx.fillText('✏️ Feel free to write or draw your working below using the toolbar', 20, 220);
  }, []);

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();

    if (tool === 'pen') {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
    } else {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
    }

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleStopDraw = () => {
    setIsDrawing(false);
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: userRole === 'student' ? 'Brian Kimani (You)' : 'Mwalimu John Mutua (You)',
      role: userRole === 'student' ? 'student' : 'teacher',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white">
      {/* Top Bar */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 md:px-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">LIVE SESSION</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <h2 className="text-sm md:text-base font-bold text-white leading-tight">{session.subject} - {session.topic}</h2>
            <p className="text-xs text-slate-400">Host: {session.teacherName} • Room: {session.meetingCode}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-3">
          <button
            onClick={() => setHandRaised(!handRaised)}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              handRaised
                ? 'bg-amber-500 text-slate-950 font-bold ring-2 ring-amber-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Hand className="h-4 w-4" />
            <span className="hidden sm:inline">{handRaised ? 'Hand Raised' : 'Raise Hand'}</span>
          </button>

          <button
            onClick={onLeave}
            className="rounded-lg bg-red-600/90 hover:bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white transition-colors"
          >
            Leave Class
          </button>
        </div>
      </div>

      {/* Main Classroom Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Video / Board Workspace */}
        <div className="flex flex-1 flex-col p-3 md:p-4 gap-3 overflow-hidden">
          {/* Top Video Grid (Teacher + Student) */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 h-44 sm:h-48">
            {/* Teacher Video (3 Cols on desktop) */}
            <div className="sm:col-span-3 relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg flex items-center justify-center">
              <img
                src={session.teacherAvatar}
                alt={session.teacherName}
                className="h-full w-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 flex items-center space-x-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-white">{session.teacherName} (Tutor)</span>
                <span className="rounded bg-[#008751] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  TSC Verified
                </span>
              </div>
              <div className="absolute top-2.5 right-3 flex items-center space-x-1.5 bg-black/50 px-2 py-1 rounded-full text-[11px] text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Audio HD</span>
              </div>
            </div>

            {/* Student WebCam Box */}
            <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
              {cameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-3 text-slate-500">
                  <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-sm mb-1">
                    BK
                  </div>
                  <span className="text-xs font-medium text-slate-300">Brian Kimani</span>
                  <span className="text-[10px] text-slate-500">Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 flex items-center space-x-1">
                <span className="text-[10px] font-semibold bg-black/60 px-1.5 py-0.5 rounded text-white">
                  You
                </span>
                {micOn ? (
                  <Mic className="h-3 w-3 text-emerald-400" />
                ) : (
                  <MicOff className="h-3 w-3 text-red-400" />
                )}
              </div>
            </div>
          </div>

          {/* Interactive Digital Blackboard / Whiteboard */}
          <div className="flex-1 flex flex-col rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner">
            {/* Whiteboard Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-3 py-2 text-xs">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setTool('pen')}
                  className={`flex items-center space-x-1 rounded px-2.5 py-1 ${
                    tool === 'pen' ? 'bg-[#008751] text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <PenTool className="h-3.5 w-3.5" />
                  <span>Pen</span>
                </button>
                <button
                  onClick={() => setTool('eraser')}
                  className={`flex items-center space-x-1 rounded px-2.5 py-1 ${
                    tool === 'eraser' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eraser className="h-3.5 w-3.5" />
                  <span>Eraser</span>
                </button>

                <div className="h-4 w-px bg-slate-800 mx-1" />

                {/* Color swatches */}
                <div className="flex items-center space-x-1">
                  {['#008751', '#38bdf8', '#f59e0b', '#ef4444', '#ffffff'].map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setPenColor(color);
                        setTool('pen');
                      }}
                      className={`h-4 w-4 rounded-full border ${
                        penColor === color ? 'ring-2 ring-white scale-110' : 'border-slate-700'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={clearBoard}
                  className="rounded px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                >
                  Clear Board
                </button>
                <button
                  onClick={() => alert('Lecture summary notes saved to your revision library!')}
                  className="flex items-center space-x-1 rounded bg-slate-800 px-2.5 py-1 text-slate-200 hover:bg-slate-700 font-medium"
                >
                  <Download className="h-3 w-3" />
                  <span>Save Board</span>
                </button>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative cursor-crosshair overflow-hidden">
              <canvas
                ref={canvasRef}
                onMouseDown={handleStartDraw}
                onMouseMove={handleDraw}
                onMouseUp={handleStopDraw}
                onMouseLeave={handleStopDraw}
                className="absolute inset-0 w-full h-full block"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar: Chat / Participants / Notes */}
        <div className="w-80 border-l border-slate-800 bg-slate-900 hidden lg:flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('board')}
              className={`flex-1 py-3 text-center border-b-2 ${
                activeTab === 'board'
                  ? 'border-[#008751] text-[#008751]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Class Chat
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 py-3 text-center border-b-2 ${
                activeTab === 'participants'
                  ? 'border-[#008751] text-[#008751]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Classmates (14)
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-3 text-center border-b-2 ${
                activeTab === 'notes'
                  ? 'border-[#008751] text-[#008751]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              KCSE Notes
            </button>
          </div>

          {/* Chat Panel */}
          {activeTab === 'board' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-3 space-y-3 overflow-y-auto text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-lg p-2.5 ${
                      m.role === 'teacher'
                        ? 'bg-[#008751]/20 border border-emerald-500/30'
                        : 'bg-slate-800/80 border border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold ${m.role === 'teacher' ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {m.sender}
                      </span>
                      <span className="text-[10px] text-slate-500">{m.time}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Mwalimu a question..."
                  className="flex-1 rounded-lg bg-slate-900 border border-slate-700 py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#008751] p-2 text-white hover:bg-[#007043] transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* Participants Tab */}
          {activeTab === 'participants' && (
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-800/70 border border-slate-700">
                <div className="flex items-center space-x-2">
                  <img src={session.teacherAvatar} className="h-6 w-6 rounded-full object-cover" alt="" />
                  <div>
                    <p className="font-bold text-white">{session.teacherName}</p>
                    <p className="text-[10px] text-emerald-400">Teacher • Host</p>
                  </div>
                </div>
                <Mic className="h-3.5 w-3.5 text-emerald-400" />
              </div>

              {[
                { name: 'Brian Kimani (You)', school: 'Nairobi High', active: true },
                { name: 'Akinyi Omondi', school: 'Kenya High', active: true },
                { name: 'Kelvin Mwangi', school: 'Alliance High', active: true },
                { name: 'Faith Chebet', school: 'Moi Girls Eldoret', active: false },
                { name: 'David Mutiso', school: 'Machakos Boys', active: true },
                { name: 'Zahra Omar', school: 'Sheikh Khalifa', active: true },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-slate-800/50">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px]">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.school}</p>
                    </div>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
              ))}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="flex-1 p-4 overflow-y-auto text-xs text-slate-300 space-y-3">
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50">
                <h4 className="font-bold text-emerald-300 mb-1 flex items-center space-x-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Key Exam Tips (KCSE Math)</span>
                </h4>
                <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                  Remember: A singular matrix has a determinant equal to zero. When asked if a transformation is reversible, always check if det(M) ≠ 0!
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-white">Recommended Practice:</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                  <li>2024 KNEC Mock Paper 1 Q8</li>
                  <li>KLB Mathematics Book 3 Page 142 Ex 7.2</li>
                  <li>Assignment #1 uploaded in student portal</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Media Controls Bar */}
      <div className="flex h-16 items-center justify-between border-t border-slate-800 bg-slate-900 px-4 md:px-8">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              micOn ? 'bg-slate-800 text-white' : 'bg-red-600/90 text-white'
            }`}
          >
            {micOn ? <Mic className="h-4 w-4 text-emerald-400" /> : <MicOff className="h-4 w-4" />}
            <span className="hidden sm:inline">{micOn ? 'Mute Mic' : 'Unmute Mic'}</span>
          </button>

          <button
            onClick={() => setCameraOn(!cameraOn)}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              cameraOn ? 'bg-slate-800 text-white' : 'bg-red-600/90 text-white'
            }`}
          >
            {cameraOn ? <Video className="h-4 w-4 text-emerald-400" /> : <VideoOff className="h-4 w-4" />}
            <span className="hidden sm:inline">{cameraOn ? 'Turn Off Cam' : 'Start Cam'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setScreenSharing(!screenSharing)}
            className={`flex items-center space-x-2 rounded-xl px-3 sm:px-4 py-2 text-xs font-semibold ${
              screenSharing ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <MonitorUp className="h-4 w-4" />
            <span className="hidden sm:inline">{screenSharing ? 'Stop Share' : 'Share Screen'}</span>
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'board' ? 'participants' : 'board')}
            className="lg:hidden flex items-center space-x-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
