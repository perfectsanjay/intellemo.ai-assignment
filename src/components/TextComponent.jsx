import React, { useEffect, useRef } from 'react';
import { Text, Transformer } from 'react-konva';

const TextComponent = ({ element, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        ref={shapeRef}
        text={element.text}
        x={element.x}
        y={element.y}
        fontSize={24}
        fill="black"
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            ...element,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

export default TextComponent;
