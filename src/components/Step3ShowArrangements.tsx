import React from "react";
import PhotoGrid from "./PhotoGrid";

interface Step3ShowArrangementsProps {
  allCombos: { images: string[]; heroIds: number[] }[];
  selectedKey: string | null;
  onSelect: (heroIdsKey: string) => void;
  showOnlySelected: boolean;
  onShowOnlySelected: (show: boolean) => void;
  onBack: () => void;
  totalCount: number;
}

const Step3ShowArrangements: React.FC<Step3ShowArrangementsProps> = ({
  allCombos,
  selectedKey,
  showOnlySelected,
  onSelect,
  onShowOnlySelected,
  onBack,
  totalCount,
}) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <h2>3. All 5-Image Arrangements (Heroes First)</h2>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 12,
        color: "#1976d2",
        fontWeight: 500,
        gap: 24,
      }}
    >
      <span>{allCombos.length} arrangements</span>
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
    <div style={{ flex: 1, overflowY: "auto", minHeight: 0, marginBottom: 24 }}>
      {allCombos.length === 0 ? (
        <div
          style={{
            color: "#e53935",
            margin: "32px 0",
            fontSize: 18,
            textAlign: "center",
          }}
        >
          No arrangements available.
          <br />
          Please select hero combos in Step 2.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          {(showOnlySelected
            ? allCombos.filter((c) => selectedKey === JSON.stringify(c.heroIds))
            : allCombos
          ).map((combo) => {
            const key =
              JSON.stringify(combo.heroIds) + "|" + combo.images.join(",");
            const selectKey = JSON.stringify(combo.heroIds);
            const isSelected = selectedKey === selectKey;
            return (
              <div
                key={key}
                style={{
                  maxWidth: 400,
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  padding: 16,
                  position: "relative",
                  cursor: "pointer",
                  border: isSelected ? "3px solid #1976d2" : "2px solid #eee",
                  transition: "box-shadow 0.2s, border 0.2s",
                }}
                onClick={() => onSelect(selectKey)}
              >
                <PhotoGrid photos={combo.images} totalCount={totalCount} />
              </div>
            );
          })}
        </div>
      )}
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
    </div>
  </div>
);

export default Step3ShowArrangements;
