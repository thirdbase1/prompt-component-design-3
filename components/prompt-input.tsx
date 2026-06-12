'use client'

import { useRef, useState } from 'react'
import { motion } from 'motion/react'

const TRANSITION = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 34,
}

function ArrowUpIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 12V2M7 2L2.5 6.5M7 2L11.5 6.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StarburstIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="text-accent"
    >
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180
          const x1 = 9 + Math.cos(angle) * 3
          const y1 = 9 + Math.sin(angle) * 3
          const x2 = 9 + Math.cos(angle) * 7.5
          const y2 = 9 + Math.sin(angle) * 7.5
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
      </g>
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 4.5L6 8L9.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PromptInput({
  onSubmit,
}: {
  onSubmit?: (value: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const expand = () => {
    setExpanded(true)
    // focus after layout animation kicks in
    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // collapse only when focus leaves the whole component and it's empty
    if (
      !containerRef.current?.contains(e.relatedTarget as Node) &&
      value.trim() === ''
    ) {
      setExpanded(false)
    }
  }

  const handleSubmit = () => {
    if (value.trim() === '') return
    onSubmit?.(value)
    setValue('')
    setExpanded(false)
  }

  return (
    <motion.div
      ref={containerRef}
      layout
      transition={TRANSITION}
      onBlur={handleBlur}
      style={{ borderRadius: expanded ? 32 : 28 }}
      className={
        'relative w-full overflow-hidden bg-card ' +
        (expanded ? 'max-w-2xl' : 'max-w-xl')
      }
    >
      {expanded ? (
        <motion.div layout className="flex flex-col">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
              if (e.key === 'Escape' && value.trim() === '') {
                setExpanded(false)
              }
            }}
            placeholder="Type something"
            rows={4}
            aria-label="Prompt"
            className="w-full resize-none bg-transparent px-7 pt-6 text-lg leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
          />
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="flex items-center justify-between px-7 pb-5 pt-2"
          >
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-full py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Select model: Fable 5"
            >
              <StarburstIcon />
              <span className="text-base font-medium text-foreground/80">
                Fable 5
              </span>
              <ChevronDownIcon />
            </button>
            <motion.button
              layoutId="send-button"
              transition={TRANSITION}
              type="button"
              onClick={handleSubmit}
              aria-label="Send prompt"
              className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground transition-opacity hover:opacity-90"
            >
              <ArrowUpIcon />
            </motion.button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div layout className="flex items-center justify-between p-2">
          <button
            type="button"
            onClick={expand}
            className="flex-1 cursor-text px-4 py-2 text-left text-base text-muted-foreground"
            aria-label="Open prompt input"
          >
            Type something
          </button>
          <motion.button
            layoutId="send-button"
            transition={TRANSITION}
            type="button"
            onClick={expand}
            aria-label="Send prompt"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-opacity hover:opacity-90"
          >
            <ArrowUpIcon />
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}
