import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    currentRoute: '',
    currentSection: '', // 'localidad', 'edificio', 'propiedad', etc.
    context: null,
    navigationHistory: [], // Para mantener un historial de navegación
    debugMode: true, // Para activar/desactivar logs
  }),
  actions: {
    setCurrentRoute(route) {
      this.currentRoute = route;
      this.logContext('Route changed');
    },
    setContext(context) {
      this.context = context;
      this.logContext('Context updated');
    },
    setCurrentSection(section) {
      this.currentSection = section;
      this.logContext('Section changed');
    },
    addToHistory(location) {
      const historyEntry = {
        from: location.from,
        to: location.to,
        section: this.currentSection,
        context: this.context,
        timestamp: location.timestamp
      };
      
      this.navigationHistory.push(historyEntry);
      
      console.group('Navigation History Update');
      console.log('New Entry:', historyEntry);
      console.log('Full History:', this.navigationHistory);
      console.groupEnd();
    },
    logContext(action) {
      if (this.debugMode) {
        console.group('ChatIA Context Update');
        console.log('Action:', action);
        console.log('Current Route:', this.currentRoute);
        console.log('Current Section:', this.currentSection);
        console.log('Context:', JSON.stringify(this.context, null, 2));
        console.log('Navigation History:', this.navigationHistory.length, 'entries');
        console.groupEnd();
      }
    },
    updateContext(contextData) {
      console.log('Actualizando contexto con:', contextData);
      this.context = {
        ...this.context,
        data: contextData
      };
      this.logContext('Context updated with specific data');
    }
  }
});
