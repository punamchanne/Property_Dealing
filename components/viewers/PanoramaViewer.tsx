'use client';

import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { useRef } from 'react';

interface PanoramaViewerProps {
    imageUrl: string;
}

export default function PanoramaViewer({ imageUrl }: PanoramaViewerProps) {
    const viewerRef = useRef<any>(null);

    return (
        <div className="w-full h-full relative">
            <ReactPhotoSphereViewer
                ref={viewerRef}
                src={imageUrl}
                height={'100%'}
                width={"100%"}
                container={""}
                // Optional: Map flat images to sphere (it will distort, but provides the 360 viewer feel)
                loadingTxt="Loading 360 View..."
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm pointer-events-none z-10">
                Drag to Interact
            </div>
        </div>
    );
}
