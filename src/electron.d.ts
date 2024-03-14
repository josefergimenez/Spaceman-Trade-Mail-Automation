// En tu archivo electron.d.ts o similar

declare global {
  interface Window {
    electronAPI: {
      getData: (
        from1: Date | null,
        to1: Date | null,
        from2: Date | null,
        to2: Date | null,
        from12: Date | null,
        to12: Date | null,
        from22: Date | null,
        to22: Date | null
      ) => Promise<any>;
    };
  }
}

export {}; // Esto asegura que el archivo sea un módulo y extiende el objeto global

