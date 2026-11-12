"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowLeft, LockKeyhole, Save, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DEPARTMENTS, usePrototypeStore, type Department } from "@/components/prototype-store"
import { AnonymousAvatar, PageHeading } from "@/components/work-connect-ui"

export function ProfileView() {
  const { profile, updateProfile, announce } = usePrototypeStore()
  const [name, setName] = useState(profile.name)
  const [department, setDepartment] = useState<Department>(profile.department)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) {
      announce("名前を入力してください。")
      return
    }
    updateProfile({ name, department })
  }

  return (
    <section className="profile-page" aria-labelledby="profile-title">
      <Link href="/" className="back-link"><ArrowLeft aria-hidden="true" />掲示板へ戻る</Link>
      <PageHeading titleId="profile-title" eyebrow="YOUR PROFILE" title="プロフィール" description="登録情報を確認・編集できます。" />

      <div className="profile-layout">
        <div className="profile-main-column">
          <Card className="profile-card">
            <CardHeader className="profile-card-header">
              <div className="profile-avatar-block">
                <AnonymousAvatar size="lg" />
                <div>
                  <CardTitle>あなたのプロフィール</CardTitle>
                  <CardDescription>掲示板では共通アバターで匿名表示されます。</CardDescription>
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="profile-card-content">
                <FieldGroup>
                  <Field data-disabled>
                    <FieldLabel htmlFor="profile-email">メールアドレス</FieldLabel>
                    <Input id="profile-email" type="email" value={profile.email} disabled />
                    <FieldDescription>本人確認用の情報です。掲示板には表示されません。</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="profile-name">名前</FieldLabel>
                    <Input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" maxLength={60} required />
                    <FieldDescription>この情報はプロフィール内だけで確認できます。</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="profile-department">部署</FieldLabel>
                    <Select value={department} onValueChange={(value) => value && setDepartment(value as Department)}>
                      <SelectTrigger id="profile-department" className="form-select-trigger"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectGroup>{DEPARTMENTS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
              </CardContent>
              <CardFooter className="profile-card-footer">
                <Button type="submit" size="lg"><Save data-icon="inline-start" aria-hidden="true" />変更を保存</Button>
              </CardFooter>
            </form>
          </Card>

          <Card className="profile-security-card">
            <CardHeader className="profile-security-content">
              <span className="profile-security-icon"><ShieldCheck aria-hidden="true" /></span>
              <div>
                <CardTitle>掲示板での匿名性</CardTitle>
                <CardDescription>名前・メールアドレスは投稿やコメントに表示されません。プロフィール情報は、実際の認証設定後に安全なアクセス制御とあわせて保存します。</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        <aside className="profile-aside">
          <Card className="profile-account-card">
            <CardHeader>
              <CardTitle>アカウント</CardTitle>
              <CardDescription>認証機能は次の設定ステップで接続します。</CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" size="lg" className="profile-logout-button" onClick={() => announce("ログアウト機能はSupabase Authの設定後に有効になります。")}>
                <LockKeyhole data-icon="inline-start" aria-hidden="true" />ログアウト（デモ）
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  )
}
