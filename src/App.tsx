import React, { useState } from "react";
import PhotoGrid from "./components/PhotoGrid";
import { getAllCombinations } from "./utils/combinations";

export default function App() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const urls = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );
    setPhotos(urls);
  };

  // Generate all combinations (as arrays of image URLs)
  const combinations = getAllCombinations(photos);

  // Helper to create a unique key for each combination
  const comboKey = (combo: string[]) => combo.join("|");

  // Filtered combinations
  const displayedCombinations = showOnlyFavorites
    ? combinations.filter((combo) => favorites.has(comboKey(combo)))
    : combinations;

  const toggleFavorite = (combo: string[]) => {
    const key = comboKey(combo);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div
      className="app-container"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="menu-bar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          padding: "1em 0 0.5em 0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <h1 style={{ margin: "0 0 0.5em 0", color: "#FFF" }}>
          FB Album Preview
        </h1>
        {photos.length === 0 && (
          <input type="file" accept="image/*" multiple onChange={handleFiles} />
        )}
        {combinations.length > 0 && (
          <button
            onClick={() => setShowOnlyFavorites((v) => !v)}
            style={{ margin: "1em 0" }}
          >
            {showOnlyFavorites
              ? `Show All (${favorites.size}/${combinations.length})`
              : `Show Only Favorites (${favorites.size}/${combinations.length})`}
          </button>
        )}
        {/* Floating Add Images Button */}
        {photos.length > 0 && (
          <>
            <input
              id="fab-file-input"
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFiles}
            />
            <button
              onClick={() => document.getElementById("fab-file-input")?.click()}
              style={{
                position: "fixed",
                bottom: 32,
                right: 32,
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#1976d2",
                color: "#fff",
                fontSize: 32,
                border: "none",
                boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                zIndex: 100,
                cursor: "pointer",
              }}
              title="Add or Replace Images"
            >
              +
            </button>
          </>
        )}
      </div>
      {combinations.length > 0 && (
        <div
          className="combos-grid"
          style={{
            flex: 1,
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            padding: "16px",
          }}
        >
          {displayedCombinations.map((combo, idx) => {
            const isFav = favorites.has(comboKey(combo));
            return (
              <div
                key={comboKey(combo)}
                className={`combo-card${isFav ? " favorited" : ""}`}
                onClick={() => toggleFavorite(combo)}
                style={{
                  cursor: "pointer",
                  position: "relative",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                  userSelect: "none",
                }}
                title={isFav ? "Unheart" : "Heart"}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 12,
                    fontSize: 24,
                    color: isFav ? "red" : "#bbb",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  ♥
                </span>
                <PhotoGrid photos={combo} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
