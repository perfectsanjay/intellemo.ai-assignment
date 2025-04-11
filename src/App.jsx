import React, { useRef, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import ImageComponent from './components/ImageComponent';
import TextComponent from './components/TextComponent';
import VideoComponent from './components/VideoComponent';
import './App.css';

const App = () => {
  const stageRef = useRef();
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const pushToHistory = (current) => {
    setHistory([...history, current]);
    setRedoStack([]);
  };

  const addImage = () => {
    const imageUrl = prompt('Enter image URL:');
    if (!imageUrl) return;
    const newElement = {
      id: Date.now(),
      type: 'image',
      src: imageUrl,
      x: 50,
      y: 50,
    };
    pushToHistory(elements);
    setElements([...elements, newElement]);
  };

  const addText = () => {
    const text = prompt('Enter text:');
    if (!text) return;
    const newElement = {
      id: Date.now(),
      type: 'text',
      text,
      x: 100,
      y: 100,
    };
    pushToHistory(elements);
    setElements([...elements, newElement]);
  };

  const addVideo = () => {
    const videoUrl = prompt('Enter video URL:');
    if (!videoUrl) return;
    const newElement = {
      id: Date.now(),
      type: 'video',
      src: videoUrl,
      x: 150,
      y: 150,
    };
    pushToHistory(elements);
    setElements([...elements, newElement]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRedoStack([elements, ...redoStack]);
    setHistory(history.slice(0, history.length - 1));
    setElements(prev);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory([...history, elements]);
    setRedoStack(redoStack.slice(1));
    setElements(next);
  };

  const moveElement = (id, direction) => {
    const offset = 10;
    const updated = elements.map(el => {
      if (el.id !== id) return el;
      switch (direction) {
        case 'up': return { ...el, y: el.y - offset };
        case 'down': return { ...el, y: el.y + offset };
        case 'left': return { ...el, x: el.x - offset };
        case 'right': return { ...el, x: el.x + offset };
        default: return el;
      }
    });
    pushToHistory(elements);
    setElements(updated);
  };

  const bringForward = (id) => {
    const index = elements.findIndex(el => el.id === id);
    if (index < elements.length - 1) {
      const newElements = [...elements];
      [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
      pushToHistory(elements);
      setElements(newElements);
    }
  };

  const sendBackward = (id) => {
    const index = elements.findIndex(el => el.id === id);
    if (index > 0) {
      const newElements = [...elements];
      [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
      pushToHistory(elements);
      setElements(newElements);
    }
  };

  const saveCanvas = () => {
    localStorage.setItem('canvasState', JSON.stringify(elements));
    alert('Canvas state saved!');
  };

  const loadCanvas = () => {
    const saved = localStorage.getItem('canvasState');
    if (saved) {
      setElements(JSON.parse(saved));
    }
  };

  return (
    <div>
      <h2 style={{ margin: '10px 0' }}>Intellemo Assignment</h2>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={addImage}>Add Image</button>
        <button onClick={addText}>Add Text</button>
        <button onClick={addVideo}>Add Video</button>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={saveCanvas}>Save</button>
        <button onClick={loadCanvas}>Load</button>
      </div>

      {selectedId && (() => {
        const selected = elements.find(el => el.id === selectedId);
        if (!selected) return null;

        return (
          <div style={{ marginBottom: 10 }}>
            <h4>Selected {selected.type.charAt(0).toUpperCase() + selected.type.slice(1)} Controls</h4>
            <button onClick={() => moveElement(selectedId, 'up')}>Up</button>
            <button onClick={() => moveElement(selectedId, 'down')}>Down</button>
            <button onClick={() => moveElement(selectedId, 'left')}>Left</button>
            <button onClick={() => moveElement(selectedId, 'right')}>Right</button>
            <button onClick={() => bringForward(selectedId)}>Bring Forward</button>
            <button onClick={() => sendBackward(selectedId)}>Send Backward</button>
          </div>
        );
      })()}

      <Stage width={window.innerWidth} height={500} ref={stageRef} style={{ border: '1px solid black' }}>
        <Layer>
          {elements.map(el => {
            switch (el.type) {
              case 'image':
                return (
                  <ImageComponent
                    key={el.id}
                    element={el}
                    isSelected={selectedId === el.id}
                    onSelect={() => setSelectedId(el.id)}
                    onChange={(newAttrs) => {
                      const updated = elements.map(item =>
                        item.id === el.id ? { ...item, ...newAttrs } : item
                      );
                      setElements(updated);
                    }}
                  />
                );
              case 'text':
                return (
                  <TextComponent
                    key={el.id}
                    element={el}
                    isSelected={selectedId === el.id}
                    onSelect={() => setSelectedId(el.id)}
                    onChange={(newAttrs) => {
                      const updated = elements.map(item =>
                        item.id === el.id ? newAttrs : item
                      );
                      setElements(updated);
                    }}
                  />
                );
              case 'video':
                return (
                  <VideoComponent
                    key={el.id}
                    element={el}
                    isSelected={selectedId === el.id}
                    onSelect={() => setSelectedId(el.id)}
                  />
                );
              default:
                return null;
            }
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;
