import { useCompareStore } from '../store/compareStore'

export const useCompare = () => {
  const {
    items,
    addItem,
    removeItem,
    clearAll,
    isInCompare,
    getCount,
    canAddMore,
    getComparisonData
  } = useCompareStore()

  return {
    compareItems: items,
    addToCompare: addItem,
    removeFromCompare: removeItem,
    clearCompare: clearAll,
    isInCompare,
    compareCount: getCount(),
    canAddMore: canAddMore(),
    comparisonData: getComparisonData()
  }}