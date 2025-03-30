import { useState } from 'react'
import { Button } from '../components/Buttons'
import { Card } from '../components/Card'
import { CreateContentModal } from '../components/CreateContentModal'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { Sidebar } from '../components/Sidebar'

function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <div>
        <Sidebar />
        <div className='p-4 ml-72 min-h-screen bg-gray-100 border-2'>
          <CreateContentModal open={modalOpen} onClose={() => {
            setModalOpen(false);
          } } />
          <div className='flex justify-end gap-4 mb-2'>
            <Button onClick={() => {
              setModalOpen(true);
            }} variant="primary" text="Add Content" startIcon={<PlusIcon />} />
            <Button variant="secondary" text="Share Brain" startIcon={<ShareIcon />} />
          </div> 
      
          <div className='flex gap-4'>
            <Card title="First Video" link="https://www.youtube.com/watch?v=1lrFsXkT_rM&ab_channel=geeguscrustVEVO" type='youtube'/>
            <Card title="First Tweet" link="https://x.com/elonmusk/status/1901204835711455288" type='twitter'/>
          </div>
          </div>
      </div>
    </>
  )
}

export default Dashboard
