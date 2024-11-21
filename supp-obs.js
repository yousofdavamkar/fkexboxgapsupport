class FlexGapManager extends FlexGapSupport {
  constructor() {
    super();
    this.resizeObserver = null;
    this.observedContainers = new Set();
  }

  initResizeObserver() {
    if (!this.resizeObserver && window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          if (!this.hasFlexGapSupport) {
            this.updateContainer(entry.target);
          }
        });
      });
    }
  }

  updateContainer(container) {
    const gap = getComputedStyle(container).gap;
    const direction = getComputedStyle(container).flexDirection;
    const children = Array.from(container.children);

    children.forEach((child, index) => {
      const isLast = index === children.length - 1;
      child.style.margin = "0";

      if (!isLast) {
        if (direction.includes("row")) {
          child.style.marginRight = gap;
        }
        if (direction.includes("column")) {
          child.style.marginBottom = gap;
        }
      }
    });
  }

  observe(container) {
    if (!this.observedContainers.has(container)) {
      this.resizeObserver?.observe(container);
      this.observedContainers.add(container);
    }
  }

  disconnect() {
    this.resizeObserver?.disconnect();
    this.observedContainers.clear();
  }
}

const flexManager = new FlexGapManager();

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  flexManager.checkFlexGapSupport();
  flexManager.initResizeObserver();

  // Observe flex containers
  document.querySelectorAll(".flex-container").forEach((container) => {
    flexManager.observe(container);
  });
});

// Clean up when needed
window.addEventListener("unload", () => {
  flexManager.disconnect();
});
