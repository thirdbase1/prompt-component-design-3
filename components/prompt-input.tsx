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
      initial={false}
      animate={{
        maxWidth: expanded ? 480 : 320,
        height: expanded ? 113 : 48,
      }}
      transition={TRANSITION}
      onBlur={handleBlur}
      style={{ borderRadius: 24 }}
      className="relative w-full overflow-hidden bg-card"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {expanded ? (
          <motion.textarea
            key="textarea"
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
            className="absolute inset-x-0 top-0 w-full resize-none bg-transparent px-5 pt-4 pr-14 text-sm leading-[17px] text-foreground outline-none placeholder:font-medium placeholder:text-muted-foreground"
          />
        ) : (
          <motion.button
            key="placeholder"
            type="button"
            onClick={expand}
            className="absolute inset-x-0 top-0 cursor-text px-5 py-[15.5px] pr-14 text-left text-sm font-medium leading-[17px] text-muted-foreground"
            aria-label="Open prompt input"
          >
            Ask anything
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer is pinned at its final position from the top — it never moves
          as the surface grows; the container edge sweeps over and reveals it. */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{
              opacity: 1,
              filter: 'blur(0px)',
              transition: { duration: 0.25, delay: 0.1, ease: 'easeOut' },
            }}
            exit={{
              opacity: 0,
              filter: 'blur(6px)',
              transition: { duration: 0.22, ease: 'easeIn' },
            }}
            className="absolute inset-x-0 top-[67px] flex translate-y-px items-center gap-5 px-5 pt-2"
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

      {/* Single persistent send button — never unmounts, just glides */}
      <motion.button
        type="button"
        onClick={expanded ? handleSubmit : expand}
        aria-label="Send prompt"
        style={{ borderRadius: 9999 }}
        className="absolute right-2 bottom-2 flex size-8 items-center justify-center bg-accent text-accent-foreground transition-opacity hover:opacity-90"
      >
        <ArrowUpIcon />
      </motion.button>
    </motion.div>
  )
}
