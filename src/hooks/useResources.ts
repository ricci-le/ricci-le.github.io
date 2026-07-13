import { useEffect, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { Resource } from '../types'
import resourcesData from '../../data/resources.json'

export function useResources() {
  const { resources, setResources } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    const fetchResources = async () => {
      if (import.meta.env.DEV) {
        try {
          const response = await fetch('/api/admin/resources')
          const data = await response.json()
          if (data.success && data.data.length > 0) {
            setResources(data.data as Resource[])
            return
          }
        } catch {
        }
      }
      
      setResources(resourcesData as Resource[])
    }
    
    fetchResources()
  }, [setResources])

  const refreshResources = async () => {
    if (!import.meta.env.DEV) return
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/resources')
      const data = await response.json()
      if (data.success) {
        setResources(data.data as Resource[])
      }
    } catch {
    } finally {
      setIsLoading(false)
    }
  }
  
  return { resources, refreshResources, isLoading }
}
