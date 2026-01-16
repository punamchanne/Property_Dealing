'use client';

import { Canvas } from '@react-three/fiber';
import { Image, OrbitControls, Environment } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

interface ThreeDPhotoViewerProps {
    imageUrl: string;
}

export default function ThreeDPhotoViewer({ imageUrl }: ThreeDPhotoViewerProps) {
    return (
        <div className="w-full h-full bg-gray-900">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />

                <Image
                    url={imageUrl}
                    scale={[10, 7]} // Adjust scale based on your aspect ratio
                    position={[0, 0, 0]}
                    transparent
                />

                <OrbitControls
                    enableZoom={true}
                    enablePan={true}
                    enableRotate={true}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 3}
                    maxAzimuthAngle={Math.PI / 4}
                    minAzimuthAngle={-Math.PI / 4}
                />
                <Environment preset="city" />
            </Canvas>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm pointer-events-none">
                Interactive 3D Layer
            </div>
        </div>
    );
}
