import ReactDOM from 'react-dom';

export const containerStyle = {
  display: 'inline-block',
  // explicitly cast as literals to avoid 'not assignable to type CSSProperties' error
  position: 'absolute' as 'absolute',
  visibility: 'hidden' as 'hidden',
  zIndex: -1
};

const idsBeingMeasured = [];

// measures and returns a list of widths of given elements
export const measureWidths = (elements, parentId = 'measure-layer') =>
  new Promise((resolve, reject) => {
    const measureLayer = document.getElementById(parentId);
    if (measureLayer && idsBeingMeasured.indexOf(parentId) === -1) {
      // prevent measuring the same elements multiple times
      idsBeingMeasured.push(parentId);
      try {
        ReactDOM.render(elements, measureLayer, () => {
          const rendered = document.getElementById(measureLayer.id);
          const widths = [].slice.call(rendered.children).map(child => child.clientWidth);
          ReactDOM.unmountComponentAtNode(rendered);
          idsBeingMeasured.splice(idsBeingMeasured.indexOf(parentId), 1);
          resolve(widths);
        });
      } catch {
        idsBeingMeasured.splice(idsBeingMeasured.indexOf(parentId), 1);
        reject();
      }
    }
  });

// find out how many items fit in a row with given width
export const getColumnCount = (itemWidths, width, remainderWidth = 0) => {
  let idx = 0;
  while (width > 0) {
    if (idx >= itemWidths.length) {
      // show full list
      return itemWidths.length;
    }
    width -= itemWidths[idx++];
  }
  // show only a part of the list
  if (width + itemWidths[idx - 1] - remainderWidth < 0) {
    // the remainder count wouldn't fit in the same row
    return idx - 2;
  } else {
    return idx - 1;
  }
};

export default measureWidths;
