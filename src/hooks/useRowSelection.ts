import { useState, useMemo, useCallback } from 'react';

type ItemWithId = { id: number };

interface SelectionEvent<T> {
  value: T[];
}

export const useRowSelection = <T extends ItemWithId>(
  data: T[],
  page: number,
  rows: number
) => {
  const [selectionCount, setSelectionCount] = useState(0);
  const [manualMap, setManualMap] = useState<Record<number, boolean>>({});

  const selectedItems = useMemo(() => {
    return data.filter((item, idx) => {
      const globalIdx = (page - 1) * rows + idx + 1;
      return manualMap[item.id] ?? globalIdx <= selectionCount;
    });
  }, [data, selectionCount, manualMap, page, rows]);

  const onSelectionChange = useCallback((e: SelectionEvent<T>) => {
    setManualMap((prev) => {
      const updated = { ...prev };
      
      data.forEach((item, idx) => {
        const globalIdx = (page - 1) * rows + idx + 1;
        const isSelected = e.value.some((s) => s.id === item.id);
        const isSelectedByRule = globalIdx <= selectionCount;
        
        if (isSelected !== isSelectedByRule) {
          updated[item.id] = isSelected;
        } else {
          delete updated[item.id];
        }
      });
      
      return updated;
    });
  }, [data, page, rows, selectionCount]);

  const applyCustomSelection = useCallback((count: number) => {
    setSelectionCount(count);
    setManualMap({});
  }, []);

  return {
    selectedItems,
    onSelectionChange,
    applyCustomSelection,
    selectionCount,
    manualMap,
  };
};
