import { isPlatform } from "@ionic/react";
import { useEffect, useRef } from "react";
import { LuExpand } from "react-icons/lu";

const GamePlayer = ({ url }: { url: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const openFullscreen = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;

      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if ((iframe as any).webkitRequestFullscreen) {
        (iframe as any).webkitRequestFullscreen();
      } else if ((iframe as any).mozRequestFullScreen) {
        (iframe as any).mozRequestFullScreen();
      } else if ((iframe as any).msRequestFullscreen) {
        (iframe as any).msRequestFullscreen();
      }
    }
  };

  useEffect(() => {
    if (isPlatform("mobile")) {
      openFullscreen();
    }
  }, []);

  return (
    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
      <iframe
        ref={iframeRef}
        src={url}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <button
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 1,
          background: "rgba(0, 0, 0, 0.5)",
          borderRadius: "50%",
          padding: "10px",
        }}
        onClick={openFullscreen}
      >
        <LuExpand className="text-3xl text-white" />
      </button>
    </div>
  );
};

export default GamePlayer;
