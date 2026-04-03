import React, { useState } from 'react'
import { Users, ArrowUp, MessageCircle, Plus, X, Search, Pin, Loader2, ShieldCheck, Heart, AlertCircle, MoreHorizontal, Pencil, Trash, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import toast from 'react-hot-toast'

// ── Hardcoded data removed — now fetched from API ──────────────────────────

export default function Communities() {
  const { user, refreshUser } = useAuth()

  const [communities,      setCommunities]      = React.useState([])
  const [loadingComms,     setLoadingComms]     = React.useState(true)
  const [loadingPosts,     setLoadingPosts]     = React.useState(false)
  const [joined,           setJoined]           = React.useState(new Set())
  const [joiningId,        setJoiningId]        = React.useState(null)
  const [activeId,         setActiveId]         = React.useState(null)
  const [posts,            setPosts]            = React.useState([])
  const [upvoted,          setUpvoted]          = React.useState(new Set())
  const [showNewPost,      setShowNewPost]      = React.useState(false)
  const [postForm,         setPostForm]         = React.useState({ title: '', content: '' })
  const [showAuth,         setShowAuth]         = React.useState(false)
  const [search,           setSearch]           = React.useState('')
  const [expandedComments, setExpandedComments] = React.useState(null)
  const [editingPost,      setEditingPost]      = React.useState(null)
  const [commentText,      setCommentText]      = React.useState('')
  const [activeDropdown,   setActiveDropdown]   = React.useState(null)
  const [editingComment,   setEditingComment]   = React.useState(null)
  const [editingCommentText, setEditingCommentText] = React.useState('')

  // Fetch communities
  React.useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const { data } = await axios.get('/api/communities')
        if (data.success) {
          setCommunities(data.communities)
          // Set joined status
          const joinedIds = new Set(data.communities.filter(c => c.isJoined).map(c => c._id))
          setJoined(joinedIds)
        }
      } catch (err) {
        console.error('Error fetching communities:', err)
      } finally {
        setLoadingComms(false)
      }
    }
    fetchCommunities()
  }, [user])

  // Fetch posts when active community changes
  React.useEffect(() => {
    if (!activeId) return
    const fetchPosts = async () => {
      setLoadingPosts(true)
      try {
        const { data } = await axios.get(`/api/posts?community=${activeId}`)
        if (data.success) {
          setPosts(data.posts)
          // Set upvoted status
          const upvotedIds = new Set(data.posts.filter(p => p.isUpvoted).map(p => p._id))
          setUpvoted(upvotedIds)
        }
      } catch (err) {
        console.error('Error fetching posts:', err)
      } finally {
        setLoadingPosts(false)
      }
    }
    fetchPosts()
  }, [activeId, user])

  const filtered        = communities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  )
  const activeCommunity = communities.find(c => c._id === activeId)
  const activePosts     = posts
    .slice()
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))

  const handleJoin = async (id, e) => {
    e.stopPropagation()
    if (!user) { setShowAuth(true); return }

    const isJoined  = joined.has(id)
    const community = communities.find(c => c._id === id)
    setJoiningId(id)

    try {
      const { data } = await axios.post(`/api/communities/${id}/join`)
      if (data.success) {
        setJoined(prev => {
          const next = new Set(prev)
          data.joined ? next.add(id) : next.delete(id)
          return next
        })
        toast.success(data.message)
        await refreshUser()
      }
    } catch (err) {
      toast.error('Failed to update community membership.')
    } finally {
      setJoiningId(null)
    }
  }

  const handleUpvote = async (postId) => {
    if (!user) { setShowAuth(true); return }
    try {
      const { data } = await axios.post(`/api/posts/${postId}/upvote`)
      if (data.success) {
        setUpvoted(prev => {
          const next = new Set(prev)
          data.upvoted ? next.add(postId) : next.delete(postId)
          return next
        })
        setPosts(prev => prev.map(p => 
          p._id === postId ? { ...p, upvoteCount: data.upvoteCount } : p
        ))
      }
    } catch (err) {
      toast.error('Failed to upvote post.')
    }
  }

  const submitPost = async () => {
    if (!user) { setShowAuth(true); return }
    if (!postForm.title.trim() || !postForm.content.trim()) return
    try {
      if (editingPost) {
        const { data } = await axios.put(`/api/posts/${editingPost._id}`, {
          title: postForm.title,
          content: postForm.content,
        })
        if (data.success) {
          setPosts(prev => prev.map(p => p._id === data.post._id ? { ...p, ...data.post } : p))
          setEditingPost(null)
          toast.success('Post updated!')
        }
      } else {
        const { data } = await axios.post('/api/posts', {
          title: postForm.title,
          content: postForm.content,
          community: activeId,
        })
        if (data.success) {
          setPosts(prev => [data.post, ...prev])
          toast.success('Post created! 🎉')
        }
      }
      setPostForm({ title: '', content: '' })
      setShowNewPost(false)
    } catch (err) {
      toast.error('Failed to save post.')
    }
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return
    try {
      const { data } = await axios.delete(`/api/posts/${postId}`)
      if (data.success) {
        setPosts(prev => prev.filter(p => p._id !== postId))
        toast.success('Post deleted')
      }
    } catch (err) {
      toast.error('Failed to delete post.')
    }
  }

  const handleComment = async (postId) => {
    if (!user) { setShowAuth(true); return }
    if (!commentText.trim()) return
    try {
      const { data } = await axios.post(`/api/posts/${postId}/comment`, { content: commentText })
      if (data.success) {
        setPosts(prev => prev.map(p => 
          p._id === postId ? { ...p, comments: [...p.comments, data.comment], commentCount: p.commentCount + 1 } : p
        ))
        setCommentText('')
        toast.success('Comment added!')
      }
    } catch (err) {
      toast.error('Failed to add comment.')
    }
  }

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      const { data } = await axios.delete(`/api/posts/${postId}/comment/${commentId}`)
      if (data.success) {
        setPosts(prev => prev.map(p => 
          p._id === postId ? { ...p, comments: p.comments.filter(c => c._id !== commentId), commentCount: p.commentCount - 1 } : p
        ))
        toast.success('Comment removed')
      }
    } catch (err) {
      toast.error('Failed to remove comment.')
    }
  }

  const handleEditComment = async (postId, commentId) => {
    if (!editingCommentText.trim()) return
    try {
      const { data } = await axios.put(`/api/posts/${postId}/comment/${commentId}`, { content: editingCommentText })
      if (data.success) {
        setPosts(prev => prev.map(p => 
          p._id === postId ? { ...p, comments: p.comments.map(c => c._id === commentId ? { ...c, content: editingCommentText } : c) } : p
        ))
        setEditingComment(null)
        setEditingCommentText('')
        toast.success('Comment updated')
      }
    } catch (err) {
      toast.error('Failed to update comment.')
    }
  }

  const handleReact = async (postId, emoji) => {
    if (!user) { setShowAuth(true); return }
    try {
      const { data } = await axios.post(`/api/posts/${postId}/react`, { emoji })
      if (data.success) {
        setPosts(prev => prev.map(p => 
          p._id === postId ? { ...p, reactions: data.reactions } : p
        ))
      }
    } catch (err) {
      toast.error('Reaction failed.')
    }
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

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {loadingComms ? (
              [1,2,3,4].map(n => (
                <div key={n} className="h-20 rounded-2xl bg-white/40 animate-pulse border-2 border-transparent" />
              ))
            ) : filtered.map(c => {
              const isJoined = joined.has(c._id)
              return (
                <motion.div 
                  key={c._id} 
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  onClick={() => setActiveId(c._id)}
                  className={`group cursor-pointer rounded-2xl p-4 border-2 transition-all shadow-sm ${
                    activeId === c._id 
                      ? 'border-indigo-600 bg-white shadow-md' 
                      : 'border-white bg-white/40 hover:bg-white hover:border-slate-200'
                  }`}
                  style={{ borderColor: activeId === c._id ? c.color : undefined }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm backdrop-blur-md bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                      {c.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-[13px] truncate">{c.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Users size={10} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                          {Math.min(100, Math.max(60, (c.memberCount % 41) + 60))} members
                        </span>
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
                          <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                            {Math.min(100, Math.max(60, (activeCommunity.memberCount % 41) + 60))} members
                          </p>
                          <span className="w-1 h-1 rounded-full bg-slate-200" />
                          <p className="text-xs text-slate-500 font-light">{activeCommunity?.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <button
                        onClick={e => handleJoin(activeCommunity?._id, e)}
                        disabled={joiningId === activeCommunity?._id}
                        className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
                          joined.has(activeCommunity?._id) 
                            ? 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600' 
                            : 'text-white shadow-lg'
                        }`}
                        style={!joined.has(activeCommunity?._id) ? { background: activeCommunity?.color } : {}}>
                        {joiningId === activeCommunity?._id ? <Loader2 size={16} className="animate-spin" /> 
                          : joined.has(activeCommunity?._id) ? '✓ Joined' : 'Join Community'}
                      </button>

                      <button onClick={() => {
                        if (!user) { setShowAuth(true); return; }
                        setShowNewPost(true)
                      }}
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
                        className="bg-white rounded-[2rem] p-8 border-2 border-indigo-500 shadow-2xl overflow-hidden relative"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-display font-bold text-slate-900 uppercase tracking-tight">
                            {editingPost ? 'Edit Your Post' : 'Create a New Post'}
                          </h3>
                          <button onClick={() => { setShowNewPost(false); setEditingPost(null); }} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
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

                  {/* Posts with Loading State */}
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    {loadingPosts ? (
                      [1,2,3].map(n => (
                        <div key={n} className="h-40 rounded-[2.5rem] bg-white animate-pulse border border-slate-100" />
                      ))
                    ) : activePosts.length === 0 ? (
                      <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <p className="text-slate-500 italic">No posts here yet. Be the first to share! ✨</p>
                      </div>
                    ) : activePosts.map(post => {
                      const isUpvoted = upvoted.has(post._id)
                      const author = post.author || {}
                      return (
                        <motion.div 
                          variants={itemVariants}
                          key={post._id} 
                          className={`bg-white rounded-2xl border transition-all shadow-sm ${
                            post.isPinned ? 'border-blue-100' : 'border-soul-border hover:border-indigo-100 hover:shadow-md'
                          }`}>
                          {post.isPinned && (
                            <div className="flex items-center gap-1.5 px-5 pt-3 pb-1">
                              <Pin size={11} className="text-indigo-500" />
                              <span className="text-xs font-semibold text-indigo-500">Pinned post</span>
                            </div>
                          )}
                          <div className="p-5 flex gap-4">
                            <div className="flex flex-col items-center gap-1.5 pt-0.5">
                              <motion.button 
                                whileTap={{ scale: 0.8 }}
                                onClick={() => handleUpvote(post._id)}
                                className={`p-1.5 rounded-lg transition-all ${
                                  isUpvoted ? 'text-indigo-600 bg-indigo-50' : 'text-soul-muted hover:bg-soul-bg hover:text-indigo-600'
                                }`}>
                                <ArrowUp size={16} />
                              </motion.button>
                              <span className={`text-xs font-bold ${isUpvoted ? 'text-indigo-600' : 'text-soul-muted'}`}>
                                {post.upvoteCount}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                  style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)' }}>
                                  {(author.name || 'Y').charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs font-semibold text-soul-text">{author.name || 'Deleted User'}</span>
                                <span className="text-soul-border">·</span>
                                <span className="text-xs text-soul-muted">{new Date(post.createdAt).toLocaleDateString()}</span>
                              </div>
                              <h4 className="font-semibold text-soul-text text-sm mb-2 leading-snug">{post.title}</h4>
                              <p className="text-xs text-soul-muted leading-relaxed mb-3">{post.content}</p>
                               <div className="flex items-center gap-4">
                                <button
                                  onClick={() => setExpandedComments(expandedComments === post._id ? null : post._id)}
                                  className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                                  <MessageCircle size={13} />
                                  {post.commentCount} comments
                                </button>
                                
                                {/* Reactions Bar */}
                                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
                                  {['❤️', '🧠', '🫂', '✨'].map(emoji => {
                                    const hasReacted = post.reactions?.some(r => r.user === user?._id && r.emoji === emoji)
                                    const count = post.reactions?.filter(r => r.emoji === emoji).length || 0
                                    return (
                                      <button 
                                        key={emoji}
                                        onClick={() => handleReact(post._id, emoji)}
                                        className={`px-2 py-1 rounded-lg text-xs transition-all flex items-center gap-1 ${
                                          hasReacted ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-white'
                                        }`}
                                      >
                                        <span>{emoji}</span>
                                        {count > 0 && <span className="font-bold text-[9px] text-slate-500">{count}</span>}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Author Actions */}
                            {user?._id === author._id && (
                              <div className="relative z-10 self-start" onMouseLeave={() => setActiveDropdown(null)}>
                                <button onClick={() => setActiveDropdown(activeDropdown === post._id ? null : post._id)}
                                  className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 transition-all">
                                  <MoreHorizontal size={18} />
                                </button>
                                <AnimatePresence>
                                  {activeDropdown === post._id && (
                                    <motion.div 
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      className="absolute right-0 top-full w-36 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden"
                                    >
                                      <button onClick={() => { setActiveDropdown(null); setEditingPost(post); setPostForm({ title: post.title, content: post.content }); setShowNewPost(true); }}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                        <Pencil size={13} /> Edit Post
                                      </button>
                                      <button onClick={() => { setActiveDropdown(null); handleDeletePost(post._id); }}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-500 transition-colors border-t border-slate-50">
                                        <Trash size={13} /> Delete Post
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>

                          <AnimatePresence>
                            {expandedComments === post._id && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-5 pb-5 border-t border-slate-50 overflow-hidden"
                              >
                                <div className="pt-4 space-y-4">
                                  {post.comments?.map(comment => (
                                    <div key={comment._id} className="flex gap-3 group/comment">
                                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                                        {comment.user?.name?.charAt(0) || 'U'}
                                      </div>
                                      <div className="flex-1 bg-slate-50 p-3 rounded-2xl rounded-tl-none relative group/content">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-[10px] font-bold text-slate-900">{comment.user?.name || 'User'}</span>
                                          
                                          {/* Comment Actions Menu */}
                                          {user && (comment.user?._id === user?._id) && (
                                            <div className="relative z-10 self-start" onMouseLeave={() => setActiveDropdown(null)}>
                                              <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === comment._id ? null : comment._id) }} 
                                                className="opacity-0 group-hover/content:opacity-100 text-slate-400 hover:text-indigo-600 transition-all p-1">
                                                <MoreHorizontal size={14} />
                                              </button>
                                              
                                              <AnimatePresence>
                                                {activeDropdown === comment._id && (
                                                  <motion.div 
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="absolute right-0 top-full w-32 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-20"
                                                  >
                                                    <button onClick={() => { setActiveDropdown(null); setEditingComment(comment._id); setEditingCommentText(comment.content); }}
                                                      className="flex items-center gap-2 w-full px-3 py-2 text-[11px] font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                                      <Pencil size={11} /> Edit Reply
                                                    </button>
                                                    <button onClick={() => { setActiveDropdown(null); handleDeleteComment(post._id, comment._id); }}
                                                      className="flex items-center gap-2 w-full px-3 py-2 text-[11px] font-semibold text-slate-600 hover:bg-red-50 hover:text-red-500 transition-colors border-t border-slate-50">
                                                      <Trash size={11} /> Delete
                                                    </button>
                                                  </motion.div>
                                                )}
                                              </AnimatePresence>
                                            </div>
                                          )}
                                        </div>
                                        {editingComment === comment._id ? (
                                          <div className="mt-2 flex items-center gap-2">
                                            <input 
                                              value={editingCommentText}
                                              onChange={e => setEditingCommentText(e.target.value)}
                                              onKeyDown={e => e.key === 'Enter' && handleEditComment(post._id, comment._id)}
                                              className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:ring-1 ring-indigo-500 outline-none"
                                              autoFocus
                                            />
                                            <button onClick={() => handleEditComment(post._id, comment._id)} className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                                              <Check size={12} />
                                            </button>
                                            <button onClick={() => setEditingComment(null)} className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                                              <X size={12} />
                                            </button>
                                          </div>
                                        ) : (
                                          <p className="text-xs text-slate-600 leading-relaxed">{comment.content}</p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                  
                                  <div className="flex gap-3 mt-4 pt-4 border-t border-slate-50">
                                    <input 
                                      value={commentText}
                                      onChange={e => setCommentText(e.target.value)}
                                      onKeyDown={e => e.key === 'Enter' && handleComment(post._id)}
                                      onClick={() => { if (!user) setShowAuth(true); }}
                                      placeholder="Add an anonymous reply..."
                                      className="flex-1 text-xs bg-slate-50 border-none rounded-xl px-4 focus:ring-1 ring-indigo-500 outline-none"
                                    />
                                    <button 
                                      onClick={() => handleComment(post._id)}
                                      disabled={!commentText.trim() && user}
                                      className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 disabled:opacity-40"
                                    >
                                      <ArrowUp size={14} />
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
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
