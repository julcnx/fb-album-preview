import "./PhotoGrid.css";

type Props = {
  photos: string[];
};

export default function PhotoGrid({ photos }: Props) {
  const visible = photos.slice(0, 5);
  const remaining = photos.length - 5;

  return (
    <div className="fb-grid">
      <div className="row row-2">
        {visible.slice(0, 2).map((url, i) => (
          <div className="cell hero" key={i}>
            <img src={url} />
          </div>
        ))}
      </div>

      <div className="row row-3">
        {visible.slice(2, 5).map((url, i) => (
          <div className="cell" key={i}>
            <img src={url} />
            {i === 2 && remaining > 0 && (
              <div className="overlay">+{remaining}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
