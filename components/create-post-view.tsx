"use client"

import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ImagePlus, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DEPARTMENTS, POST_CATEGORIES, usePrototypeStore, type Department, type PostCategory } from "@/components/prototype-store"
import { AnonymousAvatar, PageHeading } from "@/components/work-connect-ui"
import { supabase } from "@/lib/supabase"

const MAX_IMAGE_SIZE = 4 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

export function CreatePostView({ onCreated, children, embedded = false }: { onCreated?: () => void | Promise<void>; children?: ReactNode; embedded?: boolean }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { profile } = usePrototypeStore()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [department, setDepartment] = useState<Department>(profile.department)
  const [category, setCategory] = useState<PostCategory>("現場共有")
  const [imageUrl, setImageUrl] = useState<string | undefined>()
  const [imageError, setImageError] = useState("")
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setImageError("")
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError("JPG・PNG・WebP形式の画像を選択してください。")
      event.target.value = ""
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("画像は4MB以下のファイルを選択してください。")
      event.target.value = ""
      return
    }
    const reader = new FileReader()
    reader.onload = () => setImageUrl(typeof reader.result === "string" ? reader.result : undefined)
    reader.onerror = () => setImageError("画像を読み込めませんでした。別のファイルをお試しください。")
    reader.readAsDataURL(file)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const client = supabase
    if (!client) {
      setFormError("Supabaseの接続情報が未設定のため、投稿を保存できません。")
      return
    }
    const cleanTitle = title.trim()
    const cleanContent = content.trim()
    if (!cleanTitle) {
      setFormError("題名を入力してください。")
      return
    }
    if (!cleanContent) {
      setFormError("投稿内容を入力してください。")
      return
    }
    setFormError("")
    setFormSuccess("")
    setIsSubmitting(true)
    const { data: { user }, error: userError } = await client.auth.getUser()
    if (userError || !user) {
      setFormError("投稿を保存するにはログインしてください。")
      setIsSubmitting(false)
      return
    }
    const { error } = await client.from("threads").insert({
      title: cleanTitle,
      content: cleanContent,
      author_name: "匿名ユーザー",
      user_id: user.id,
    })
    if (error) {
      setFormError(`投稿を保存できませんでした。${error.message}`)
      setIsSubmitting(false)
      return
    }
    if (onCreated) {
      await onCreated()
      setTitle("")
      setContent("")
      setImageUrl(undefined)
      if (fileInputRef.current) fileInputRef.current.value = ""
      setFormSuccess("投稿を保存しました。")
      setIsSubmitting(false)
      return
    }
    router.push("/")
  }

  return (
    <section className="composer-page" aria-labelledby="composer-title">
      {!embedded ? <Link href="/" className="back-link"><ArrowLeft aria-hidden="true" />掲示板へ戻る</Link> : null}
      <PageHeading titleId="composer-title" eyebrow="SHARE WITH YOUR TEAM" title="新しい投稿" description="現場の気づきやアイデアを、匿名で共有できます。" />
      {!supabase ? <p className="form-error" role="status">Supabaseの接続情報が未設定のため、投稿機能を利用できません。</p> : null}

      <Card className="composer-card">
        <CardHeader className="composer-card-header">
          <div className="compose-identity">
            <AnonymousAvatar />
            <div>
              <CardTitle>匿名ユーザーとして投稿</CardTitle>
              <CardDescription>名前やメールアドレスは掲示板に表示されません。</CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="composer-card-content">
            <FieldGroup className="composer-fields">
              <Field data-invalid={Boolean(formError)}>
                <FieldLabel htmlFor="post-title">題名</FieldLabel>
                <Input
                  id="post-title"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value)
                    if (event.target.value.trim()) setFormError("")
                  }}
                  maxLength={80}
                  placeholder="投稿の題名を入力してください"
                  aria-invalid={Boolean(formError)}
                  required
                />
                <FieldDescription>{title.length}/80文字</FieldDescription>
              </Field>
              <Field data-invalid={Boolean(formError)}>
                <FieldLabel htmlFor="post-content">投稿内容</FieldLabel>
                <Textarea
                  id="post-content"
                  value={content}
                  onChange={(event) => {
                    setContent(event.target.value)
                    if (event.target.value.trim()) setFormError("")
                  }}
                  maxLength={800}
                  rows={7}
                  placeholder="職場で気づいたこと、共有したいことを書いてみましょう。"
                  aria-invalid={Boolean(formError)}
                  required
                />
                <FieldDescription>{content.length}/800文字。個人名や個人情報は入力しないでください。</FieldDescription>
                {formError ? <FieldError>{formError}</FieldError> : null}
                {formSuccess ? <p className="form-success" role="status">{formSuccess}</p> : null}
              </Field>

              <FieldGroup className="compose-select-grid">
                <Field>
                  <FieldLabel htmlFor="post-department">部署</FieldLabel>
                  <Select value={department} onValueChange={(value) => value && setDepartment(value as Department)}>
                    <SelectTrigger id="post-department" className="form-select-trigger"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>{DEPARTMENTS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="post-category">カテゴリ</FieldLabel>
                  <Select value={category} onValueChange={(value) => value && setCategory(value as PostCategory)}>
                    <SelectTrigger id="post-category" className="form-select-trigger"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>{POST_CATEGORIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>

              <Field>
                <FieldLabel htmlFor="post-image">画像を添付</FieldLabel>
                <div className="attachment-row">
                  <Input
                    ref={fileInputRef}
                    id="post-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={handleImageChange}
                    aria-label="投稿画像を選択"
                  />
                  <Button type="button" variant="outline" size="lg" onClick={() => fileInputRef.current?.click()}>
                    <ImagePlus data-icon="inline-start" aria-hidden="true" />画像を選ぶ
                  </Button>
                  <FieldDescription>JPG・PNG・WebP、4MBまで</FieldDescription>
                </div>
                {imageError ? <p className="form-error" role="alert">{imageError}</p> : null}
                {imageUrl ? (
                  <div className="attachment-preview">
                    <img src={imageUrl} alt="投稿に添付する画像のプレビュー" />
                    <Button type="button" variant="secondary" size="icon-sm" aria-label="添付画像を削除" onClick={() => {
                      setImageUrl(undefined)
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}>
                      <X data-icon="inline-start" aria-hidden="true" />
                    </Button>
                  </div>
                ) : null}
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="composer-card-footer">
            {!embedded ? <Link href="/" className="secondary-link-button">キャンセル</Link> : null}
            <Button type="submit" size="lg" disabled={isSubmitting || !supabase}>
              <Send data-icon="inline-start" aria-hidden="true" />{isSubmitting ? "投稿中..." : "投稿する"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="prototype-caption">本文はSupabaseに保存されます。部署・カテゴリ・添付画像の保存には未対応です。</p>
      {children}
    </section>
  )
}
