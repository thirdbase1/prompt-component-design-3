'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const TRANSITION = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 34,
}

function ArrowUpIcon() {
  return (
    <svg
      width="16"
      height="16"
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
    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
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
      style={{ borderRadius: 28 }}
      className={
        'relative w-full bg-card ' + (expanded ? 'max-w-2xl' : 'max-w-xl')
      }
    >
      {/* Mask layer clips all inner content to the rounded container during the morph.
          The button is intentionally NOT in here so it never gets clipped. */}
      <motion.div
        layout
        transition={TRANSITION}
        style={{ borderRadius: 28 }}
        className="flex flex-col overflow-hidden"
      >
        {expanded ? (
          <motion.textarea
            layout="position"
            transition={TRANSITION}
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
            className="w-full resize-none bg-transparent px-7 pt-[26px] pr-20 text-lg leading-normal text-foreground outline-none placeholder:text-muted-foreground"
          />
        ) : (
          <motion.button
            layout="position"
            transition={TRANSITION}
            type="button"
            onClick={expand}
            className="cursor-text px-7 py-[26px] pr-20 text-left text-lg leading-normal text-muted-foreground"
            aria-label="Open prompt input"
          >
            Type something
          </motion.button>
        )}

        {/* Footer reserves space for the button row when expanded */}
        <AnimatePresence mode="popLayout">
          {expanded && (
            <motion.div
              layout="position"
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.25, delay: 0.1, ease: 'easeOut' },
              }}
              exit={{
                opacity: 0,
                y: 8,
                transition: { duration: 0.15, ease: 'easeIn' },
              }}
              className="flex items-center px-7 pb-6 pt-3"
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Single persistent send button — never unmounts, just morphs */}
      <motion.button
        layout
        transition={TRANSITION}
        type="button"
        onClick={expanded ? handleSubmit : expand}
        aria-label="Send prompt"
        style={{ borderRadius: 9999 }}
        className={
          'absolute flex size-12 items-center justify-center bg-accent text-accent-foreground transition-opacity hover:opacity-90 ' +
          (expanded ? 'right-5 bottom-5' : 'right-4 bottom-4')
        }
      >
        <ArrowUpIcon />
      </motion.button>
    </motion.div>
  )
}
