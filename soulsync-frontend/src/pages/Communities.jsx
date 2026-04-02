import React, { useState } from 'react'
import { Users, ArrowUp, MessageCircle, Plus, X, Search, Pin, Loader2, ShieldCheck, Heart, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import toast from 'react-hot-toast'

// ── All community and post data — identical to v2 ────────────────────────────
const communities = [
  { id: 1, name: 'Academic Stress',    emoji: '📚', memberCount: 2340, color: '#4F46E5', description: 'For students navigating exams, deadlines, and academic pressure. Share strategies and find encouragement.' },
  { id: 2, name: 'Work Stress',        emoji: '💼', memberCount: 3150, color: '#0F172A', description: 'Support for workplace burnout, difficult managers, toxic environments, and career anxiety.' },
  { id: 3, name: 'Relationship Stress',emoji: '💔', memberCount: 1870, color: '#EF4444', description: 'Navigate the complexities of love, family bonds, and interpersonal struggles with compassion.' },
  { id: 4, name: 'Anxiety Support',    emoji: '🌊', memberCount: 4200, color: '#3B82F6', description: 'A safe, non-judgmental space for those living with anxiety disorders and panic attacks.' },
  { id: 5, name: 'Depression Support', emoji: '🌱', memberCount: 3600, color: '#10B981', description: 'Compassionate community for people dealing with depression and persistent low mood.' },
  { id: 6, name: 'Career Pressure',    emoji: '🎯', memberCount: 1540, color: '#F59E0B', description: 'For those feeling lost, pressured, or overwhelmed with career decisions and job searching.' },
  { id: 7, name: 'Mindfulness Circle', emoji: '🧘', memberCount: 2800, color: '#06B6D4', description: 'Share meditation tips, mindfulness journeys, and peaceful daily reflections.' },
  { id: 8, name: 'Parenting Stress',   emoji: '👨‍👩‍👧', memberCount: 1200, color: '#EC4899', description: 'For parents navigating the joys and very real challenges of raising children.' },
]

const seedPosts = {
  1: [
    { id: 101, user: 'Arjun K.',  avatar: 'A', time: '2h ago', title: 'Finals are destroying me — any tips?', content: "I have 4 exams in 3 days and can't focus at all. My mind goes blank the moment I open a textbook. Has anyone found study break strategies that actually help reset focus?", upvotes: 47, commentCount: 23, pinned: false },
    { id: 102, user: 'Priya S.',  avatar: 'P', time: '5h ago', title: 'How I survived my toughest semester — what actually worked', content: "After nearly failing out last year, I discovered that studying in 25-minute focused blocks with 5-minute movement breaks changed everything. The Pomodoro technique isn't just productivity advice — it genuinely prevents the mental fatigue that makes studying feel impossible.", upvotes: 89, commentCount: 34, pinned: true },
    { id: 103, user: 'Meena T.',  avatar: 'M', time: '1d ago', title: 'Dealing with parental pressure on top of exam stress', content: "My parents keep checking on my progress every few hours and it's making everything worse. I feel watched all the time. Anyone navigate this dynamic successfully?", upvotes: 62, commentCount: 18, pinned: false },
  ],
  2: [
    { id: 201, user: 'Ravi M.',   avatar: 'R', time: '1h ago', title: 'My manager makes me feel worthless', content: "Nothing I do is ever good enough. I work late, deliver on time, get positive client feedback — and still get picked apart in every 1:1. I dread going to work every day. Has anyone dealt with a relentlessly hypercritical boss and come through it?", upvotes: 62, commentCount: 41, pinned: false },
    { id: 202, user: 'Sunita P.', avatar: 'S', time: '3h ago', title: "Six months of burnout — I finally quit and here's what happened", content: "Best professional decision I've ever made. The first two weeks I just slept. Then slowly I started running, cooking, and actually enjoying evenings again. For anyone on the fence: your nervous system will thank you.", upvotes: 134, commentCount: 67, pinned: true },
  ],
  4: [
    { id: 401, user: 'Kiran T.',  avatar: 'K', time: '30m ago', title: 'Had a panic attack in public for the first time', content: "It happened in a grocery store. Heart racing, couldn't breathe, felt like I was dying. I managed to get outside but I'm terrified it'll happen again. Does the fear of it happening again eventually get better?", upvotes: 38, commentCount: 52, pinned: false },
    { id: 402, user: 'Meera L.',  avatar: 'M', time: '4h ago', title: 'Box breathing literally stopped my spiral during a work presentation', content: "I was in front of 20 people, felt the anxiety starting to climb, and quietly did the 4-4-4-4 box breathing while appearing to think. Genuinely worked. Sharing this for everyone because I was skeptical until it worked when it actually mattered.", upvotes: 203, commentCount: 88, pinned: true },
    { id: 403, user: 'Dev R.',    avatar: 'D', time: '1d ago', title: "Anxiety and avoidance — the trap I didn't know I was in", content: "Every time I avoided something that made me anxious, it felt like relief. But the avoided list kept growing and my world kept shrinking. CBT helped me see this pattern clearly. Now I do small exposures every day.", upvotes: 97, commentCount: 44, pinned: false },
  ],
  5: [
    { id: 501, user: 'Ananya S.', avatar: 'A', time: '2h ago', title: 'Three months of consistent journaling — what changed', content: "I was skeptical. Felt silly writing to myself. But three months in, I can see patterns I never noticed before — specific triggers, recurring thoughts, the situations that reliably pull me down. The self-knowledge alone has been worth it.", upvotes: 156, commentCount: 43, pinned: true },
  ],
}

const defaultPosts = [
  { id: 1, user: 'SoulSync Team', avatar: 'S', time: '1d ago', title: 'Welcome to this community 💙', content: "This is a safe, judgment-free space. Please be kind, share authentically, and support each other. You are not alone in what you're feeling.", upvotes: 128, commentCount: 12, pinned: true },
]

export default function Communities() {
  const { user, refreshUser } = useAuth()

  const getInitialJoined = () => {
    if (!user?.joinedCommunities?.length) return new Set()
    const names = new Set((user.joinedCommunities).map(c => typeof c === 'object' ? c.name : c))
    return new Set(communities.filter(c => names.has(c.name)).map(c => c.id))
  }

  const [joined,           setJoined]           = useState(getInitialJoined)
  const [joiningId,        setJoiningId]        = useState(null)
  const [activeId,         setActiveId]         = useState(null)
  const [posts,            setPosts]            = useState(seedPosts)
  const [upvoted,          setUpvoted]          = useState(new Set())
  const [showNewPost,      setShowNewPost]      = useState(false)
  const [postForm,         setPostForm]         = useState({ title: '', content: '' })
  const [showAuth,         setShowAuth]         = useState(false)
  const [search,           setSearch]           = useState('')
  const [expandedComments, setExpandedComments] = useState(null)

  const filtered        = communities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  )
  const activeCommunity = communities.find(c => c.id === activeId)
  const activePosts     = (posts[activeId] || defaultPosts)
    .slice()
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))

  const handleJoin = async (id, e) => {
    e.stopPropagation()
    if (!user) { setShowAuth(true); return }

    const isJoined  = joined.has(id)
    const community = communities.find(c => c.id === id)
    setJoiningId(id)

    setJoined(prev => {
      const next = new Set(prev)
      isJoined ? next.delete(id) : next.add(id)
      return next
    })

    try {
      await axios.post('/api/communities/join-by-name', {
        name:        community.name,
        emoji:       community.emoji,
        description: community.description,
        memberCount: community.memberCount,
        color:       community.color,
        action:      isJoined ? 'leave' : 'join',
      })
      toast.success(isJoined ? `Left "${community.name}"` : `Joined "${community.name}"! 💙`)
      await refreshUser()
    } catch {
      const key    = `soulsync_communities_${user._id || user.id}`
      const stored = JSON.parse(localStorage.getItem(key) || '[]')
      if (isJoined) {
        localStorage.setItem(key, JSON.stringify(stored.filter(c => c.name !== community.name)))
      } else {
        if (!stored.find(c => c.name === community.name)) {
          stored.push({ name: community.name, emoji: community.emoji, description: community.description, memberCount: community.memberCount })
          localStorage.setItem(key, JSON.stringify(stored))
        }
      }
      toast.success(isJoined ? `Left "${community.name}"` : `Joined "${community.name}"! 💙`)
      await refreshUser()
    } finally {
      setJoiningId(null)
    }
  }

  const handleUpvote = (postId) => {
    if (!user) { setShowAuth(true); return }
    setUpvoted(prev => {
      const next = new Set(prev)
      next.has(postId) ? next.delete(postId) : next.add(postId)
      return next
    })
  }

  const submitPost = () => {
    if (!postForm.title.trim() || !postForm.content.trim()) return
    const newPost = {
      id:           Date.now(),
      user:         user?.name || 'You',
      avatar:       user?.name?.charAt(0).toUpperCase() || 'Y',
      time:         'Just now',
      title:        postForm.title,
      content:      postForm.content,
      upvotes:      0,
      commentCount: 0,
      pinned:       false,
    }
    setPosts(prev => ({ ...prev, [activeId]: [newPost, ...(prev[activeId] || defaultPosts)] }))
    setPostForm({ title: '', content: '' })
    setShowNewPost(false)
    toast.success('Post created! 🎉')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header — Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center md:text-left"
        >
          <span className="tag-mint mb-3 inline-block">Real Support</span>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-slate-900 mb-4 tracking-tighter leading-tight">You Are Not Alone</h1>
          <p className="text-slate-500 max-w-xl mb-0 leading-relaxed font-light text-lg">Find your tribe. Share authentically. Heal in connection.</p>
        </motion.div>

        {/* Community Guidelines — Big Boxes as requested */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200">
              <ShieldCheck size={20} />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight uppercase">Community Safety & Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Respect over Reaction", desc: "Be kind, even in disagreement. We nurture belonging.", color: "#4F46E5", bg: "bg-indigo-50/30" },
              { icon: ShieldCheck, title: "Safe Space Policy", desc: "Zero tolerance for explicit, illegal, or harmful content.", color: "#0F172A", bg: "bg-slate-50/50" },
              { icon: Users, title: "Well Behaved", desc: "Professionalism and empathy are our core requirements.", color: "#06B6D4", bg: "bg-cyan-50/30" },
              { icon: AlertCircle, title: "Crisis Support", desc: "Use our dedicated support tools for any urgent mental health needs.", color: "#EF4444", bg: "bg-red-50/30" }
            ].map((rule, ri) => (
              <motion.div 
                key={ri}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (ri * 0.1) }}
                whileHover={{ y: -5 }}
                className={`p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden ${rule.bg}`}
              >
                <div className="w-14 h-14 rounded-3xl mb-6 flex items-center justify-center shadow-inner bg-white border border-slate-100"
                  style={{ color: rule.color }}>
                  <rule.icon size={28} />
                </div>
                <h4 className="font-display text-lg font-bold text-slate-900 mb-3 tracking-tight leading-none uppercase">{rule.title}</h4>
                <p className="text-sm text-slate-500 font-light leading-relaxed">{rule.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Search Repositioned — Below Guidelines */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search communities by name or topic..."
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm focus:shadow-indigo-500/10 focus:border-indigo-200 outline-none transition-all text-slate-600 font-medium" />
          </div>
          
          {user && joined.size > 0 && (
            <p className="text-sm font-medium text-slate-400 italic">
              Currently a member of <span className="text-indigo-600 font-bold">{joined.size} circles</span>
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">

          {/* ── Community list ───────────────────────────────────────── */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {filtered.map(c => {
              const isJoined = joined.has(c.id)
              return (
                <motion.div 
                  key={c.id} 
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  onClick={() => setActiveId(c.id)}
                  className={`group cursor-pointer rounded-2xl p-4 border-2 transition-all shadow-sm ${
                    activeId === c.id 
                      ? 'border-indigo-600 bg-white shadow-md' 
                      : 'border-white bg-white/40 hover:bg-white hover:border-slate-200'
                  }`}
                  style={{ borderColor: activeId === c.id ? c.color : undefined }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm backdrop-blur-md bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                      {c.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-[13px] truncate">{c.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Users size={10} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{c.memberCount.toLocaleString()}</span>
                        {isJoined && <span className="w-1 h-1 rounded-full bg-indigo-500 ml-1" />}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* ── Post panel ───────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {!activeId ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center h-[500px]"
                >
                  <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-4xl mb-6 shadow-inner">🤝</div>
                  <h2 className="font-display text-3xl font-bold text-slate-900 mb-3 tracking-tight">Select a Community</h2>
                  <p className="text-slate-500 max-w-sm mb-0">Choose a circle to start connecting, sharing, and healing together.</p>
                </motion.div>
              ) : (
                <motion.div 
                  key={activeId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Community banner */}
                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 blur-3xl opacity-10 pointer-events-none"
                      style={{ background: activeCommunity?.color }} />
                    
                    <div className="flex items-center gap-5 relative z-10">
                      <motion.div 
                        initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                        className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-4xl bg-slate-50 border border-slate-100 shadow-inner"
                      >
                        {activeCommunity?.emoji}
                      </motion.div>
                      <div>
                        <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight uppercase">{activeCommunity?.name}</h2>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">{activeCommunity?.memberCount?.toLocaleString()} members</p>
                          <span className="w-1 h-1 rounded-full bg-slate-200" />
                          <p className="text-xs text-slate-500 font-light">{activeCommunity?.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <button
                        onClick={e => handleJoin(activeCommunity?.id, e)}
                        disabled={joiningId === activeCommunity?.id}
                        className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
                          joined.has(activeCommunity?.id) 
                            ? 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600' 
                            : 'text-white shadow-lg'
                        }`}
                        style={!joined.has(activeCommunity?.id) ? { background: activeCommunity?.color } : {}}>
                        {joiningId === activeCommunity?.id ? <Loader2 size={16} className="animate-spin" /> 
                          : joined.has(activeCommunity?.id) ? '✓ Joined' : 'Join Community'}
                      </button>

                      <button onClick={() => setShowNewPost(true)}
                        className="btn-soul px-6 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/10">
                        <Plus size={16} /> New Post
                      </button>
                    </div>
                  </div>

                  {/* New post form */}
                  <AnimatePresence>
                    {showNewPost && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginBottom: 16 }}
                        exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                        className="bg-white rounded-2xl p-6 border-2 border-indigo-500 shadow-lg overflow-hidden"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-soul-text">Create a Post</h3>
                          <button onClick={() => setShowNewPost(false)} className="p-1.5 rounded-lg text-soul-muted hover:bg-soul-bg">
                            <X size={16} />
                          </button>
                        </div>
                        <input value={postForm.title}
                          onChange={e => setPostForm(p => ({ ...p, title: e.target.value }))}
                          placeholder="Post title..."
                          className="soul-input mb-3 text-sm" />
                        <textarea value={postForm.content}
                          onChange={e => setPostForm(p => ({ ...p, content: e.target.value }))}
                          placeholder="Share your thoughts, experience, or question..."
                          rows={4}
                          className="soul-input mb-3 text-sm resize-none" />
                        <div className="flex gap-2">
                          <button onClick={submitPost}
                            disabled={!postForm.title.trim() || !postForm.content.trim()}
                            className="btn-soul px-5 py-2.5 rounded-xl text-sm disabled:opacity-40 disabled:transform-none shadow-md">
                            <span>Post</span>
                          </button>
                          <button onClick={() => setShowNewPost(false)}
                            className="px-5 py-2.5 rounded-xl border border-soul-border text-sm text-soul-muted hover:bg-soul-bg">
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Posts */}
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    {activePosts.map(post => {
                      const isUpvoted = upvoted.has(post.id)
                      return (
                        <motion.div 
                          variants={itemVariants}
                          key={post.id} 
                          className={`bg-white rounded-2xl border transition-all shadow-sm ${
                            post.pinned ? 'border-blue-100' : 'border-soul-border hover:border-indigo-100 hover:shadow-md'
                          }`}>
                          {post.pinned && (
                            <div className="flex items-center gap-1.5 px-5 pt-3 pb-1">
                              <Pin size={11} className="text-indigo-500" />
                              <span className="text-xs font-semibold text-indigo-500">Pinned post</span>
                            </div>
                          )}
                          <div className="p-5 flex gap-4">
                            <div className="flex flex-col items-center gap-1.5 pt-0.5">
                              <motion.button 
                                whileTap={{ scale: 0.8 }}
                                onClick={() => handleUpvote(post.id)}
                                className={`p-1.5 rounded-lg transition-all ${
                                  isUpvoted ? 'text-indigo-600 bg-indigo-50' : 'text-soul-muted hover:bg-soul-bg hover:text-indigo-600'
                                }`}>
                                <ArrowUp size={16} />
                              </motion.button>
                              <span className={`text-xs font-bold ${isUpvoted ? 'text-indigo-600' : 'text-soul-muted'}`}>
                                {post.upvotes + (isUpvoted ? 1 : 0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                  style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)' }}>
                                  {post.avatar}
                                </div>
                                <span className="text-xs font-semibold text-soul-text">{post.user}</span>
                                <span className="text-soul-border">·</span>
                                <span className="text-xs text-soul-muted">{post.time}</span>
                              </div>
                              <h4 className="font-semibold text-soul-text text-sm mb-2 leading-snug">{post.title}</h4>
                              <p className="text-xs text-soul-muted leading-relaxed mb-3">{post.content}</p>
                              <button
                                onClick={() => setExpandedComments(expandedComments === post.id ? null : post.id)}
                                className="flex items-center gap-1.5 text-xs text-soul-muted hover:text-indigo-600 transition-colors">
                                <MessageCircle size={13} />
                                {post.commentCount} comments
                              </button>
                              <AnimatePresence>
                                {expandedComments === post.id && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mt-3 pt-3 border-t border-soul-border overflow-hidden"
                                  >
                                    <p className="text-xs text-soul-muted italic">
                                      💬 Join the community and start sharing to see comments!
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
