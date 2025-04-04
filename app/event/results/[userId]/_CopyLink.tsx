'use client'

import { useState, useEffect } from 'react'

export default function CopyLink({
  id,
  isResults,
}: {
  id: string
  isResults?: boolean
}) {
  //   const url = isResults
  //     ? `${process.env.NEXT_PUBLIC_BASE_URL}/event/results/${id}`
  //     : `${process.env.NEXT_PUBLIC_BASE_URL}/event/add-dates/${id}`;

  const [url, setUrl] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (window) {
      setUrl(
        isResults
          ? `${window.location.origin}/event/results/${id}`
          : `${window.location.origin}/event/add-dates/${id}`,
      )
    }
  }, [id, isResults])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <>
      <div
        className={`card w-full shadow-2xl ${isResults ? 'bg-base-300 text-base-content' : 'bg-primary/70 text-primary-content'}`}
      >
        <div className='card-body'>
          <h2 className='card-title mb-4 text-2xl'>
            {isResults ? 'View Results' : 'Share with others'}
          </h2>
          <div className='join w-full'>
            <input
              type='text'
              className='input join-item w-full'
              value={url}
              readOnly
            />
            <button className='btn join-item btn-neutral' onClick={copyToClipboard}>
              Copy
            </button>
          </div>
        </div>
      </div>
      {isCopied && (
        <div className='toast absolute right-[50%] bottom-0 translate-x-[50%]'>
          <div className='alert alert-info'>
            <span>Link copied to clipboard.</span>
          </div>
        </div>
      )}
    </>
  )
}
