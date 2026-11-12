"use client"

import Link from "next/link"
import { Heart, MessageCircle, MoreHorizontal, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { DemoPost } from "@/components/prototype-store"
import { AnonymousAvatar, CategoryBadge, DepartmentBadge } from "@/components/work-connect-ui"
import { usePrototypeStore } from "@/components/prototype-store"

export function PostCard({ post }: { post: DemoPost }) {
  const { toggleLike } = usePrototypeStore()

  return (
    <Card className="post-card">
      <CardHeader className="post-card-header">
        <div className="post-author-row">
          <AnonymousAvatar />
          <div className="post-author-info">
            <CardTitle className="post-author-name">匿名ユーザー</CardTitle>
            <CardDescription className="post-author-subline">
              <span>{post.department}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.createdAt}>{post.timeLabel}</time>
            </CardDescription>
          </div>
        </div>
        <CardAction>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="投稿のその他メニューはプロトタイプでは利用できません" disabled>
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="post-card-content">
        <div className="post-tags">
          <DepartmentBadge department={post.department} />
          <CategoryBadge category={post.category} />
        </div>
        <Link href={`/posts/${post.id}`} className="post-body-link">
          <p className="post-body">{post.content}</p>
        </Link>
        {post.imageUrl ? (
          <Link href={`/posts/${post.id}`} className="post-image-link" aria-label="画像付き投稿の詳細を見る">
            <img className="post-image" src={post.imageUrl} alt={post.imageAlt ?? "投稿に添付された画像"} loading="lazy" />
          </Link>
        ) : null}
      </CardContent>

      <CardFooter className="post-card-footer">
        <Button
          type="button"
          variant={post.likedByMe ? "secondary" : "ghost"}
          size="lg"
          className="post-action-button"
          aria-pressed={post.likedByMe}
          aria-label={`${post.likedByMe ? "いいねを解除" : "いいね"}、${post.likeCount}件`}
          onClick={() => toggleLike(post.id)}
        >
          <Heart data-icon="inline-start" fill={post.likedByMe ? "currentColor" : "none"} aria-hidden="true" />
          <span>{post.likeCount}</span>
        </Button>
        <Link href={`/posts/${post.id}#comments`} className="post-comment-link">
          <MessageCircle aria-hidden="true" />
          <span>{post.commentCount}件</span>
        </Link>
        <span className="post-actions-spacer" />
        <Link href={`/posts/${post.id}`} className="post-detail-link">
          詳しく見る <ArrowUpRight aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  )
}
