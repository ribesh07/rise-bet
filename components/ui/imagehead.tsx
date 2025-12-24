type ImageHeadProps = {
  icon?: React.ReactNode;
  title: string;
  count: number;
  image: string;
  color?: "blue" | "green" | "red";
};

const ImageHead: React.FC<ImageHeadProps> = ({
  icon,
  title,
  count,
  image,
  color = "blue",
}) => {
  return (
    <div className={`Rise-card ${color}`}>
      {/* IMAGE */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* FOOTER (UNDER IMAGE – Rise style) */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#102531]">
        {/* LEFT: ICON + TITLE */}
        <div className="flex items-center gap-2 min-w-0">
          {icon && (
            <span className="flex items-center justify-center w-5 h-5 text-white/90">
              {icon}
            </span>
          )}

          <span className="text-white font-semibold text-base leading-tight truncate">
            {title}
          </span>
        </div>

        {/* RIGHT: COUNT */}
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <span className="Rise-dot" />
          {count.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ImageHead;
