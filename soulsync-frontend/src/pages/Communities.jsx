import React, { useState } from 'react'
import { Users, ArrowUp, MessageCircle, Plus, X, Search, Pin, Loader2 } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import toast from 'react-hot-toast'

// ── All community and post data — identical to v2 ────────────────────────────
const communities = [
  { id: 1, name: 'Academic Stress',    emoji: '📚', memberCount: 2340, color: '#5DADE2', description: 'For students navigating exams, deadlines, and academic pressure. Share strategies and find encouragement.' },
  { id: 2, name: 'Work Stress',        emoji: '💼', memberCount: 3150, color: '#A29BFE', description: 'Support for workplace burnout, difficult managers, toxic environments, and career anxiety.' },
  { id: 3, name: 'Relationship Stress',emoji: '💔', memberCount: 1870, color: '#E74C3C', description: 'Navigate the complexities of love, family bonds, and interpersonal struggles with compassion.' },
  { id: 4, name: 'Anxiety Support',    emoji: '🌊', memberCount: 4200, color: '#5DADE2', description: 'A safe, non-judgmental space for those living with anxiety disorders and panic attacks.' },
  { id: 5, name: 'Depression Support', emoji: '🌱', memberCount: 3600, color: '#27AE60', description: 'Compassionate community for people dealing with depression and persistent low mood.' },
  { id: 6, name: 'Career Pressure',    emoji: '🎯', memberCount: 1540, color: '#F39C12', description: 'For those feeling lost, pressured, or overwhelmed with career decisions and job searching.' },
  { id: 7, name: 'Mindfulness Circle', emoji: '🧘', memberCount: 2800, color: '#55E6C1', description: 'Share meditation tips, mindfulness journeys, and peaceful daily reflections.' },
  { id: 8, name: 'Parenting Stress',   emoji: '👨‍👩‍👧', memberCount: 1200, color: '#E91E8C', description: 'For parents navigating the joys and very real challenges of raising children.' },
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

  // Initialise joined from user's DB data (joinedCommunities populated as objects)
  const getInitialJoined = () => {
    if (!user?.joinedCommunities?.length) return new Set()
    const names = new Set((user.joinedCommunities).map(c => typeof c === 'object' ? c.name : c))
    return new Set(communities.filter(c => names.has(c.name)).map(c => c.id))
  }

  const [joined,           setJoined]           = useState(getInitialJoined)
  const [joiningId,        setJoiningId]        = useState(null)   // community id being toggled
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

  // ── Join / leave — saves to DB and syncs Profile ─────────────────────────
  const handleJoin = async (id, e) => {
    e.stopPropagation()
    if (!user) { setShowAuth(true); return }

    const isJoined  = joined.has(id)
    const community = communities.find(c => c.id === id)
    setJoiningId(id)

    // Optimistic UI
    setJoined(prev => {
      const next = new Set(prev)
      isJoined ? next.delete(id) : next.add(id)
      return next
    })

    try {
      // Try real backend (works if community is seeded with matching name)
      await axios.post('/api/communities/join-by-name', {
        name:        community.name,
        emoji:       community.emoji,
        description: community.description,
        memberCount: community.memberCount,
        color:       community.color,
        action:      isJoined ? 'leave' : 'join',
      })
      toast.success(isJoined ? `Left "${community.name}"` : `Joined "${community.name}"! 💙`)
      await refreshUser()   // Profile → Communities tab updates immediately
    } catch {
      // Fallback: store in localStorage so Profile still shows it
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

  // ── Upvote (local state, same as v2) ─────────────────────────────────────
  const handleUpvote = (postId) => {
    if (!user) { setShowAuth(true); return }
    setUpvoted(prev => {
      const next = new Set(prev)
      next.has(postId) ? next.delete(postId) : next.add(postId)
      return next
    })
  }

  // ── Submit post (local, same as v2) ──────────────────────────────────────
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

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-8">
          <span className="tag-mint mb-3 inline-block">Communities</span>
          <h1 className="font-display text-5xl font-bold text-soul-text mb-3">You Are Not Alone</h1>
          <p className="text-soul-muted max-w-lg mb-2">Find your tribe. Share authentically. Heal in connection.</p>
          {user && joined.size > 0 && (
            <p className="text-sm mb-5">
              <span className="text-blue-calm font-semibold">{joined.size} joined</span>
              <span className="text-soul-muted"> — visible in your Profile → Communities tab</span>
            </p>
          )}
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-soul-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search communities..."
              className="soul-input pl-10 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Community list ───────────────────────────────────────── */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-2.5">
            {filtered.map(c => {
              const isJoined = joined.has(c.id)
              const isBusy   = joiningId === c.id
              return (
                <div key={c.id} onClick={() => setActiveId(c.id)}
                  className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${
                    activeId === c.id ? 'border-blue-calm bg-blue-pale' : 'bg-white border-soul-border hover:border-blue-light'
                  }`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{c.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-soul-text text-sm leading-tight">{c.name}</p>
                        <button
                          onClick={e => handleJoin(c.id, e)}
                          disabled={isBusy}
                          className={`flex-shrink-0 text-xs px-3 py-1 rounded-lg font-semibold transition-all disabled:opacity-60 flex items-center gap-1 ${
                            isJoined ? 'bg-blue-pale text-blue-dark border border-blue-light' : 'text-white'
                          }`}
                          style={!isJoined ? { background: c.color } : {}}>
                          {isBusy
                            ? <Loader2 size={11} className="animate-spin" />
                            : isJoined ? '✓ Joined' : 'Join'
                          }
                        </button>
                      </div>
                      <p className="text-xs text-soul-muted line-clamp-2 leading-relaxed">{c.description}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Users size={11} className="text-soul-muted" />
                        <span className="text-xs text-soul-muted">{c.memberCount.toLocaleString()} members</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Post panel ───────────────────────────────────────────── */}
          <div className="lg:col-span-8 xl:col-span-9">
            {activeId ? (
              <div className="space-y-4">
                {/* Community banner */}
                <div className="bg-white rounded-2xl p-5 border border-soul-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activeCommunity?.emoji}</span>
                    <div>
                      <h2 className="font-display text-xl font-bold text-soul-text">{activeCommunity?.name}</h2>
                      <p className="text-xs text-soul-muted">{activeCommunity?.memberCount?.toLocaleString()} members</p>
                    </div>
                  </div>
                  <button onClick={() => { if (!user) { setShowAuth(true); return } setShowNewPost(true) }}
                    className="btn-soul px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 whitespace-nowrap">
                    <span className="flex items-center gap-1.5 relative z-10">
                      <Plus size={14} /> New Post
                    </span>
                  </button>
                </div>

                {/* New post form */}
                {showNewPost && (
                  <div className="bg-white rounded-2xl p-6 border-2 border-blue-calm animate-slide-up">
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
                        className="btn-soul px-5 py-2.5 rounded-xl text-sm disabled:opacity-40 disabled:transform-none">
                        <span>Post</span>
                      </button>
                      <button onClick={() => setShowNewPost(false)}
                        className="px-5 py-2.5 rounded-xl border border-soul-border text-sm text-soul-muted hover:bg-soul-bg">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Posts — identical rendering to v2 */}
                {activePosts.map(post => {
                  const isUpvoted = upvoted.has(post.id)
                  return (
                    <div key={post.id} className={`bg-white rounded-2xl border transition-all ${
                      post.pinned ? 'border-blue-light' : 'border-soul-border hover:border-blue-light'
                    }`}>
                      {post.pinned && (
                        <div className="flex items-center gap-1.5 px-5 pt-3 pb-1">
                          <Pin size={11} style={{ color: '#5DADE2' }} />
                          <span className="text-xs font-semibold" style={{ color: '#5DADE2' }}>Pinned post</span>
                        </div>
                      )}
                      <div className="p-5 flex gap-4">
                        <div className="flex flex-col items-center gap-1.5 pt-0.5">
                          <button onClick={() => handleUpvote(post.id)}
                            className={`p-1.5 rounded-lg transition-all ${
                              isUpvoted ? 'text-blue-calm bg-blue-pale' : 'text-soul-muted hover:bg-soul-bg hover:text-blue-calm'
                            }`}>
                            <ArrowUp size={16} />
                          </button>
                          <span className={`text-xs font-bold ${isUpvoted ? 'text-blue-calm' : 'text-soul-muted'}`}>
                            {post.upvotes + (isUpvoted ? 1 : 0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ background: 'linear-gradient(135deg, #5DADE2, #A29BFE)' }}>
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
                            className="flex items-center gap-1.5 text-xs text-soul-muted hover:text-blue-calm transition-colors">
                            <MessageCircle size={13} />
                            {post.commentCount} comments
                          </button>
                          {expandedComments === post.id && (
                            <div className="mt-3 pt-3 border-t border-soul-border">
                              <p className="text-xs text-soul-muted italic">
                                💬 Join the community and start sharing to see comments!
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 bg-white rounded-2xl border border-soul-border text-center px-6">
                <div className="text-5xl mb-4">👈</div>
                <h3 className="font-display text-xl font-semibold text-soul-text mb-2">Select a community</h3>
                <p className="text-sm text-soul-muted max-w-xs">
                  Choose a community from the left to view posts, join discussions, and connect with others.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
