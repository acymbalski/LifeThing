import React, { useEffect, useRef } from "react";
import { useClientStore } from "../stores/clientStore";
import { useMessageStore } from "../stores/messageStore";
import { useConnectionStore } from "../stores/connectionStore";
import { ClientService } from "../services/clientService";
import { DESKTHING_EVENTS } from "@deskthing/types";

export const DevWrapper: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Client Store subscriptions
  const isViteServerConnected = useClientStore(
    (state) => state.isViteServerConnected
  );
  const connectionAttempts = useClientStore(
    (state) => state.connectionAttempts
  );
  const appManifest = useClientStore((state) => state.appManifest);
  const clientId = useClientStore((state) => state.clientId);
  const songData = useClientStore((state) => state.songData);
  const requestManifest = useClientStore((state) => state.requestManifest);
  
  // Message Store subscriptions
  const handleIframeMessage = useMessageStore(
    (state) => state.handleIframeMessage
  );
  const sendToIframe = useMessageStore((state) => state.sendToIframe);
  
  // Connection Store subscriptions
  const initialize = useConnectionStore((state) => state.initialize);
  const checkViteServer = useConnectionStore((state) => state.checkViteServer);
  const setupMessageBusSubscription = useConnectionStore(
    (state) => state.setupMessageBusSubscription
  );
  const viteDevUrl = useConnectionStore((state) => state.viteDevUrl);
  
  // Initialize connection on mount
  useEffect(() => {
    initialize();
    requestManifest();
    checkViteServer();
  }, []);

  // Setup message bus subscription
  useEffect(() => {
    const unsubscribe = setupMessageBusSubscription();
    return unsubscribe;
  }, []);

  // Send song data when it changes
  useEffect(() => {
    sendToIframe({
      type: "DEVICE_CLIENT.MUSIC" as any,
      app: "client",
      payload: songData,
    });
  }, [songData]);

  // Handle iframe messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== viteDevUrl) return;
      handleIframeMessage(event.data.payload, event.origin);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [viteDevUrl, handleIframeMessage]);

  const handleIframeLoad = () => {
    if (!appManifest) return;

    const clientStatusPayload = {
      clientId,
      connected: true,
      timestamp: Date.now(),
      currentApp: appManifest.id,
    };

    // Send connection events
    ClientService.sendToApp({
      type: DESKTHING_EVENTS.CLIENT_STATUS,
      request: "connected",
      payload: clientStatusPayload,
    });

    ClientService.sendToApp({
      type: DESKTHING_EVENTS.CLIENT_STATUS,
      request: "opened",
      payload: clientStatusPayload,
    });
  };

  const handleIframeError = () => {
    ClientService.sendToApp({
      type: DESKTHING_EVENTS.CLIENT_STATUS,
      request: "disconnected",
      payload: clientId,
    });
  };

  const renderLoadingState = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#2d2d2d",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <p style={{ fontSize: "1.5em", fontWeight: "bold" }}>
        Connecting to Development Server...
      </p>
      <p style={{ textAlign: "center", maxWidth: "80%" }}>
        Run the Vite Development of your frontend on port 5173 to view here!
      </p>
      {connectionAttempts > 0 && (
        <p style={{ marginTop: "20px", color: "#ffcc00" }}>
          Connection attempts: {connectionAttempts} - Still trying to connect...
        </p>
      )}
    </div>
  );

  return (
    <div
      className="dev-container"
      style={{
        padding: 0,
        margin: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {isViteServerConnected ? (
        <iframe
          title="DeskThing App"
          ref={iframeRef}
          src={viteDevUrl}
          id="app"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      ) : (
        renderLoadingState()
      )}
      <div id="debug-panel" />
    </div>
  );
};
