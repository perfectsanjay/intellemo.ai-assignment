import React, { useEffect, useRef, useState } from 'react';
import { Image, Transformer } from 'react-konva';

const ImageComponent = ({ element, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [img, setImg] = useState(null);

  useEffect(() => {
    const image = new window.Image();
    image.src = element.src;
    image.crossOrigin = 'Anonymous';
    image.onload = () => setImg(image);
  }, [element.src]);

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    onChange({
      ...element,
      x: node.x(),
      y: node.y(),
      width: node.width() * scaleX,
      height: node.height() * scaleY,
      rotation: node.rotation(),
    });
  };

  if (!img) return null;

  return (
    <>
      <Image
        image={img}
        x={element.x}
        y={element.y}
        width={element.width || img.width}
        height={element.height || img.height}
        rotation={element.rotation || 0}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        onTransformEnd={handleTransformEnd}
        onDragEnd={(e) => {
          onChange({
            ...element,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default ImageComponent;
