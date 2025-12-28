import React, { useState, useEffect } from "react";
import { saveImages, getAllImages, clearImages } from "./utils/imageDB";
import PhotoGrid from "./components/PhotoGrid";
import Step1SelectPhotos from "./components/Step1SelectPhotos";
import Step2PickHeroCombos from "./components/Step2PickHeroCombos";
import Step3ShowArrangements from "./components/Step3ShowArrangements";
import { getAllCombinations } from "./utils/combinations";
import { kPermutations } from "./utils/permutations";
import { heroPermutations } from "./utils/heroPermutations";

// Helper: get all k-permutations for step 2 (alias for clarity)
const kPermutationsStep2 = kPermutations;

export default function App() {
  // Show only selected toggles for each step
  const [showOnlySelectedStep1, setShowOnlySelectedStep1] = useState(false);
  const [showOnlySelectedStep2, setShowOnlySelectedStep2] = useState(false);
  // Determine initial step based on persisted data
  function getInitialStep() {
    const savedSelected = localStorage.getItem("fab_selected");
    const savedHeroCombos = localStorage.getItem("fab_heroCombosSelected");
    if (savedHeroCombos && JSON.parse(savedHeroCombos).length > 0) return 3;
    if (savedSelected && JSON.parse(savedSelected).length > 0) return 2;
    return 1;
  }
  const [step, setStep] = useState(getInitialStep);
  // photos: { id, url }
  const [photos, setPhotos] = useState<{ id: number; url: string }[]>([]);
  const [selected, setSelected] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("fab_selected");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [heroCombosSelected, setHeroCombosSelected] = useState<string[]>(() => {
    const saved = localStorage.getItem("fab_heroCombosSelected");
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("fab_favorites");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Step 1: handle file input
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    await clearImages();
    const ids = await saveImages(files);
    const blobs = files;
    const urls = blobs.map((blob, i) => ({
      id: ids[i],
      url: URL.createObjectURL(blob),
    }));
    setPhotos(urls);
    setSelected(new Set());
    setHeroCombosSelected([]);
    setFavorites(new Set());
    setStep(1);
    localStorage.removeItem("fab_selected");
    localStorage.removeItem("fab_heroCombosSelected");
    localStorage.removeItem("fab_favorites");
  };
  // On mount, load images from IndexedDB
  useEffect(() => {
    getAllImages().then((items) => {
      setPhotos(
        items.map((item) => ({
          id: item.id,
          url: URL.createObjectURL(item.blob),
        }))
      );
    });
  }, []);

  // Step 1: Toggle select on image (no hard limit)
  const toggleSelectPhoto = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      // Reset next steps' data
      setHeroCombosSelected([]);
      setFavorites(new Set());
      localStorage.setItem("fab_selected", JSON.stringify(Array.from(next)));
      localStorage.removeItem("fab_heroCombosSelected");
      localStorage.removeItem("fab_favorites");
      return next;
    });
  };
  // Persist heroCombosSelected and favorites to localStorage
  useEffect(() => {
    localStorage.setItem(
      "fab_heroCombosSelected",
      JSON.stringify(heroCombosSelected)
    );
  }, [heroCombosSelected]);

  useEffect(() => {
    localStorage.setItem(
      "fab_favorites",
      JSON.stringify(Array.from(favorites))
    );
  }, [favorites]);

  // Step 2: Generate all hero (2-image) permutations from selectedPhotos only
  // Use selectedPhotoObjs only once
  const heroCombos: number[][] = kPermutationsStep2(
    photos.filter((p) => selected.has(p.id)).map((p) => p.id),
    2
  );

  // Always compute selectedPhotos from current selection (as objects)
  const selectedPhotos = photos.filter((p) => selected.has(p.id));

  // For Step 1: filter photos if showOnlySelectedStep1
  const step1Photos = showOnlySelectedStep1
    ? photos.filter((p) => selected.has(p.id)).map((p) => p.url)
    : photos.map((p) => p.url);

  // For Step 2: filter heroCombos if showOnlySelectedStep2
  const step2HeroCombos = showOnlySelectedStep2
    ? heroCombos
        .filter((ids) => heroCombosSelected.includes(JSON.stringify(ids)))
        .map((ids) =>
          ids.map((id) => photos.find((p) => p.id === id)?.url || "")
        )
    : heroCombos.map((ids) =>
        ids.map((id) => photos.find((p) => p.id === id)?.url || "")
      );

  // On mount or when photos change, restore selected from localStorage if possible
  useEffect(() => {
    const saved = localStorage.getItem("fab_selected");
    if (saved && photos.length > 0) {
      const arr = JSON.parse(saved);
      // Only keep selections that exist in current photos
      setSelected(
        new Set(arr.filter((id: number) => photos.some((p) => p.id === id)))
      );
    }
  }, [photos]);

  // Step 2: Generate all hero (2-image) permutations from selectedPhotos only
  const selectedPhotoObjs = photos.filter((p) => selected.has(p.id));
  // const heroCombos: number[][] = kPermutationsStep2(
  //   selectedPhotoObjs.map((p) => p.id),
  //   2
  // );
  // Step 3: single selection state and show only selected
  const [step3SelectedKey, setStep3SelectedKey] = useState<string | null>(null);
  const [showOnlySelectedStep3, setShowOnlySelectedStep3] = useState(false);

  // Step 3: For each selected hero combo, generate all 5-image permutations with those heroes in first two spots (both orders), using only selectedPhotos
  // But the '+X' overlay in PhotoGrid should be based on all uploaded images
  // Also return heroIds for stable favorite keys
  const allCombos: { images: string[]; heroIds: number[] }[] =
    step === 3
      ? heroPermutations(selectedPhotos, heroCombosSelected).map(
          ({ images, heroIds }) => ({ images, heroIds })
        )
      : [];
  const totalUploadedCount = photos.length;

  return (
    <div
      className="app-container"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
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
      {photos.length > 0 && (
        <div style={{ padding: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <b>Step {step} of 3</b>
          </div>
          {step === 1 && (
            <Step1SelectPhotos
              photos={step1Photos}
              selected={
                new Set(
                  photos.filter((p) => selected.has(p.id)).map((p) => p.url)
                )
              }
              onToggle={(url) => {
                const photo = photos.find((p) => p.url === url);
                if (photo) toggleSelectPhoto(photo.id);
              }}
              onNext={() => setStep(2)}
              showOnlySelected={showOnlySelectedStep1}
              onShowOnlySelected={setShowOnlySelectedStep1}
              selectedCount={selected.size}
              maxCount={6}
            />
          )}
          {step === 2 && (
            <Step2PickHeroCombos
              heroCombos={step2HeroCombos}
              heroCombosSelected={heroCombosSelected.map((key) => {
                try {
                  const ids = JSON.parse(key);
                  return ids.map(
                    (id: number) => photos.find((p) => p.id === id)?.url || ""
                  );
                } catch {
                  return [];
                }
              })}
              onSelect={(urls) => {
                // Convert urls to ids
                const ids = urls
                  .map((url: string) => photos.find((p) => p.url === url)?.id)
                  .filter((id) => id !== undefined);
                const key = JSON.stringify(ids);
                setHeroCombosSelected((prev) => {
                  let next;
                  if (prev.includes(key)) next = prev.filter((k) => k !== key);
                  else next = [...prev, key];
                  // Reset favorites if hero combos change
                  setFavorites(new Set());
                  localStorage.removeItem("fab_favorites");
                  return next;
                });
              }}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
              showOnlySelected={showOnlySelectedStep2}
              onShowOnlySelected={setShowOnlySelectedStep2}
              selectedCount={heroCombosSelected.length}
              maxCount={2}
              totalCount={heroCombos.length}
            />
          )}
          {step === 3 && (
            <Step3ShowArrangements
              allCombos={allCombos}
              selectedKey={step3SelectedKey}
              onSelect={setStep3SelectedKey}
              showOnlySelected={showOnlySelectedStep3}
              onShowOnlySelected={setShowOnlySelectedStep3}
              onBack={() => setStep(2)}
              totalCount={totalUploadedCount}
            />
          )}
        </div>
      )}
    </div>
  );
}
