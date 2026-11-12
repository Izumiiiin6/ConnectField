"use client"

import Link from "next/link"
import { Bell, Check, Heart, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { usePrototypeStore } from "@/components/prototype-store"
import { AnonymousAvatar, PageHeading } from "@/components/work-connect-ui"

export function NotificationsView() {
  const { notifications, posts, unreadCount, markNotificationRead, markAllNotificationsRead } = usePrototypeStore()
  const orderedNotifications = [...notifications].sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())

  return (
    <section className="notifications-page" aria-labelledby="notifications-title">
      <PageHeading
        eyebrow="YOUR ACTIVITY"
        title="通知"
        description="あなたの投稿への反応を確認できます。"
        actions={unreadCount > 0 ? <Button type="button" variant="outline" size="lg" onClick={markAllNotificationsRead}><Check data-icon="inline-start" aria-hidden="true" />すべて既読にする</Button> : undefined}
      />
      <h2 id="notifications-title" className="sr-only">通知一覧</h2>

      {orderedNotifications.length ? (
        <Card className="notifications-card">
          <CardHeader className="notifications-card-header">
            <CardTitle>最近のアクティビティ</CardTitle>
            <CardDescription>{unreadCount ? `未読 ${unreadCount}件` : "すべて確認済みです"}</CardDescription>
          </CardHeader>
          <CardContent className="notifications-list">
            {orderedNotifications.map((notification, index) => {
              const post = posts.find((item) => item.id === notification.postId)
              const isLike = notification.type === "like"
              return (
                <div key={notification.id}>
                  <Link
                    href={post ? `/posts/${post.id}` : "/"}
                    className={`notification-link${notification.read ? "" : " is-unread"}`}
                    onClick={() => markNotificationRead(notification.id)}
                  >
                    <span className={`notification-type-icon${isLike ? " is-like" : " is-comment"}`}>
                      {isLike ? <Heart aria-hidden="true" /> : <MessageCircle aria-hidden="true" />}
                    </span>
                    <AnonymousAvatar size="sm" />
                    <span className="notification-copy">
                      <span><strong>匿名ユーザー</strong>があなたの投稿に{isLike ? "いいね" : "コメント"}しました</span>
                      <small>{notification.timeLabel}{post ? ` · 「${post.content.slice(0, 42)}${post.content.length > 42 ? "…" : ""}」` : ""}</small>
                    </span>
                    {!notification.read ? <span className="unread-dot" aria-label="未読" /> : null}
                  </Link>
                  {index < orderedNotifications.length - 1 ? <Separator /> : null}
                </div>
              )
            })}
          </CardContent>
        </Card>
      ) : (
        <Empty className="notifications-empty">
          <EmptyHeader>
            <EmptyMedia variant="icon"><Bell aria-hidden="true" /></EmptyMedia>
            <EmptyTitle>通知はまだありません</EmptyTitle>
            <EmptyDescription>投稿へのいいねやコメントがここに表示されます。</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </section>
  )
}
