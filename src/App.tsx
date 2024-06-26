import { useRef, useEffect } from 'react';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';

import * as faceapi from 'face-api.js';

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.srcObject = stream;
      }
    })
  }, [])

  useEffect(() => {
    Promise.all([
      faceapi.loadFaceDetectionModel('/models'),
      faceapi.loadFaceLandmarkModel('/models'),
      faceapi.loadFaceExpressionModel('/models'),
    ]).then(() => {
      console.log('Models loaded.');

    })
  }, [])


  const handleLoadedMetadata = async () => {
    const videoEl = videoRef.current;
    const canvasEl = canvasRef.current;
    if (!videoEl || !canvasEl) return;


    const detection = await faceapi.detectSingleFace(
      videoEl as HTMLVideoElement,
      new faceapi.TinyFaceDetectorOptions()
    )
      .withFaceLandmarks()
      .withFaceExpressions();

    if (detection) {
      const dimensions = {
        width: videoEl.offsetWidth,
        height: videoEl.offsetHeight,
      }

      faceapi.matchDimensions(canvasEl, dimensions)
      const resizedResults = faceapi.resizeResults(detection, dimensions)
      faceapi.draw.drawDetections(canvasEl, resizedResults)
      faceapi.draw.drawFaceLandmarks(canvasEl, resizedResults)
      faceapi.draw.drawFaceExpressions(canvasEl, resizedResults)
    }

    setTimeout(handleLoadedMetadata, 1000);
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row md:justify-between gap-14 xl:gap-40 p-10 items-center container mx-auto">
      <Header />
      <section className="flex flex-col gap-6 flex-1 w-full">
        <div className="bg-white rounded-xl p-2">
          <div className="relative flex items-center justify-center aspect-video w-full">
            {/* Substitua pela Webcam */}
            <div className="aspect-video rounded-lg bg-gray-300 w-full">
              <div className="relative flex items-center justify-center aspect-video w-full">
                <video
                  onLoadedMetadata={handleLoadedMetadata}
                  autoPlay
                  ref={videoRef} className='rounded aspect-video'></video>
                <canvas ref={canvasRef} className='absolute inset-0 w-full h-full'></canvas>
              </div>
            </div>
            {/* Substitua pela Webcam */}
          </div>
        </div>
        <div
          className={`bg-white rounded-xl px-8 py-6 flex gap-6 lg:gap-20 items-center h-[200px] justify-center`}
        >
          <p className="text-4xl text-center flex justify-center items-center text-yellow-300">
            {/* Substitua pelo texto */}
            <LoadingSpinner />
            {/* Substitua pelo texto */}
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;
