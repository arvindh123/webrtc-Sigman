import React, { useRef , useEffect } from 'react';

export default function VideoContent({media}) {
    const videoRef = useRef();

    useEffect( () =>  { 

            if (media instanceof MediaStream) {
            videoRef.current.srcObject = media; 
            videoRef.current.play();
            } else {
            videoRef.current.srcObject = null; 
            }
        } , 
        [media] 
    )  

    return (
        <video ref={videoRef} width="320" height="240"  autoplay muted controls playsinline   > </video>
    );
}
