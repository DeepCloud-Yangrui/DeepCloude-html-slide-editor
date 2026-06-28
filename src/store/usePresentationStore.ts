import { create } from 'zustand'
import type { Slide } from '@/types'

interface PresentationState {
  // Runtime state
  currentIndex: number
  direction: 1 | -1
  isPlaying: boolean
  slides: Slide[]

  // Actions
  setSlides: (slides: Slide[]) => void
  goToSlide: (index: number) => void
  nextSlide: () => void
  prevSlide: () => void
  goToFirst: () => void
  goToLast: () => void
  togglePlay: () => void
  setPlaying: (playing: boolean) => void
}

export const usePresentationStore = create<PresentationState>()((set, get) => ({
  currentIndex: 0,
  direction: 1,
  isPlaying: false,
  slides: [],

  setSlides: (slides) => set({ slides, currentIndex: 0, direction: 1 }),

  goToSlide: (index) => {
    const { currentIndex, slides } = get()
    if (index < 0 || index >= slides.length) return
    set({
      currentIndex: index,
      direction: index > currentIndex ? 1 : -1,
    })
  },

  nextSlide: () => {
    const { currentIndex, slides } = get()
    if (currentIndex >= slides.length - 1) return
    set({
      currentIndex: currentIndex + 1,
      direction: 1,
    })
  },

  prevSlide: () => {
    const { currentIndex } = get()
    if (currentIndex <= 0) return
    set({
      currentIndex: currentIndex - 1,
      direction: -1,
    })
  },

  goToFirst: () => set({ currentIndex: 0, direction: -1 }),
  goToLast: () => set({ currentIndex: get().slides.length - 1, direction: 1 }),

  togglePlay: () => set({ isPlaying: !get().isPlaying }),
  setPlaying: (playing) => set({ isPlaying: playing }),
}))
