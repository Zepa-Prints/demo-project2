import { useEffect } from 'react'

export function useDocTitle(title) {
  useEffect(() => {
    document.title = title
  }, [title])
}
