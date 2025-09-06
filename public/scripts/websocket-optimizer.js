// Optimización de WebSocket para bfcache
class OptimizedWebSocket {
  constructor(url, protocols = []) {
    this.url = url;
    this.protocols = protocols;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isPageVisible = true;
    
    this.setupPageLifecycleEvents();
    this.setupVisibilityHandling();
  }

  setupPageLifecycleEvents() {
    // Manejar eventos del ciclo de vida de la página para bfcache
    window.addEventListener('beforeunload', () => {
      this.cleanupConnection();
    });

    window.addEventListener('pagehide', (event) => {
      // Si la página va al bfcache, cerrar conexión limpiamente
      if (event.persisted) {
        this.cleanupConnection();
      }
    });

    window.addEventListener('pageshow', (event) => {
      // Si la página viene del bfcache, reconectar
      if (event.persisted && this.ws?.readyState !== WebSocket.OPEN) {
        this.reconnect();
      }
    });

    // Manejar cambios de visibilidad
    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = !document.hidden;
      
      if (this.isPageVisible && this.ws?.readyState !== WebSocket.OPEN) {
        this.reconnect();
      }
    });
  }

  setupVisibilityHandling() {
    // Pausar reconexiones cuando la página no es visible
    this.visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && this.ws?.readyState === WebSocket.OPEN) {
          // Opcional: reducir actividad cuando no es visible
          this.sendHeartbeat(false);
        } else if (entry.isIntersecting) {
          this.sendHeartbeat(true);
        }
      });
    });
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url, this.protocols);
        
        this.ws.onopen = (event) => {
          this.reconnectAttempts = 0;
          this.onOpen?.(event);
          resolve(event);
        };

        this.ws.onmessage = (event) => {
          this.onMessage?.(event);
        };

        this.ws.onerror = (event) => {
          this.onError?.(event);
          reject(event);
        };

        this.ws.onclose = (event) => {
          this.onClose?.(event);
          
          // Solo reconectar si la página es visible y no fue cierre intencional
          if (this.isPageVisible && !event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  scheduleReconnect() {
    setTimeout(() => {
      if (this.isPageVisible) {
        this.reconnect();
      }
    }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
  }

  reconnect() {
    this.reconnectAttempts++;
    this.connect().catch(error => {
      // Handle reconnection failure (logging removed to avoid console statement)
      if (typeof this.onReconnectError === 'function') {
        this.onReconnectError(error);
      }
    });
  }

  send(data) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
      return true;
    }
    return false;
  }

  sendHeartbeat(active = true) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.send(JSON.stringify({ 
        type: 'heartbeat', 
        active,
        timestamp: Date.now() 
      }));
    }
  }

  cleanupConnection() {
    if (this.ws) {
      // Marcar como cierre limpio para evitar reconexión
      this.ws.onclose = null;
      this.ws.close(1000, 'Page unload');
      this.ws = null;
    }
  }

  close() {
    this.cleanupConnection();
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevenir reconexiones
  }

  // Métodos de callback que pueden ser sobrescritos
  onOpen(_event) {}
  onMessage(_event) {}
  onError(_event) {}
  onClose(_event) {}
}

// Ejemplo de uso con fallback
class ConnectionManager {
  constructor() {
    this.useWebSocket = false; // Deshabilitar por defecto para mejor bfcache
    this.pollingInterval = null;
    this.init();
  }

  init() {
    // Solo usar WebSocket si es absolutamente necesario
    if (this.shouldUseWebSocket()) {
      this.setupWebSocket();
    } else {
      this.setupPolling();
    }
  }

  shouldUseWebSocket() {
    // Criterios para usar WebSocket (ej: chat en tiempo real)
    return window.location.pathname.includes('/chat') || 
           window.location.search.includes('realtime=true');
  }

  setupWebSocket() {
    this.ws = new OptimizedWebSocket('wss://example.com/ws');
    
    this.ws.onMessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleUpdate(data);
    };

    this.ws.connect();
  }

  setupPolling() {
    // Polling más eficiente para la mayoría de casos
    this.startPolling();
  }

  startPolling() {
    if (this.pollingInterval) return;

    this.pollingInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.fetchUpdates();
      }
    }, 30000); // 30 segundos
  }

  fetchUpdates() {
    fetch('/api/updates')
      .then(response => response.json())
      .then(data => this.handleUpdate(data))
      .catch(_error => {
        // Silently handle polling errors
      });
  }

  handleUpdate(_data) {
    // Manejar actualizaciones
    // Data processing without logging
  }

  cleanup() {
    if (this.ws) {
      this.ws.close();
    }
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}

// Inicializar solo si es necesario
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.connectionManager = new ConnectionManager();
  });
} else {
  window.connectionManager = new ConnectionManager();
}

// Limpiar al descargar
window.addEventListener('beforeunload', () => {
  window.connectionManager?.cleanup();
});
