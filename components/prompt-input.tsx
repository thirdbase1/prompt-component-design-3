'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FableIcon } from '@/components/fable-icon'

const TRANSITION = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 34,
}

function ArrowUpIcon() {
  return (
    <svg
      width="12"
      height="12"
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

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 2.5V11.5M2.5 7H11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BarsIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <rect x="1.5" y="8" width="2.5" height="4.5" rx="1" fill="currentColor" />
      <rect
        x="5.75"
        y="5"
        width="2.5"
        height="7.5"
        rx="1"
        fill="currentColor"
        opacity="0.7"
      />
      <rect
        x="10"
        y="2"
        width="2.5"
        height="10.5"
        rx="1"
        fill="currentColor"
        opacity="0.4"
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
      style={{ borderRadius: 24 }}
      className={
        'relative w-full bg-card ' +
        (expanded ? 'max-w-[480px]' : 'max-w-[320px]')
      }
    >
      {/* Mask layer clips all inner content to the rounded container during the morph.
          The button is intentionally NOT in here so it never gets clipped. */}
      <motion.div
        layout
        transition={TRANSITION}
        style={{ borderRadius: 24 }}
        className="flex flex-col overflow-hidden"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {expanded ? (
            <motion.textarea
              key="textarea"
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
              placeholder="Ask anything"
              rows={3}
              aria-label="Prompt"
              className="w-full resize-none bg-transparent px-5 pt-4 pr-14 text-sm leading-[17px] text-foreground outline-none placeholder:text-muted-foreground"
            />
          ) : (
            <motion.button
              key="placeholder"
              layout="position"
              transition={TRANSITION}
              type="button"
              onClick={expand}
              className="cursor-text px-5 py-[15.5px] pr-14 text-left text-sm leading-[17px] text-muted-foreground"
              aria-label="Open prompt input"
            >
              Ask anything
            </motion.button>
          )}
        </AnimatePresence>

        {/* Footer reserves space for the button row when expanded */}
        <AnimatePresence mode="popLayout">
          {expanded && (
            <motion.div
              layout="position"
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.25, delay: 0.1, ease: 'easeOut' },
              }}
              exit={{
                opacity: 0,
                y: 8,
                filter: 'blur(4px)',
                transition: { duration: 0.15, ease: 'easeIn' },
              }}
              className="flex translate-y-[3px] items-center gap-5 px-5 pb-4 pt-2"
            >
              <button
                type="button"
                className="flex items-center gap-2 rounded-full py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Select model: Fable 5"
              >
                <FableIcon />
                <span className="text-sm font-medium text-foreground/50">
                  Fable 5
                </span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full py-1 text-foreground/50 transition-colors hover:text-foreground"
                aria-label="Select effort level: Medium"
              >
                <BarsIcon />
                <span className="text-sm font-medium">Medium</span>
              </button>
              <button
                type="button"
                className="ml-auto mr-9 flex items-center justify-center rounded-full py-1 text-foreground/50 transition-colors hover:text-foreground"
                aria-label="Add attachment"
              >
                <PlusIcon />
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
          'absolute flex size-8 items-center justify-center bg-accent text-accent-foreground transition-opacity hover:opacity-90 ' +
          (expanded ? 'right-3 bottom-3' : 'right-2 bottom-2')
        }
      >
        <ArrowUpIcon />
      </motion.button>
    </motion.div>
  )
}
