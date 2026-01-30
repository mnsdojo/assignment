import "./App.css";
import { useArtWork } from "./hooks/useArtwork";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useMemo, useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox, type CheckboxChangeEvent } from "primereact/checkbox";
import { useRowSelection } from "./hooks/useRowSelection";

function App() {
  const tableStyle = useMemo(() => ({ minWidth: "50rem" }), []);

  const [page, setPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);

  const { pagination, artWorks, loading, error } = useArtWork(page);

  const {
    selectedItems,
    onSelectionChange,
    applyCustomSelection,
  
  } = useRowSelection(artWorks, page, rows);

  const [customSelectCount, setCustomSelectCount] = useState<number | null>(
    null,
  );
  const overlayRef = useRef<OverlayPanel>(null);

  const handleCustomSelect = () => {
    if (customSelectCount && customSelectCount > 0) {
      applyCustomSelection(customSelectCount);
      overlayRef.current?.hide();
    }
  };

  const areAllOnPageSelected = useMemo(() => {
    if (artWorks.length === 0) return false;
    return artWorks.every((item) =>
      selectedItems.some((sel) => sel.id === item.id),
    );
  }, [artWorks, selectedItems]);

  const onSelectAllChange = (e: CheckboxChangeEvent) => {
    if (e.checked) {
      const newItems = artWorks.filter((a) => !selectedItems.some((s) => s.id === a.id));
      onSelectionChange({ value: [...selectedItems, ...newItems] });
    } else {
      const remaining = selectedItems.filter((s) => !artWorks.some((a) => a.id === s.id));
      onSelectionChange({ value: remaining });
    }
  };

  const selectionHeaderTemplate = () => {
    return (
      <div className="selection-header">
        <Checkbox
          onChange={onSelectAllChange}
          checked={areAllOnPageSelected}
          aria-label="Select All"
        />
        <i
          className="pi pi-chevron-down overlay-trigger"
          onClick={(e) => overlayRef.current?.toggle(e)}
        />
      </div>
    );
  };

  if (error) return <span>{error.message}</span>;

  return (
    <div className="card app-container">
      <div className="gallery-header">
        <h3>Art Institute of Chicago Gallery</h3>
        <p>Currently on page: {page}</p>
      </div>

      <OverlayPanel ref={overlayRef} style={{ width: "300px" }}>
        <div className="overlay-container">
          <label htmlFor="rowcount" className="row-count-label">
            Select Rows
          </label>
          <InputNumber
            id="rowcount"
            placeholder="Enter number..."
            value={customSelectCount}
            onValueChange={(e) => setCustomSelectCount(e.value ?? null)}
            min={1}
            max={pagination?.total || 1000}
          />
          <Button
            label="Submit"
            onClick={handleCustomSelect}
          />
        </div>
      </OverlayPanel>

      <DataTable
        value={artWorks}
        loading={loading}
        selection={selectedItems}
        onSelectionChange={onSelectionChange}
        dataKey="id"
        tableStyle={tableStyle}
        paginator
        lazy
        rows={rows}
        first={first}
        totalRecords={pagination?.total || 0}
        onPage={(e) => {
          setFirst(e.first ?? 0);
          setRows(e.rows ?? 12);
          setPage((e.page ?? 0) + 1);
        }}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        selectionMode="multiple"
      >
        <Column
          header={selectionHeaderTemplate}
          selectionMode="multiple"
          style={{ width: "3rem" }}
        />
        <Column field="title" header="Title" />
        <Column field="origin" header="Place of Origin" />
        <Column field="artist" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="startDate" header="Start Date" />
        <Column field="endDate" header="End Date" />
      </DataTable>
    </div>
  );
}

export default App;
