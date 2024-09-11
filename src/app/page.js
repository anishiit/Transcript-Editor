"use client"
import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

const defaultTranscript =[
  { "word": "Hello", "start_time": 0, "duration": 500 },
  { "word": "world", "start_time": 500, "duration": 700 },
  { "word": "This", "start_time": 1200, "duration": 300 },
  { "word": "is", "start_time": 1500, "duration": 200 },
  { "word": "a", "start_time": 1700, "duration": 100 },
  { "word": "test", "start_time": 1800, "duration": 400 }
]
export default function Component({ initialTranscript= defaultTranscript}) {
  const [transcript, setTranscript] = useState(initialTranscript)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [editingIndex, setEditingIndex] = useState(null)
  const intervalRef = useRef(null)
  const totalDuration = (transcript || []).reduce((sum, word) => sum + word.duration, 0);


  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime >= totalDuration) {
            setIsPlaying(false)
            return totalDuration
          }
          return prevTime + 100
        })
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, totalDuration])

  const togglePlayback = () => {
    if (currentTime >= totalDuration) {
      setCurrentTime(0)
    }
    setIsPlaying(!isPlaying)
  }

  const resetPlayback = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleWordClick = (index) => {
    setEditingIndex(index)
  }

  const handleWordEdit = (index, newWord) => {
    const updatedTranscript = [...transcript]
    updatedTranscript[index].word = newWord
    setTranscript(updatedTranscript)
    setEditingIndex(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Transcript Editor</h1>
            <div className="mb-6 flex justify-center space-x-4">
              <button
                onClick={togglePlayback}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button
                onClick={resetPlayback}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                aria-label="Reset"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-2 text-lg text-black ">
              {(transcript || []).map((word, index) => (
                <Word
                  key={index}
                  word={word}
                  isHighlighted={currentTime >= word.start_time && currentTime < word.start_time + word.duration}
                  isEditing={editingIndex === index}
                  onClick={() => handleWordClick(index)}
                  onEdit={(newWord) => handleWordEdit(index, newWord)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



function Word({ word, isHighlighted, isEditing, onClick, onEdit }) {
  const [editedWord, setEditedWord] = useState(word.word)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onEdit(editedWord)
    }
  }

  if (isEditing) {
    return (
      <input
        type="text"
        value={editedWord}
        onChange={(e) => setEditedWord(e.target.value)}
        onBlur={() => onEdit(editedWord)}
        onKeyDown={handleKeyDown}
        className="px-1 py-0.5 border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 bg-blue-50 rounded"
        autoFocus
      />
    )
  }

  return (
    <span
      onClick={onClick}
      className={`cursor-pointer px-1 py-0.5 rounded transition-colors duration-200 ease-in-out ${
        isHighlighted ? 'bg-yellow-200' : 'hover:bg-gray-100'
      }`}
    >
      {word.word}
    </span>
  )
}
