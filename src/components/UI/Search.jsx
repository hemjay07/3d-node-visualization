// components/UI/Search.jsx
import { useState, useEffect, useRef } from 'react'
import { useSearchStore } from '../../stores/searchStore'

export function Search({ nodeGroups }) {
  const [searchResults, setSearchResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef(null)
  
  const { 
    searchQuery, 
    setSearchQuery,
    setSelectedNodeGroup,
    isTransitioning 
  } = useSearchStore()

  // Handle search input
  const handleSearch = (value) => {
    setSearchQuery(value)
    
    if (!value.trim()) {
      setSearchResults([])
      return
    }

    const query = value.toLowerCase()
    const results = nodeGroups.filter(group => {
      // Search in group ID
      if (group.id.toLowerCase().includes(query)) return true;
      // Search in node IDs
      if (group.nodes.some(node => node.id.toLowerCase().includes(query))) return true;
      return false;
    }).slice(0, 5)

    setSearchResults(results)
    setIsOpen(true)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleSelect(searchResults[0])
    }
  }

  // Handle group selection
  const handleSelect = (group) => {
    setSearchQuery('') // Reset search query
    setSearchResults([])
    setIsOpen(false)
    setSelectedNodeGroup(group) // This will trigger even if it's the same group
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={searchRef} className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search node groups..."
        disabled={isTransitioning}
        className="w-64 px-4 py-2 text-sm text-white bg-black/20 border border-white/20 rounded-lg 
                 backdrop-blur-sm outline-none focus:border-white/40 transition-colors"
      />
      
      {isOpen && searchResults.length > 0 && (
        <div className="absolute w-full mt-2 bg-black/80 border border-white/20 rounded-lg overflow-hidden backdrop-blur-sm">
          {searchResults.map((group) => (
            <button
              key={group.id}
              onClick={() => handleSelect(group)}
              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors"
            >
              <span className="font-medium">{group.id}</span>
              {/* Show matching nodes if any */}
              {group.nodes.some(n => n.id.toLowerCase().includes(searchQuery.toLowerCase())) && (
                <div className="text-xs text-gray-400 mt-1">
                  Contains matching nodes
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}