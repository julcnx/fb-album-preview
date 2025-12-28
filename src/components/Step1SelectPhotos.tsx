import React from "react";

interface Step1SelectPhotosProps {
  photos: string[];
  selected: Set<string>;
  onToggle: (url: string) => void;
  onNext: () => void;
  showOnlySelected: boolean;
  onShowOnlySelected: (show: boolean) => void;
  selectedCount: number;
  maxCount: number;
}

const Step1SelectPhotos: React.FC<Step1SelectPhotosProps> = ({
  photos,
  selected,
  onToggle,
  onNext,
  showOnlySelected,
  onShowOnlySelected,
  selectedCount,
  maxCount,
}) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <h2>1. Select up to 6 Images</h2>
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
        flexWrap: "wrap",
        gap: 12,
        overflowY: "auto",
        minHeight: 0,
        marginBottom: 24,
      }}
    >
      {photos.map((url) => (
        <div key={url} style={{ position: "relative" }}>
          <img
            src={url}
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              borderRadius: 8,
              transition: "outline 0.3s",
              cursor: "pointer",
              outline: selected.has(url)
                ? "3px solid #1976d2"
                : "2px solid #bbb",
            }}
            title={selected.has(url) ? "Click to unselect" : "Click to select"}
            onClick={() => onToggle(url)}
          />
        </div>
      ))}
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
      <button
        disabled
        style={{ minWidth: 120, opacity: 0.5, cursor: "default" }}
      >
        Back
      </button>
      <button
        disabled={selected.size < 5 || selected.size > 6}
        onClick={onNext}
        style={{ minWidth: 180 }}
      >
        Next: Pick Hero Combos
      </button>
    </div>
  </div>
);

export default Step1SelectPhotos;
