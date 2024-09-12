"use client"
import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"






const defaultTranscript = [
  {
    timestamp: "00:01.3",
    words: [
      { word: "1.3s", start_time: 0, duration: 300, color: "text-gray-500" },
      { word: "But", start_time: 300, duration: 300 },
      { word: "with", start_time: 600, duration: 300 },
      { word: "VIRALCUT", start_time: 900, duration: 500, color: "text-orange-500" },
      { word: "you", start_time: 1400, duration: 200 },
      { word: "can", start_time: 1600, duration: 200 },
      { word: "send", start_time: 1800, duration: 300 },
      { word: "in", start_time: 2100, duration: 200 },
      { word: "an", start_time: 2300, duration: 200 },
      { word: "AI", start_time: 2500, duration: 300 },
      { word: "avatar", start_time: 2800, duration: 500, color: "text-red-500" },
      { word: "to", start_time: 3300, duration: 200 },
      { word: "take", start_time: 3500, duration: 300 },
      { word: "your", start_time: 3800, duration: 300 },
      { word: "place.", start_time: 4100, duration: 400 },
      { word: "They'll", start_time: 4500, duration: 300 },
      { word: "share", start_time: 4800, duration: 300 },
      { word: "your", start_time: 5100, duration: 300 },
      { word: "favorite", start_time: 5400, duration: 500, color: "text-red-500" },
      { word: "stories.", start_time: 5900, duration: 500 },
      { word: "It's", start_time: 6400, duration: 300, color: "text-red-500" },
      { word: "like", start_time: 6700, duration: 300 },
      { word: "having", start_time: 7000, duration: 300 },
      { word: "a", start_time: 7300, duration: 100 },
      { word: "digital", start_time: 7400, duration: 400 },
      { word: "stand", start_time: 7800, duration: 300 },
      { word: "in", start_time: 8100, duration: 200 },
      { word: "that", start_time: 8300, duration: 200 },
      { word: "never", start_time: 8500, duration: 300 },
      { word: "gets", start_time: 8800, duration: 300 },
      { word: "tired", start_time: 9100, duration: 300 },
      { word: "or", start_time: 9400, duration: 200 },
      { word: "runs", start_time: 9600, duration: 300 },
      { word: "out", start_time: 9900, duration: 300 },
      { word: "of", start_time: 10200, duration: 200 },
      { word: "things", start_time: 10400, duration: 300 },
      { word: "to", start_time: 10700, duration: 200 },
      { word: "say.", start_time: 10900, duration: 400 },
      { word: "Sit", start_time: 11300, duration: 300 },
      { word: "back,", start_time: 11600, duration: 300 },
      { word: "relax,", start_time: 11900, duration: 400 },
      { word: "and", start_time: 12300, duration: 200 },
      { word: "let", start_time: 12500, duration: 200 },
      { word: "your", start_time: 12700, duration: 300 },
      { word: "avatar", start_time: 13000, duration: 500, color: "text-red-500" },
      { word: "handle", start_time: 13500, duration: 400 },
      { word: "the", start_time: 13900, duration: 200 },
      { word: "chit", start_time: 14100, duration: 300, color: "text-red-500" },
      { word: "chat.", start_time: 14400, duration: 300, color: "text-red-500" },
      { word: "You", start_time: 14700, duration: 200 },
      { word: "deserve", start_time: 14900, duration: 400, color: "text-red-500" },
      { word: "it.", start_time: 15300, duration: 200 },
    ]
  },
  {
    timestamp: "00:15.8",
    words: [
      { word: "Whether", start_time: 15800, duration: 400 },
      { word: "it's", start_time: 16200, duration: 200 },
      { word: "a", start_time: 16400, duration: 100 },
      { word: "weekly", start_time: 16500, duration: 300 },
      { word: "catch", start_time: 16800, duration: 300, color: "text-red-500" },
      { word: "up", start_time: 17100, duration: 200 },
      { word: "or", start_time: 17300, duration: 200 },
      { word: "a", start_time: 17500, duration: 100 },
      { word: "holiday", start_time: 17600, duration: 400, color: "text-red-500" },
      { word: "gathering,", start_time: 18000, duration: 500, color: "text-red-500" },
      { word: "let", start_time: 18500, duration: 200 },
      { word: "US", start_time: 18700, duration: 200 },
      { word: "avatars", start_time: 18900, duration: 400 },
      { word: "keep", start_time: 19300, duration: 200 },
      { word: "your", start_time: 19500, duration: 200 },
      { word: "family", start_time: 19700, duration: 300 },
      { word: "entertained", start_time: 20000, duration: 500, color: "text-red-500" },
      { word: "and", start_time: 20500, duration: 200 },
      { word: "connected.", start_time: 20700, duration: 500 },
    ]
  }
]

export default function Component({ initialTranscript = defaultTranscript }) {
  const [transcript, setTranscript] = useState(initialTranscript)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const intervalRef = useRef(null)

  const totalDuration = transcript.reduce((sum, paragraph) => 
    sum + paragraph.words.reduce((pSum, word) => pSum + word.duration, 0), 0)

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

  const handleWordEdit = (paragraphIndex, wordIndex, newWord) => {
    const updatedTranscript = [...transcript]
    updatedTranscript[paragraphIndex].words[wordIndex].word = newWord
    setTranscript(updatedTranscript)
  }

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${(ms % 1000).toString().padStart(3, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-900 py-6 px-4 sm:px-6 lg:px-8 text-gray-300">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-4 sm:mb-6">Transcript Editor</h1>
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="text-xl font-mono">{formatTime(currentTime)}</div>
              <div className="flex space-x-4">
                <Button
                  onClick={togglePlayback}
                  size="icon"
                  className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                <Button
                  onClick={resetPlayback}
                  size="icon"
                  className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 text-white shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
                  aria-label="Reset"
                >
                  <RotateCcw className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <div className="space-y-6 text-base sm:text-lg">
              {transcript.map((paragraph, paragraphIndex) => (
                <div key={paragraphIndex} className="space-y-2">
                  <div className="text-gray-500 text-sm">{paragraph.timestamp}</div>
                  <div className="whitespace-normal break-words">
                    {paragraph.words.map((word, wordIndex) => (
                      <Word
                        key={wordIndex}
                        word={word}
                        isHighlighted={currentTime >= word.start_time && currentTime < word.start_time + word.duration}
                        onEdit={(newWord) => handleWordEdit(paragraphIndex, wordIndex, newWord)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


function Word({ word, isHighlighted, onEdit }) {
  const [editedWord, setEditedWord] = useState(word.word)

  const handleEdit = () => {
    onEdit(editedWord)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span
          className={`cursor-pointer px-1 py-0.5 rounded transition-colors duration-200 ease-in-out inline-block ${
            isHighlighted ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'
          } ${word.color || ''}`}
        >
          {word.word}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none text-gray-200">Edit Word</h4>
            <p className="text-sm text-gray-400">
              Make changes to the selected word.
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              id="word"
              value={editedWord}
              onChange={(e) => setEditedWord(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="bg-yellow-600 hover:bg-yellow-700 text-white border-none transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Correct
            </Button>
            <Button
              variant="outline"
              className="bg-gray-600 hover:bg-gray-700 text-white border-none transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Correct All
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}