import React, { useState } from 'react';
import { Engine, Position } from '../engine';
import Segment from './segment';
import './index.css';

export default function Body(props:{engine:Engine, segments:Position[]}) {
  return (
    <>
      {props.segments.map((position, index) => <Segment key={index} engine={props.engine} position={position}/>)}
    </>
  );
}