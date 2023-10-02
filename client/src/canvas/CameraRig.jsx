import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import state from '../store';

const CameraRig = ({ children }) => {
  // Create a reference to a group object in the 3D scene
  const group = useRef();
  
  // Access the current state using useSnapshot from the 'valtio' library
  const snap = useSnapshot(state);

  // Use the useFrame hook to update the camera and group's rotation
  useFrame((state, delta) => {
    // Determine if the screen width is less than or equal to 1260 pixels
    const isBreakpoint = window.innerWidth <= 1260;
    
    // Determine if the screen width is less than or equal to 600 pixels
    const isMobile = window.innerWidth <= 600;

    // Define a target camera position based on the 'snap.intro' value and screen width
    let targetPosition = [-0.4, 0, 2];
    
    if (snap.intro) {
      if (isBreakpoint) targetPosition = [0, 0, 2];
      if (isMobile) targetPosition = [0, 0.2, 2.5];
    } else {
      if (isMobile) targetPosition = [0, 0.2, 2.5];
      else targetPosition = [0, 0, 2];
    }

    // Use easing.damp3 to smoothly interpolate the camera's position
    easing.damp3(state.camera.position, targetPosition, 0.25, delta);

    // Use easing.dampE to smoothly interpolate the rotation of the 'group'
    easing.dampE(
      group.current.rotation,
      [state.pointer.y / 10, -state.pointer.x / 5, 0],
      0.25,
      delta
    );
  });

  // Render the 'children' components inside a group, allowing nesting of 3D elements
  return <group ref={group}>{children}</group>;
};

export default CameraRig;
