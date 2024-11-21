class FlexGapSupport {
  constructor() {
    this.hasFlexGapSupport = null;
    this.fallbackClass = "no-flexgap";
  }

  checkFlexGapSupport() {
    // Create test elements
    const flex = document.createElement("div");
    const child1 = document.createElement("div");
    const child2 = document.createElement("div");

    // Set up test container
    flex.style.cssText = `
        display: flex;
        flex-direction: column;
        row-gap: 1px;
        position: absolute;
        visibility: hidden;
        width: 0;
        height: 0;
      `;

    // Add children
    flex.appendChild(child1);
    flex.appendChild(child2);

    // Add to DOM temporarily
    document.body.appendChild(flex);

    try {
      // Check if gap is working
      this.hasFlexGapSupport = flex.scrollHeight === 1;

      // Apply fallback class if needed
      if (!this.hasFlexGapSupport) {
        document.documentElement.classList.add(this.fallbackClass);
      }
    } catch (error) {
      console.error("Error checking flex gap support:", error);
      this.hasFlexGapSupport = false;
    } finally {
      // Clean up
      if (flex.parentNode) {
        flex.parentNode.removeChild(flex);
      }
    }

    return this.hasFlexGapSupport;
  }

  applyFallback() {
    const flexContainers = document.querySelectorAll(".flex-container");

    flexContainers.forEach((container) => {
      const gap = getComputedStyle(container).gap || "1rem";
      const direction = getComputedStyle(container).flexDirection;

      if (!this.hasFlexGapSupport) {
        const children = Array.from(container.children);

        children.forEach((child) => {
          if (direction === "column") {
            child.style.marginBottom = gap;
          } else {
            child.style.marginRight = gap;
          }
        });

        // Remove margin from last child
        if (children.length > 0) {
          const lastChild = children[children.length - 1];
          if (direction === "column") {
            lastChild.style.marginBottom = "0";
          } else {
            lastChild.style.marginRight = "0";
          }
        }
      }
    });
  }
}
// Initialize and use the feature detection
const flexGapDetector = new FlexGapSupport();

// Check for support and apply fallbacks
document.addEventListener("DOMContentLoaded", () => {
  const hasSupport = flexGapDetector.checkFlexGapSupport();

  if (!hasSupport) {
    flexGapDetector.applyFallback();
  }

  console.log("Flex gap support:", hasSupport);
});

// CSS to handle fallbacks
const styles = `
  .no-flexgap .flex-container {
    --gap: 1rem;
    margin: calc(-1 * var(--gap)) 0 0 calc(-1 * var(--gap));
  }

  .no-flexgap .flex-container > * {
    margin: var(--gap) 0 0 var(--gap);
  }
`;
