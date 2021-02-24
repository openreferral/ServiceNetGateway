import React from 'react';
import { Textfit } from 'react-textfit';

export const fitText = (label, minLength, initialFontSize) =>
  label.length < minLength ? (
    <span style={{ fontSize: initialFontSize }}>{label}</span>
  ) : (
    <Textfit mode="single" forceSingleModeWidth={false}>
      {label}
    </Textfit>
  );
