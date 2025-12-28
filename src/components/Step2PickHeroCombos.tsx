import React from "react";
import PhotoGrid from "./PhotoGrid";

interface Step2PickHeroCombosProps {
  heroCombos: string[][];
  heroCombosSelected: string[][];
  onSelect: (urls: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  showOnlySelected: boolean;
  onShowOnlySelected: (show: boolean) => void;
  selectedCount: number;
  maxCount: number;
  totalCount: number;
}

const Step2PickHeroCombos: React.FC<Step2PickHeroCombosProps> = ({
  heroCombos,
  heroCombosSelected,
  onSelect,
  onNext,
  onBack,
  showOnlySelected,
  onShowOnlySelected,
  selectedCount,
  maxCount,
  totalCount,
}) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <h2>2. Pick Hero Combos (top 2 images)</h2>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 8,
        color: "#1976d2",
        fontWeight: 500,
        gap: 24,
      }}
    >
      <span>
        {selectedCount} selected / {maxCount} max
      </span>
      <span>{totalCount} total</span>
      <label style={{ fontWeight: 400, fontSize: 15 }}>
        <input
          type="checkbox"
          checked={showOnlySelected}
          onChange={(e) => onShowOnlySelected(e.target.checked)}
          style={{ marginRight: 6 }}
        />
        Show only selected
      </label>
    </div>
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        overflowY: "auto",
        marginBottom: 24,
        minHeight: 0,
      }}
    >
      {heroCombos.map((combo) => {
        const isSelected = heroCombosSelected.some(
          (sel) =>
            sel.length === combo.length &&
            sel.every((url, i) => url === combo[i])
        );
        const key = JSON.stringify(combo);
        return (
          <div
            key={key}
            style={{
              border: isSelected ? "2px solid #1976d2" : "2px solid #eee",
              borderRadius: 8,
              padding: 16,
              cursor: "pointer",
              background: isSelected ? "#e3f2fd" : "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              boxSizing: "border-box",
            }}
            onClick={() => onSelect(combo)}
          >
            <PhotoGrid photos={combo} totalCount={combo.length} />
          </div>
        );
      })}
    </div>
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        background: "#fff",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
        padding: "16px 0 12px 0",
        display: "flex",
        justifyContent: "center",
        zIndex: 100,
        gap: 16,
      }}
    >
      <button onClick={onBack} style={{ minWidth: 120 }}>
        Back
      </button>
      <button
        disabled={
          heroCombosSelected.length < 1 || heroCombosSelected.length > 2
        }
        onClick={onNext}
        style={{ minWidth: 180 }}
      >
        Next: Show All Arrangements
      </button>
    </div>
  </div>
);

export default Step2PickHeroCombos;
