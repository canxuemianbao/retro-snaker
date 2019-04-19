import React, { useReducer, useEffect } from 'react';
import Body from './body';
import Bonus from './bonus';
import { Engine, Position, Direction, simpleClone } from '../engine';
import './index.css';

const engine = Engine.getInstance({
  left:0,
  right:50,
  top:0,
  bottom:50,
});

type InitialState = {
  segments:Position[];
  bonus:Position;
  dir:Direction;
  failed:Boolean;
};

const initialState:InitialState = {
  dir:Direction.bottom,
  segments:[engine.generateBonus()],
  bonus:engine.generateBonus(),
  failed:false,
};

enum actionType {
  dir,
  segments,
  failed,
  bonus,
};

const createAction = <T extends {}>(type:actionType, value:T) => ({type, value});

const reducer = function(state:InitialState, action:{type:actionType, value:any}):InitialState {
  const newState = simpleClone(state);
  switch(action.type) {
    case actionType.dir:
      newState.dir = action.value;
      return newState;
    case actionType.segments:
      newState.segments = action.value;
      return newState;
    case actionType.failed:
      newState.failed = action.value;
      return newState;
    case actionType.bonus:
      newState.bonus = action.value;
      return newState;
  }
}

export default function Map() {
  const [state, dispatch] = useReducer(reducer, initialState);
  if (state.failed) {
    console.log('你输啦');
  }

  const moveOneShot = (dir:Direction) => {
    const newBody = engine.moveOneShot(state.segments, dir);
    if (engine.isFail(newBody)) {
      dispatch(createAction(actionType.failed, true));
      return;
    }
    if (engine.touchPosition(newBody, state.bonus)) {
      const tail = engine.generateTail(state.segments);
      const bonus = engine.generateBonus();
      dispatch(createAction(actionType.bonus, bonus));
      newBody.push(tail);
    }
    dispatch(createAction(actionType.segments, newBody));
    dispatch(createAction(actionType.dir, dir));
  }

  const tick = () => {
    moveOneShot(state.dir);
  };

  useEffect(() => {
    const animateId = setTimeout(tick, 500);
    return () => clearInterval(animateId);
  });

  // left = 37
  // up = 38
  // right = 39
  // down = 40
  const onKeydown = (e:KeyboardEvent) => {
    switch(e.keyCode) {
      case 37:
        if (Direction.right !== state.dir) {
          moveOneShot(Direction.left);
        }
        break;
      case 38:
        if (Direction.bottom !== state.dir) {
          moveOneShot(Direction.top);
        }
        break;
      case 39:
        if (Direction.left !== state.dir) {
          moveOneShot(Direction.right);
        }
        break;
      case 40:
        if (Direction.top !== state.dir) {
          moveOneShot(Direction.bottom);
        }
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, []);

  return (
    <div className="map">
      {state.failed ? '': (
        <>
          <Body engine={engine} segments={state.segments}/>
          <Bonus engine={engine} position={state.bonus}/>
        </>
      )}
    </div>
  );
}