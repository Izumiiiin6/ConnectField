"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, MessageCircle, Send, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { usePrototypeStore } from "@/components/prototype-store"
import { AnonymousAvatar, CategoryBadge, DepartmentBadge } from "@/components/work-connect-ui"

export function PostDetailView({ postId }: { postId: string }) {
  const { posts, toggleLike, addComment } = usePrototypeStore()
  const [commentText, setCommentText] = useState("")
  const [commentError, setCommentError] = useState("")
  const post = posts.find((item) => item.id === postId)

  if (!post) {
    return (
      <section className="detail-page">
        <Empty className="not-found-empty">
          <EmptyHeader>
            <EmptyMedia variant="icon"><MessageCircle aria-hidden="true" /></EmptyMedia>
            <EmptyTitle>投稿が見つかりません</EmptyTitle>
            <EmptyDescription>投稿が削除されたか、URLが正しくないようです。</EmptyDescription>
          </EmptyHeader>
          <EmptyContent><Link href="/" className="primary-link-button">掲示板に戻る</Link></EmptyContent>
        </Empty>
      </section>
    )
  }

  function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!commentText.trim()) {
      setCommentError("コメントを入力してください。")
      return
    }
    addComment(postId, commentText)
    setCommentText("")
    setCommentError("")
  }

  return (
    <section className="detail-page" aria-labelledby="detail-title">
      <Link href="/" className="back-link"><ArrowLeft aria-hidden="true" />掲示板へ戻る</Link>
      <div className="detail-layout">
        <div className="detail-main-column">
          <Card className="detail-post-card">
            <CardHeader className="post-card-header detail-post-header">
              <div className="post-author-row">
                <AnonymousAvatar />
                <div className="post-author-info">
                  <CardTitle className="post-author-name">匿名ユーザー</CardTitle>
                  <CardDescription className="post-author-subline">
                    <span>{post.department}</span><span aria-hidden="true">·</span><time dateTime={post.createdAt}>{post.timeLabel}</time>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="detail-post-content">
              <h1 id="detail-title" className="sr-only">投稿の詳細</h1>
              <div className="post-tags"><DepartmentBadge department={post.department} /><CategoryBadge category={post.category} /></div>
              <p className="detail-post-body">{post.content}</p>
              {post.imageUrl ? <img className="detail-post-image" src={post.imageUrl} alt={post.imageAlt ?? "投稿に添付された画像"} /> : null}
            </CardContent>
            <CardFooter className="detail-post-footer">
              <Button
                type="button"
                variant={post.likedByMe ? "secondary" : "ghost"}
                size="lg"
                aria-pressed={post.likedByMe}
                aria-label={`${post.likedByMe ? "いいねを解除" : "いいね"}、${post.likeCount}件`}
                onClick={() => toggleLike(post.id)}
              >
                <Heart data-icon="inline-start" fill={post.likedByMe ? "currentColor" : "none"} aria-hidden="true" />
                いいね <span>{post.likeCount}</span>
              </Button>
              <span className="detail-comment-summary"><MessageCircle aria-hidden="true" />{post.commentCount}件のコメント</span>
            </CardFooter>
          </Card>

          <Card className="comments-card" id="comments">
            <CardHeader className="comments-card-header">
              <CardTitle>コメント</CardTitle>
              <CardDescription>{post.commentCount}件の返信</CardDescription>
            </CardHeader>
            <CardContent className="comment-list">
              {post.comments.length ? post.comments.map((comment, index) => (
                <div key={comment.id} className="comment-item-wrap">
                  <article className="comment-item">
                    <AnonymousAvatar size="sm" />
                    <div className="comment-content">
                      <div className="comment-meta"><strong>匿名ユーザー</strong><time dateTime={comment.createdAt}>{comment.timeLabel}</time></div>
                      <p>{comment.content}</p>
                    </div>
                  </article>
                  {index < post.comments.length - 1 ? <Separator /> : null}
                </div>
              )) : (
                <Empty className="comments-empty">
                  <EmptyHeader>
                    <EmptyTitle>まだコメントはありません</EmptyTitle>
                    <EmptyDescription>最初の返信を投稿してみましょう。</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
            <CardContent className="comment-compose-content">
              <form onSubmit={handleCommentSubmit}>
                <FieldGroup>
                  <Field data-invalid={Boolean(commentError)}>
                    <FieldLabel htmlFor="comment-text">返信を書く</FieldLabel>
                    <Textarea
                      id="comment-text"
                      value={commentText}
                      onChange={(event) => {
                        setCommentText(event.target.value)
                        if (event.target.value.trim()) setCommentError("")
                      }}
                      maxLength={400}
                      rows={3}
                      placeholder="相手を尊重した返信を心がけましょう。"
                      aria-invalid={Boolean(commentError)}
                    />
                    <FieldDescription>個人名や個人情報は入力しないでください。</FieldDescription>
                    {commentError ? <p className="form-error" role="alert">{commentError}</p> : null}
                  </Field>
                  <div className="comment-submit-row">
                    <AnonymousAvatar size="sm" />
                    <Button type="submit" size="lg" disabled={!commentText.trim()}>
                      <Send data-icon="inline-start" aria-hidden="true" />返信する
                    </Button>
                  </div>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>

        <aside className="detail-aside" aria-label="匿名性について">
          <Card className="privacy-card">
            <CardHeader>
              <CardTitle className="detail-aside-title"><ShieldCheck aria-hidden="true" />安心して共有するために</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>投稿者とコメント投稿者は、全員共通のアバターで表示されます。個人を特定できる情報は投稿しないようご注意ください。</CardDescription>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  )
}
