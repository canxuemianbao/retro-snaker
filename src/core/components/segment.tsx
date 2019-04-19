import React, { useState } from 'react';
import { Engine, Position } from '../engine';
import './index.css';

export default function Segment(props:{engine:Engine, position:Position}) {
  const realPosition = props.engine.getPixel(props.position);
  const style = {
    left: `${realPosition.x}px`,
    top: `${realPosition.y}px`,
    width: `${props.engine.getPositionRate()}px`,
    height: `${props.engine.getPositionRate()}px`,
  };
  return <div className='segment' style={style}/>;
}