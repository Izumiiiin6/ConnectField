"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export const DEPARTMENTS = ["店舗運営", "人事・総務", "営業", "本部", "その他"] as const
export type Department = (typeof DEPARTMENTS)[number]

export const POST_CATEGORIES = ["現場共有", "改善提案", "人事から", "相談", "その他"] as const
export type PostCategory = (typeof POST_CATEGORIES)[number]

export type DemoComment = {
  id: string
  content: string
  createdAt: string
  timeLabel: string
}

export type DemoPost = {
  id: string
  department: Department
  category: PostCategory
  content: string
  createdAt: string
  timeLabel: string
  imageUrl?: string
  imageAlt?: string
  likeCount: number
  commentCount: number
  likedByMe: boolean
  comments: DemoComment[]
}

export type DemoNotification = {
  id: string
  postId: string
  type: "like" | "comment"
  createdAt: string
  timeLabel: string
  read: boolean
}

export type DemoProfile = {
  name: string
  department: Department
  email: string
}

type CreatePostInput = {
  content: string
  department: Department
  category: PostCategory
  imageUrl?: string
}

type PrototypeStore = {
  posts: DemoPost[]
  notifications: DemoNotification[]
  unreadCount: number
  profile: DemoProfile
  statusMessage: string | null
  announce: (message: string) => void
  createPost: (input: CreatePostInput) => string
  toggleLike: (postId: string) => void
  addComment: (postId: string, content: string) => void
  markNotificationRead: (notificationId: string) => void
  markAllNotificationsRead: () => void
  updateProfile: (profile: Pick<DemoProfile, "name" | "department">) => void
}

const INITIAL_POSTS: DemoPost[] = [
  {
    id: "post-break-room",
    department: "店舗運営",
    category: "現場共有",
    content: "休憩室の共有ボードを整理しました。今週のシフト変更と、備品の追加申請についてまとめています。小さなことでも気づいたら気軽に共有してください。",
    createdAt: "2026-11-02T01:50:00.000Z",
    timeLabel: "1時間前",
    imageUrl: "/images/break-room-board.png",
    imageAlt: "休憩室のテーブルと、文字のない共有ボード",
    likeCount: 8,
    commentCount: 2,
    likedByMe: false,
    comments: [
      { id: "comment-break-1", content: "見やすくなって助かります。備品の場所も分かりやすいですね。", createdAt: "2026-11-02T02:02:00.000Z", timeLabel: "48分前" },
      { id: "comment-break-2", content: "ありがとうございます。申請の締切も確認しました。", createdAt: "2026-11-02T02:12:00.000Z", timeLabel: "38分前" },
    ],
  },
  {
    id: "post-hr-deadline",
    department: "人事・総務",
    category: "人事から",
    content: "【有給申請の締切について】11月分の希望休は、11月8日までに申請をお願いします。申請フォームで迷う点があれば、この投稿に返信してください。",
    createdAt: "2026-11-02T00:30:00.000Z",
    timeLabel: "2時間前",
    likeCount: 12,
    commentCount: 3,
    likedByMe: true,
    comments: [
      { id: "comment-hr-1", content: "申請フォームの場所をもう一度教えていただけますか？", createdAt: "2026-11-02T00:52:00.000Z", timeLabel: "2時間前" },
      { id: "comment-hr-2", content: "社内ポータルの「各種申請」から進められます。", createdAt: "2026-11-02T01:04:00.000Z", timeLabel: "1時間前" },
      { id: "comment-hr-3", content: "確認できました。ありがとうございます。", createdAt: "2026-11-02T01:18:00.000Z", timeLabel: "1時間前" },
    ],
  },
  {
    id: "post-closing-flow",
    department: "店舗運営",
    category: "改善提案",
    content: "夕方の混雑時に、レジ応援の呼び出し方法を少し変えてみました。売場から声をかけるより、インカムで役割を分けておくと落ち着いて対応できました。ほかの店舗でも試せそうです。",
    createdAt: "2026-11-01T08:20:00.000Z",
    timeLabel: "昨日",
    likeCount: 5,
    commentCount: 1,
    likedByMe: false,
    comments: [
      { id: "comment-flow-1", content: "具体的な役割分担も共有いただけると参考になります。", createdAt: "2026-11-01T09:00:00.000Z", timeLabel: "昨日" },
    ],
  },
]

