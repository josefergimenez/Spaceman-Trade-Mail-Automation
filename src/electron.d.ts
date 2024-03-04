// En tu archivo electron.d.ts o similar

declare global {
  interface Window {
    electronAPI: {
      getData: () => Promise<any>;
    };
  }
}

export {}; // Esto asegura que el archivo sea un módulo y extiende el objeto global

