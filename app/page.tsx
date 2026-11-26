'use client'

import { useEffect, useState } from 'react'
import { CreatePostView } from '@/components/create-post-view'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'

type Thread = {
  id: number
  title: string
  content: string
  author_name: string
  created_at: string
}

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [threadError, setThreadError] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editMessage, setEditMessage] = useState('')
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  const getThreads = async () => {
    const client = supabase
    if (!client) {
      setThreadError('Supabaseの接続情報が未設定のため、投稿を読み込めません。')
      setThreads([])
      return
    }

    const { data, error } = await client
      .from('threads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('投稿一覧を取得できませんでした:', error)
      setThreadError('投稿一覧を取得できませんでした。Supabaseの設定を確認してください。')
      return
    }

    setThreadError('')
    setThreads((data ?? []) as Thread[])
  }

  useEffect(() => {
    void getThreads()
  }, [])

  const updateThread = async (id: number) => {
    const client = supabase
    if (!client) {
      setEditMessage('Supabaseの接続情報が未設定のため、投稿を更新できません。')
      return
    }
    const title = editTitle.trim()
    const content = editContent.trim()
    if (!title || !content) {
      setEditMessage('題名と投稿内容を入力してください。')
      return
    }

    setEditMessage('')
    setIsSavingEdit(true)
    const { data, error } = await client
      .from('threads')
      .update({ title, content })
      .eq('id', id)
      .select('id')
      .maybeSingle()

    if (error) {
      console.error('投稿を更新できませんでした:', error)
      setEditMessage(`投稿を保存できませんでした。${error.message}`)
      setIsSavingEdit(false)
      return
    }
    if (!data) {
      setEditMessage('投稿が見つからないか、更新する権限がありません。')
      setIsSavingEdit(false)
      return
    }

    setEditId(null)
    setEditMessage('投稿を更新しました。')
    await getThreads()
    setIsSavingEdit(false)
  }

  const deleteThread = async (id: number) => {
    const client = supabase
    if (!client) {
      setThreadError('Supabaseの接続情報が未設定のため、投稿を削除できません。')
      return
    }
    const { error } = await client
      .from('threads')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('投稿を削除できませんでした:', error)
      return
    }

    await getThreads()
  }

  return (
    <CreatePostView onCreated={getThreads} embedded>
      <section className="home-thread-section" aria-labelledby="thread-list-title">
        <div className="feed-list-toolbar">
          <div>
            <h2 id="thread-list-title">投稿一覧</h2>
            <p>Supabaseに保存された投稿です</p>
          </div>
          {!threadError ? <span className="thread-count">{threads.length}件</span> : null}
        </div>
        {threadError ? <p className="form-error" role="status">{threadError}</p> : null}
        {editMessage ? (
          <p className={editMessage === '投稿を更新しました。' ? 'form-success' : 'form-error'} role="status">
            {editMessage}
          </p>
        ) : null}
        {threads.length ? (
          <div className="post-list">
            {threads.map((thread) => (
              <Card className="post-card" key={thread.id}>
                {editId === thread.id ? (
                  <>
                    <CardHeader><CardTitle>投稿を編集</CardTitle></CardHeader>
                    <CardContent className="home-thread-edit-fields">
                      <Input aria-label="投稿タイトル" value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
                      <Textarea aria-label="投稿本文" rows={5} value={editContent} onChange={(event) => setEditContent(event.target.value)} />
                    </CardContent>
                    <CardFooter className="home-thread-actions">
                      <Button type="button" variant="outline" disabled={isSavingEdit} onClick={() => {
                        setEditId(null)
                        setEditMessage('')
                      }}>キャンセル</Button>
                      <Button type="button" disabled={isSavingEdit} onClick={() => updateThread(thread.id)}>
                        {isSavingEdit ? '保存中...' : '更新する'}
                      </Button>
                    </CardFooter>
                  </>
                ) : (
                  <>
                    <CardHeader><CardTitle>{thread.title}</CardTitle></CardHeader>
                    <CardContent>
                      <p className="home-thread-content">{thread.content}</p>
                      <p className="home-thread-meta">
                        投稿者：{thread.author_name} · {new Date(thread.created_at).toLocaleString('ja-JP')}
                      </p>
                    </CardContent>
                    <CardFooter className="home-thread-actions">
                      <Button type="button" variant="outline" onClick={() => {
                        setEditId(thread.id)
                        setEditTitle(thread.title)
                        setEditContent(thread.content)
                        setEditMessage('')
                      }}>編集する</Button>
                      <Button type="button" variant="destructive" onClick={() => deleteThread(thread.id)}>削除する</Button>
                    </CardFooter>
                  </>
                )}
              </Card>
            ))}
          </div>
        ) : threadError ? null : (
          <Card className="home-thread-empty"><CardContent>まだ投稿はありません。</CardContent></Card>
        )}
      </section>
    </CreatePostView>
  )
}