const INITIAL_NOTIFICATIONS: DemoNotification[] = [
  { id: "notification-1", postId: "post-break-room", type: "comment", createdAt: "2026-11-02T02:12:00.000Z", timeLabel: "38分前", read: false },
  { id: "notification-2", postId: "post-hr-deadline", type: "like", createdAt: "2026-11-02T01:18:00.000Z", timeLabel: "1時間前", read: false },
  { id: "notification-3", postId: "post-closing-flow", type: "comment", createdAt: "2026-11-01T09:00:00.000Z", timeLabel: "昨日", read: true },
]

const INITIAL_PROFILE: DemoProfile = {
  name: "デモ利用者",
  department: "店舗運営",
  email: "demo@workconnect.jp",
}

const PrototypeStoreContext = createContext<PrototypeStore | null>(null)

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [profile, setProfile] = useState(INITIAL_PROFILE)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const announce = useCallback((message: string) => {
    setStatusMessage(message)
  }, [])

  useEffect(() => {
    if (!statusMessage) return
    const timeoutId = window.setTimeout(() => setStatusMessage(null), 2800)
    return () => window.clearTimeout(timeoutId)
  }, [statusMessage])

  const createPost = useCallback((input: CreatePostInput) => {
    const now = new Date()
    const post: DemoPost = {
      id: crypto.randomUUID(),
      department: input.department,
      category: input.category,
      content: input.content.trim(),
      createdAt: now.toISOString(),
      timeLabel: "たった今",
      imageUrl: input.imageUrl,
      imageAlt: input.imageUrl ? "投稿に添付された画像" : undefined,
      likeCount: 0,
      commentCount: 0,
      likedByMe: false,
      comments: [],
    }
    setPosts((current) => [post, ...current])
    announce("投稿を作成しました。デモデータはリロードで初期化されます。")
    return post.id
  }, [announce])

  const toggleLike = useCallback((postId: string) => {
    const target = posts.find((post) => post.id === postId)
    if (!target) return
    setPosts((current) => current.map((post) => {
      if (post.id !== postId) return post
      return {
        ...post,
        likedByMe: !post.likedByMe,
        likeCount: Math.max(0, post.likeCount + (post.likedByMe ? -1 : 1)),
      }
    }))
    announce(target.likedByMe ? "いいねを取り消しました。" : "いいねしました。")
  }, [announce, posts])

  const addComment = useCallback((postId: string, content: string) => {
    const cleanContent = content.trim()
    if (!cleanContent) return
    const comment: DemoComment = {
      id: crypto.randomUUID(),
      content: cleanContent,
      createdAt: new Date().toISOString(),
      timeLabel: "たった今",
    }
    setPosts((current) => current.map((post) => post.id === postId
      ? { ...post, comments: [...post.comments, comment], commentCount: post.commentCount + 1 }
      : post))
    announce("コメントを追加しました。")
  }, [announce])

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((current) => current.map((notification) => notification.id === notificationId
      ? { ...notification, read: true }
      : notification))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })))
    announce("すべての通知を既読にしました。")
  }, [announce])

  const updateProfile = useCallback((nextProfile: Pick<DemoProfile, "name" | "department">) => {
    setProfile((current) => ({ ...current, ...nextProfile, name: nextProfile.name.trim() }))
    announce("プロフィールを更新しました。デモ内の一時保存です。")
  }, [announce])

  const unreadCount = notifications.filter((notification) => !notification.read).length
  const value = useMemo(() => ({
    posts,
    notifications,
    unreadCount,
    profile,
    statusMessage,
    announce,
    createPost,
    toggleLike,
    addComment,
    markNotificationRead,
    markAllNotificationsRead,
    updateProfile,
  }), [posts, notifications, unreadCount, profile, statusMessage, announce, createPost, toggleLike, addComment, markNotificationRead, markAllNotificationsRead, updateProfile])

  return <PrototypeStoreContext.Provider value={value}>{children}</PrototypeStoreContext.Provider>
}

export function usePrototypeStore() {
  const store = useContext(PrototypeStoreContext)
  if (!store) throw new Error("usePrototypeStore must be used inside PrototypeProvider")
  return store
}
