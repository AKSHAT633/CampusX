import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchItems, deleteItem, updateItem } from '../servers/api'
import { useNavigate } from 'react-router-dom'

const SellLostAndFoundPostedItem = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { itemData } = useSelector((state) => state.item)
  const { userData } = useSelector((state) => state.user)

  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title: '', category: '', description: '', location: '', date: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!itemData || itemData.length === 0) fetchItems(dispatch)
  }, [dispatch])

  const myItems = (itemData || []).filter((i) => i.postedBy?._id === userData?._id)

  const startEdit = (it) => {
    setEditingId(it._id)
    setForm({ title: it.title || '', category: it.category || '', description: it.description || '', location: it.location || '', date: it.date ? new Date(it.date).toISOString().slice(0,10) : '' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ title: '', category: '', description: '', location: '', date: '' })
  }

  const submitEdit = async (id) => {
    setLoading(true)
    const payload = { ...form }
    const res = await updateItem(id, payload)
    setLoading(false)
    if (res?.error) alert(res.message || 'Update failed')
    else {
      fetchItems(dispatch)
      cancelEdit()
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    const res = await deleteItem(id)
    if (res?.error) alert(res.message || 'Delete failed')
    else fetchItems(dispatch)
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">My Lost & Found Posts</h2>
          <button onClick={() => navigate('/lost-found/add')} className="px-3 py-2 bg-blue-600 rounded">+ New</button>
        </div>

        {myItems.length === 0 && <div className="text-blue-300/60">You have no posts yet.</div>}

        <div className="grid gap-4">
          {myItems.map((it) => (
            <div key={it._id} className="p-4 rounded border bg-white/5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{it.title}</h3>
                  <div className="text-sm text-blue-300/80">{it.category} • {it.location}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(it)} className="px-3 py-1 bg-yellow-500 rounded">Edit</button>
                  <button onClick={() => handleDelete(it._id)} className="px-3 py-1 bg-red-600 rounded">Delete</button>
                  <button onClick={() => navigate(`/item/${it._id}`)} className="px-3 py-1 bg-blue-600 rounded">View</button>
                </div>
              </div>

              <p className="text-sm text-blue-300/70 mt-3">{it.description}</p>

              {editingId === it._id && (
                <div className="mt-3 space-y-2">
                  <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full p-2 rounded bg-slate-900/60" />
                  <input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full p-2 rounded bg-slate-900/60" />
                  <input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} className="w-full p-2 rounded bg-slate-900/60" />
                  <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="w-full p-2 rounded bg-slate-900/60" />
                  <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full p-2 rounded bg-slate-900/60" />
                  <div className="flex gap-2">
                    <button disabled={loading} onClick={() => submitEdit(it._id)} className="px-3 py-2 bg-green-600 rounded">{loading ? 'Saving...' : 'Save'}</button>
                    <button onClick={cancelEdit} className="px-3 py-2 bg-gray-600 rounded">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


export default SellLostAndFoundPostedItem
