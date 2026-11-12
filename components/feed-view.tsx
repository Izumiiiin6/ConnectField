"use client"

import { useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowRight, Lightbulb, Search, ShieldCheck, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { DEPARTMENTS, usePrototypeStore } from "@/components/prototype-store"
import { PageHeading } from "@/components/work-connect-ui"
import { PostCard } from "@/components/post-card"

export function FeedView() {
  const { posts } = usePrototypeStore()
  const [draftKeyword, setDraftKeyword] = useState("")
  const [appliedKeyword, setAppliedKeyword] = useState("")
  const [department, setDepartment] = useState("all")

  const visiblePosts = useMemo(() => {
    const normalizedKeyword = appliedKeyword.trim().toLocaleLowerCase("ja")
    return posts
      .filter((post) => department === "all" || post.department === department)
      .filter((post) => !normalizedKeyword || post.content.toLocaleLowerCase("ja").includes(normalizedKeyword))

      .slice(0, 20)
  }, [appliedKeyword, department, posts])

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAppliedKeyword(draftKeyword)
  }

  function resetSearch() {
    setDraftKeyword("")
    setAppliedKeyword("")
    setDepartment("all")
  }

  return (
    <div className="feed-layout">
      <section className="feed-main" aria-labelledby="feed-title">
        <PageHeading
          eyebrow="WORKSPACE / FEED"
          title="現場の声が集まる場所。"
          description="気づきやアイデアを、安心して共有しよう。"
          actions={<Link href="/posts/new" className="primary-link-button"><span>新しい投稿</span><ArrowRight aria-hidden="true" /></Link>}
        />

        <Card className="search-card">
          <CardHeader className="search-card-header">
            <CardTitle>投稿を検索</CardTitle>
            <CardDescription>キーワードや部署から、必要な情報を見つけられます。</CardDescription>
          </CardHeader>
          <form onSubmit={handleSearch}>
            <CardContent className="search-card-content">
              <FieldGroup className="search-fields">
                <Field className="search-field">
                  <FieldLabel htmlFor="feed-search">キーワード</FieldLabel>
                  <div className="search-input-wrap">
                    <Search aria-hidden="true" />
                    <Input
                      id="feed-search"
                      type="search"
                      value={draftKeyword}
                      onChange={(event) => setDraftKeyword(event.target.value)}
                      placeholder="投稿内容を検索"
                      autoComplete="off"
                    />
                  </div>
                </Field>
                <Field className="search-field">
                  <FieldLabel htmlFor="feed-department">部署</FieldLabel>
                  <Select value={department} onValueChange={(value) => setDepartment(value ?? "all")}>
                    <SelectTrigger id="feed-department" className="search-select-trigger">
                      <SelectValue placeholder="すべての部署" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">すべての部署</SelectItem>
                        {DEPARTMENTS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter className="search-card-footer">
              <Button type="button" variant="outline" size="lg" onClick={resetSearch}>条件をリセット</Button>
              <Button type="submit" size="lg"><Search data-icon="inline-start" aria-hidden="true" />検索する</Button>
            </CardFooter>
          </form>
        </Card>

        <div className="feed-list-toolbar">
          <div>
            <h2 id="feed-title">新着の投稿</h2>
            <p>みんなの共有が新しい順に並びます</p>
          </div>
          <Badge variant="outline">{visiblePosts.length}件</Badge>
        </div>

        {visiblePosts.length ? (
          <div className="post-list">
            {visiblePosts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        ) : (
          <Empty className="feed-empty">
            <EmptyHeader>
              <EmptyMedia variant="icon"><Search aria-hidden="true" /></EmptyMedia>
              <EmptyTitle>投稿が見つかりません</EmptyTitle>
              <EmptyDescription>キーワードや部署を変えて、もう一度検索してください。</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button type="button" variant="outline" onClick={resetSearch}>検索条件をリセット</Button>
            </EmptyContent>
          </Empty>
        )}
      </section>

      <aside className="feed-aside" aria-label="コミュニティ情報">
        <Card className="community-card">
          <CardHeader className="community-card-header">
            <span className="community-icon"><Sparkles aria-hidden="true" /></span>
            <CardTitle>ひとことから、職場が変わる。</CardTitle>
            <CardDescription>現場と会社をつなぐ、もうひとつの共有場所。</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/posts/new" className="community-cta">気づきを共有する <ArrowRight aria-hidden="true" /></Link>
          </CardContent>
        </Card>

        <Card className="guide-card">
          <CardHeader className="guide-card-header">
            <span className="guide-icon"><Lightbulb aria-hidden="true" /></span>
            <CardTitle>投稿のヒント</CardTitle>
            <CardDescription>具体的な状況や気づきを書くと、みんなに伝わりやすくなります。</CardDescription>
          </CardHeader>
          <CardContent>
            <Separator />
            <ul className="guide-list">
              <li>個人が特定される情報は書かない</li>
              <li>小さな改善や疑問も歓迎</li>
              <li>返信はお互いにやさしく</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="privacy-card">
          <CardHeader className="privacy-card-header">
            <span className="privacy-icon"><ShieldCheck aria-hidden="true" /></span>
            <CardTitle>みんな共通の匿名表示</CardTitle>
          </CardHeader>
          <CardContent className="privacy-card-content">
            <CardDescription>名前や顔写真は投稿に表示されません。</CardDescription>
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}
