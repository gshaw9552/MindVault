import { useEffect, useState } from 'react'
import { Button } from '../components/Buttons'
import { Card } from '../components/Card'
import { CreateContentModal } from '../components/CreateContentModal'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { Sidebar } from '../components/Sidebar'
import { API_BASE } from '../config'

interface ContentItem {
  _id: string
  title: string
  link: string
  type: string
}

function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false)
  const [contentList, setContentList] = useState<ContentItem[]>([])

  // ↳ Move handleDelete here so it can call setContentList
  async function handleDelete(contentId: string) {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('You must be signed in to delete.')
      return
    }
    if (!window.confirm('Delete this item?')) return

    try {
      const res = await fetch(`${API_BASE}/content`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contentId }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Delete failed')
      }
      // remove it from state
      setContentList((prev) => prev.filter((i) => i._id !== contentId))
    } catch (e: any) {
      console.error('Delete error:', e)
      alert('Failed to delete: ' + e.message)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    fetch(`${API_BASE}/content`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          return [] as ContentItem[]
        }
        const data = await res.json()
        return data.content as ContentItem[]
      })
      .then((items) => {
        setContentList(items)
      })
      .catch((err) => {
        console.error('Fetch Content Error:', err)
      })
  }, [])

  return (
    <>
      <div>
        <Sidebar />
        <div className='p-4 ml-72 min-h-screen bg-gray-100 border-2'>
          <CreateContentModal
            open={modalOpen}
            onClose={() => {
              setModalOpen(false)
            }}
          />
          <div className='flex justify-end gap-4 mb-2'>
            <Button
              onClick={() => {
                setModalOpen(true)
              }}
              variant='primary'
              text='Add Content'
              startIcon={<PlusIcon />}
            />
            <Button variant='secondary' text='Share Brain' startIcon={<ShareIcon />} />
          </div>
          {/* === TEMPORARY: Render some static Card components for layout testing === */}
          {/* 
          <div className="flex flex-wrap gap-4">
            <Card
              title="Sample Video"
              link="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              type="youtube"
            />
            <Card
              title="Example Tweet"
              link="https://x.com/example/status/1234567890"
              type="twitter"
            />
            <Card
              title="Interesting Article"
              link="https://example.com/article"
              type="link"
            />
            <Card
              title="Music Clip"
              link="https://soundcloud.com/example"
              type="music"
            />
          </div>
          */}
          {/* === End temporary cards === */}
          <div className='flex flex-wrap gap-8 justify-center'>
            {contentList.map((item) => (
              <div key={item._id} className='relative'>
                <Card
                  title={item.title}
                  link={item.link}
                  type={item.type}
                  onDelete={() => handleDelete(item._id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
