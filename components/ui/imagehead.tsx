type ImageHeadProps = {
   icon?: React.ReactNode;
  title: string;
  count: number;
  image: string;
  color?: 'blue' | 'green'|'red';
};

const ImageHead: React.FC<ImageHeadProps> = ({
  icon,
  title,
  count,
  image,
  color = 'blue',
}) => {
  return (
    <div className={`stake-card ${color}`}>
      <img src={image} alt={title} />

      <div className="stake-card-footer">
        <div className="stake-card-title">
          <div className="absolute bottom-0 left-0 p-4 bg-black/50 w-full flex items-center">
            {icon}
            
          </div>
        </div>
        <span className="text-white font-semibold ml-1">{title}</span>
        <div className="stake-card-count">
          <span className="stake-dot" />
          {count.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ImageHead;
